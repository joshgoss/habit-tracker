import { selector } from "recoil";
import { authState } from "./atoms";

export const isAuthenticated = selector({
	key: "authenticated",
	get: ({ get }) => {
		const state = get(authState);
		return !!state.accessToken;
	},
});
