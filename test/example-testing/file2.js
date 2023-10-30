const importedWordList = require('../../src/microServices/MediaService/utils/randomWords');
const words = require('./file1');
const numbers = require('./file3');
const wordList = importedWordList.wordList;

// build number array 
const joinCoupleRandomWords = () => {
const numOne = Math.floor(Math.random() * 50);
const numTwo = Math.floor(Math.random() * 50);
console.log(numOne, numTwo)
const wordOne = words.getWordFromParam(numOne, importedWordList.wordList);
const wordTwo = words.getWordFromParam(numTwo, importedWordList.wordList);
console.log(wordOne, wordTwo)
return wordOne + ' ' + wordTwo;
};

const createArrayAndJoinWords = (numOfWords) => {
    const numArray = numbers.createArrayOfRandomNumbers(100);
    const numArr = [];
    for (let i = 0; i < numOfWords; i++){
        numArr.push(numbers.addTwoNumbers(numArray, numbers.createRandomNumberBtwn0andparam(100), numbers.createRandomNumberBtwn0andparam(100)));
    }
    const wordsJoined =  numArr.map((e) => {
        return words.getWordFromParam(e, wordList);
    }).join(' ');
    return wordsJoined;
}

module.exports = {
    createArrayAndJoinWords,
    joinCoupleRandomWords,
}