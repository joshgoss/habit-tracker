import { Request, Response } from "express";
import { Habit } from "./models";

export const validateHabit = async (
	req: Request,
	res: Response,
	next: Function
) => {
	const { habitId } = req.params;
	if (!habitId) {
		return res
			.status(422)
			.json({ code: 422, error: "habitId route param is required" });
	}

	if (!req.user) {
		return res
			.status(401)
			.json({ code: 401, error: "User is not authenticated" });
	}

	const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });

	if (!habit) {
		return res
			.status(404)
			.json({ code: 404, error: "Habit not found for user" });
	}

	req.habit = habit;

	next(null);
};
