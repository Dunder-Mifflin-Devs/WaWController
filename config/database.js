const mongoose = require("mongoose");
const props = require("./props");
require('dotenv').config();

// This file connects your server to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(props.dbUrl, { //necessary for tests
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
