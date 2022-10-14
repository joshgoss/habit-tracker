import { selector } from "recoil";
import { authState } from "./atoms";

export const isAuthenticated = selector({
	key: "authenticated",
	get: ({ get }): boolean => {
		const state = get(authState);
		return !!state.accessToken;
	},
});
