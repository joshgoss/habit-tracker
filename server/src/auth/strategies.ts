import Debug from "debug";
import passport from "passport";
import { Request } from "express";
import config from "../config";
import { AuthProvider, JwtPayload, generateAccessToken } from "./utils";
import { User } from "../users/models";

/*****************************
 * Google Strategy
 *****************************/
import {
	Profile,
	Strategy as GoogleStrategy,
	VerifyCallback,
} from "passport-google-oauth20";

const googleDebug = Debug("strategy:google");
export const verifyGoogle = async (
	req: Request,
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	done: VerifyCallback
) => {
	googleDebug("Verifying google authentication");
	googleDebug("accessToken: ", accessToken);
	googleDebug("refreshToken: ", refreshToken);
	googleDebug("Profile: ", profile);
	let user = await User.findOne({
		provider: AuthProvider.Google,
		providerUserId: profile.id,
	});

	if (!user) {
		googleDebug("No user found. Creating new user...");
		user = await User.create({
			firstName: profile.name ? profile.name.givenName : "",
			lastName: profile.name ? profile.name.familyName : "",
			provider: AuthProvider.Google,
			providerUserId: profile.id,
		});
		googleDebug("New user created");
	} else {
		googleDebug("Existing user found");
	}

	return done(null, user);
};

export const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `http://${process.env.HOST!}:${
			process.env.PORT
		}/auth/google/redirect`,
		passReqToCallback: true,
		scope: "scope",
	},
	verifyGoogle
);

/*****************************
 * JWT Strategy
 *****************************/
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
	secretOrKey: config.JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const verifyJwt = async (payload: JwtPayload, done: Function) => {
	const user = await User.findById(payload.sub);
	return user ? done(null, user) : done(null, false);
};

export const jwtStrategy = new JwtStrategy(jwtOptions, verifyJwt);
