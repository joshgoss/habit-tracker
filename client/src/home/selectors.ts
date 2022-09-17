import { selector } from "recoil";
import api from "../utils/api";
import {
	forceHabitsRefresh,
	forceHistoryRefresh,
	historyParamsState,
} from "./atoms";
import { Habit, History } from "../types";

export const fetchHabits = selector({
	key: "fetchHabits",
	get: async ({ get }): Promise<Habit[]> => {
		get(forceHabitsRefresh);
		const response = await api.get("/habits");
		return response.data;
	},
});

export const fetchHistory = selector({
	key: "fetchHistory",
	get: async ({ get }): Promise<History[]> => {
		get(forceHistoryRefresh);
		const params = get(historyParamsState);
		const response = await api.get("/history", params);
		return response.data;
	},
});

export const getCompletedHabits = selector({
	key: "completedHabits",
	get: ({ get }) => {
		const habits = get(fetchHabits);
		const history = get(fetchHistory);

		return habits.filter((habit) => {
			const entries = history.filter((item) => item.habitId === habit._id);
			const entry = entries.length ? entries[0] : null;
			return entry && entry.completed ? true : false;
		});
	},
});

export const getUncompletedHabits = selector({
	key: "uncompletedHabits",
	get: ({ get }) => {
		const habits = get(fetchHabits);
		const history = get(fetchHistory);

		return habits.filter((habit) => {
			const entries = history.filter((item) => item.habitId === habit._id);
			const entry = entries.length ? entries[0] : null;
			return !entry || !entry.completed ? true : false;
		});
	},
});
