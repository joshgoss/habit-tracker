export {};

declare global {
  namespace Express {
    interface User {
      _id: string;
      firstName: string;
      lastName: string;
      provider: string;
      providerUserId: string;
      createdAt: number;
      updatedAt: number;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SUCCESS_REDIRECT: string,
      DEBUG: string,
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      HOST: string;
      JWT_SECRET: string;
      MONGODB_URI: string;
      NODE_ENV: 'test' | 'development' | 'production';
      PORT: string;
    }
  }
}