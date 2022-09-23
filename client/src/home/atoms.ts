import { atom } from "recoil";
import { todayUtc } from "../utils/date";

export const historyParamsState = atom({
	key: "historyParamsState",
	default: {
		startDate: new Date(),
		endDate: new Date(),
	},
});

export const forceHabitsRefresh = atom({
	key: "forceHabitsRefresh",
	default: 0,
});

export const forceHistoryRefresh = atom({
	key: "forceHistoryRefresh",
	default: 0,
});
