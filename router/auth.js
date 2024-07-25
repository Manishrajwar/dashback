// Import the required modules
const express = require("express");
const router = express.Router();

const {TrailLogin  , AdminSignup} = require("../Controller/auth");
const {isTrail} = require("../middleware/auth");

// Import the required controllers and middleware functions
router.post("/TrailLogin"  ,  TrailLogin);
router.post("/adminSignup"  ,  AdminSignup);

module.exports = router;