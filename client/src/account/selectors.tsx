import { selector } from "recoil";
import api from "../utils/api";
import { User } from "../types";
import { forceAccountRefresh } from "./atoms";

export const fetchAccount = selector({
	key: "fetchAccount",
	get: async ({ get }): Promise<User> => {
		get(forceAccountRefresh);
		const response = await api.get("/auth/me");
		return response.data;
	},
});
