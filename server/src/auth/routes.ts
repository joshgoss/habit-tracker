import Debug from 'debug';
import { Request, Router } from 'express';
import passport from 'passport';
import * as R from 'ramda';

import config from '../config.js';
import { User } from '../users/models.js';
import { AuthProvider, JwtPayload, generateAccessToken } from './utils.js';

const router = Router();

/*****************************
 * JWT Configuration
 *****************************/
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
 };

 export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: Function ) => {
    const user = await User.findById(payload.sub);
    return user ? done(null, user) : done(null, false);
});


/*****************************
 * Google Auth Configuration
 *****************************/
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
const googleDebug = Debug('auth:google');
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://${process.env.HOST!}:${process.env.PORT}/api/auth/google/callback`,
        passReqToCallback: true,
        scope: "scope",
    },
    async (
        req: Request,
        accessToken: string, 
        refreshToken: string, 
        profile: any, 
        cb: VerifyCallback
    ) => {
            googleDebug('Verifying google authentication');
            googleDebug('accessToken: ', accessToken);
            googleDebug('refreshToken: ', refreshToken);
            googleDebug('Profile: ', profile);
            let user = await User.findOne({ email: profile.email });

            if (!user) {
                googleDebug('No user found. Creating new user...');
                user = new User({ 
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    provider: AuthProvider.Google, 
                    providerUserId: profile.id
                });
                await user.save();
                googleDebug('New user created');
            } else {
                googleDebug('Existing user found');
            }

            return cb(null, user);
    }
);


router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
    '/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        googleDebug('Request user is: ', req.user);
        googleDebug('Google callback called');
        if (!req.user) {
            return res.status(401).json({message: 'Not authorized'});
        }
        googleDebug('Generating accessToken...');
        const accessToken = generateAccessToken({
            sub: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            provider: req.user.provider,
        });
        googleDebug(`accessToken is: ${accessToken}`);
        // Generate jwt token and return token within query param
        googleDebug(`Redirecting to:  ${config.AUTH_SUCCESS_REDIRECT}`);
        res.redirect(301, `${config.AUTH_SUCCESS_REDIRECT}?accessToken=${accessToken}`);
    }
);

export default router;
