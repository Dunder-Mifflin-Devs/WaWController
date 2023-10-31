const { connectDB, clearDB, closeDB } = require("../../config/database");
const user = require("../../src/microServices/WaWuserManagement/UserModels/User");
const mongoose = require("mongoose");

//test suite to determine if the database is connected (throws error is something wrong happens)
describe("test database connection", () => {
    beforeAll(async () => await connectDB());
    afterEach(async () => await clearDB());

    afterAll(async () => await closeDB());
    
    test("if database connects", async () => {
        await user.create({
            _id: new mongoose.Types.ObjectId(),
            userEmail: "example@email.com"
        });
        expect(1).toBe(1);
    })
})