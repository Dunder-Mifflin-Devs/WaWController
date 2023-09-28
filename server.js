const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const props = require('./config/props');
const userRoutes = require('./src/routes/userRoutes');

require('dotenv').config({ path: './config/.env' });

// Routes
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});