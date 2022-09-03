export const historyQueryParams = {
	type: "object",
	properties: {
		startDate: { type: "string", format: "date" },
		endDate: { type: "string", format: "date" },
	},
};

export const history = {
	type: "object",
	properties: {
		habitId: { type: "string" },
		amount: { type: "number", minimum: 0 },
		date: { type: "string", format: "date" },
	},
	required: ["habitId", "amount", "date"],
};
