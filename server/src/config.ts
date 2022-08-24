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
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	HOST: process.env.HOST,
	JWT_SECRET: process.env.JWT_SECRET,
	MONGODB_URI: process.env.MONGODB_URI,
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT,
};

configDebug("config is: ", config);

export default config;
