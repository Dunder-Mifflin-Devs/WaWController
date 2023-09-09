const express = require('express');
const app = express();
const yn = require('yn');
const port = process.env.PORT || 3000;

require('dotenv').config({ path: './config/.env' });


// Check if in a local environment
const isMockEnvironment = yn(process.env.ENVIRONMENT === 'local');

let dbUrl;
if (isMockEnvironment) {
    // If in mock env, use mock DB
    dbUrl = process.env.MOCK_DB_URL;
} else {
    // Else use live DB
    dbUrl = process.env.LIVE_DB_URL;
}

app.listen(port, () => {
    console.log(`Server is running in ${port}.`);
    console.log(`Database is on ${dbUrl}`)
});