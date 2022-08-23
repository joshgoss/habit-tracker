import jwt from "jsonwebtoken";
import config from "../config.js";

export interface JwtPayload {
  sub: string;
  provider: string;
}

/**
 * Generate json web token
 * @param  {string} userId
 * @returns {string}
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "6h" });
};
