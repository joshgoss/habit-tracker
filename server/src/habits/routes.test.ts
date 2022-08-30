import request from "supertest";
import { IUser, User } from "../users/models";
import { Habit, IHabit } from "../habits/models";
import { createAndLoginUser } from "../testUtils";
import app from "../index";

describe("/habits", () => {
	let user: IUser | undefined;
	let accessToken: string | undefined;

	beforeAll(async () => {
		const creds = await createAndLoginUser();
		user = creds.user;
		accessToken = creds.accessToken;
	});

	afterAll(async () => {
		if (user) {
			await User.deleteOne({ _id: user._id });
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
			const habit = await Habit.create({
				amount: 1,
				name: "Exercise",
				frequency: "daily",
				dayOfWeek: [],
				icon: "running",
				color: "yellow",
				userId: user ? user._id : undefined,
			});

			const resp = await request(app)
				.get("/habits")
				.set("Authorization", `Bearer ${accessToken}`);

			expect(resp.status).toBe(200);
			expect(resp.body).toHaveProperty("data");
			expect(Array.isArray(resp.body.data)).toBe(true);
			expect(resp.body.data).toHaveLength(1);
			expect(resp.body.data[0]._id).toBe(habit._id.toString());
			await Habit.deleteOne({ _id: habit._id });
		});
	});
});
