/**
 * Convert date to Utc
 * @param {Date} d
 * @returns {Date}
 */
export const toUtc = (d: Date) => {
	const utc = Date.UTC(
		d.getUTCFullYear(),
		d.getUTCMonth(),
		d.getUTCDate(),
		d.getUTCHours(),
		d.getUTCMinutes(),
		d.getUTCSeconds()
	);
	return new Date(utc);
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

export const toLocal = (d: Date) => {
	return new Date(d.toLocaleDateString());
};

/**
 * Convert string date to a UTC date object
 *
 * @param {string} str
 * @returns  {Date}
 */
export const strToUtc = (str: string): Date => {
	return new Date(`${str} UTC`);
};
