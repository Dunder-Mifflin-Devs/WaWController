module.exports = {
    addTwoNumbers: async (arr, indexOne, indexTwo) => {
        const num1 = arr[indexOne];
        const num2 = arr[indexTwo];
       return typeof  num1 === 'number' && typeof num2 === 'number' ?
                num1 + num2 : new Error('At least one of these is not a number')
    },

    mulitplyTwoNumbers: async (arr, indexOne, indexTwo) => {
        const num1 = typeof arr[indexOne] === 'number' ? arr[indexOne] : Math.floor(Math.random() * 5) + 1;
        const num2 = typeof arr[indexTwo] === 'number' ? arr [indexTwo] : Math.floor(Math.random() * 3) + 1;
        return num1 * num2;
    },

    createArrayOfRandomNumbers: (arrLength) => {
        return Array.from({length: arrLength}, (_, index) => Math.floor(Math.random() * (index+1)))
    }
}