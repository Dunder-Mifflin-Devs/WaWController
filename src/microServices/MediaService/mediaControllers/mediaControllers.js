const { getRandomWord } = require("../utils/randomWords");
const props = require("../../../../config/props.js");

/* This will be where you put your controller for media
You will probably want to organize these based on what the method is doing (POST, PUT, DELETE, GET)*/
module.exports = {
    // search omdb for movies, tv shows, or both
    /* Example parameters
         search: "Matrix"
         type: "movie"
         page: 1
    */
    searchOMDB: async (req, res) => {
        let results = [];
        let search = req.query.search || "";
        let type = (req.query.type || "").toLowerCase();
        let page = req.query.page || 1;
        if (type !== "movie" && type !== "series") type = "";

        try {
            results = await (await fetch(`${props.omdb}&i=${search}&type=${type}&plot=full`)).json();
            if (results.Response === "True") {
                delete results.Response;
                return res.json({ success: true, results: [results], totalResults: 1});
            }

            results = await (await fetch(`${props.omdb}&s=${search}&type=${type}&page=${page}`)).json();
            if (results.Response !== "True") throw "Unable to receive a response from OMDB";

            return res.json({ success: true, results: results.Search, totalResults: Number(results.totalResults) });
        }
        catch(err) {
            console.error(err);
            return res.json({ success: false, message: "Failed to search OMDB" });
        }
    },

    // get random movies, tv shows, or both from OMDB
    /* Example parameters
         type: "movie"
         amount: 10
    */
    randomOMDB: async (req, res) => {
        let results = [];
        let type = (req.query.type || "").toLowerCase();
        //let genre = (req.query.genre || "").toLowerCase();
        let amount = req.query.amount || 10;
        let randomWord;
        let count;

        /*
        if (genre !== "action" &&
            genre !== "romantic" &&
            genre !== "comedy" &&
            genre !== "drama") {
            genre = "";
        }
        else {
            genre = genre.charAt(0).toUpperCase() + genre.slice(1);
        }
        */

        try {
            if (type !== "movie" && type !== "series") type = "";

            do {
                randomWord = getRandomWord();
                let result = await (await fetch(`${props.omdb}&s=${randomWord}&type=${type}`)).json();
                if (result.Response === "True") {
                    count = Number(result.totalResults)
                }
            } while (!count);
            let pages = Math.ceil(count / 10);
            let set = new Set();

            while (results.length < amount && set.size < pages) {
                let page = Math.floor(Math.random() * pages) + 1;

                while (set.has(page)) {
                    page = Math.floor(Math.random() * pages) + 1;
                }
                set.add(page);
                let result = await (await fetch(`${props.omdb}&s=${randomWord}&type=${type}&page=${page}`)).json();

                if (result.Response === "True") {
                    for (let item of result.Search) {
                        console.log(item);
                        if (results.length < amount) {
                            results.push(item);
                        }
                        console.log("Here")
                    }
                }
            }

            return res.json({ success: true, results });
        } catch(err) {
            console.error(err);
            return res.json({ success: false, message: "Failed to make a random search of OMDB" });
        }
    }
}