declare global {
	namespace NodeJS {
		interface ProcessEnv {
			AUTH_SUCCESS_REDIRECT: string;
			DEBUG: string;
			ENVIRONMENT: "development" | "test" | "production";
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			HOST: string;
			JWT_EXPIRES_IN: string;
			JWT_SECRET: string;
			MONGODB_URI: string;
			NODE_ENV: "development" | "production";
			PORT: string;
		}
	}
}

export {};
