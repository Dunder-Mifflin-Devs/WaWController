const express = require("express");
const controller = require("../mediaControllers/mediaControllers");

module.exports = (passport) => {
  const router = express.Router();

  router.get("/omdb/search", controller.searchOMDB);
  router.get("/omdb/random", controller.randomOMDB);
  return router;
};
