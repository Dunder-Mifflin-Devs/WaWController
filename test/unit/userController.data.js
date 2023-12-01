const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userId1 = new mongoose.Types.ObjectId();
let userId2 = new mongoose.Types.ObjectId();

let exampleUser = {
    _id: userId1,
    passHash: bcrypt.hashSync("password", 10),
    userEmail: "example@gmail.com",
    userName: "User 1"
};

let exampleProfile1 = {
    _id: new mongoose.Types.ObjectId(),
    userId: this.userId1,
    langPref: "English",
    favoriteGenres: ["Horror", "Drama"]
};
let exampleProfile2 = {
    _id: new mongoose.Types.ObjectId(),
    userId: this.userId2,
    langPref: "Gibberish",
    favoriteGenres: ["Horror", "Comedy"]
};

let getProfileReq1 = {
    isAuthenticated: () => false,
};
let getProfileReq2 = {
    isAuthenticated: () => true,
    user: {
        _id: this.userId1
    }
};

let postProfileReq1 = {
    body: {
        langPref: "English",
        favoriteGenres: ["Horror", "Comedy"]
    },
    user: {
        _id: this.userId1
    }
};

let postProfileReq2 = {
    body: {
        favoriteGenres: ["Horror", "Comedy"]
    },
    user: {
        _id: this.userId1
    }
};

let putProfileReq1 = {
    body: {
        favoriteGenres: ["Horror", "Comedy", "Action"]
    },
    user: {
        _id: this.userId1
    }
};

let deleteUserReq1 = {
    user: {
        _id: this.userId1
    }
};

let deleteProfileReq1 = {
    user: {
        _id: this.userId1
    }
};


let unauthorizedResponse = { error: 'Unauthorized' };
let noProfileResponse = { error: 'Profile not found.' };
let getProfileErrorResponse = { message: 'Error fetching profile data' };

module.exports = {
    userId1,
    userId2,
    exampleProfile1,
    exampleProfile2,
    getProfileReq1,
    getProfileReq2,
    postProfileReq1,
    postProfileReq2,
    putProfileReq1,
    deleteUserReq1,
    deleteProfileReq1,
    unauthorizedResponse,
    noProfileResponse,
    getProfileErrorResponse,
    getProfileSuccessResponse: exampleProfile1,
}