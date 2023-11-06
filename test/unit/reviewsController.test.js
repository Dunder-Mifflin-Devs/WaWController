const data = require("./reviewsController.data");
const { putRating } = require("../../src/microServices/ReviewRatingsService/reviewRatingsControllers/reviewsController");
const { updateOne } = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");

//sets up the functinos to mock
jest.mock("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels", () => {
    return {
        updateOne: jest.fn()
    }
});

// test suite for review/rating controller unit tests
describe("Review/Rating Controller Tests", () => {
    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });
      
    afterEach(() => {
        console.error.mockRestore()
    });

    test("results of a valid rating update are formatted correctly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });

        expect(await putRating(data.examplePutRatingRequest))
            .toEqual({ success: true, message: "Updated rating/review" });
    });

    test("results of updating nonexistant rating are formatted correctly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 0
            }
        });

        expect(await putRating(data.examplePutRatingRequest))
            .toEqual({ success: false, message: 'Rating not found' });
    });

    test("results of an invalid rating update are formatted correctly", async () => {
        updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            throw "Example Error";
        });

        expect(await putRating(data.examplePutRatingRequest))
            .toEqual({ success: false, message: "Failed to update rating/review" });
    });
});