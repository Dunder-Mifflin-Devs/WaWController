const { connectDB, clearDB, closeDB } = require("../../config/database");
const user = require("../../src/microServices/WaWuserManagement/UserModels/User");
const media = require("../../src/microServices/MediaService/mediaModels/mediaModels");
const reviewRating = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");
const mongoose = require("mongoose");

describe("test database connection", () => {
  beforeAll(async () => await connectDB());
  afterEach(async () => await clearDB());

  afterAll(async () => await closeDB());

  test("if user model works", async () => {
    let newUser = {
      _id: new mongoose.Types.ObjectId(),
      userEmail: "example@email.com",
    };
    await user.create(newUser);

    expect(await user.findOne(newUser)).toMatchObject(newUser);
  });

  test("if media model works", async () => {
    let newMedia = {
      imdbId: "tt0133093",
      totalRatings: 1,
      numberOfRatings: 1,
    };
    await media.create(newMedia);

    expect(await media.findOne(newMedia)).toMatchObject(newMedia);
  });

  test("if default media model works", async () => {
    let id = "tt0133093";
    await media.create({ imdbId: id });

    expect(await media.findOne({ imdbId: id })).toMatchObject({
      imdbId: id,
      totalRatings: 0,
      numberOfRatings: 0,
    });
  });

  test("if media model will not work when not given imdbId", async () => {
    try {
      let newMedia = {
        totalRatings: 1,
        numberOfRatings: 1,
      };
      await media.create(newMedia);

      throw new Error("Example error");
    } catch (err) {
      expect(err.message).toBe("Media validation failed");
    }
  });

  test("if review model works", async () => {
    let newReview = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      mediaId: "tt0133093",
      review: "let",
    };
    await reviewRating.create(newReview);

    expect(await reviewRating.findOne({ mediaId: "tt0133093" })).toMatchObject(
      newReview
    );
  });

  test("if rating model works", async () => {
    let newRating = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      mediaId: "tt0133093",
      rating: 5,
    };
    await reviewRating.create(newRating);

    expect(await reviewRating.findOne({ mediaId: "tt0133093" })).toMatchObject(
      newRating
    );
  });

  test("if rating model does not work with unexpected rating", async () => {
    try {
      let newRating = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        mediaId: "tt0133093",
        rating: 6,
      };
      await reviewRating.create(newRating);

      throw new Error("Example error");
    } catch (err) {
      expect(err.message).toBe("ReviewRating validation failed");
    }
  });
});
