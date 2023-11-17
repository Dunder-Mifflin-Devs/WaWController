const { connectDB, clearDB, closeDB } = require("../../config/database");
const user = require("../../src/microServices/WaWuserManagement/UserModels/User");
const media = require("../../src/microServices/MediaService/mediaModels/mediaModels");
const mongoose = require("mongoose");

//test suite to determine if the database is connected (throws error is something wrong happens)
describe("test database connection", () => {
    beforeAll(async () => await connectDB());
    afterEach(async () => await clearDB());

    afterAll(async () => await closeDB());
    
    test("if user model works", async () => {
        let newUser = {
            _id: new mongoose.Types.ObjectId(),
            userEmail: "example@email.com"
        };
        await user.create(newUser);
        
        expect(await user.findOne(newUser)).toMatchObject(newUser);
    });

    test("if media model works", async () => {
        let newMedia = {
            imdbId: "tt0133093",
            totalRatings: 1,
            numberOfRatings: 1
        }
        await media.create(newMedia);

        expect(await media.findOne(newMedia)).toMatchObject(newMedia);
    });

    test("if default media model works", async () => {
        let id = "tt0133093";
        await media.create({imdbId: id});

        expect(await media.findOne({imdbId: id}))
            .toMatchObject({
                imdbId: id,
                totalRatings: 0,
                numberOfRatings: 0
            });
    });

    test("if media model will not work when not given imdbId", async () => {
        try {
            let newMedia = {
                totalRatings: 1,
                numberOfRatings: 1
            };
            let result = await media.create(newMedia);

            throw "Example error"
        } catch(err) {
            expect(err._message).toBe("Media validation failed");
        }
    });
});