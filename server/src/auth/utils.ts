import jwt from 'jsonwebtoken';
import config from '../config.js';

export enum AuthProvider {
    Apple='apple',
    Github='github',
    Google='google',
}

export interface JwtPayload {
    sub: string;
    provider: string;
    firstName: string;
    lastName: string;
}

/**
 * Generate json web token
 * @param  {string} userId
 * @returns {string}
 */
export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '6h' });
};