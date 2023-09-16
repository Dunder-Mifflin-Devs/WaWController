const User = require('../../src/models/User')
const request = require("supertest")

const db = require("../../src/dev-mongo")
const app = require("../../src/server")

const user1Body = {
    "userName": "Adam",
    "email": "adam@gmail.com",
    "password": "exampleHash"
}
const user2Body = {
    "userName": "Bob",
    "email": "bob@gmail.com",
    "password": "exampleHash"
}

beforeAll(async () => await db.run())
// afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

describe("creating User", () => {

    test("returns 201 when account created", async () => {
        
        const response = await request(app)
            .post("/signup")
            .send(user1Body)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    // test("returns 400 when request has improper email", async () => {

    // })
    // test("returns 409 when account name is already taken", async () => {

    // })
    // test("returns 409 when email is already taken", async () => {

    // })
    

})
