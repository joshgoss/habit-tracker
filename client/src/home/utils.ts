import { DateTime } from "luxon";
import api from "../utils/api";
import { Frequency, Habit } from "../types";

interface HistoryData {
	habitId: string;
	amount: number;
	date: string;
}

export const setHistory = async (
	data: HistoryData,
	historyId?: string | null
) => {
	if (historyId) {
		return await api.put(`/history/${historyId}`, { amount: data.amount });
	} else {
		return await api.post(`/history`, data);
	}
};

/**
 * Returns true or false depending on if the habit runs on date provided
 * @param {Habit} habit
 * @param {luxon DateTime} date
 * @returns {boolean}
 */
export const isHabitDay = (habit: Habit, date: DateTime): boolean => {
	if (
		habit.frequency === Frequency.Daily ||
		habit.frequency === Frequency.Weekly
	) {
		return habit.daysOfWeek.includes(date.weekday);
	} else if (habit.frequency === Frequency.Monthly) {
		return habit.dayOfMonth === date.day;
	} else {
		return false;
	}
};

export const getStreakText = (amount: number, frequency: Frequency): string => {
	if (frequency === Frequency.Daily) {
		return amount > 1 ? "days" : "day";
	} else if (frequency === Frequency.Weekly) {
		return amount > 1 ? "weeks" : "week";
	} else if (frequency === Frequency.Monthly) {
		return amount > 1 ? "months" : "month";
	} else {
		throw new Error("Invalid frequency");
	}
};
