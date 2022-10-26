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
			MONGODB_DB: string;
			MONGODB_HOST: string;
			MONGODB_PASSWORD: string;
			MONGODB_PORT: string;
			MONGODB_USER: string;
			NODE_ENV: "development" | "production";
			NODE_HOST: string;
			NODE_PORT: string;
		}
	}
}

export {};
