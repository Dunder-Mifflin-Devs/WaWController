const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let exampleRatingId = new mongoose.Types.ObjectId();

let exampleRating2Id = new mongoose.Types.ObjectId();

let exampleRating3Id = new mongoose.Types.ObjectId();

let exampleUserId = new mongoose.Types.ObjectId();

let exampleUser2Id = new mongoose.Types.ObjectId();

let exampleUser = {
    _id: exampleUserId,
    userEmail: "example@gmail.com",
    userName: "User 1",
    passHash: bcrypt.hashSync("password", 10),
}

let exampleUserLogin = {
    email: "example@gmail.com",
    password: "password"
}

let exampleRating = {
    _id: exampleRatingId,
    userId: exampleUserId,
    mediaId: "tt0133093",
    rating: 5,
    review: "example"
}

let exampleRating2 = {
    _id: exampleRating2Id,
    userId: exampleUser2Id,
    mediaId: "tt0133093",
    rating: 5,
    review: "example 2"
}

let exampleRatingUpdate = {
    rating: 3
}

let putRatingTestURL1 = "/reviews/" + exampleRatingId;
let putRatingTestURL2 = "/reviews/" + exampleRating2Id;
let putRatingTestURL3 = "/reviews/" + exampleRating3Id;

module.exports = {
    exampleRatingId,
    exampleRating2Id,
    exampleRating3Id,
    exampleRating,
    exampleRating2,
    exampleRatingUpdate,
    exampleUser,
    exampleUserLogin,
    putRatingTestURL1,
    putRatingTestURL2,
    putRatingTestURL3
}

