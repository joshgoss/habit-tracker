import { selector } from "recoil";
import { authState } from "./atoms";
import api from "../utils/api";

export const isAuthenticated = selector({
	key: "authenticated",
	get: ({ get }) => {
		const state = get(authState);
		return !!state.accessToken;
	},
});

export const fetchAccount = selector({
	key: "fetchAccount",
	get: async ({ get }) => {
		const response = await api.get("/auth/me");
		return response.data;
	},
});
