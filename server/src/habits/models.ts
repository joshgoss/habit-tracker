import mongoosePkg from "mongoose";
import { Frequency, DayOfWeek } from "../constants";
const { model, Schema } = mongoosePkg;

export interface IHabit {
	_id: string;
	name: string;
	icon: string;
	color: string;
	amount: number;
	frequency: Frequency;
	daysOfWeek: DayOfWeek[];
	dayOfMonth?: number;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
	{
		name: { type: String, required: true },
		icon: { type: String, required: true },
		color: { type: String, required: true },
		amount: { type: Number, required: true },
		frequency: { type: String, required: true },
		daysOfWeek: [{ type: Number }],
		dayOfMonth: { type: Number },
		userId: Schema.Types.ObjectId,
	},
	{ timestamps: true }
);

export const Habit = model<IHabit>("Habit", habitSchema);
