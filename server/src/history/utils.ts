import * as R from "ramda";
import { DayOfWeek, Frequency } from "../constants";
import { Habit, IHabit } from "../habits/models";
import { habit } from "../habits/schemas";
import { History, IHistory } from "./models";

// NOTE: These date functions assume the TZ is set to UTC

/**
 * Changes the time on the date object to beginning of day
 * @param {Date} d A Date object instance
 * @returns {Date}
 */
export const startOfDay = (d: Date): Date => {
	d.setUTCHours(0, 0, 0, 0);
	return d;
};

/**
 * Changes the time on the date object passed
 * to the end of the day
 * @param {Date} d A Date object instance
 * @returns {Date}
 */
export const endOfDay = (d: Date): Date => {
	d.setUTCHours(23, 59, 59, 999);
	return d;
};

/**
 * Creates a date object instance for the current day with the time
 * set to the beginning of the day
 * @returns {Date}
 */
export const startOfToday = (): Date => {
	const d = new Date();
	startOfDay(d);
	return d;
};

/**
 * Creates a date object instance for the current day with the time
 * set to the end of the day
 * @returns {Date}
 */
export const endOfToday = (): Date => {
	const d = new Date();
	endOfDay(d);
	return d;
};

/**
 * Add days to an existing date resulting in a new date
 * @param {Date} d The date to add days on to
 * @param {Date} numDays {number} The number of days to add
 * @returns {Date}
 */
export const addDays = (d: Date, numDays: number): Date => {
	const newDate = new Date(d);
	newDate.setDate(newDate.getDate() + numDays);
	return newDate;
};

/** Return the number of days between two dates
 * @param d1 {Date} First date
 * @param d2 {Date} Second date
 * @returns {number} The number of days between the two dates
 */
export const getDaysDiff = (d1: Date, d2: Date): number => {
	const day = 1000 * 60 * 60 * 24;
	const timeDiff = Math.abs(d2.getTime() - d1.getTime());
	return Math.round(timeDiff / day);
};

/**
 * Find the closest previous date based on supported days of week passed
 * @param date {Date} The start date
 * @param daysOfWeek {DayOfWeek[]} The days of week the previous day must be on
 * @returns {Date}
 */
export const closestPrevDate = (date: Date, daysOfWeek: DayOfWeek[]): Date => {
	const day = date.getUTCDay();

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

	return addDays(date, -distance);
};
