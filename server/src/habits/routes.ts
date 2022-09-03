import { Router } from "express";
import passport from "passport";

import { Habit } from "./models";
import { ajv } from "../lib/validation";
import { validateHabit } from "./middleware";
import { Frequency } from "../constants";

const router = Router();

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const data = await Habit.find({ userId: req.user._id });

		res.json({
			code: 200,
			data,
		});
	}
);

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const validate = ajv.getSchema("habit");

		if (!validate) throw Error("Unable to get schema for habit");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		if (req.body.frequency === Frequency.Monthly && !req.body.dayOfMonth) {
			return res.status(400).json({
				code: 400,
				error: "dayOfMonth is required when frequency is monthly",
			});
		}

		if (
			[Frequency.Weekly, Frequency.Daily].includes(req.body.frequency) &&
			!req.body.daysOfWeek
		) {
			return res.status(400).json({
				code: 400,
				error: "daysOfMonth is required when frequency is weekly or daily",
			});
		}

		const habit = await Habit.create({ ...req.body, userId: req.user._id });
		return res.status(201).json({ code: 201, data: habit });
	}
);

router.get(
	"/:habitId",
	passport.authenticate("jwt", { session: false }),
	validateHabit,
	async (req, res) => {
		return res.json({ code: 200, data: req.habit });
	}
);

router.delete(
	"/:habitId",
	passport.authenticate("jwt", { session: false }),
	validateHabit,
	async (req, res) => {
		await Habit.deleteOne({ _id: req.habit._id, userId: req.user._id });
		return res.json({ code: 200, data: req.habit });
	}
);

router.put(
	"/:habitId",
	passport.authenticate("jwt", { session: false }),
	validateHabit,
	async (req, res) => {
		const validate = ajv.getSchema("habit");

		if (!validate) throw Error("Unable to get schema for habit");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		const habit = await Habit.findOneAndUpdate(
			{
				_id: req.habit._id,
				userId: req.user._id,
			},
			req.body,
			{ new: true }
		);
		return res.json({ code: 200, data: habit });
	}
);

export default router;
