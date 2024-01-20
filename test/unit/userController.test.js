const data = require("./userController.data");
const {
  getProfile,
  postProfile,
  putProfile,
  deleteUser,
  deleteProfile,
} = require("../../src/microServices/WaWuserManagement/userControllers/userController");
const Profile = require("../../src/microServices/WaWuserManagement/UserModels/Profile");
const User = require("../../src/microServices/WaWuserManagement/UserModels/User");

jest.mock(
  "../../src/microServices/WaWuserManagement/UserModels/Profile",
  () => {
    return {
      findOne: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };
  }
);
jest.mock("../../src/microServices/WaWuserManagement/UserModels/User", () => {
  return {
    deleteOne: jest.fn(),
  };
});

describe("User Controller Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("results of a successful deleteUser request are formatted properly", async () => {
    User.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 1 };
    });
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 1 };
    });

    expect(await deleteUser(data.deleteUserReq1)).toEqual({
      success: true,
      message: "User account deleted successfully",
    });
  });

  test("results of a deleteUser request with no matching user are formatted properly", async () => {
    User.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 0 };
    });
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 0 };
    });

    expect(await deleteUser(data.deleteUserReq1)).toEqual({
      success: false,
      message: "User not found",
    });
  });

  test("results of a deleteUser request with an error when deleting user are formatted properly", async () => {
    User.deleteOne.mockImplementation((dbCallBody) => {
      throw "Example error";
    });
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 0 };
    });

    expect(await deleteUser(data.deleteUserReq1)).toEqual({
      success: false,
      message: "An error occurred while deleting the user account.",
    });
  });

  test("results of a deleteUser request with an error when deleting the user's profile are formatted properly", async () => {
    User.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 1 };
    });
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      throw new Error("Example error");
    });

    expect(await deleteUser(data.deleteUserReq1)).toEqual({
      success: false,
      message: "An error occurred while deleting the user account.",
    });
  });

  test("results of a successful deleteProfile request are formatted properly", async () => {
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 1 };
    });

    expect(await deleteProfile(data.deleteProfileReq1)).toEqual({
      success: true,
      message: "Profile deleted",
    });
  });

  test("results of a deleteProfile request with no exiting profile are formatted properly", async () => {
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      return { deletedCount: 0 };
    });

    expect(await deleteProfile(data.deleteProfileReq1)).toEqual({
      success: false,
      message: "No profile exists for the user",
    });
  });

  test("results of a deleteProfile request with an error are formatted properly", async () => {
    Profile.deleteOne.mockImplementation((dbCallBody) => {
      throw new Error("Example error");
    });

    expect(await deleteProfile(data.deleteProfileReq1)).toEqual({
      success: false,
      message: "Error while deleting profile data",
    });
  });

  test("results of an unauthenticated getProfile request are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return null;
    });

    expect(await getProfile(data.getProfileReq1)).toMatchObject(
      data.unauthorizedResponse
    );
  });

  test("results of getting a user's profile are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return data.exampleProfile1;
    });

    expect(await getProfile(data.getProfileReq2)).toMatchObject(
      data.getProfileSuccessResponse
    );
  });

  test("results of no associated profile are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return null;
    });

    expect(await getProfile(data.getProfileReq2)).toMatchObject(
      data.noProfileResponse
    );
  });

  test("results of an error during a getProfile request are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      throw new Error("Example Error");
    });

    expect(await getProfile(data.getProfileReq2)).toMatchObject(
      data.getProfileErrorResponse
    );
  });

  test("results of a successful postProfile request are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return null;
    });
    Profile.create.mockImplementation((dbCallBody) => {
      return null;
    });

    expect(await postProfile(data.postProfileReq1)).toEqual({
      success: true,
      message: "Profile created",
    });
  });

  test("results of improper sent data to a postProfile request are formattted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return null;
    });
    Profile.create.mockImplementation((dbCallBody) => {
      return null;
    });

    expect(await postProfile(data.postProfileReq2)).toEqual({
      success: false,
      message: "field langPref is required",
    });
  });

  test("results of a postProfile request when a profile exists are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return data.exampleProfile2;
    });
    Profile.create.mockImplementation((dbCallBody) => {
      return null;
    });

    expect(await postProfile(data.postProfileReq1)).toEqual({
      success: false,
      message: "Profile for the user already exists",
    });
  });

  test("results of an error occurring during a postProfile request are formatted properly", async () => {
    Profile.findOne.mockImplementation((dbCallBody) => {
      return null;
    });
    Profile.create.mockImplementation((dbCallBody) => {
      throw new Error("Example error");
    });

    expect(await postProfile(data.postProfileReq1)).toEqual({
      success: false,
      message: "Failed to create profile",
    });
  });

  test("results of a successful putProfile request are formatted properly", async () => {
    Profile.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
      return {
        matchedCount: 1,
      };
    });

    expect(await putProfile(data.putProfileReq1)).toEqual({
      success: true,
      message: "Profile updated successfully",
    });
  });

  test("results of a putProfile request when no profile exists are formatted properly", async () => {
    Profile.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
      return {
        matchedCount: 0,
      };
    });

    expect(await putProfile(data.putProfileReq1)).toEqual({
      success: false,
      message: "Profile not found.",
    });
  });

  test("results of an error occurring during a putProfile request are formatted properly", async () => {
    Profile.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
      throw new Error("Example error");
    });

    expect(await putProfile(data.putProfileReq1)).toEqual({
      success: false,
      message: "Failed to update profile",
    });
  });
});
