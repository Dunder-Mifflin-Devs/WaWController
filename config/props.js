require('dotenv').config({ path: './config/.env' });

// Production environment properties
const productionProps = {
  env: process.env.NODE_ENV,
  dbUrl: process.env.LIVE_DB_URL,
  apiKey: process.env.LIVE_API_KEY,
};

// Development environment properties
const developmentProps = {
    env: process.env.NODE_ENV,
    dbUrl: process.env.MOCK_DB_URL,
    apiKey: process.env.MOCK_API_KEY,
  };

// Export the properties based on the current environment in .env file
module.exports = process.env.NODE_ENV === 'production' ? productionProps : developmentProps;
