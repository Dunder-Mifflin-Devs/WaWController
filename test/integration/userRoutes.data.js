let postProfileBody = {
    langPref: "English",
    favoriteGenres: ["Example1", "Example2"],
    favoriteMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    watchedMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    toWatchMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    userTags: {
        series: [],
        episodes: [],
        movies: []
    },
    userFriends: []
};

let postProfileBody2 = {
    favoriteGenres: ["Example1", "Example2"],
    favoriteMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    watchedMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    toWatchMedia: {
        series: [],
        episodes: [],
        movies: []
    },
    userTags: {
        series: [],
        episodes: [],
        movies: []
    },
    userFriends: []
};

let putUserBody = {
    userName: "User 2"
};

let putProfileBody = {
    langPref: "Sarcasm"
};

let validLogin = {
    email: "example@gmail.com",
    password: "password"
};

let invalidLogin = {
    email: "example@gmail.com",
    password: "password2"
};

let exampleEmail = "example@gmail.com";
let exampleUsername = "User 1";

module.exports = {
    postProfileBody,
    postProfileBody2,
    validLogin,
    invalidLogin,
    putUserBody,
    putProfileBody,
    exampleEmail,
    exampleUsername,
};