import mongoosePkg from "mongoose";
const { model, Schema } = mongoosePkg;
import { AuthProvider } from "../constants";

export interface IUser {
	_id: string;
	firstName: string;
	lastName: string;
	provider: AuthProvider;
	providerUserId: string;
	timezone: string;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		provider: { type: String, required: true },
		providerUserId: { type: String, required: true },
		timezone: { type: String, required: true, default: "America/New_York" },
	},
	{ timestamps: true }
);

export const User = model<IUser>("User", userSchema);
