import { atom } from "recoil";
import { DateTime } from "luxon";

export const historyParamsState = atom({
	key: "historyParamsState",
	default: {
		startDate: DateTime.now().toISODate(),
		endDate: DateTime.now().toISODate(),
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
