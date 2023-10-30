const wordList = require('../../src/microServices/MediaService/utils/randomWords');
const words = require('./file1');
const numbers = require('./file3')

// build number array 
const arrayOfRandomNumbers = numbers.createArrayOfRandomNumbers();
const randomNumberFromMultiplying = numbers.mulitplyTwoNumbers(arrayOfRandomNumbers, 12, 99)
const randomNumberFromAdding = numbers.addTwoNumbers(arrayOfRandomNumbers, 14, 75);

const multiplyTwoPotentiallyRandomNumbers = (num1, num2) => {
    
}