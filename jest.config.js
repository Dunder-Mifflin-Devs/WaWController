module.exports = {
    preset: "@shelf/jest-mongodb",
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest uses to refer to the root directory of your project
    rootDir: "./",
    // Looks for test files with a '.test.js' or '.spec.js' suffix in the 'test' directory
    testMatch: [
        "**/test/**/*.test.js",
        "**/test/**/*.spec.js"
    ],
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    // The test environment that will be used for testing
    testEnvironment: "node",
    // A list of paths to directories that Jest should use to search for files in
    roots: [
        "<rootDir>/test"
    ],
    // The glob patterns Jest uses to detect test files
    // By default it looks for .js, .jsx, .ts and .tsx files inside of __tests__ folders,
    // as well as any files with a suffix of .test or .spec (e.g. Component.test.js or Component.spec.js).
    // It will also find files called test.js or spec.js.
    moduleFileExtensions: [
        "js",
        "json",
        "jsx",
        "node"
    ],
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        "/node_modules/",
        "\\.pnp\\.[^\\/]+$"
    ],
    // Automatically reset mock state between every test
    resetMocks: true,
    // Automatically restore mock state between every test
    restoreMocks: true,
    // Automatically clear mock calls and instances between every test
    clearMocks: true
};
