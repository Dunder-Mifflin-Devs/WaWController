const data = require("./reviewsController.data");
const {
    putReviewRating,
    getReviewRating,
    getReviews,
    getAverageRating,
    deleteReviewRating
} = require("../../src/microServices/ReviewRatingsService/reviewRatingsControllers/reviewsController");
const Rating = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");
const Media = require("../../src/microServices/MediaService/mediaModels/mediaModels");

//sets up the functions to mock
jest.mock("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels", () => {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        countDocuments: jest.fn(),
        deleteOne: jest.fn()
    }
});
jest.mock("../../src/microServices/MediaService/mediaModels/mediaModels", () => {
    return {
        findOne: jest.fn(),
        updateOne: jest.fn(),
        create: jest.fn()
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

    test("results of a valid putReviewRating request are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody, dbUpdate) => {
            return data.exampleRating
        });
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });
        Media.updateOne.mockImplementation((dbCallbody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });
        Media.create.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await putReviewRating(data.examplePutRatingRequest))
            .toEqual({ success: true, message: "Updated rating/review" });
    });

    test("results of a putReviewRrating request without an existing reviewRating are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody, dbUpdate) => {
            return null
        });
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 0
            }
        });
        Media.updateOne.mockImplementation((dbCallbody, dbUpdate) => {
            return {
                matchedCount: 0
            }
        });
        Media.updateOne.mockImplementation((dbCallbody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });

        expect(await putReviewRating(data.examplePutRatingRequest))
            .toEqual({ success: false, message: 'Review/rating not found' });
    });

    test("results of an invalid putReviewRating request are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody, dbUpdate) => {
            return data.exampleRating
        });
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            throw "Example Error";
        });
        Media.updateOne.mockImplementation((dbCallbody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });
        Media.updateOne.mockImplementation((dbCallbody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });

        expect(await putReviewRating(data.examplePutRatingRequest))
            .toEqual({ success: false, message: "Failed to update rating/review" });
    });

    test("results of deleting a rating successfully are formatted correctly", async () => {
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 1
            }
        });
        Rating.findOne.mockImplementation((dbCallbody) => {
            return data.exampleRating
        });
        Rating.deleteOne.mockImplementation((dbCallBody) => {
            return {
                matchedCount: 1
            }
        });
        Media.findOne.mockImplementation((dbCallBody) => {
            return {
                matchedCount: 1
            }
        });

        expect(await deleteReviewRating(data.exampleDeleteRatingRequest))
            .toEqual({ success: true, message: "Deleted review/rating"});
    });

    test("results of deleting a non-existant rating are formatted correctly", async () => {
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            return {
                matchedCount: 0
            }
        });
        Rating.findOne.mockImplementation((dbCallbody) => {
            return data.exampleRating
        });

        expect(await deleteReviewRating(data.exampleDeleteRatingRequest))
            .toEqual({ success: false, message: "Review/rating not found" });
    });

    test("results of a deleteReviewRating request error are formatted correctly", async () => {
        Rating.updateOne.mockImplementation((dbCallBody, dbUpdate) => {
            throw "Example error"
        });
        Rating.findOne.mockImplementation((dbCallbody) => {
            return data.exampleRating
        });

        expect(await deleteReviewRating(data.exampleDeleteRatingRequest))
            .toEqual({ success: false, message: "Failed to delete review/rating" });
    });

    test("results of a successful getReviewRating request are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody) => {
            return data.exampleRating
        });

        expect(await getReviewRating(data.exampleGetRatingRequest))
            .toEqual(data.exampleRating);
    });

    test("results of a getReviewRating request without a review/rating are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await getReviewRating(data.exampleGetRatingRequest))
            .toEqual({ success: false, message: "No existing rating or review from this user for this media" });
    });

    test("results of a failure occurring when calling getReviewRating are formatted correctly", async () => {
        Rating.findOne.mockImplementation((dbCallBody) => {
            throw "Example error"
        });

        expect(await getReviewRating(data.exampleGetRatingRequest))
            .toEqual({ success: false, message: "Failed to get rating/review" });
    });

    test("results of a successful getAverageRating request are formatted correctly", async () => {
        Media.findOne.mockImplementation((dbCallBody) => {
            return data.exampleMediaInfo
        });

        expect(await getAverageRating(data.exampleGetAverageRatingRequest))
            .toEqual({ averageRating: data.exampleAverageRating, numberOfRatings: data.exampleMediaInfo.numberOfRatings });
    });

    test("results of a getAverageRating request with an invalid mediaId are formatted correctly", async () => {
        Media.findOne.mockImplementation((dbCallBody) => {
            return null
        });

        expect(await getAverageRating(data.exampleGetAverageRatingRequest))
            .toEqual({ success: false, message: "No media found with the given id" });
    });

    test("results of a getAverageRating request that caused on error are formatted correctly", async () => {
        Media.findOne.mockImplementation((dbCallBody) => {
            throw "Example error"
        });

        expect(await getAverageRating(data.exampleGetAverageRatingRequest))
            .toEqual({ success: false, message: "Failed to get average rating" });
    });

    test("results of a successful getReviews request are formatted correctly", async () => {
        Rating.find.mockImplementation((dbCallBody) => {
            return {
                populate: () => {
                    return {
                        skip: () => {
                            return { limit: () => data.exampleReviews }
                        }
                    }
                }
            }
        });
        Rating.countDocuments.mockImplementation((dbCallBody) => {
            return data.exampleReviews.length
        });

        let result = await getReviews(data.exampleGetReviewsRequest);
        expect(result)
            .toMatchObject({ success: true, count: data.exampleReviews.length });
        
        expect(result.results.length)
            .toBe(data.exampleReviews.length);

        expect(result.results)
            .toMatchObject(data.exampleReviews);
    });

    test("resuts of a getReviews request that caused an error in find are formatted correctly", async () => {
        Rating.find.mockImplementation((dbCallBody) => {
            throw "Example error"
        });
        Rating.countDocuments.mockImplementation((dbCallBody) => {
            return 1
        });

        expect(await getReviews(data.exampleGetReviewsRequest))
            .toEqual({ success: false, message: "Failed to find reviews" });
    });

    test("resuts of a getReviews request that caused an error in countDocuments are formatted correctly", async () => {
        Rating.find.mockImplementation((dbCallBody) => {
            return data.exampleReviews
        });
        Rating.countDocuments.mockImplementation((dbCallBody) => {
            throw "Example error"
        });

        expect(await getReviews(data.exampleGetReviewsRequest))
            .toEqual({ success: false, message: "Failed to find reviews" });
    });
});