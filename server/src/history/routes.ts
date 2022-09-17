import passport from "passport";
import { Router } from "express";
import { Frequency } from "../constants";
import { ajv } from "../lib/validation";
import { History } from "./models";
import { endOfDay, endOfToday, startOfDay, startOfToday } from "./utils";
import { Habit } from "../habits/models";
import { validateHistory } from "./middleware";

const router = Router();

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const validate = ajv.getSchema("historyQueryParams");

		if (!validate) throw new Error("Unable to get history query params schema");

		const valid = validate(req.query);
		if (!valid) {
			return res.status(422).json({ code: 422, errors: validate.errors });
		}

		const startDate = req.query.startDate
			? startOfDay(new Date(req.query.startDate as string))
			: startOfToday();
		const endDate = req.query.endDate
			? endOfDay(new Date(req.query.endDate as string))
			: endOfToday();

		const data = await History.find({
			userId: req.user._id,
			date: {
				$gte: startDate,
				$lte: endDate,
			},
		});

		return res.json({
			code: 200,
			data,
		});
	}
);

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const validate = ajv.getSchema("history");
		if (!validate) throw new Error("Unable to history schema");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		const habit = await Habit.findOne({
			_id: req.body.habitId,
			userId: req.user._id,
		});

		if (!habit) {
			return res.status(404).json({
				code: 404,
				error: "No habit exists for user with habitID passed",
			});
		}

		const d = new Date(req.body.date);
		const existing = await History.findOne({
			habitId: req.body.habitId,
			userId: req.user._id,
			date: startOfDay(new Date(req.body.date)),
		});

		if (existing) {
			return res.status(422).json({
				code: 422,
				error: "History already exists for this user and habit on date passed",
			});
		}

		const requiresDaysOfWeek = [Frequency.Daily, Frequency.Weekly];
		const hasDays = habit.daysOfWeek.length;
		const isHabitDay = habit.daysOfWeek.includes(d.getDay());
		if (
			requiresDaysOfWeek.includes(habit.frequency) &&
			hasDays &&
			!isHabitDay
		) {
			return res
				.status(422)
				.json({ code: 422, error: "Habit does not run on this day of week" });
		}

		if (
			habit.frequency === Frequency.Monthly &&
			habit.dayOfMonth !== d.getDate()
		) {
			return res.status(422).json({
				code: 422,
				error: "Habit does not run on this day of month",
			});
		}

		const history = await History.create({
			amount: req.body.amount,
			date: d,
			userId: req.user._id,
			habitId: habit._id,
			completed: habit.amount === req.body.amount,
		});

		return res.status(201).json({ code: 201, data: history });
	}
);

router.get(
	"/:historyId",
	passport.authenticate("jwt", { session: false }),
	validateHistory,
	async (req, res) => {
		res.json({ code: 200, data: req.history });
	}
);

router.put(
	"/:historyId",
	passport.authenticate("jwt", { session: false }),
	validateHistory,
	async (req, res) => {
		const validate = ajv.getSchema("history");

		if (!validate) throw Error("Unable to get schema for history");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		const habit = await Habit.findOne({
			_id: req.body.habitId,
			userId: req.user._id,
		});

		if (!habit) {
			return res
				.status(422)
				.json({ code: 422, error: "Habit does not exist for user" });
		}

		if (req.body.amount > habit.amount) {
			return res.status(400).json({
				code: 400,
				error: "History amount cannot be greater than habit amount",
			});
		}

		const history = await History.findOneAndUpdate(
			{
				_id: req.params.historyId,
			},
			{ ...req.body, completed: habit.amount === req.body.amount },
			{ new: true }
		);

		res.json({ code: 200, data: history });
	}
);

router.delete(
	"/:historyId",
	passport.authenticate("jwt", { session: false }),
	validateHistory,
	async (req, res) => {
		await History.deleteOne({ _id: req.params.historyId });
		res.json({ code: 200, data: req.history });
	}
);

export default router;
