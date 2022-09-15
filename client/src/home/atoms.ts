import { atom } from "recoil";
import { formatDate, todayUtc } from "../utils/date";

export const historyParamsState = atom({
	key: "historyParamsState",
	default: {
		startDate: formatDate(todayUtc()),
		endDate: formatDate(todayUtc()),
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
