import { atom } from "recoil";
import { getAccessToken } from "../utils/session";

export const authState = atom({
	key: "authState",
	default: {
		accessToken: getAccessToken(),
	},
});
