import mongoose, { Connection } from "mongoose";

let db: Connection | undefined;

export const connectDatabase = async (uri: any) => {
	await mongoose.connect(uri);
	db = mongoose.connection;
	return db;
};

export const disconnectDatabase = async () => {
	if (db) {
		await db.close();
	}
};

export default db;
