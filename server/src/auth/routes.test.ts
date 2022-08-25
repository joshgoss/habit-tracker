import request from "supertest";
import app from "../index";
import config from "../config";
import { connectDatabase, disconnectDatabase } from "../database";

describe("/auth/google", () => {
	describe("GET /auth/google", () => {
		it("Should redirect to google's auth login page", async () => {
			const res = await request(app).get("/auth/google");
			expect(res.status).toBe(302);
			expect(res.header.location).toContain("https://accounts.google.com");
		});
	});

	describe("GET /auth/google/redirect", () => {});
});
