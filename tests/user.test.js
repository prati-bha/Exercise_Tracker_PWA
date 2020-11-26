require("dotenv")
const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const { userOneId, userOne, setupDatabase } = require("./helper");

beforeEach(setupDatabase);


test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users/signUp")
        .send({
            name: "Test",
            email: "testmail@test.com",
            password: "test123"
        })
        .expect(200);
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
});

test("Should login an existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not authenticate user with invalid credentials", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: "invalidPassword"
        })
        .expect(400);
});
test("Should get username for authenticated user", async () => {
    await request(app)
        .get("/users/username?username='pra'")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});
test("Should get username undefined", async () => {
    await request(app)
        .get("/users/username")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(400);
});

test("Should get username already taken message", async () => {
    await request(app)
        .post("/users/username")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            username: "pratibh",
        }).expect(200);

    await request(app)
        .get("/users/username?username='pratibh'")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});