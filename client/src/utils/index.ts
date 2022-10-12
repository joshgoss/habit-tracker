export function random(min = 1, max = 100) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export const formatDate = (d: Date): string => {
	return d.toISOString().split("T")[0];
};
