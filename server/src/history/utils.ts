// NOTE: These date functions assume the TZ is set to UTC

/**
 * Changes the time on the date object to beginning of day
 * @param {Date} d A Date object instance
 * @returns {Date}
 */
export const startOfDay = (d: Date): Date => {
	d.setUTCHours(0, 0, 0, 0);
	return d;
};

/**
 * Changes the time on the date object passed
 * to the end of the day
 * @param d A Date object instance
 * @returns {Date}
 */
export const endOfDay = (d: Date): Date => {
	d.setUTCHours(23, 59, 59, 999);
	return d;
};

/**
 * Creates a date object instance for the current day with the time
 * set to the beginning of the day
 * @returns {Date}
 */
export const startOfToday = (): Date => {
	const d = new Date();
	startOfDay(d);
	return d;
};

/**
 * Creates a date object instance for the current day with the time
 * set to the end of the day
 * @returns {Date}
 */
export const endOfToday = (): Date => {
	const d = new Date();
	endOfDay(d);
	return d;
};
