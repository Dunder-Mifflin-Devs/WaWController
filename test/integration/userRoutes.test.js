const request = require("supertest");
const User = require("../../src/microServices/WaWuserManagement/UserModels/User");
const Profile = require("../../src/microServices/WaWuserManagement/UserModels/Profile");
const { connectDB, clearDB, closeDB } = require("../../config/database");
const data = require("./userRoutes.data");

// test suite for user management route integration tests
describe("User Management Routes Tests", () => {
    beforeAll(async () => await connectDB());
    beforeEach(async () => {
        await request(app)
            .post("/usermgmt/signup/email")
            .send({
                userName: data.exampleUsername,
                ...data.validLogin
            })
            .expect(201)
            .then( res => {
                expect(res.body)
                    .toEqual({ msg: "Account created" });
            });
    });
    afterEach(async () => await clearDB());
    afterAll(async () => await closeDB());
  
    test("if user is created properly", async () => {
        expect(await User.findOne({ userEmail: data.exampleEmail }))
            .toMatchObject({ userEmail: data.exampleEmail, userName: data.exampleUsername });
    });

    test("if valid login credentials are able to login", async () => {
        await request(app)
            .post("/usermgmt/local-login")
            .send(data.validLogin)
            .expect(200);
    });

    test("if invalid login credentials are unable to login", async () => {
        await request(app)
            .post("/usermgmt/local-login")
            .send(data.invalidLogin)
            .expect(401);
    });

    test("if a logged in user is able to create a profile", async () => {
        await request(app)
            .post("/usermgmt/profile")
            .send({
                ...data.validLogin,
                ...data.postProfileBody
            })
            .expect(201)
            .then(res => {
                expect(res.body)
                    .toEqual({ msg: "Profile created" });
            });

        let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
        expect(await Profile.findOne({ userId: _id }))
            .toMatchObject(data.postProfileBody);
    });

    test("if a logged in user is able to edit a user", async () => {
        await request(app)
            .put("/usermgmt/user")
            .send({
                ...data.validLogin,
                ...data.putUserBody
            })
            .expect(201)
            .then(res => {
                expect(res.body)
                    .toEqual({ msg: "User updated successfully" });
            });
        
        expect(await User.findOne({ userEmail: data.exampleEmail }))
            .toMatchObject({userEmail: data.exampleEmail,
                userName: data.exampleUsername,
                ...data.putUserBody
            });
    });

    test("if a logged in user is able to edit a profile", async () => {
        await request(app)
            .post("/usermgmt/profile")
            .send({
                ...data.validLogin,
                ...data.postProfileBody
            })
            .expect(201)
            .then(res => {
                expect(res.body)
                    .toEqual({ msg: "Profile created" });
            });
        
        await request(app)
            .put("/usermgmt/profile")
            .send({
                ...data.validLogin,
                ...data.putProfileBody
            })
            .expect(201)
            .then(res => {
                expect(res.body)
                    .toEqual({ msg: "Profile updated successfully" });
            });

        let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
        expect(await Profile.findOne({ userId: _id }))
            .toMatchObject({
                ...data.postProfileBody,
                ...data.putProfileBody
            });
    });
})