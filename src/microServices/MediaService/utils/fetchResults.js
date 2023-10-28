const props = require("../../../../config/props.js");

module.exports = {
    fetchResults: async (data) => {
        if (data.type !== "movie" && data.type !== "series") data.type = "";
        let results = [];
        results = await (await fetch(`${props.omdb}&i=${data.search}&type=${data.type}&plot=full`)).json();
            if (results.Response === "True") {
                delete results.Response;
                return res.json({ success: true, results: [results], totalResults: 1});
            }

            results = await (await fetch(`${props.omdb}&s=${search}&type=${type}&page=${data.page}`)).json();
            if (results.Response !== "True") {
                throw "Unable to receive a response from OMDB";
        }
            return results
    },
}