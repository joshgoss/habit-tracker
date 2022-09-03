import { Request, Response } from "express";
import { nextTick } from "process";
import { History } from "./models";

/**
 * Middleware for handling routes with a historyId. It will check if the history item exists, belongs to
 * the user and puts the history on the request object for easy access
 * @param req Express request instance
 * @param res Express response instance
 * @param next Next function to continue
 * @returns
 */
export const validateHistory = async (
	req: Request,
	res: Response,
	next: Function
) => {
	const { historyId } = req.params;

	if (!historyId) {
		return res
			.status(400)
			.json({ code: 400, error: "historyId route parameter is required" });
	}

	const history = await History.findOne({
		_id: historyId,
		userId: req.user._id,
	});

	if (!history) {
		return res
			.status(404)
			.json({ code: 404, error: "No history entry found for user" });
	}

	req.history = history;
	next(null);
};
