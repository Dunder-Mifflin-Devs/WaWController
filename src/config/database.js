const mongoose = require("mongoose");

// This file connects your server to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING || "mongodb://127.0.0.1:27017/", { //necessary for tests
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
