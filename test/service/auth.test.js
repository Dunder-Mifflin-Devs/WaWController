const User = require('../../src/microServices/WaWuserManagement/UserModels/User');
const request = require("supertest")

const db = require("../../dev-mongo")
const app = require("../../server")

const user1Body = {
    "userName": "Adam",
    "email": "adam@gmail.com",
    "password": "exampleHash"
}
const user2Body = {
    "userName": "Bob",
    "email": "bob.com",
    "password": "exampleHash"
}
const user3Body = {
    "userName": "Adam",
    "email": "charlie@gmail.com",
    "password": "exampleHash"
}
const user4Body = {
    "userName": "Charlie",
    "email": "adam@gmail.com",
    "password": "exampleHash"
}

//beforeAll(async () => await db.run())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

describe("creating User", () => {

    test("returns 201 when account created", async () => {
        const response = await request(app)
            .post("/signup")
            .send(user1Body)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    test("returns 400 when request has improper email", async () => {
        const response = await request(app)
            .post("/signup")
            .send(user2Body)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    test("returns 409 when account name is already taken", async () => {
        const response = await request(app)
            .post("/signup")
            .send(user1Body)
            .expect('Content-Type', /json/)
            .expect(201)
        const response2 = await request(app)
            .post("/signup")
            .send(user3Body)
            .expect('Content-Type', /json/)
            .expect(409)
    })
    test("returns 409 when email is already taken", async () => {
        const response = await request(app)
            .post("/signup")
            .send(user1Body)
            .expect('Content-Type', /json/)
            .expect(201)
        const response2 = await request(app)
            .post("/signup")
            .send(user4Body)
            .expect('Content-Type', /json/)
            .expect(409)
    })
    

})
