const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let exampleRatingId = new mongoose.Types.ObjectId();

let exampleRating2Id = new mongoose.Types.ObjectId();

let exampleUserId = new mongoose.Types.ObjectId();

let exampleUser2Id = new mongoose.Types.ObjectId();

let exampleUser3Id = new mongoose.Types.ObjectId();

let exampleUser = {
    _id: exampleUserId,
    userEmail: "example@gmail.com",
    userName: "User 1",
    passHash: bcrypt.hashSync("password", 10),
};

let exampleUser2 = {
    _id: exampleUser2Id,
    userEmail: "example2@gmail.com",
    userName: "User 2",
    passHash: bcrypt.hashSync("password2", 10)
};

let exampleUser3 = {
    _id: exampleUser3Id,
    userEmail: "example3@gmail.com",
    userName: "User 3",
    passHash: bcrypt.hashSync("password3", 10)
};

let exampleUserLogin = {
    email: "example@gmail.com",
    password: "password"
};

let exampleUser2Login = {
    email: "example2@gmail.com",
    password: "password2"
};

let exampleUser3Login = {
    email: "example3@gmail.com",
    password: "password3"
};

let exampleRating = {
    _id: exampleRatingId,
    userId: exampleUserId,
    mediaId: "tt0133093",
    rating: 5,
    review: "example"
}

let exampleRating2 = {
    _id: exampleRating2Id,
    userId: exampleUser3Id,
    mediaId: "tt0133093",
    rating: 3,
    review: "example2"
}

let exampleRatingUpdate = {
    rating: 3
}

let exampleRatingUpdate2 = {
    rating: 6
}

let putRatingTestURL = "/reviews/tt0133093";
let getReviewRatingURL = "/reviews/tt0133093";
let deleteReviewRatingURL = "/reviews/tt0133093";
let getReviewsURLPage1 = "/reviews/tt0133093/1";
let getReviewsURLPage2 = "/reviews/tt0133093/2";
let getReviewsURLInvalidPage = "/reviews/tt0133093/a";
let getReviewsURLId2 = "/reviews/tt0133094"
let getAverageRatingURL = "/reviews/tt0133093/rating";

module.exports = {
    exampleRatingId,
    exampleRating2Id,
    exampleRating,
    exampleRating2,
    exampleRatingUpdate,
    exampleRatingUpdate2,
    exampleUser,
    exampleUser2,
    exampleUser3,
    exampleUserLogin,
    exampleUser2Login,
    exampleUser3Login,
    putRatingTestURL,
    getReviewRatingURL,
    deleteReviewRatingURL,
    getReviewsURLPage1,
    getReviewsURLPage2,
    getReviewsURLInvalidPage,
    getReviewsURLId2,
    getAverageRatingURL
}

