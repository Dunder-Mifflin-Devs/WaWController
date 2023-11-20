const request = require("supertest");
const data = require("./reviewRatingsRoutes.data");
const user = require("../../src/microServices/WaWuserManagement/UserModels/User");
const reviewRating = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");
const { connectDB, clearDB, closeDB } = require("../../config/database");

// test suite for review/rating route integration tests
describe("Review/Rating Routes Tests", () => {
    beforeAll(async () => await connectDB());
    beforeEach(async () => {
        await user.create(data.exampleUser);
        await user.create(data.exampleUser2);
        await reviewRating.create(data.exampleRating);
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
        
        let temp = await reviewRating.findById(data.exampleRatingId);
        expect(temp).toMatchObject({ rating: data.exampleRating.rating });
    });
});