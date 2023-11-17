const data = require("./userController.data");
const { getProfile } = require("../../src/microServices/WaWuserManagement/userControllers/userController");
const { findOne } = require("../../src/microServices/WaWuserManagement/UserModels/Profile");

jest.mock("../../src/microServices/WaWuserManagement/UserModels/Profile", () => {
    return {
        findOne: jest.fn()
    }
});

// test suite for user controller unit tests
describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
    afterEach(() => {
        console.error.mockRestore()
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
})
