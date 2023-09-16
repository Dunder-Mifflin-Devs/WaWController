const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const props = require('./config/props');

require('dotenv').config({ path: './config/.env' });


app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});