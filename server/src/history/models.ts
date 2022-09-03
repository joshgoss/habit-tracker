import mongoosePkg from "mongoose";
const { model, Schema } = mongoosePkg;

export interface IHistory {
	_id: string;
	amount: number;
	habitId: string;
	userId: string;
	completed: boolean;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

const historySchema = new Schema<IHistory>(
	{
		amount: { type: Number },
		habitId: Schema.Types.ObjectId,
		userId: Schema.Types.ObjectId,
		completed: { type: Boolean },
		date: { type: Date },
	},
	{ timestamps: true }
);

export const History = model<IHistory>("History", historySchema);
