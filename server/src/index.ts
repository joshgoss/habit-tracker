
// load config first since it also loads dotenv
import config from './config.js';

import Debug from 'debug';
const serverDebug = Debug('server');

serverDebug("Starting app");

import express, { Express, Request, Response} from 'express';
import mongoose from 'mongoose';
import passport from 'passport';


import authRoutes, { jwtStrategy, googleStrategy } from './auth/routes.js';

serverDebug('Connecting to database');
await mongoose.connect(config.MONGODB_URI);
serverDebug('Connected to database');

serverDebug('Registering passport strategies');
passport.use(googleStrategy);
passport.use(jwtStrategy);

process.on('SIGINT', async () => {
    serverDebug("Closing app");
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    serverDebug("Closing app");
    await mongoose.connection.close();
    process.exit(0);
});


const app: Express = express();

app.get('/healthcheck', (req: Request, res: Response) => {
    res.json({success: true})
});

app.use('/api/auth', authRoutes);

app.listen(config.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${config.PORT}`);
})