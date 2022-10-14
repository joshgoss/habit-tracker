import { atom } from "recoil";

export const forceAccountRefresh = atom({
	key: "forceAccountRefresh",
	default: 0,
});
