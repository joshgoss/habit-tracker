import jwt from "jsonwebtoken";
import config from "../config";

export interface JwtPayload {
	sub: string;
	provider: string;
}

export enum AuthProvider {
	Apple = "Apple",
	Github = "Github",
	Google = "Google",
}

/**
 * Generate json web token
 * @param  {string} userId
 * @returns {string}
 */
export const generateAccessToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "6h" });
};
