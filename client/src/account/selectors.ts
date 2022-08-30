import { selector } from "recoil";
import api from "../utils/api";

export const fetchAccount = selector({
	key: "fetchAccount",
	get: async ({ get }) => {
		const response = await api.get("/auth/me");
		return response.data;
	},
});
