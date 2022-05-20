const express = require("express");
const router = express.Router();

const userControllers = require("../controller/user");

router.get("/user", userControllers.getUsers);

module.exports = router;