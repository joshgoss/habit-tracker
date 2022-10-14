import { DateTime } from "luxon";
import config from "../config";
import { Frequency, DayOfWeek } from "../constants";
import { connectDatabase, disconnectDatabase } from "../lib/database";
import { History, getStreaksForUser } from "./models";
import { IUser, User } from "../users/models";
import { Habit, IHabit } from "../habits/models";
import { createUser } from "../testUtils";
import { habit } from "../habits/schemas";

describe("getStreaksForUser()", () => {
	let user: IUser;

	beforeAll(async () => {
		await connectDatabase(config.MONGODB_URI);
		user = await createUser();
	});

	afterAll(async () => {
		await User.deleteOne({ _id: user?._id });
		await disconnectDatabase();
	});

	describe("Daily frequency streak", () => {
		let habit: IHabit;
		beforeAll(async () => {
			habit = await Habit.create({
				name: "Exercise",
				amount: 1,
				frequency: Frequency.Daily,
				icon: "Dumbbells",
				color: "blue",
				daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
				userId: user._id,
			});
		});

		afterAll(async () => {
			await Habit.deleteOne({ _id: habit?._id });
		});

		it("should return a streak of 0 with no history", async () => {
			const streaks = await getStreaksForUser(
				user._id,
				DateTime.now().setZone(user.timezone).toJSDate(),
				user.timezone
			);

			expect(streaks.length).toBe(1);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(0);
		});

		it("should correctly calculated a streak for a habit with consecutive days", async () => {
			const date = DateTime.now().setZone(user.timezone);

			const rows = [...Array(10).keys()].map((n) => ({
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
				date: n ? date.minus(n).toJSDate() : date.toJSDate(),
			}));

			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should correctly end streak if gap in history", async () => {
			const date = DateTime.now().setZone(user.timezone);
			const notCompletedIndex = 3;
			const rows = [...Array(4).keys()].map((n, index) => ({
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: index !== notCompletedIndex,
				date: n ? date.plus({ days: -n }).toJSDate() : date.toJSDate(),
			}));

			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(notCompletedIndex);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should handle gap between end date and most recent history entry", async () => {
			const today = DateTime.now().setZone(user.timezone);
			const future = today.plus({ days: 60 });
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};

			await History.create({ ...data, date: future.toJSDate() });
			await History.create({
				...data,
				date: today.toJSDate(),
			});
			await History.create({
				...data,
				date: today.plus({ days: 1 }).toJSDate(),
			});
			await History.create({
				...data,
				date: today.plus({ days: 2 }).toJSDate(),
			});

			const streaks = await getStreaksForUser(
				user._id,
				future.toJSDate(),
				user.timezone
			);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(1);

			await History.deleteMany({ habitId: habit._id });
		});
	});

	describe("Weekly frequency streak", () => {
		let habit: IHabit;

		beforeAll(async () => {
			habit = await Habit.create({
				name: "Exercise",
				amount: 1,
				frequency: Frequency.Weekly,
				icon: "Dumbbells",
				color: "blue",
				daysOfWeek: [DayOfWeek.Wednesday],
				userId: user._id,
			});
		});

		afterAll(async () => {
			await Habit.deleteOne({ _id: habit?._id });
		});

		it("should return a streak of 0 with no history", async () => {
			const streaks = await getStreaksForUser(
				user._id,
				new Date(),
				user.timezone
			);

			expect(streaks.length).toBe(1);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(0);
		});

		it("should correctly calculated a streak for a habit with consecutive weeks", async () => {
			const date = DateTime.fromISO("2022-10-12", {
				zone: user.timezone,
			});
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date: date.toJSDate() },
				{ ...data, date: date.minus({ weeks: 1 }).toJSDate() },
				{ ...data, date: date.minus({ weeks: 2 }).toJSDate() },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("Should correctly end streak with gaps in history ", async () => {
			const date = DateTime.fromISO("2022-10-12", { zone: user.timezone });
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date: date.toJSDate() },
				{ ...data, date: date.minus({ weeks: 1 }).toJSDate() },
				{ ...data, date: date.minus({ weeks: 2 }).toJSDate() },
				{
					...data,
					date: date.minus({ weeks: 3 }).toJSDate(),
					amount: 0,
					completed: false,
				},
				{ ...data, date: date.minus({ weeks: 4 }).toJSDate() },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(3);

			await History.deleteMany({ habitId: habit._id });
		});
	});

	describe("monthly frequency streak", () => {
		let habit: IHabit;

		beforeAll(async () => {
			habit = await Habit.create({
				name: "Exercise",
				amount: 1,
				frequency: Frequency.Monthly,
				icon: "Dumbbells",
				color: "blue",
				daysOfWeek: [],
				dayOfMonth: 1,
				userId: user._id,
			});
		});

		afterAll(async () => {
			Habit.deleteOne({ _id: habit._id });
		});

		it("should correctly calculated a streak for a habit with consecutive months", async () => {
			const date = DateTime.fromISO("2022-10-01", { zone: user.timezone });
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date: date.toJSDate() },
				{ ...data, date: date.minus({ months: 1 }).toJSDate() },
				{ ...data, date: date.minus({ months: 2 }).toJSDate() },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should correctly end streak for a habit with gaps in history", async () => {
			const date = DateTime.fromISO("2022-10-01", { zone: user.timezone });
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date: date.toJSDate() },
				{ ...data, date: date.minus({ months: 1 }).toJSDate() },
				{ ...data, date: date.minus({ months: 2 }).toJSDate() },
				{
					...data,
					date: date.minus({ months: 3 }).toJSDate(),
					amount: 0,
					completed: false,
				},
				{ ...data, date: date.minus({ months: 4 }).toJSDate() },
				{ ...data, date: date.minus({ months: 5 }).toJSDate() },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(
				user._id,
				date.toJSDate(),
				user.timezone
			);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(3);

			await History.deleteMany({ habitId: habit._id });
		});
	});
});
