const express = require("express");
const router = express.Router();

router.use("/userService", (req, res, next) => {
    const userServiceRoutes = require("../microServices/WaWuserManagement/index");
    userServiceRoutes(req, res, next);
})