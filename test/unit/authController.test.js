const data = require("./mediaController.data");

// sets up the functions to mock
jest.mock("../../src/microServices/MediaService/utils/fetchResults", () => {
    return {
        omdbSearch: jest.fn()
    }
});
jest.mock("../../src/microServices/MediaService/utils/randomWords", () => {
    return {
        wordList: ["matrix"],
        getRandomWord: () => "matrix"
    }
});



// test suite for media controller unit tests
describe("Media Controller Tests", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
    afterEach(() => {
        console.error.mockRestore()
    });

    test("results of a title search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            if ("i" in params) return { Response: "False" };
            else return data.omdbTitleResponse;
        });

        expect(await searchOMDB(data.omdbTitleRequest))
            .toEqual(data.omdbTitleExpected);
    })

    test("results of an api error in a title or id search are handled correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            throw "Error Occurred"
        });

        expect(await searchOMDB(data.omdbTitleRequest))
            .toEqual(data.omdbErrorExpected);
    })

    test("results of an id search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            if ("i" in params) return data.omdbIdResponse;
            else return { Response: False };
        });

        expect(await searchOMDB(data.omdbIdRequest))
            .toEqual(data.omdbIdExpected);
    })

    test("results of a failed search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbErrorResponse);

        expect(await searchOMDB(data.omdbErrorRequest))
            .toEqual(data.omdbErrorExpected);
    })

    test("results of a random search of 5 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(await randomOMDB(data.omdbRandomRequest5))
            .toEqual(data.omdbRandomExpected5);
    })

    test("results of a random search of 10 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(await randomOMDB(data.omdbRandomRequest10))
            .toEqual(data.omdbRandomExpected10);
    })

    test("results of a random search of 15 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(await randomOMDB(data.omdbRandomRequest15))
            .toEqual(data.omdbRandomExpected15);
    })

    test("results of an error in a random search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(await randomOMDB(data.omdbRandomErrorRequest))
            .toEqual(data.omdbRandomErrorExpected);
    })

    test("results of an api error in random search are handled correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            throw "Error Occurred"
        });

        expect(await randomOMDB(data.omdbRandomErrorRequest))
            .toEqual(data.omdbRandomErrorExpected);
    })
})