import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import Debug from "debug";

// load config first since it also loads dotenv
import config from "./config";
import { connectDatabase, disconnectDatabase } from "./lib/database";

import { jwtStrategy, githubStrategy, googleStrategy } from "./auth/strategies";
import authRoutes from "./auth/routes";
import habitsRoutes from "./habits/routes";
import historyRoutes from "./history/routes";
import timezoneRoutes from "./timezones/routes";

const serverDebug = Debug("server");

serverDebug("Starting app");

serverDebug("Connecting to database");
connectDatabase(config.MONGODB_URI);
serverDebug("Connected to database");

serverDebug("Registering passport strategies");
passport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(jwtStrategy);

const app: Express = express();

app.use(
	cors({ origin: "*", allowedHeaders: ["Authorization", "Content-Type"] })
);

app.use(express.json());

app.get("/healthcheck", (req: Request, res: Response) => {
	res.json({ code: 200, success: true });
});

app.use("/auth", authRoutes);
app.use("/habits", habitsRoutes);
app.use("/history", historyRoutes);
app.use("/timezones", timezoneRoutes);

if (require.main === module) {
	app.listen(config.NODE_PORT, () => {
		console.log(
			`[server]: Server is running at http://localhost:${config.NODE_PORT}`
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
