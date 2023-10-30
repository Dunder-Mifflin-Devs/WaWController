const importedList = require('../../src/microServices/MediaService/utils/randomWords');
const words = require('./file1');
const wordList = importedList.wordList;
const randomNumber = Math.floor((Math.random() * 1952)) //length of imported list is 1952

describe('When calling getWordFromParam', () => {
    it('should return the expected word given the index and list', async() => {
        const newWordList = ['ability', 'another'];
        const expected = 'another';
        const response = await words.getWordFromParam(1, newWordList);
        expect(response).toBe(expected);
    });

    it('should throw an error when given a negative number as a param', async () => {
        const expected = Error('sorry, not here');
        const response = await words.getWordFromParam(-1, wordList)
        expect(response.toString()).toBe(expected.toString())
    });

    it('should throw an error when the number provided is larger than the length of the list', async () => {
        const expected = Error('sorry, not here');
        const response = await words.getWordFromParam(200000000, wordList)
        expect(response.toString()).toBe(expected.toString())
    });
});

describe('When calling getNumberFromWord', () => {
    it('should return the index of the word + 1 when the word is in the word list', async () =>{
        const expected = 1;
        const response = await words.getNumberFromWord('ability', wordList);
        expect(response).toBe(expected)
    });

    it('should return an error of "not today" when called with invalid parameters', async () => {
        const expected = 'Error: not today';
        const response = words.getNumberFromWord('non-existent-word', wordList);
        expect(response.toString()).toBe(expected);
    });

    it('should return the same number as when finding the word using getWordFromParam', async () => {
        const word = words.getWordFromParam(randomNumber, wordList);
        const expected = randomNumber + 1;
        const response = await words.getNumberFromWord(word, wordList);
        expect(response).toBe(expected);
    });
})