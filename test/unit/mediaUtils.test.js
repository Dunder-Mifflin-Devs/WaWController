const {
  wordList,
  getRandomWord,
} = require("../../src/microServices/MediaService/utils/randomWords");

describe("Media Utils Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("if getRandomWord returns a word in the wordList", () => {
    expect(wordList).toContain(getRandomWord());
  });
});
