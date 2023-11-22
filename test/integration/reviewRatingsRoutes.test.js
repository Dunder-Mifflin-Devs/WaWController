const request = require("supertest");
const data = require("./reviewRatingsRoutes.data");
const user = require("../../src/microServices/WaWuserManagement/UserModels/User");
const reviewRating = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");
const { connectDB, clearDB, closeDB } = require("../../config/database");
const mongoose = require("mongoose");

// test suite for review/rating route integration tests
describe("Review/Rating Routes Tests", () => {
    beforeAll(async () => await connectDB());
    beforeEach(async () => {
        await user.create(data.exampleUser);
        await user.create(data.exampleUser2);
        await user.create(data.exampleUser3);
        await reviewRating.create(data.exampleRating);
        await reviewRating.create(data.exampleRating2);
    });
    afterEach(async () => await clearDB());
    afterAll(async () => await closeDB());

    test("if review/rating is updated", async () => {
        await request(app)
            .put(data.putRatingTestURL)
            .send({
                ...data.exampleUserLogin,
                ...data.exampleRatingUpdate
            })
            .expect(201)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Updated rating/review" })
            });
        
        expect(await reviewRating.findById(data.exampleRatingId))
            .toMatchObject({
                ...data.exampleRating,
                ...data.exampleRatingUpdate
            });
    });

    test("if non-existant review/rating is not updated", async () => {
        await request(app)
            .put(data.putRatingTestURL)
            .send({
                ...data.exampleUser2Login,
                ...data.exampleRatingUpdate
            })
            .expect(404)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: 'Review/rating not found' })
            });
    });

    test("if updating of invalid review/rating is handled correctly", async () => {
        await request(app)
            .put(data.putRatingTestURL)
            .send({
                ...data.exampleUserLogin,
                ...data.exampleRatingUpdate2
            })
            .expect(500)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: 'Failed to update rating/review' })
            });
        
        expect(await reviewRating.findById(data.exampleRatingId))
            .toMatchObject({ rating: data.exampleRating.rating });
    });

    test("if putReviewRating request while not logged in is handled corerctly", async () => {
        await request(app)
            .delete(data.putRatingTestURL)
            .expect(400);
    });

    test("if successful getReviewRatingRequest is handled correctly", async () => {
        await request(app)
            .get(data.getReviewRatingURL)
            .send({
                ...data.exampleUserLogin
            })
            .expect(200)
            .then(res => {
                res.body._id = new mongoose.Types.ObjectId(res.body._id);
                res.body.userId = new mongoose.Types.ObjectId(res.body.userId);
                expect(res.body)
                    .toMatchObject(data.exampleRating);
            });
    });

    test("if unsuccessful getReviewRating request is handled correctly", async () => {
        await request(app)
            .get(data.getReviewRatingURL)
            .send({
                ...data.exampleUser2Login
            })
            .expect(404)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: "No existing rating or review from this user for this media" });
            })
    });

    test("if getReviewRating request while not logged in is handled corerctly", async () => {
        await request(app)
            .delete(data.getReviewRatingURL)
            .expect(400);
    });

    test("if successful deleteReviewRating request of rating is handled correctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUserLogin,
                delete: "rating"
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Deleted review/rating"});
            });
        
        expect(await reviewRating.findById(data.exampleRatingId.toString()))
            .toMatchObject({
                ...data.exampleRating,
                rating: null
            });
    });

    test("if successful deleteReviewRating request of review is handled correctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUserLogin,
                delete: "review"
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Deleted review/rating"});
            });
        
        expect(await reviewRating.findById(data.exampleRatingId))
            .toMatchObject({
                ...data.exampleRating,
                review: null
            });
    });

    test("if successful deleteReviewRating request of rating and review is handled correctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUserLogin,
                delete: "rating"
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Deleted review/rating"});
            });

        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUserLogin,
                delete: "review"
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Deleted review/rating"});
            });
        
        expect(await reviewRating.findById(data.exampleRatingId))
            .toBe(null);
    });

    test("if successful deleteReviewRating request is handled correctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUserLogin
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: true, message: "Deleted review/rating"});
            });
        
        expect(await reviewRating.findById(data.exampleRatingId))
            .toBe(null);
    });
    
    test("if unsuccessful deleteReviewRating request is handled correctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .send({
                ...data.exampleUser2Login
            })
            .expect(404)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: 'Review/rating not found'});
            });
    });

    test("if deleteReviewRating request while not logged in is handled corerctly", async () => {
        await request(app)
            .delete(data.deleteReviewRatingURL)
            .expect(400);
    });

    test("if successful getReviews request without pageSize is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLPage1)
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual([data.exampleRating, data.exampleRating2])
            });
    });

    test("if successful getReviews request without pageSize is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLPage1)
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual([data.exampleRating, data.exampleRating2])
            });
    });

    test("if successful getReviews request with pageSize 1 and page 1 is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLPage1)
            .send({
                pageSize: 1
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual([data.exampleRating])
            });
    });

    test("if successful getReviews request with pageSize 1 and page 2 is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLPage2)
            .send({
                pageSize: 1
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual([data.exampleRating2])
            });
    });

    test("if getReviews request with invalid page is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLInvalidPage)
            .send({
                pageSize: 1
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: "Failed to find reviews"});
            });
    });

    test("if getReviews request with invalid pageSize is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLPage1)
            .send({
                pageSize: "a"
            })
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: "Failed to find reviews"});
            });
    });

    test("if successful getReviews request of no reviews is handled correctly", async () => {
        await request(app)
            .get(data.getReviewsURLId2)
            .expect(200)
            .then(res => {
                expect(res.body)
                    .toEqual([])
            });
    });
});