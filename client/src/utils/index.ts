const AUTH_TOKEN_KEY = "authToken";
/**
 * Sets auth token value within the session storage of the browser
 * @param  {string} authToken - The auth token value
 * @returns {void}
 */
export const setAuthToken = (authToken: string): void =>
  sessionStorage.setItem(AUTH_TOKEN_KEY, authToken);

/**
 * Get the auth token value from the session storage of the browser
 * @returns {string | null}
 */
export const getAuthToken = (): string | null =>
  sessionStorage.getItem(AUTH_TOKEN_KEY);

/**
 * Returns true or false depending on if the user is authenticated
 * @return {boolean}
 */
export const isAuthenticated = (): boolean => !!getAuthToken();
