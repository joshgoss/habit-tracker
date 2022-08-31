import mongoose from "mongoose";
import request from "supertest";
import { IUser, User } from "../users/models";
import { Habit, IHabit } from "../habits/models";
import { createAndLoginUser } from "../testUtils";
import app from "../index";

describe("/habits", () => {
	let user: IUser | undefined;
	let accessToken: string | undefined;
	let habit: IHabit | undefined;

	beforeAll(async () => {
		const creds = await createAndLoginUser();
		user = creds.user;
		accessToken = creds.accessToken;

		habit = await Habit.create({
			name: "Read",
			icon: "book",
			color: "blue",
			frequency: "daily",
			amount: 1,
			userId: user._id,
		});
	});

	afterAll(async () => {
		if (user) {
			await User.deleteOne({ _id: user._id });
		}

		if (habit) {
			await Habit.deleteOne({ _id: habit._id });
		}
	});

	describe("GET /habits", () => {
		it("should not authorize getting habits with an invalid auth token", async () => {
			const resp = await request(app)
				.get("/habits")
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});

		it("it should get habits for user with a valid auth token ", async () => {
			const resp = await request(app)
				.get("/habits")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(Array.isArray(resp.body.data)).toBe(true);
			expect(resp.body.data).toHaveLength(1);
			expect(resp.body.data[0]._id).toBe((habit as IHabit)._id.toString());
		});
	});

	describe("POST /habits", () => {
		it("should deny access if invalid auth token is passed", async () => {
			const resp = await request(app)
				.post("/habits")
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});
		it("should return error is payload is invalid", async () => {
			const resp = await request(app)
				.post("/habits")
				.send({
					amount: 1,
					color: "red",
					icon: "sun",
					daysOfWeek: [],
				})
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(422);
			expect(resp.body).toHaveProperty("errors");
		});
		it("should create a habit successfully with valid user and payload", async () => {
			const resp = await request(app)
				.post("/habits")
				.send({
					name: "Exercise",
					amount: 1,
					color: "red",
					icon: "sun",
					frequency: "daily",
					daysOfWeek: [],
				})
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(201);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data).toHaveProperty("_id");

			await Habit.deleteOne({ _id: resp.body.data._id });
		});
	});

	describe("GET /habits/:habitId", () => {
		it("should deny access if invalid auth token is passed", async () => {
			const resp = await request(app)
				.get(`/habits/${(habit as IHabit)._id}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});
		it("should return 404 error if habit cannot be found", async () => {
			const newId = new mongoose.Types.ObjectId();
			const resp = await request(app)
				.get(`/habits/${newId.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(404);
		});
		it("should return user's habit successfully", async () => {
			const resp = await request(app)
				.get(`/habits/${(habit as IHabit)._id.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data._id).toBe((habit as IHabit)._id.toString());
		});
	});

	describe("DELETE /habits/:habitId", () => {
		it("should deny access if invalid auth token is passed", async () => {
			const resp = await request(app)
				.delete(`/habits/${(habit as IHabit)._id}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});
		it("should return 404 error if habit cannot be found", async () => {
			const newId = new mongoose.Types.ObjectId();
			const resp = await request(app)
				.delete(`/habits/${newId.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(404);
		});
		it("should delete user's habit successfully", async () => {
			const delHabit = await Habit.create({
				name: "Stretch",
				icon: "person",
				color: "red",
				frequency: "daily",
				amount: 2,
				userId: (user as IUser)._id,
			});
			const resp = await request(app)
				.delete(`/habits/${(delHabit as IHabit)._id.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data._id).toBe((delHabit as IHabit)._id.toString());
			await Habit.deleteOne({ _id: delHabit._id });
		});
	});

	describe("PUT /habits/:habitId", () => {
		it("should deny access if invalid auth token is passed", async () => {
			const resp = await request(app)
				.delete(`/habits/${(habit as IHabit)._id}`)
				.set("Authorization", `Bearer junktoken`);
			expect(resp.status).toBe(401);
		});
		it("should return 404 error if habit cannot be found", async () => {
			const newId = new mongoose.Types.ObjectId();
			const resp = await request(app)
				.delete(`/habits/${newId.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`);
			expect(resp.status).toBe(404);
		});
		it("should update user's habit successfully", async () => {
			const resp = await request(app)
				.put(`/habits/${(habit as IHabit)._id.toString()}`)
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					name: "Read book",
					icon: (habit as IHabit).icon,
					color: (habit as IHabit).color,
					frequency: (habit as IHabit).frequency,
					amount: (habit as IHabit).amount,
				});

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(resp.body.data._id).toBe((habit as IHabit)._id.toString());
			expect(resp.body.data.name).toBe("Read book");
		});
	});
});
