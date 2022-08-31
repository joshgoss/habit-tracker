import mongoosePkg from "mongoose";
const { model, Schema } = mongoosePkg;

export enum Frequency {
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
}

export enum DayOfWeek {
	Monday = "mon",
	Tuesday = "tue",
	Wednesday = "wed",
	Thursday = "thu",
	Friday = "fri",
	Saturday = "sat",
	Sunday = "sun",
}

export interface IHabit {
	_id: string;
	name: string;
	icon: string;
	color: string;
	amount: number;
	frequency: Frequency;
	daysOfWeek: DayOfWeek[];
	dayOfMonth: number;
	userId: string;
	createdAt: number;
	updatedAt: number;
}

const habitSchema = new Schema<IHabit>(
	{
		name: { type: String, required: true },
		icon: { type: String, required: true },
		color: { type: String, required: true },
		amount: { type: Number, required: true },
		frequency: { type: String, required: true },
		daysOfWeek: [{ type: String }],
		dayOfMonth: { type: Number },
		userId: Schema.Types.ObjectId,
	},
	{ timestamps: true }
);

export const Habit = model<IHabit>("Habit", habitSchema);
