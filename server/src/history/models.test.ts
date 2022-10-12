import config from "../config";
import { Frequency, DayOfWeek } from "../constants";
import { connectDatabase, disconnectDatabase } from "../lib/database";
import { History, getStreaksForUser } from "./models";
import { IUser, User } from "../users/models";
import { Habit, IHabit } from "../habits/models";
import { addDays, startOfDay } from "./utils";
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
				daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
				userId: user._id,
			});
		});

		afterAll(async () => {
			await Habit.deleteOne({ _id: habit?._id });
		});

		it("should return a streak of 0 with no history", async () => {
			const streaks = await getStreaksForUser(user._id, startOfDay(new Date()));

			expect(streaks.length).toBe(1);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(0);
		});

		it("should correctly calculated a streak for a habit with consecutive days", async () => {
			const date = startOfDay(new Date());
			const rows = [...Array(10).keys()].map((n) => ({
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
				date: n ? addDays(date, -n) : date,
			}));

			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should correctly end streak if gap in history", async () => {
			const date = startOfDay(new Date());
			const notCompletedIndex = 3;
			const rows = [...Array(4).keys()].map((n, index) => ({
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: index !== notCompletedIndex,
				date: n ? addDays(date, -n) : date,
			}));

			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(notCompletedIndex);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should handle gap between end date and most recent history entry", async () => {
			const futureDate = addDays(startOfDay(new Date()), 60);
			const today = startOfDay(new Date());
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
				date: today,
			};

			await History.create(data);
			await History.create({ ...data, date: addDays(today, 1) });
			await History.create({ ...data, date: addDays(today, 2) });
			await History.create({ ...data, date: addDays(today, 3) });

			const streaks = await getStreaksForUser(user._id, futureDate);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(0);

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
			const streaks = await getStreaksForUser(user._id, startOfDay(new Date()));

			expect(streaks.length).toBe(1);
			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);

			expect(habitStreak?.streak).toBe(0);
		});

		it("should correctly calculated a streak for a habit with consecutive weeks", async () => {
			const date = startOfDay(new Date("2022-10-12"));
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date },
				{ ...data, date: addDays(date, -7) },
				{ ...data, date: addDays(date, -14) },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("Should correctly end streak with gaps in history ", async () => {
			const date = startOfDay(new Date("2022-10-12"));
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date },
				{ ...data, date: addDays(date, -7) },
				{ ...data, date: addDays(date, -14) },
				{ ...data, date: addDays(date, -21), amount: 0, completed: false },
				{ ...data, date: addDays(date, -28) },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
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
			const date = startOfDay(new Date("2022-10-01"));
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date },
				{ ...data, date: startOfDay(new Date("2022-09-01")) },
				{ ...data, date: startOfDay(new Date("2022-08-01")) },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
			expect(streaks).toHaveLength(1);

			const habitStreak = streaks.find(
				(s) => s.habitId.toString() === habit._id.toString()
			);
			const streak = habitStreak ? habitStreak.streak : 0;
			expect(streak).toBe(rows.length);

			await History.deleteMany({ habitId: habit._id });
		});

		it("should correctly end streak for a habit with gaps in history", async () => {
			const date = startOfDay(new Date("2022-10-01"));
			const data = {
				habitId: habit._id,
				userId: user._id,
				amount: 1,
				completed: true,
			};
			const rows = [
				{ ...data, date },
				{ ...data, date: startOfDay(new Date("2022-09-01")) },
				{ ...data, date: startOfDay(new Date("2022-08-01")) },
				{
					...data,
					date: startOfDay(new Date("2022-07-01")),
					amount: 0,
					completed: false,
				},
				{ ...data, date: startOfDay(new Date("2022-06-01")) },
				{ ...data, date: startOfDay(new Date("2022-05-01")) },
			];
			await History.insertMany(rows);

			const streaks = await getStreaksForUser(user._id, date);
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
