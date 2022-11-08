import dotenv from "dotenv";
import Debug from "debug";
import path from "path";
const configDebug = Debug("config");

const environment = process.env.ENVIRONMENT
	? process.env.ENVIRONMENT
	: "development";
configDebug(`Environment: ${environment}`);

const envFile = `${path.resolve(__dirname, "..")}/.env.${environment}`;
configDebug(`Env file is: ${envFile}`);
configDebug("Loading environment variables from env file");
dotenv.config({
	path: envFile,
});

const config = {
	AUTH_SUCCESS_REDIRECT: process.env.AUTH_SUCCESS_REDIRECT,
	DEBUG: process.env.DEBUG,
	GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GITHUB_CALLBACK: process.env.GITHUB_CALLBACK,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	HOST: process.env.HOST,
	JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN),
	JWT_SECRET: process.env.JWT_SECRET,
	MONGODB_DB: process.env.MONGODB_DB,
	MONGODB_HOST: process.env.MONGODB_HOST,
	MONGODB_PORT: process.env.MONGODB_PORT,
	MONGODB_URI: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`,
	NODE_ENV: process.env.NODE_ENV || "development",
	NODE_PORT: Number(process.env.NODE_PORT),
	TZ: process.env.TZ,
};

configDebug("config is: ", config);

export default config;
