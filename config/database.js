const mongoose = require("mongoose");
require('dotenv').config();

// This file connects your server to MongoDB
const connectDB = async () => {
  try {
    let dbUrl;

    switch (process.env.ENV) {
      case "prod":
        dbUrl = process.env.LIVE_DB_URL;
        break;
      case "devLocal":
        dbUrl = process.env.MOCK_DB_URL;
        break;
      default:
        dbUrl = "mongodb://127.0.0.1:27017/";
    }

    const conn = await mongoose.connect(dbUrl, { //necessary for tests
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

     console.log(`MongoDB Connected: ${conn.connection.host}`);
   } catch (err) {
     console.error(err);
     process.exit(1);
   }
 };

module.exports = connectDB;
