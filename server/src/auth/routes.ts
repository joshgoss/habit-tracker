import Debug from "debug";
import { Router } from "express";
import passport from "passport";
import config from "../config";
import { ajv } from "../lib/validation";
import { User } from "../users/models";
import { generateAccessToken } from "./utils";

const router = Router();

/**************************************
 * Get authenticated user's account
 *************************************/
router.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		if (!req.user) {
			return res
				.status(401)
				.json({ code: 401, error: "Invalid auth token provided" });
		}

		return res.json({ code: 200, data: req.user });
	}
);

router.put(
	"/me",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		if (!req.user) {
			return res
				.status(401)
				.json({ code: 401, error: "Invalid auth token provided" });
		}

		const validate = ajv.getSchema("account");
		if (!validate) throw new Error("Unable to history schema");

		const valid = validate(req.body);
		if (!valid) {
			return res.status(400).json({ code: 400, errors: validate.errors });
		}

		await User.updateOne(
			{
				_id: req.user._id,
			},
			{ $set: { timezone: req.body.timezone } }
		);

		req.user.timezone = req.body.timezone;
		await req.user.save();

		return res.json({ code: 200, data: req.user });
	}
);

/********************
 * Google Auth
 ********************/
const googleDebug = Debug("auth:google");
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);
router.get(
	"/google/redirect",
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/",
	}),
	(req, res) => {
		googleDebug("Request user is: ", req.user);
		googleDebug("Google callback called");
		if (!req.user) {
			return res.status(401).json({ code: 401, error: "Not authorized" });
		}
		googleDebug("Generating accessToken...");
		const accessToken = generateAccessToken(
			{
				sub: req.user._id,
				provider: req.user.provider,
			},
			config.JWT_EXPIRES_IN
		);
		googleDebug(`accessToken is: ${accessToken}`);
		googleDebug(`Redirecting to:  ${config.AUTH_SUCCESS_REDIRECT}`);
		const expiresAt = Date.now() + config.JWT_EXPIRES_IN * 1000;
		googleDebug("Expires at is: ", expiresAt);

		res.redirect(
			302,
			`${config.AUTH_SUCCESS_REDIRECT}?accessToken=${accessToken}&expiresAt=${expiresAt}`
		);
	}
);

/********************
 * Github Auth
 ********************/
const githubDebug = Debug("auth:github");
router.get(
	"/github",
	passport.authenticate("github", {
		scope: ["profile"],
		session: false,
	})
);
router.get(
	"/github/redirect",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/",
	}),
	(req, res) => {
		githubDebug("Request user is: ", req.user);
		githubDebug("Github callback called");
		if (!req.user) {
			return res.status(401).json({ code: 401, error: "Not authorized" });
		}
		githubDebug("Generating accessToken...");
		const accessToken = generateAccessToken(
			{
				sub: req.user._id,
				provider: req.user.provider,
			},
			config.JWT_EXPIRES_IN
		);
		githubDebug(`accessToken is: ${accessToken}`);
		githubDebug(`Redirecting to:  ${config.AUTH_SUCCESS_REDIRECT}`);
		const expiresAt = Date.now() + config.JWT_EXPIRES_IN * 1000;
		githubDebug("Expires at is: ", expiresAt);

		res.redirect(
			302,
			`${config.AUTH_SUCCESS_REDIRECT}?accessToken=${accessToken}&expiresAt=${expiresAt}`
		);
	}
);

export default router;
