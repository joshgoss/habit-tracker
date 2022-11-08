import Debug from "debug";
import passport from "passport";
import { Request } from "express";
import config from "../config";
import { JwtPayload } from "./utils";
import { AuthProvider } from "../constants";
import { User } from "../users/models";

/*****************************
 * Google Strategy
 *****************************/
import {
	Profile as GoogleProfile,
	Strategy as GoogleStrategy,
	VerifyCallback,
} from "passport-google-oauth20";

const googleDebug = Debug("auth:google");
export const verifyGoogle = async (
	req: Request,
	accessToken: string,
	refreshToken: string,
	profile: GoogleProfile,
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
		clientID: config.GOOGLE_CLIENT_ID,
		clientSecret: config.GOOGLE_CLIENT_SECRET,
		callbackURL: config.GOOGLE_CALLBACK,
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

/*******************************
 * Github Strategy
 *******************************/
import {
	Strategy as GitHubStrategy,
	Profile as GithubProfile,
} from "passport-github2";
const githubDebug = Debug("auth:github");
export const verifyGithub = async (
	accessToken: string,
	refreshToken: string,
	profile: GithubProfile,
	done: VerifyCallback
) => {
	githubDebug("Verifying github authentication");
	githubDebug("accessToken: ", accessToken);
	githubDebug("refreshToken: ", refreshToken);
	githubDebug("Profile: ", profile);
	let user = await User.findOne({
		provider: AuthProvider.Github,
		providerUserId: profile.id,
	});

	if (!user) {
		const names = profile.displayName.split(" ");
		githubDebug("No user found. Creating new user...");
		user = await User.create({
			firstName: names[0],
			lastName: names.length > 1 ? names[1] : "",
			provider: AuthProvider.Github,
			providerUserId: profile.id,
		});
		githubDebug("New user created");
	} else {
		githubDebug("Existing user found");
	}

	return done(null, user);
};

export const githubStrategy = new GitHubStrategy(
	{
		clientID: config.GITHUB_CLIENT_ID,
		clientSecret: config.GITHUB_CLIENT_SECRET,
		callbackURL: config.GITHUB_CALLBACK,
	},
	verifyGithub
);
