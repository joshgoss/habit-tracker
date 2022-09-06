import jwt from "jsonwebtoken";
import config from "../config";

export interface JwtPayload {
	sub: string;
	provider: string;
}

/**
 * Generate json web token
 * @param  {string} userId,
 * @param {number} expiresIn How long the token takes to expire in seconds
 * @returns {string}
 */
export const generateAccessToken = (
	payload: JwtPayload,
	expiresIn: number
): string => {
	return jwt.sign(payload, config.JWT_SECRET, { expiresIn: expiresIn * 1000 });
};
