const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    langPref: {
      type: String,
    },
    favoriteGenres: {
      type: Array, // Array of strings for genre.
    },
    favoriteMedia: {
      // Object containing the type of media containing array of favorites
      series: [{ type: mongoose.Schema.Types.ObjectId, ref: "Series" }],
      episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    },
    watchedMedia: {
      // Object containing the type of media containing array of watched
      series: [{ type: mongoose.Schema.Types.ObjectId, ref: "Series" }],
      episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    },
    toWatchMedia: {
      // Object containing the type of media containing array of watched
      series: [{ type: mongoose.Schema.Types.ObjectId, ref: "Series" }],
      episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    },
    userTags: {
      // Object containing the type of media containing objects with the name of the tag and a list of media
      series: [{
        tag: String,
        list: [{
          type: mongoose.Schema.Types.ObjectId, ref: "Series"
        }]
      }],
      episodes: [{
        tag: String,
        list: [{
          type: mongoose.Schema.Types.ObjectId, ref: "Episode"
        }]
      }],
      movies: [{
        tag: String,
        list: [{
          type: mongoose.Schema.Types.ObjectId, ref: "Movie"
        }]
      }],
      // example: 
      // {
      //   series: [ { tag: 'sci fi worth watching', list: ['UUID', 'UUID', 'UUID'] } ],
      //   episodes: [],
      // }
      // let taggedList = user(colin).userTags.series.find(x => x.tag === 'sci fi worth watching').list
    },
    userFriends: (
      // Array of UUID strings of other users
      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    ),
}); 

module.exports = mongoose.model('Profile', ProfileSchema, 'user-profiles'); // (ModelName, SchemaName, MongoDB collection name)