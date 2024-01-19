module.exports = {
  preset: "@shelf/jest-mongodb",

  rootDir: "./",

  testMatch: ["**/test/**/*.test.js", "**/test/**/*.spec.js"],
  verbose: true,
  testEnvironment: "node",
  roots: ["<rootDir>/test"],

  moduleFileExtensions: ["js", "json", "jsx", "node"],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  globalSetup: "./test/setupServer.js",
  globalTeardown: "./test/teardownServer.js",
};
