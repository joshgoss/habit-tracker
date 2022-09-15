import { selector } from "recoil";
import { authState } from "./atoms";
import api from "../utils/api";
import { User } from "../types";

export const isAuthenticated = selector({
	key: "authenticated",
	get: ({ get }): boolean => {
		const state = get(authState);
		return !!state.accessToken;
	},
});

export const fetchAccount = selector({
	key: "fetchAccount",
	get: async ({ get }): Promise<User> => {
		const response = await api.get("/auth/me");
		return response.data;
	},
});
