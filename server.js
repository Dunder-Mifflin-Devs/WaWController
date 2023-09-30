const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const props = require('./config/props');

require('dotenv').config({ path: './config/.env' });

/* TODO wide open routes go here*/



/* TODO Passport authentication logic goes here*/

/* TODO secure routes go here*/

app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});