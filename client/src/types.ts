export enum AuthProvider {
	Apple = "Apple",
	Github = "Github",
	Google = "Google",
}

export enum Frequency {
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
}

export enum DayOfWeek {
	Sunday = 0,
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
}

export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	provider: AuthProvider;
	providerUserId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Habit {
	_id?: string;
	name: string;
	icon: string;
	color: string;
	amount: number;
	frequency: Frequency;
	daysOfWeek: DayOfWeek[];
	dayOfMonth?: number;
	userId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface History {
	_id: string;
	amount: number;
	habitId: string;
	userId: string;
	completed: boolean;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface HabitStreak {
	habitId: string;
	streak: number;
}
