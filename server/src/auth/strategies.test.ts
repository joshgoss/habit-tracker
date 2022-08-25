import { Request } from "express";
import { Profile } from "passport-google-oauth20";
import config from "../config";
import { connectDatabase, disconnectDatabase } from "../database";
import { verifyGoogle } from "./strategies";
import { User } from "../users/models";
import { createUser } from "../testUtils";

describe("Test Strategies", () => {
	beforeAll(async () => {
		await connectDatabase(config.MONGODB_URI);
	});

	afterAll(async () => {
		await disconnectDatabase();
	});

	describe("verifyGoogle function", () => {
		it("should create a new user if the user has not logged in before", async () => {
			const googleId = Math.random().toString();
			const req: Request = {} as Request;
			const done = () => {};
			const profile: Profile = {
				id: googleId,
				name: { givenName: "test", familyName: "user" },
			} as Profile;

			await verifyGoogle(req, "accessToken", "refreshToken", profile, done);

			let found = await User.findOne({
				provider: "Google",
				providerUserId: googleId,
			});
			const provider = found ? found.provider : undefined;
			const providerUserId = found ? found.providerUserId : undefined;
			expect(provider).toBe("Google");
			expect(providerUserId).toBe(googleId);

			await User.deleteOne({ provider: "Google", providerUserId: googleId });
		});

		it("should not create duplicate records if the user has already logged in", async () => {
			const user = await createUser();
			const req: Request = {} as Request;
			const done = () => {};
			const profile: Profile = {
				id: user.providerUserId,
				name: { givenName: user.firstName, familyName: user.lastName },
			} as Profile;

			await verifyGoogle(req, "accessToken", "refreshToken", profile, done);

			let numRecords = await User.countDocuments({
				provider: "Google",
				providerUserId: user.providerUserId,
			});
			expect(numRecords).toBe(1);
			await User.deleteOne({ _id: user._id });
		});
	});
});
