const joinedFiles = require('./file2');
jest.mock('./file3.js')
const numbers = require('./file3');
jest.mock('./file1.js')
const words = require('./file1');
const importedWords = require('../../src/microServices/MediaService/utils/randomWords');
const wordList = importedWords.wordList;

afterEach(() => jest.resetAllMocks())
describe('createArrayAndJoinWords should', () => {
    test('return the words from the lookup seperated by a space', async () => {
        const expected = wordList[1] + ' ' + wordList[2];
        words.getWordFromParam.mockReturnValueOnce(wordList[1])
                .mockReturnValueOnce(wordList[2]);
        const response = joinedFiles.joinCoupleRandomWords();
        expect(response).toBe(expected)
    });
    test('should return only 2 values', () => {
        const expected = 2;
        words.getWordFromParam.mockReturnValueOnce(wordList[1])
                .mockReturnValueOnce(wordList[2]);
        const response = joinedFiles.joinCoupleRandomWords();
        expect(response.split(' ').length).toBe(expected)
    })
})
describe('createArrayAndJoinWords should', () => {
    test('return the number of values passed in as an argument', () => {
        const newWordList = ['foo', 'bar', 'fizz', 'buzz', 'five'];
        newWordList.forEach(e => {
            words.getWordFromParam.mockReturnValueOnce(e)
        })
        const result = joinedFiles.createArrayAndJoinWords(5);
        expect(result).toBe(newWordList.join(' '));
    })
})