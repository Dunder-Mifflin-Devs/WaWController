require("dotenv").config({ path: "./config/.env" });
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')

// This file runs a MongoDB server locally for development
module.exports.run = async () => {
  const dbPath = path.join(__dirname, '..', '.mongo');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  // start mongo
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath,
      // to persist data between runs (https://github.com/nodkz/mongodb-memory-server/issues/524)
      storageEngine: 'wiredTiger',
    },
  });

  const uri = mongod.getUri();
  console.log(`Mongo server started on: ${uri}`);
}


// module.exports.connect = async() => {
//   const mongoServer = await MongoMemoryServer.create()
//   const uri = mongoServer.getUri()
//   const mongooseOpts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//   }
//   await mongoose.connect(uri, mongooseOpts)
// }

module.exports.closeDatabase = async() => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  // await mongod.stop()
}

module.exports.clearDatabase = async() => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
      const collection = collection[key]
      await collection.deleteMany()
  }
}