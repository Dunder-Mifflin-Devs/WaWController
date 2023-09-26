const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }, // UUID
  passHash: {
    type: String, 
    required: false
  }, 
  profPic: {
    type: String, 
    required: false
  }, // url to profile pic
  altAuth: {
    type: JSON, 
    required: false
  },
  userEmail: {
    type: String, 
    required: false
  }, // if using oAuth, this field will be populated via different means, so when user signs up wit oAuth, this will not be filled til after completed.
  userName: {
    type: String, 
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema, 'user-logins'); // (ModelName, SchemaName, MongoDB collection name)