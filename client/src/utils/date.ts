/**
 * Convert date to Utc
 * @param {Date} d
 * @returns {Date}
 */
export const toUtc = (d: Date) => {
	return new Date(d.toUTCString());
};

/**
 * Get todays date in UTC time zone
 * @param d G
 * @returns {Date}
 */
export const todayUtc = () => {
	return toUtc(new Date());
};

/**
 * Format date in the format of YYYY-MM-DD
 * @param {Date} d
 * @returns {string}
 */
export const formatDate = (d: Date): string => {
	return d.toISOString().split("T")[0];
};
