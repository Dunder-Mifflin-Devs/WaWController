module.exports = {

    getWordFromParam: async (number, words) => {
        return number <= words.length && number > 0? 
            words[number - 1] : new Error ('sorry, not here');
        }, 

    getNumberFromWord: async (word, list) => {
        return list.includes(word) ? 
        list.indexOf(word) + 1 : new Error('not today');
    }
}