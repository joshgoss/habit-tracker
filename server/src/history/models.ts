import Debug from "debug";
import * as R from "ramda";
import { DateTime } from "luxon";

import mongoosePkg from "mongoose";
const { model, Schema } = mongoosePkg;
import { IHabit, Habit } from "../habits/models";
import { Frequency, HabitStreak, DayOfWeek } from "../constants";
import { closestPrevDate, prefixNum } from "./utils";

export interface IHistory {
	_id: string;
	amount: number;
	habitId: string;
	userId: string;
	completed: boolean;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

const historySchema = new Schema<IHistory>(
	{
		amount: { type: Number, required: true },
		habitId: Schema.Types.ObjectId,
		userId: Schema.Types.ObjectId,
		completed: { type: Boolean, required: true },
		date: { type: Date, required: true },
	},
	{ timestamps: true }
);

export const History = model<IHistory>("History", historySchema);

/**
 * Get streaks for each habit the user has
 * @param userId {string} The id of user to get streaks for
 * @param endDate {Date} The end date to get streaks for
 * @returns {HabitStreak[]} A list of habit streaks
 */
const streaksDebug = Debug("history.models:getStreaksForUser");
export const getStreaksForUser = async (
	userId: string,
	endDate: Date,
	timezone: string
): Promise<HabitStreak[]> => {
	const luxonDate = DateTime.fromJSDate(endDate);
	const history = await History.find({
		userId: userId,
		date: { $lte: endDate },
	}).sort({
		habitId: 1,
		date: -1,
	});
	streaksDebug(`userId is: ${userId}`);
	streaksDebug(`endDate is: `, luxonDate);
	const habits = await Habit.find({ userId });
	const byHabitId = R.groupBy((h: IHistory) => h.habitId);
	const grouped = byHabitId(history);

	return habits.reduce((acc: HabitStreak[], habit: IHabit) => {
		streaksDebug(`habit is: `, habit);
		let habitStreak: HabitStreak | undefined = acc.find(
			(s) => s.habitId === habit._id
		);
		const entries = grouped[habit._id];

		streaksDebug("entries are: ", entries);

		if (!habitStreak) {
			streaksDebug("No habit streak yet");
			habitStreak = { habitId: habit._id, streak: 0 };
			acc.push(habitStreak);
		}

		if (!entries || !entries.length) {
			streaksDebug("No entries found");
			return acc;
		}

		// The next date which must be matched to continue the steak;
		let nextDate = luxonDate;
		let daysOfWeek = habit.daysOfWeek.sort();

		streaksDebug("daysofWeeks: ", daysOfWeek);

		if (
			habit.frequency === Frequency.Daily ||
			habit.frequency === Frequency.Weekly
		) {
			streaksDebug("Habit frequency is daily or weekly");
			const endDay = luxonDate.weekday;

			if (daysOfWeek.includes(endDay)) {
				nextDate = luxonDate;
			} else {
				nextDate = closestPrevDate(luxonDate, daysOfWeek);
			}
		} else if (habit.frequency === Frequency.Monthly) {
			streaksDebug("Habit frequency is monthly");
			nextDate = DateTime.fromObject(
				{
					day: luxonDate.day,
					month: luxonDate.month,
					year: luxonDate.year,
				},
				{ zone: timezone }
			);
		}

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const curDate = DateTime.fromJSDate(entry.date, { zone: timezone });
			const endDateDiff = luxonDate.diff(curDate, "days").toObject().days;

			streaksDebug("Entry is: ", entry);
			streaksDebug(`curDate is ${curDate.toString()}`);
			streaksDebug(`streak is: ${habitStreak.streak}`);
			streaksDebug(`nextDate is: ${nextDate.toString()}`);
			streaksDebug(`Cur date days diff from end date: ${endDateDiff}`);

			let shouldIncrement = true;

			// Entry is on end date so allow streak to continue even if it isn't completed yet
			if (curDate.toISODate() === luxonDate.toISODate() && !entry.completed) {
				streaksDebug(
					"Entry date matches end date so skipping enforcing entry being complete"
				);
				shouldIncrement = false;
			} else if (curDate.toISO() === nextDate.toISO() && !entry.completed) {
				streaksDebug("Entry not completed");
				return acc;
			} else if (curDate < nextDate && endDateDiff && endDateDiff > 1) {
				streaksDebug("Entry date is before expected next date... streak ended");
				return acc;
			}

			if (
				habit.frequency === Frequency.Daily ||
				habit.frequency === Frequency.Weekly
			) {
				const curDayOfWeek = curDate.weekday;

				streaksDebug("Frequency is daily or weekly");
				if (!daysOfWeek.includes(curDayOfWeek)) {
					streaksDebug(
						"Entry is not on week day the habit expects, skipping..."
					);
					continue;
				} else {
					nextDate = closestPrevDate(curDate, daysOfWeek);
				}
			} else if (habit.frequency === Frequency.Monthly) {
				nextDate = nextDate.minus({ months: 1 });
			}

			streaksDebug("Incrementing streak");
			habitStreak.streak = shouldIncrement
				? habitStreak.streak + 1
				: habitStreak.streak;
			shouldIncrement = true;
		}

		return acc;
	}, []);
};
