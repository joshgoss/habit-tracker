import { atom } from "recoil";
import { formatDate } from "../utils";

export const historyParamsState = atom({
	key: "historyParamsState",
	default: {
		startDate: formatDate(new Date()),
		endDate: formatDate(new Date()),
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
