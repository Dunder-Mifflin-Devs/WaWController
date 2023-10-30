const math = require('./file3');
const arrWords = ['wordOne', 'wordTwo', 'wordThree', 3]
const arrNums = Array.from({length: 30}, (_, index) => index + 1) //array length 10 with values 1-30

describe('When calling multiplyTwoNumbers', () => {
    it('should return the value of the two number muliplied by each other', async () => {
        const expected = 50;
        const response = await math.mulitplyTwoNumbers(arrNums, 4, 9);
        expect(response).toBe(expected);
    });

    it('should return a number between 1 and 15 when called with an array of items that are not of type "number"', async () => {
        const response = await math.mulitplyTwoNumbers(arrWords, 1, 2);
        expect(arrNums.includes(response)).toBeTruthy();
    });
});

describe('When calling addTwoNumber', () => {
    it('should return the value of the two number added together', async () => {
        const expected = 2;
        const response = await math.addTwoNumbers(arrNums, 0, 0);
        expect(response).toBe(expected);
    });

    it('should return an error when the type of both values are not "number"', async () => {
        const expected = 'Error: At least one of these is not a number';
        const response = await math.addTwoNumbers(arrWords, 0, 3);
        expect(response.toString()).toBe(expected)
    });
});

describe('When calling createArrayOfRandomNumbers', () => {
    it('should return an array of the length passed in as an argument', async () => {
        const arrayOfNums = [10, 11, 12, 18];
        const response = arrayOfNums.map(e => {
            return (math.createArrayOfRandomNumbers(e)).length;        })
        expect(response).toEqual(arrayOfNums)
    });

    it('should produce no number larger than the value of the highest index number', async () => {
        const expected = Array.from({length: 11}, (_, i) => i) //array to verify no values are above 10
        const response = math.createArrayOfRandomNumbers(10);
        const includesResponseInExpected = response.map(e => {
           return expected.includes(e) // true when number is is expected array
        });
        //check for a false in the includesResponseInExpected array
        expect(includesResponseInExpected.includes(false)).toBeFalsy(); 
    });
})
describe('when calling createRandomNumberBtwn0andparam', () => {
    it('should return a number between 0 and the param', async () => {
        const result = math.createRandomNumberBtwn0andparam(20);
        expect(result >= 0 && result <= 20).toBeTruthy();
    });
    it('should not produce a number greater than the param', async () => {
        let truth = false;
        for (let i = 0; i < 1500; i++){
            const number = math.createRandomNumberBtwn0andparam(2)
            if( number >= 2 || number < 0){
                truth = true
            }
        }
        expect(truth).toBeFalsy();
    });
})