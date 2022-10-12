import { DayOfWeek, Frequency } from "../constants";

export const habit = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 3, maxLength: 75 },
		icon: { type: "string", minLength: 2, maxLength: 75 },
		color: { type: "string", minLength: 2, maxLength: 75 },
		amount: { type: "number", minimum: 1 },
		frequency: {
			type: "string",
			enum: Object.values(Frequency),
		},
		daysOfWeek: {
			type: "array",
			items: { type: "number", enum: Object.values(DayOfWeek) },
			minItems: 1,
			maxItems: 7,
			uniqueItems: true,
		},
		dayOfMonth: { type: "number", nullable: true, minimum: 1, maximum: 31 },
	},
	required: ["name", "amount", "icon", "color", "frequency"],
	additionalProperties: false,
};
