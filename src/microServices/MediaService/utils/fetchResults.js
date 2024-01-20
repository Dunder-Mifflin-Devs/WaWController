const props = require("../../../../config/props.js");

module.exports = {
  omdbSearch: async (params) => {
    let url = props.omdb;
    if (params.type !== "movie" && params.type !== "series") delete params.type;
    for (let key in params) {
      url += "&" + key + "=" + params[key];
    }

    let results = await (await fetch(url)).json();
    return results;
  },
};
