const props = require("../../../../config/props.js");

module.exports = {
    // makes a search of omdb with the specified parameters
    omdbSearch: async (params) => {
        let url = props.omdb;
        if (params.type !== "movie" && params.type !== "series") delete params.type;
        for (let key in params) {
            url += "&" + key + "=" + params[key];
        }
        
        let results = await (await fetch(url)).json();
        return results;
    },
}