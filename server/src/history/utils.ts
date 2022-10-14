import { DateTime } from "luxon";
import { DayOfWeek, Frequency } from "../constants";
import { Habit, IHabit } from "../habits/models";
import { habit } from "../habits/schemas";
import { History, IHistory } from "./models";

/**
 * Find the closest previous date based on supported days of week passed
 * @param {Luxon DateTime} date  The start date
 * @param {DayOfWeek[]} daysOfWeek  The days of week the previous day must be on
 * @returns {Date}
 */
export const closestPrevDate = (
	date: DateTime,
	daysOfWeek: DayOfWeek[]
): DateTime => {
	const day = date.weekday;

	let closestDay = daysOfWeek
		.slice()
		.reverse()
		.find((d) => d < day);

	let distance;
	if (!closestDay) {
		closestDay = daysOfWeek[daysOfWeek.length - 1];
		distance = closestDay === day ? 7 : 7 - closestDay;
	} else {
		distance = Math.abs(day - closestDay);
	}
	return date.minus({ days: distance });
};
/** Prefix number with a 0 if the number is single digit
 * @params {number} d number representing the date
 * @return {string}
 */
export const prefixNum = (d: number) =>
	d.toString().length === 1 ? `0${d}` : d.toString();
