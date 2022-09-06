import { atom } from "recoil";
import { getAccessToken, getExpiresAt } from "../utils/session";

export const authState = atom({
	key: "authState",
	default: {
		accessToken: getAccessToken(),
		expiresAt: getExpiresAt(),
	},
});
