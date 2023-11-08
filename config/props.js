require('dotenv').config({ path: './config/.env' });

// Production environment properties
const productionProps = {
  env: process.env.NODE_ENV,
  dbUrl: process.env.LIVE_DB_URL,
  apiKey: process.env.LIVE_API_KEY,
  omdb: process.env.OMDB,
  port: process.env.PORT || 3001,
};

// Development environment properties
const developmentProps = {
    env: process.env.NODE_ENV,
    dbUrl: process.env.MOCK_DB_URL || "mongodb://127.0.0.1:27017/",
    apiKey: process.env.MOCK_API_KEY,
    mockDbPort: Number(process.env.MOCK_DB_PORT || "27017"),
    omdb: process.env.OMDB,
    port: process.env.PORT || 3001,
  };

// Export the properties based on the current environment in .env file
module.exports = process.env.NODE_ENV === 'production' ? productionProps : developmentProps;
