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
        await reviewRating.create(data.exampleRating);
        await reviewRating.create(data.exampleRating2);
    });
    afterEach(async () => await clearDB());
    afterAll(async () => await closeDB());

    test("if review/rating is updated", async () => {
        await request(app)
            .put(data.putRatingTestURL1)
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

    test("if review/rating of other user is not updated", async () => {
        await request(app)
            .put(data.putRatingTestURL2)
            .send({
                ...data.exampleUserLogin,
                ...data.exampleRatingUpdate
            })
            .expect(404)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: 'Rating not found' })
            });
        
        expect(await reviewRating.findById(data.exampleRating2Id))
            .toMatchObject({
                ...data.exampleRating2
            });
    });

    test("if updating of invalid review/rating is handled correctly", async () => {
        await request(app)
            .put(data.putRatingTestURL3)
            .send({
                ...data.exampleUserLogin,
                ...data.exampleRatingUpdate
            })
            .expect(404)
            .then(res => {
                expect(res.body)
                    .toEqual({ success: false, message: 'Rating not found' })
            });
        
        expect(await reviewRating.findById(data.exampleRating3Id))
            .toBe(null);
    });
});