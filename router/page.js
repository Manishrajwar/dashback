// Import the required modules
const express = require("express");
const router = express.Router();

const {auth, isAdmin } = require("../middleware/auth");
const { CreatePage , GetAllPage ,GetMyTeamPage } = require("../Controller/page");

router.post("/createPage"  , CreatePage);
router.get("/getAllPage" , auth , GetAllPage);
router.get("/getMyTeamPage" , auth , isAdmin , GetMyTeamPage);

module.exports = router;