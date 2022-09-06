const ACCESS_TOKEN_KEY = "accessToken";
const EXPIRES_AT_KEY = "expiresAt";

/**
 * Sets auth token value within the session storage of the browser
 * @param  {string} authToken - The auth token value
 * @returns {void}
 */
export const setAccessToken = (authToken: string, expiresAt: number): void => {
	sessionStorage.setItem(ACCESS_TOKEN_KEY, authToken);
	sessionStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
};

/**
 * Get the auth token value from the session storage of the browser
 * @returns {string | null}
 */
export const getAccessToken = (): string | null => {
	return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getExpiresAt = (): number | null => {
	const expiresAt = sessionStorage.getItem(EXPIRES_AT_KEY);
	return expiresAt ? Number(expiresAt) : null;
};

/**
 * Removes accessToken data within session storage
 * @returns {void}
 */
export const clearAccessToken = (): void => {
	sessionStorage.removeItem(ACCESS_TOKEN_KEY);
	sessionStorage.removeItem(EXPIRES_AT_KEY);
};

/**
 * Returns true or false depending on if the user is authenticated
 * @return {boolean}
 */
export const isAuthenticated = (): boolean => !!getAccessToken();
