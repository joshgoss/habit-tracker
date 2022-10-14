import request from "supertest";
import { User, IUser } from "../users/models";
import { createAndLoginUser } from "../testUtils";
import app from "../index";

describe("/auth", () => {
	let user: IUser;
	let accessToken: string;

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
	describe("GET /auth/me", () => {
		it("should fetch account information with valid auth token", async () => {
			const res = await request(app)
				.get("/auth/me")
				.set("Authorization", `Bearer ${accessToken}`);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("data");
			expect(res.body.data).toHaveProperty("_id");
		});

		it("should fail to fetch account information with invalid auth token", async () => {
			const res = await request(app)
				.get("/auth/me")
				.set("Authorization", `Bearer invalidtoken`);
			expect(res.status).toBe(401);
		});
	});

	describe("PUT /auth/me", () => {
		const timezone = "America/New_York";
		it("should update account information with valid auth token", async () => {
			const res = await request(app)
				.put("/auth/me")
				.send({ timezone })
				.set("Authorization", `Bearer ${accessToken}`);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("data");
			expect(res.body.data).toHaveProperty("_id");
			const updated = await User.findOne({ _id: user?._id });
			expect(res.body.data.timezone).toBe(timezone);
		});

		it("should fail to update account information with invalid auth token", async () => {
			const res = await request(app)
				.put("/auth/me")
				.send({ timezone: "America/New_York" })
				.set("Authorization", `Bearer invalidtoken`);
			expect(res.status).toBe(401);
		});
	});
});
