import { Router } from "express";
import Debug from "debug";
import passport from "passport";

import { Habit } from "./models";
import { ajv } from "../lib/validation";
import { validateHabit } from "./middleware";

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
			return res.status(422).json({ code: 422, errors: validate.errors });
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
