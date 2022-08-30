const ACCESS_TOKEN_KEY = "accessToken";
/**
 * Sets auth token value within the session storage of the browser
 * @param  {string} authToken - The auth token value
 * @returns {void}
 */
export const setAccessToken = (authToken: string): void =>
	sessionStorage.setItem(ACCESS_TOKEN_KEY, authToken);

/**
 * Get the auth token value from the session storage of the browser
 * @returns {string | null}
 */
export const getAccessToken = (): string | null =>
	sessionStorage.getItem(ACCESS_TOKEN_KEY);

/**
 * Returns true or false depending on if the user is authenticated
 * @return {boolean}
 */
export const isAuthenticated = (): boolean => !!getAccessToken();

const ACCOUNT_KEY = "account";
/**
 * Sets user's account information within session storage
 * @param  {string} account - User's account info
 * @returns {void}
 */
export const setAccount = (account: object): void =>
	sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));

/**
 * Get user's account info from the session storage of the browser
 * @returns {object | null}
 */
export const getAccount = (): object => {
	const account = sessionStorage.getItem(ACCOUNT_KEY);
	return account ? JSON.parse(account) : null;
};
