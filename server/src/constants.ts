export enum AuthProvider {
	Github = "Github",
	Google = "Google",
}

export interface HabitStreak {
	habitId: string;
	streak: number;
}

export enum Frequency {
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
}

export enum DayOfWeek {
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
	Sunday = 7,
}
