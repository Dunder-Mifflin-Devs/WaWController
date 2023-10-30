module.exports = {

    getWordFromParam: (number, words) => {
        return number < words.length && number >= 0 ? 
            words[number] : new Error ('sorry, not here');
        }, 

    getNumberFromWord: (word, list) => {
        return list.includes(word) ? 
        list.indexOf(word) + 1 : new Error('not today');
    }
}