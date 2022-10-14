import { DateTime } from "luxon";
import passport from "passport";
import { Router } from "express";
import { Frequency } from "../constants";
import { ajv } from "../lib/validation";
import { getStreaksForUser, History } from "./models";
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

		const defaultDate = DateTime.now().setZone(req.user.timezone);

		const startDate = req.query.startDate
			? DateTime.fromISO(req.query.startDate as string, {
					zone: req.user.timezone,
			  })
			: defaultDate;
		const endDate = req.query.endDate
			? DateTime.fromISO(req.query.endDate as string, {
					zone: req.user.timezone,
			  })
			: defaultDate;

		const data = await History.find({
			userId: req.user._id,
			date: {
				$gte: startDate.set({ hour: 0, minute: 0, second: 0 }).toJSDate(),
				$lte: endDate.set({ hour: 23, minute: 59, second: 59 }).toJSDate(),
			},
		});

		return res.json({
			code: 200,
			data,
			streaks: await getStreaksForUser(
				req.user._id,
				endDate.toJSDate(),
				req.user.timezone
			),
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

		const d = DateTime.fromISO(req.body.date, {
			zone: req.user.timezone,
		});
		const existing = await History.findOne({
			habitId: req.body.habitId,
			userId: req.user._id,
			date: d.toJSDate(),
		});

		if (existing) {
			return res.status(422).json({
				code: 422,
				error: "History already exists for this user and habit on date passed",
			});
		}

		const requiresDaysOfWeek = [Frequency.Daily, Frequency.Weekly];
		const isHabitDay = habit.daysOfWeek.includes(d.weekday);
		if (requiresDaysOfWeek.includes(req.body.frequency)) {
			if (!isHabitDay) {
				return res
					.status(422)
					.json({ code: 422, error: "Habit does not run on this day of week" });
			} else if (!req.body.days.length) {
				return res.status(422).json({
					code: 422,
					error:
						"daysOfWeek must have at least one day when frequency is daily or weekly",
				});
			}
		} else if (
			req.body.frequency === Frequency.Weekly &&
			req.body.daysOfWeek.length !== 1
		) {
			return res.status(422).json({
				code: 422,
				error: "daysOfWeek must only include one day when frequency is weekly",
			});
		} else if (
			habit.frequency === Frequency.Monthly &&
			habit.dayOfMonth !== d.day
		) {
			return res.status(422).json({
				code: 422,
				error: "Habit does not run on this day of month",
			});
		}

		if (req.body.amount > habit.amount) {
			return res.status(422).json({
				code: 422,
				error: "Amount cannot be greater than habit amount",
			});
		}
		const history = await History.create({
			amount: req.body.amount,
			date: d.toJSDate(),
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
		const validate = ajv.getSchema("updateHistory");

		if (!validate) throw Error("Unable to get schema for history");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		const habit = await Habit.findOne({
			_id: req.history.habitId,
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
