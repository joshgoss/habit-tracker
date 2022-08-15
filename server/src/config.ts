import dotenv from 'dotenv';
import Debug from 'debug';
const configDebug = Debug('config');
dotenv.config();

configDebug("Loaded environment variables from .env");
configDebug('Setting config values');
const config = {
    AUTH_SUCCESS_REDIRECT: process.env.AUTH_SUCCESS_REDIRECT,
    DEBUG: process.env.DEBUG,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    HOST: process.env.HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT,
};

configDebug(config);

export default config;