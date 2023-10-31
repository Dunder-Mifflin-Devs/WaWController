// Exports a function used by Jest to setup the server
// and make it available for use in the test files
module.exports = async () => {
    const app = require("../server.js");
    global.app = app;
}