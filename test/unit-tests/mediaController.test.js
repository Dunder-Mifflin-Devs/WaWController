const data = require("./mediaController.data");
const { searchOMDB, randomOMDB } = require("../../src/microServices/MediaService/mediaControllers/mediaControllers");
const { omdbSearch } = require("../../src/microServices/MediaService/utils/fetchResults");

jest.mock("../../src/microServices/MediaService/utils/fetchResults", () => {
    return {
        omdbSearch: jest.fn()
    }
})

describe("Media Controller Tests", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
      afterEach(() => {
        console.error.mockRestore()
    })

    test("results of a title search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            if ("i" in params) return { Response: "False" };
            else return data.omdbTitleResponse;
        });

        expect(JSON.stringify(await searchOMDB(data.omdbTitleRequest)))
            .toBe(JSON.stringify(data.omdbTitleExpected));
    })

    test("results of an api error in a title or index search are handled correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            throw "Error Occurred"
        });

        expect(JSON.stringify(await searchOMDB(data.omdbTitleRequest)))
            .toBe(JSON.stringify(data.omdbErrorExpected));
    })

    test("results of an index search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            if ("i" in params) return data.omdbIndexResponse;
            else return { Response: False };
        });

        expect(JSON.stringify(await searchOMDB(data.omdbIndexRequest)))
            .toBe(JSON.stringify(data.omdbIndexExpected));
    })

    test("results of a failed search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbErrorResponse);

        expect(JSON.stringify(await searchOMDB(data.omdbErrorRequest)))
            .toBe(JSON.stringify(data.omdbErrorExpected));
    })

    test("results of a random search of 5 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(JSON.stringify(await randomOMDB(data.omdbRandomRequest5)))
            .toBe(JSON.stringify(data.omdbRandomExpected5));
    })

    test("results of a random search of 10 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(JSON.stringify(await randomOMDB(data.omdbRandomRequest10)))
            .toBe(JSON.stringify(data.omdbRandomExpected10));
    })

    test("results of a random search of 15 are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(JSON.stringify(await randomOMDB(data.omdbRandomRequest15)))
            .toBe(JSON.stringify(data.omdbRandomExpected15));
    })

    test("results of an error in a random search are formatted correctly", async () => {
        omdbSearch.mockImplementation((params) => data.omdbRandomResponse);

        expect(JSON.stringify(await randomOMDB(data.omdbRandomErrorRequest)))
            .toBe(JSON.stringify(data.omdbRandomErrorExpected));
    })

    test("results of an api error in random search are handled correctly", async () => {
        omdbSearch.mockImplementation((params) => {
            throw "Error Occurred"
        });

        expect(JSON.stringify(await randomOMDB(data.omdbRandomErrorRequest)))
            .toBe(JSON.stringify(data.omdbRandomErrorExpected));
    })
})