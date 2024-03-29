const request = require("supertest");
const data = require("./reviewRatingsRoutes.data");
const User = require("../../src/microServices/WaWuserManagement/UserModels/User");
const ReviewRating = require("../../src/microServices/ReviewRatingsService/reviewRatingsModels/reviewRatingsModels");
const Media = require("../../src/microServices/MediaService/mediaModels/mediaModels");
const { connectDB, clearDB, closeDB } = require("../../config/database");
const mongoose = require("mongoose");
const {
  getReviewRating,
} = require("../../src/microServices/ReviewRatingsService/reviewRatingsControllers/reviewsController");

// test suite for review/rating route integration tests
describe("Review/Rating Routes Tests", () => {
  beforeAll(async () => await connectDB());
  beforeEach(async () => {
    await User.create(data.exampleUser);
    await User.create(data.exampleUser2);
    await User.create(data.exampleUser3);
    await ReviewRating.create(data.exampleRating);
    await ReviewRating.create(data.exampleRating2);
    await ReviewRating.create(data.exampleRating3);
    await Media.create(data.exampleMedia);
  });
  afterEach(async () => await clearDB());
  afterAll(async () => await closeDB());

  test("if a successful postRating request is handled correctly", async () => {
    await ReviewRating.deleteOne({ _id: data.exampleRatingId });

    await request(app)
      .post(
        data.postRatingTestURL + "/rating/" + data.exampleRatingUpdate.rating
      )
      .send({
        ...data.exampleUserLogin,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "User rating added",
        });
      });

    expect(
      await ReviewRating.find({
        mediaId: data.exampleRating.mediaId,
        userId: data.exampleRating.userId,
      })
    ).toMatchObject([
      {
        rating: data.exampleRatingUpdate.rating,
        review: undefined,
      },
    ]);

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings:
        data.exampleMedia.totalRatings + data.exampleRatingUpdate.rating,
      numberOfRatings: data.exampleMedia.numberOfRatings + 1,
    });
  });

  test("if a postRating request with invalid rating is handled correctly", async () => {
    await ReviewRating.deleteOne({ _id: data.exampleRatingId });

    await request(app)
      .post(
        data.postRatingTestURL + "/rating/" + data.exampleRatingUpdate2.rating
      )
      .send({
        ...data.exampleUserLogin,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Unable to add user rating",
        });
      });

    expect(
      await ReviewRating.find({
        mediaId: data.exampleRating.mediaId,
        userId: data.exampleRating.userId,
      })
    ).toMatchObject([]);

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings: data.exampleMedia.totalRatings,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if a postRating with an already existing review/rating fails", async () => {
    await request(app)
      .post(
        data.postRatingTestURL + "/rating/" + data.exampleRatingUpdate2.rating
      )
      .send({
        ...data.exampleUserLogin,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Review/rating already exists",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      ...data.exampleRating,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings: data.exampleMedia.totalRatings,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if a postRating request when not logged in fails", async () => {
    await request(app)
      .post(
        data.postRatingTestURL + "/rating/" + data.exampleRatingUpdate2.rating
      )
      .expect(400);

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings: data.exampleMedia.totalRatings,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if a successful postReview request is handled correctly", async () => {
    await ReviewRating.deleteOne({ _id: data.exampleRatingId });

    await request(app)
      .post(
        data.postRatingTestURL + "/review/" + data.exampleReviewUpdate.review
      )
      .send({
        ...data.exampleUserLogin,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "User review added",
        });
      });

    expect(
      await ReviewRating.find({
        mediaId: data.exampleRating.mediaId,
        userId: data.exampleRating.userId,
      })
    ).toMatchObject([
      {
        ...data.exampleRatingUpdate,
        rating: undefined,
      },
    ]);
  });

  test("if a postReview with an already existing review/rating fails", async () => {
    await request(app)
      .post(
        data.postRatingTestURL + "/review/" + data.exampleReviewUpdate.review
      )
      .send({
        ...data.exampleUserLogin,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Review/rating already exists",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      ...data.exampleRating,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings: data.exampleMedia.totalRatings,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if a postRating request when not logged in fails", async () => {
    await request(app)
      .post(
        data.postRatingTestURL + "/review/" + data.exampleReviewUpdate.review
      )
      .expect(400);

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings: data.exampleMedia.totalRatings,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if while logged in a successful putReviewRating request is handled correctly", async () => {
    await request(app)
      .put(data.putRatingTestURL)
      .send({
        ...data.exampleUserLogin,
        ...data.exampleRatingUpdate,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "Updated rating/review",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      ...data.exampleRating,
      ...data.exampleRatingUpdate,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleMedia.imdbId,
      totalRatings:
        data.exampleRatingUpdate.rating + data.exampleRating2.rating,
      numberOfRatings: data.exampleMedia.numberOfRatings,
    });
  });

  test("if a successful putReviewRating request when missing a media model is handled correctly", async () => {
    await request(app)
      .put(data.putRatingTestURL2)
      .send({
        ...data.exampleUserLogin,
        ...data.exampleRatingUpdate,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "Updated rating/review",
        });
      });

    expect(await ReviewRating.findById(data.exampleRating3Id)).toMatchObject({
      ...data.exampleRating3,
      ...data.exampleRatingUpdate,
    });

    let result = await Media.findOne({ imdbId: data.exampleRating3.mediaId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual({
      imdbId: data.exampleRating3.mediaId,
      totalRatings: data.exampleRatingUpdate.rating,
      numberOfRatings: 1,
    });
  });

  test("if a putReviewRating request without an existing review/rating is handled correctly", async () => {
    await request(app)
      .put(data.putRatingTestURL)
      .send({
        ...data.exampleUser2Login,
        ...data.exampleRatingUpdate,
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Review/rating not found",
        });
      });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual(data.exampleMedia);
  });

  test("if a putReviewRating request with invalid data is handled correctly", async () => {
    await request(app)
      .put(data.putRatingTestURL)
      .send({
        ...data.exampleUserLogin,
        ...data.exampleRatingUpdate2,
      })
      .expect(500)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Failed to update rating/review",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      rating: data.exampleRating.rating,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual(data.exampleMedia);
  });

  test("if putReviewRating request while not logged in is handled corerctly", async () => {
    await request(app).put(data.putRatingTestURL).expect(400);

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      mediaId: data.exampleRating.mediaId,
      rating: data.exampleRating.rating,
      review: data.exampleRating.review,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toEqual(data.exampleMedia);
  });

  test("if successful getReviewRatingRequest is handled correctly", async () => {
    await request(app)
      .get(data.getReviewRatingURL)
      .send({
        ...data.exampleUserLogin,
      })
      .expect(200)
      .then((res) => {
        res.body._id = new mongoose.Types.ObjectId(res.body._id);
        res.body.userId = new mongoose.Types.ObjectId(res.body.userId);
        expect(res.body).toMatchObject(data.exampleRating);
      });
  });

  test("if unsuccessful getReviewRating request is handled correctly", async () => {
    await request(app)
      .get(data.getReviewRatingURL)
      .send({
        ...data.exampleUser2Login,
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "No existing rating or review from this user for this media",
        });
      });
  });

  test("if getReviewRating request while not logged in is handled corerctly", async () => {
    await request(app).get(data.getReviewRatingURL).expect(400);
  });

  test("if successful deleteReviewRating request of review is handled correctly", async () => {
    await request(app)
      .delete(data.deleteReviewRatingURL)
      .send({
        ...data.exampleUserLogin,
        delete: "review",
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "Deleted review/rating",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toMatchObject({
      ...data.exampleRating,
      review: null,
    });

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toMatchObject(data.exampleMedia);
  });

  test("if successful deleteReviewRating request is handled correctly", async () => {
    await request(app)
      .delete(data.deleteReviewRatingURL)
      .send({
        ...data.exampleUserLogin,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          success: true,
          message: "Deleted review/rating",
        });
      });

    expect(await ReviewRating.findById(data.exampleRatingId)).toBe(null);

    let result = await Media.findOne({ imdbId: data.exampleMedia.imdbId });
    expect({
      imdbId: result.imdbId,
      numberOfRatings: result.numberOfRatings,
      totalRatings: result.totalRatings,
    }).toMatchObject({
      imdbId: data.exampleMedia.imdbId,
      numberOfRatings: data.exampleMedia.numberOfRatings - 1,
      totalRatings: data.exampleMedia.totalRatings - data.exampleRating.rating,
    });
  });

  test("if unsuccessful deleteReviewRating request is handled correctly", async () => {
    await request(app)
      .delete(data.deleteReviewRatingURL)
      .send({
        ...data.exampleUser2Login,
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Review/rating not found",
        });
      });
  });

  test("if deleteReviewRating request while not logged in is handled corerctly", async () => {
    await request(app).delete(data.deleteReviewRatingURL).expect(400);
  });

  test("if successful getReviews request without pageSize and page 1 is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLPage1)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({ count: 2, success: true });
        expect(res.body.results.length).toBe(2);

        expect(res.body.results).toMatchObject([
          {
            ...data.exampleRating,
            _id: data.exampleRating._id.toString(),
            userId: data.exampleRating.userId.toString(),
          },
          {
            ...data.exampleRating2,
            _id: data.exampleRating2._id.toString(),
            userId: data.exampleRating2.userId.toString(),
          },
        ]);
      });
  });

  test("if successful getReviews request without pageSize and page 2 is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLPage2)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ count: 2, results: [], success: true });
      });
  });

  test("if successful getReviews request with pageSize 1 and page 1 is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLPage1 + "?pageSize=1")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({ count: 2, success: true });
        expect(res.body.results.length).toBe(1);

        expect(res.body.results).toMatchObject([
          {
            ...data.exampleRating,
            _id: data.exampleRating._id.toString(),
            userId: data.exampleRating.userId.toString(),
          },
        ]);
      });
  });

  test("if successful getReviews request with pageSize 1 and page 2 is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLPage2 + "?pageSize=1")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({ count: 2, success: true });
        expect(res.body.results.length).toBe(1);

        expect(res.body.results).toMatchObject([
          {
            ...data.exampleRating2,
            _id: data.exampleRating2._id.toString(),
            userId: data.exampleRating2.userId.toString(),
          },
        ]);
      });
  });

  test("if getReviews request with invalid page is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLInvalidPage + "?pageSize=1")
      .expect(500)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Failed to find reviews",
        });
      });
  });

  test("if getReviews request with invalid pageSize is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLPage1 + "?pageSize=a")
      .expect(500)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "Failed to find reviews",
        });
      });
  });

  test("if successful getReviews request of no reviews is handled correctly", async () => {
    await request(app)
      .get(data.getReviewsURLId2)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ count: 0, results: [], success: true });
      });
  });

  test("if successful getAverageRating request is handled correctly", async () => {
    await request(app)
      .get(data.getAverageRatingURL)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          averageRating:
            data.exampleMedia.totalRatings / data.exampleMedia.numberOfRatings,
          numberOfRatings: data.exampleMedia.numberOfRatings,
        });
      });
  });

  test("if unsuccessful getAverageRating request is handled correctly", async () => {
    await request(app)
      .get(data.getAverageRatingURLId2)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "No media found with the given id",
        });
      });
  });
});
