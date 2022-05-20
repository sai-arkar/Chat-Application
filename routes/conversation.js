const express = require("express");
const router = express.Router();

const convControllers = require("../controller/conversation");

router.get("/new-conv/:rId", convControllers.getConv);

router.post("/chat", convControllers.postChat);

// Not necessary
router.post("/new-conv", convControllers.newConv);


module.exports = router;