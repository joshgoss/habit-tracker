import { timeZonesNames } from "@vvo/tzdb";

export const account = {
	type: "object",
	properties: {
		timezone: { type: "string", enum: timeZonesNames },
	},
};
