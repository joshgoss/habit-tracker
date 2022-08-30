import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import Debug from "debug";

// load config first since it also loads dotenv
import config from "./config";
import { connectDatabase, disconnectDatabase } from "./database";
import authRoutes from "./auth/routes";
import { jwtStrategy, googleStrategy } from "./auth/strategies";

const serverDebug = Debug("server");

serverDebug("Starting app");

serverDebug("Connecting to database");
connectDatabase(config.MONGODB_URI);
serverDebug("Connected to database");

serverDebug("Registering passport strategies");
passport.use(googleStrategy);
passport.use(jwtStrategy);

const app: Express = express();

app.use(
	cors({ origin: "*", allowedHeaders: ["Authorization", "Content-Type"] })
);

app.get("/healthcheck", (req: Request, res: Response) => {
	res.json({ success: true });
});

app.use("/auth", authRoutes);

if (require.main === module) {
	app.listen(config.PORT, () => {
		console.log(
			`[server]: Server is running at https://localhost:${config.PORT}`
		);
	});

	app.on("finish", () => {
		serverDebug("app finishing..");
	});

	app.on("close", () => {
		serverDebug("app closing...");
	});
}

const cleanUp = async () => {
	serverDebug("Shutting down app...");
	await disconnectDatabase();
	process.exit(0);
};

process.on("SIGINT", cleanUp);
process.on("SIGTERM", cleanUp);

export default app;
