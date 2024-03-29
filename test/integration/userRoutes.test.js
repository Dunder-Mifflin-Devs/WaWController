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
        ...data.validLogin,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Account created" });
      });
  });
  afterEach(async () => await clearDB());
  afterAll(async () => await closeDB());

  test("if user is created properly", async () => {
    expect(await User.findOne({ userEmail: data.exampleEmail })).toMatchObject({
      userEmail: data.exampleEmail,
      userName: data.exampleUsername,
    });
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

  test("if a logged in user is able to edit a user", async () => {
    await request(app)
      .put("/usermgmt/user")
      .send({
        ...data.validLogin,
        ...data.putUserBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ msg: "User updated successfully" });
      });

    expect(await User.findOne({ userEmail: data.exampleEmail })).toMatchObject({
      userEmail: data.exampleEmail,
      userName: data.exampleUsername,
      ...data.putUserBody,
    });
  });

  test("if a logged in user can call deleteUser successfully", async () => {
    await request(app)
      .delete("/usermgmt/user")
      .send({
        ...data.validLogin,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "User account deleted successfully",
        });
      });

    expect(
      (await User.findOne({ userEmail: data.exampleEmail })) === null
    ).toBe(true);
  });

  test("if calling deleteUser when not logged in fails", async () => {
    await request(app).delete("/usermgmt/user").expect(400);

    expect(
      (await User.findOne({ userEmail: data.exampleEmail })) === null
    ).toBe(false);
  });

  test("if a logged in user can call postProfile successfully", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect(await Profile.findOne({ userId: _id })).toMatchObject(
      data.postProfileBody
    );
  });

  test("if postProfile calls are unsuccessful when called without necessary fields", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody2,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "field langPref is required",
        });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect((await Profile.findOne({ userId: _id })) === null).toBe(true);
  });

  test("if a postProfile call is unsuccessful when a profile already exists for the user", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Profile for the user already exists",
        });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect(await Profile.findOne({ userId: _id })).toMatchObject(
      data.postProfileBody
    );
  });

  test("if postProfile calls are unsuccessful when not logged in", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.postProfileBody,
      })
      .expect(400);

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect((await Profile.findOne({ userId: _id })) === null).toBe(true);
  });

  test("if a logged in user is able to call putProfile", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app)
      .put("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.putProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "Profile updated successfully",
        });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect(await Profile.findOne({ userId: _id })).toMatchObject({
      ...data.postProfileBody,
      ...data.putProfileBody,
    });
  });

  test("if a putProfile call is unsuccessful when it does not already exist", async () => {
    await request(app)
      .put("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.putProfileBody,
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Profile not found.",
        });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect((await Profile.findOne({ userId: _id })) === null).toBe(true);
  });

  test("if putProfile calls fail when not logged in", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app)
      .put("/usermgmt/profile")
      .send({
        ...data.putProfileBody,
      })
      .expect(400);

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect(await Profile.findOne({ userId: _id })).toMatchObject({
      ...data.postProfileBody,
    });
  });

  test("if a logged in user can call deleteProfile successfully", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app)
      .delete("/usermgmt/profile")
      .send({
        ...data.validLogin,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile deleted" });
      });

    let _id = (await User.findOne({ userEmail: data.exampleEmail }))._id;
    expect((await Profile.findOne({ userId: _id })) === null).toBe(true);
  });

  test("if deleteProfile sends appropriate response when no profile exists for user", async () => {
    await request(app)
      .delete("/usermgmt/profile")
      .send({
        ...data.validLogin,
      })
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "No profile exists for the user",
        });
      });
  });

  test("if deleteProfile sends appropriate response when not logged in", async () => {
    await request(app).delete("/usermgmt/profile").expect(400);
  });

  test("if a logged in user is able to get their profile", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app)
      .get("/usermgmt/profile")
      .send({
        ...data.validLogin,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject(data.postProfileBody);
      });
  });

  test("if getProfile without being logged in is handled properly", async () => {
    await request(app)
      .post("/usermgmt/profile")
      .send({
        ...data.validLogin,
        ...data.postProfileBody,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ success: true, message: "Profile created" });
      });

    await request(app).get("/usermgmt/profile").expect(400);
  });

  test("if getProfile for a user without a profile is handled properly", async () => {
    await request(app)
      .get("/usermgmt/profile")
      .send({
        ...data.validLogin,
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ error: "Profile not found." });
      });
  });
});
