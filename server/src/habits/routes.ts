import { Router } from "express";
import Debug from "debug";
import passport from "passport";

import { Habit } from "./models";

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

export default router;
