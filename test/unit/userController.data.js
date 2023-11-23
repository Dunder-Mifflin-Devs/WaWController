const mongoose = require("mongoose");

let userId1 = new mongoose.Types.ObjectId();
let userId2 = new mongoose.Types.ObjectId();

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
    unauthorizedResponse,
    noProfileResponse,
    getProfileErrorResponse,
    getProfileSuccessResponse: exampleProfile1,
}