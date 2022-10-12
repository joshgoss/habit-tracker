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
	get: async ({ get }) => {
		get(forceHistoryRefresh);
		const params = get(historyParamsState);
		const response = await api.get("/history", {
			startDate: params.startDate,
			endDate: params.endDate,
		});
		return {
			data: response.data,
			streaks: response.streaks,
		};
	},
});

export const getCompletedHabits = selector({
	key: "completedHabits",
	get: ({ get }) => {
		const habits = get(fetchHabits);
		const { data } = get(fetchHistory);

		return habits.filter((habit) => {
			const entries = data.filter(
				(item: History) => item.habitId === habit._id
			);
			const entry = entries.length ? entries[0] : null;
			return entry && entry.completed ? true : false;
		});
	},
});

export const getUncompletedHabits = selector({
	key: "uncompletedHabits",
	get: ({ get }) => {
		const habits = get(fetchHabits);
		const { data } = get(fetchHistory);

		return habits.filter((habit) => {
			const entries = data.filter(
				(item: History) => item.habitId === habit._id
			);
			const entry = entries.length ? entries[0] : null;
			return !entry || !entry.completed ? true : false;
		});
	},
});
