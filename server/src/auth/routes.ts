import Debug from "debug";
import { Request, Router } from "express";
import passport from "passport";
import * as R from "ramda";
import config from "../config";
import { JwtPayload, generateAccessToken } from "./utils";

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

		return res.json({ data: req.user });
	}
);

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
		const accessToken = generateAccessToken({
			sub: req.user._id,
			provider: req.user.provider,
		});
		googleDebug(`accessToken is: ${accessToken}`);
		googleDebug(`Redirecting to:  ${config.AUTH_SUCCESS_REDIRECT}`);
		res.redirect(
			301,
			`${config.AUTH_SUCCESS_REDIRECT}?accessToken=${accessToken}`
		);
	}
);

export default router;
