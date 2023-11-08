// Exports function used by Jest to teardown the server and database
const { closeDB, stopDB } = require("../config/database");

module.exports = async () => {
    app.close()
    await closeDB();
    await stopDB();
}