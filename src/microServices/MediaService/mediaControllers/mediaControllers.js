const { getRandomWord } = require("../utils/randomWords");
const fetchResults = require('../utils/fetchResults')
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
        const data = {
            search: req.query.search || "",
            type: (req.query.type || "").toLowerCase(),
            page: req.query.page || 1
        }
        try {
            const results = await fetchResults(data);
            console.log(results)
            console.log(req)
            console.log(res)
            const successResponse = { success: true, results: results.Search, totalResults: Number(results.totalResults) }
            res.json(successResponse);
            return successResponse;
        }
        catch(err) {
            console.error(err);
            const failureResponse = { success: false, message: "Failed to search OMDB" }
            res.json(failureReponse);
            return failureResponse
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