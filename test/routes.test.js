import app from "../app";
import request from "supertest";
import { expect } from "@jest/globals";

test("should register user for the app", async() => {
	const response = await request(app)
		.post("/api/auth/register")
		.send({
			"firstName": "Mahesh",
			"lastName": "Kumar",
			"age": 22,
			"mobileNumber": 70567678961,
			"genderCd": "M"
		});
	expect(response.statusCode).toBe(200);
});

// describe("POST /api/auth/register", () => {
// 	test("should with registration success and status code as 200", async () => {
// 		const newLogin = await request(app)
// 			.post("/api/auth/register")
// 			.send({
// 				"firstName": "Ramesh",
// 				"lastName": "Kumar",
// 				"age": 20,
// 				"mobileNumber": "988888888",
// 				"genderCd": "M"
// 			});
// 		expect(newLogin.body).toHaveProperty("mobileNumber");
// 		expect(newLogin.body.firstName).toBe("Ramesh");
// 		expect(newLogin.statusCode).toBe(200);
// 	});
// });
