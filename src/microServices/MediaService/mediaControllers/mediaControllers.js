const { getRandomWord } = require("../utils/randomWords");
const { omdbSearch } = require("../utils/fetchResults");

module.exports = {
  searchOMDB: async (req, res) => {
    let results = [];
    let response;
    let search = req.query.search || "";
    let type = (req.query.type || "").toLowerCase();
    let page = req.query.page || 1;
    if (type !== "movie" && type !== "series") type = "";

    try {
      results = await omdbSearch({
        i: search,
        plot: "full",
      });

      if (results.Response === "True") {
        delete results.Response;
        response = { success: true, results: [results], totalResults: 1 };
        if (res) res.json(response);
        return response;
      }

      results = await omdbSearch({
        s: search,
        type,
        page,
      });
      if (results.Response !== "True")
        throw new Error("Unable to receive a response from OMDB");

      response = {
        success: true,
        results: results.Search,
        totalResults: Number(results.totalResults),
      };
      if (res) res.json(response);
      return response;
    } catch (err) {
      console.error(err);
      response = { success: false, message: "Failed to search OMDB" };
      if (res) res.json(response);
      return response;
    }
  },

  // get random movies, tv shows, or both from OMDB
  randomOMDB: async (req, res) => {
    let results = [];
    let response;
    let type = (req.query.type || "").toLowerCase();
    let amount = req.query.amount || 10;
    let randomWord;
    let count;

    try {
      if (type !== "movie" && type !== "series") type = "";
      if (amount < 0 || amount > 100)
        throw new Error("Invalid amount requested");

      while (results.length < amount) {
        do {
          randomWord = getRandomWord();
          let result = await omdbSearch({
            s: randomWord,
            type,
          });

          if (result.Response === "True") {
            count = Number(result.totalResults);
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

          let result = await omdbSearch({
            s: randomWord,
            type,
            page,
          });

          if (result.Response === "True") {
            for (let item of result.Search) {
              if (results.length < amount) {
                results.push(item);
              }
            }
          }
        }
      }

      response = { success: true, results };
      if (res) res.json(response);
      return response;
    } catch (err) {
      console.error(err);
      response = {
        success: false,
        message: "Failed to make a random search of OMDB",
      };
      if (res) res.json(response);
      return response;
    }
  },
};
