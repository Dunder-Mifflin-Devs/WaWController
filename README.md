# WaWController
Worth-a-Watch's Backend point of entry Service

In order to efficiently communicate with other microservices and the front-end, the WaWController will provide an interface between individual microservices and the client-facing front end.

# Starting scripts

npm run test: runs Jest testing scripts in testing folder
npm run test-coverage: runs testing with coverage summary at the end
npm start: runs prod 
npm run dev: runs dev with remote server
npm run devLocal: runs dev with local mongoDB server via mongodb-memory-server

# .env variables
Just used as examples, use secrets and protect api calls / logins as necessary.

There are 4 files in the ./src/config: .env.dev, .env.devLocal, .env.prod, .env.test

They include properites like the following for .env.devLocal:

`ENV = devLocal
PORT = 3000
SESSION_SECRET = "keyboard cat"
DB_STRING = "mongodb://127.0.0.1:27017/"`