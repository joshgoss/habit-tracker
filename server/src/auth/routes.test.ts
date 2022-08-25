import request from "supertest";
import { User, IUser } from "../users/models";
import { createAndLoginUser } from "../testUtils";
import app from "../index";

describe("GET /auth/me", () => {
	let user: IUser | undefined;
	let accessToken: string | undefined;

	beforeAll(async () => {
		const r = await createAndLoginUser();
		user = r[0] as IUser;
		accessToken = r[1] as string;
	});

	afterAll(async () => {
		if (user) {
			await User.deleteOne({ _id: user._id });
		}
	});
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
