import api from "../utils/api";

interface HistoryData {
	habitId: string;
	amount: number;
	date: string;
}

export const setHistory = async (
	data: HistoryData,
	historyId?: string | null
) => {
	if (historyId) {
		return await api.put(`/history/${historyId}`, data);
	} else {
		return await api.post(`/history`, data);
	}
};
