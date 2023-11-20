const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let exampleRatingId = new mongoose.Types.ObjectId();

let exampleUserId = new mongoose.Types.ObjectId();

let exampleUser2Id = new mongoose.Types.ObjectId();

let exampleUser = {
    _id: exampleUserId,
    userEmail: "example@gmail.com",
    userName: "User 1",
    passHash: bcrypt.hashSync("password", 10),
}

let exampleUser2 = {
    _id: exampleUser2Id,
    userEmail: "example2@gmail.com",
    userName: "User 2",
    passHash: bcrypt.hashSync("password2", 10)
};

let exampleUserLogin = {
    email: "example@gmail.com",
    password: "password"
};

let exampleUser2Login = {
    email: "example2@gmail.com",
    password: "password2"
};

let exampleRating = {
    _id: exampleRatingId,
    userId: exampleUserId,
    mediaId: "tt0133093",
    rating: 5,
    review: "example"
}

let exampleRatingUpdate = {
    rating: 3
}

let exampleRatingUpdate2 = {
    rating: 6
}

let putRatingTestURL = "/reviews/tt0133093";

module.exports = {
    exampleRatingId,
    exampleRating,
    exampleRatingUpdate,
    exampleRatingUpdate2,
    exampleUser,
    exampleUser2,
    exampleUserLogin,
    exampleUser2Login,
    putRatingTestURL
}

