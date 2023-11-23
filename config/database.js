const mongoose = require("mongoose");
const props = require("./props");
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let mongod;

// Creates a connection to MongoDB
module.exports.connectDB = async () => {
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

// Runs a MongoDB server locally for development
module.exports.run = async (port=27017) => {
  const dbPath = path.join(__dirname, '..', '.mongo');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  // start mongo
  mongod = await MongoMemoryServer.create({
    instance: {
      port,
      dbPath,
      // to persist data between runs (https://github.com/nodkz/mongodb-memory-server/issues/524)
      storageEngine: 'wiredTiger',
    },
  });

  const uri = mongod.getUri();
  console.log(`Mongo server started on: ${uri}`);
}

//Closes the mongoDB server
module.exports.stopDB = async () => {
  if (mongod) {
    await mongod.stop();
    mongod = undefined;
  }
};

// Closes the MongoDB server (if it exists) and connection
module.exports.closeDB = async() => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

// Clears the database
module.exports.clearDB = async() => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
