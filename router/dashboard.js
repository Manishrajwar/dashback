// Import the required modules
const express = require("express");
const router = express.Router();

const {GetUserDetails , UserClockIn} = require("../Controller/Dashboard");
const {auth } = require("../middleware/auth");

router.get("/getUserDetails"  ,auth , GetUserDetails);
router.post("/clockIn" , auth ,  UserClockIn);

module.exports = router;