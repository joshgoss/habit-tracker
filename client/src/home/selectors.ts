import { selector } from "recoil";
import api from "../utils/api";
import { forceHabitsRefresh, historyParamsState } from "./atoms";
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
		const params = get(historyParamsState);
		const response = await api.get("/history", params);
		return response.data;
	},
});
