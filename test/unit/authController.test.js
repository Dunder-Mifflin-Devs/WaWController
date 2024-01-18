const data = require("./mediaController.data");
const authC = require("../../src/microServices/WaWAuth/authControllers/authController");
const { logout } = require("../../src/microServices/WaWAuth/authControllers/authController");

// sets up the functions to mock
// jest.mock("../../src/microServices/MediaService/utils/fetchResults", () => {
//     return {
//         omdbSearch: jest.fn()
//     }
// });
// jest.mock("../../src/microServices/MediaService/utils/randomWords", () => {
//     return {
//         wordList: ["matrix"],
//         getRandomWord: () => "matrix"
//     }
// });
// jest.mock("../../src/microServices/authController/", () => {
//     return {
//         wordList: ["matrix"],
//         getRandomWord: () => "matrix"
//     }
// });



// test suite for media controller unit tests
describe("authController should-", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
    afterEach(() => {
        console.error.mockRestore()
    });

    test("destroy session when the user is authenticated AND there is not server error", async () => {
        const req = {
            
            isAuthenticated:() => {
                return true
            },
            session:{
                destroy: jest.fn(()=>{}),
            }
        };
        const res={
            status:() => {},
        };
        authC.logout(req, res);
        expect(req.session.destroy).toHaveBeenCalledTimes(1);
    });

    test("return error when session is not destroyed", async () => {
        const req = {
            isAuthenticated:() => {
                return true;
            },
            session:{
                destroy: jest.fn(()=>{
                    throw new Error('foo');
                }),
            }
        };
        const res={
            status:()=>{},
        };
        authC.logout(req, res);
         expect(req.session.destroy).toHaveBeenCalledTimes(1);
    });
    
    test("return a 400 when no the user is not authenticated", async () => {
        const req = {
            isAuthenticated:() => {
                return false;
            },
        };
        const res={
            status: jest.fn(() => {})
        };
        authC.logout(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
    });
});