const data = require("./userController.data");
const {
    getProfile,
    postProfile,
    putProfile
} = require("../../src/microServices/WaWuserManagement/userControllers/userController");
const {
    findOne,
    create,
    updateOne
} = require("../../src/microServices/WaWuserManagement/UserModels/Profile");

jest.mock("../../src/microServices/WaWuserManagement/UserModels/Profile", () => {
    return {
        findOne: jest.fn(),
        create: jest.fn(),
        updateOne: jest.fn()
    }
});

// test suite for user controller unit tests
describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
    afterEach(() => {
        console.error.mockRestore();
    });
    
    test("results of an unauthenticated getProfile request are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await getProfile(data.getProfileReq1))
            .toMatchObject(data.unauthorizedResponse);
    });

    test("results of getting a user's profile are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return data.exampleProfile1
        });

        expect(await getProfile(data.getProfileReq2))
            .toMatchObject(data.getProfileSuccessResponse);
    });

    test("results of no associated profile are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await getProfile(data.getProfileReq2))
            .toMatchObject(data.noProfileResponse);
    });

    test("results of an error during a getProfile request are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            throw "Example Error";
        });

        expect(await getProfile(data.getProfileReq2))
            .toMatchObject(data.getProfileErrorResponse);
    });

    test("results of a successful postProfile request are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return null
        });
        create.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await postProfile(data.postProfileReq1))
            .toEqual({ success: true, message: "Profile created" });
    });

    test("results of improper sent data to a postProfile request are formattted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return null
        });
        create.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await postProfile(data.postProfileReq2))
            .toEqual({ success: false, message: "field langPref is required" });
    });

    test("results of a postProfile request when a profile exists are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return data.exampleProfile2
        });
        create.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await postProfile(data.postProfileReq1))
            .toEqual({ success: false, message: "Profile for the user already exists" });
    });

    test("results of an error occurring during a postProfile request are formatted properly", async () => {
        findOne.mockImplementation((dbCallBody) => {
            return null
        });
        create.mockImplementation((dbCallBody) => {
            throw "Example error"
        });

        expect(await postProfile(data.postProfileReq1))
            .toEqual({ success: false, message: "Failed to create profile" });
    });

    test("results of a successful putProfile request are formatted properly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });

        expect(await putProfile(data.putProfileReq1))
            .toEqual({ success: true, message: "Profile updated successfully" });
    });

    test("results of a putProfile request when no profile exists are formatted properly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 0
            }
        });

        expect(await putProfile(data.putProfileReq1))
            .toEqual({ success: false, message: 'Profile not found.' });
    });

    test("results of an error occurring during a putProfile request are formatted properly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            throw "Example error"
        });

        expect(await putProfile(data.putProfileReq1))
            .toEqual({ success: false, message: "Failed to update profile" });
    });
})

