import request from "supertest";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import app from "../index";
import { IHistory, History } from "./models";
import { Habit, IHabit } from "../habits/models";
import { createAndLoginUser } from "../testUtils";
import { IUser, User } from "../users/models";

describe("/history", () => {
	let user: IUser | undefined;
	let accessToken: string | undefined;
	let history: IHistory | undefined;
	let habit: IHabit | undefined;

	beforeAll(async () => {
		const creds = await createAndLoginUser();
		user = creds.user;
		accessToken = creds.accessToken;
		habit = await Habit.create({
			name: "Test habit",
			amount: 1,
			icon: "plus",
			color: "black",
			frequency: "daily",
			userId: user._id,
			daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
		});

		history = await History.create({
			date: DateTime.now().setZone(user.timezone).toJSDate(),
			completed: true,
			amount: 1,
			habitId: habit._id,
			userId: user._id,
		});
	});

	afterAll(async () => {
		await History.deleteOne({ _id: (history as IHistory)._id });
		await Habit.deleteOne({ _id: (habit as IHabit)._id });
		await User.deleteOne({ _id: (user as IUser)._id });
	});

	describe("GET /history", () => {
		it("should block unauthorized access", async () => {
			const resp = await request(app)
				.get("/history")
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("should fetch user's history entries", async () => {
			const resp = await request(app)
				.get("/history")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data[0]._id).toBe((history as IHistory)._id.toString());
		});
	});

	describe("POST /history", () => {
		it("should not allow unauthorized access", async () => {
			const resp = await request(app)
				.post("/history")
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("should not allow creating history for non existent habit", async () => {
			const resp = await request(app)
				.post("/history")
				.send({
					amount: 1,
					habitId: new mongoose.Types.ObjectId().toString(),
					date: "2012-04-23",
				})
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(404);
		});

		it("should forbid creating history if it already exists for a habit, user, and date", async () => {
			const habit2: IHabit = await Habit.create({
				amount: 1,
				name: "exercise",
				frequency: "daily",
				daysOfWeek: [],
				icon: "person",
				userId: (user as IUser)._id,
				color: "red",
			});
			const date = DateTime.fromISO("2018-10-09", { zone: user?.timezone });
			const existingHistory: IHistory = await History.create({
				amount: 1,
				completed: true,
				date: date.toISO(),
				habitId: habit2._id,
				userId: (user as IUser)._id,
			});
			const resp = await request(app)
				.post("/history")
				.send({
					amount: 1,
					habitId: habit2._id,
					date: date.toISODate(),
				})
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(422);

			await Habit.deleteOne({ _id: habit2._id });
			await History.deleteOne({ _id: existingHistory._id });
		});

		it("should be able to create history successfully with valid params", async () => {
			const resp = await request(app)
				.post("/history")
				.send({
					amount: 1,
					habitId: (habit as IHabit)._id.toString(),
					date: DateTime.fromISO("2022-08-11", {
						zone: user?.timezone,
					}).toISODate(),
				})
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(201);
			await History.deleteOne({ _id: resp.body._id });
		});
	});

	describe("GET /history/:historyId", () => {
		it("should not allow unauthorized access", async () => {
			const resp = await request(app)
				.get(`/history/${(history as IHistory)._id.toString()}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("should successfully get existing history", async () => {
			const resp = await request(app)
				.get(`/history/${(history as IHistory)._id.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data._id).toBe((history as IHistory)._id.toString());
		});
	});

	describe("DELETE /history/:historyId", () => {
		it("should not allow unauthorized access", async () => {
			const resp = await request(app)
				.delete(`/history/${(history as IHistory)._id.toString()}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("should delete a user's history entry", async () => {
			const date = DateTime.fromISO("2018-05-09", { zone: user?.timezone });
			const history2: IHistory = await History.create({
				amount: 1,
				completed: true,
				date: date.toJSDate(),
				habitId: (habit as IHabit)._id,
				userId: (user as IUser)._id,
			});

			const resp = await request(app)
				.delete(`/history/${(history2 as IHistory)._id.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
		});
	});

	describe("PUT /history/:historyId", () => {
		it("should not allow unauthorized access", async () => {
			const resp = await request(app)
				.put(`/history/${(history as IHistory)._id.toString()}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("should update a user's history entry", async () => {
			const resp = await request(app)
				.put(`/history/${(history as IHistory)._id.toString()}`)
				.send({
					amount: 0,
					habitId: (habit as IHabit)._id,
					date: DateTime.fromISO((history as IHistory).date.toISOString(), {
						zone: user?.timezone,
					}).toISODate(),
				})
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data.amount).toBe(0);
		});
	});
});
