// Import the required modules
const express = require("express");
const router = express.Router();

const {auth, isAdmin } = require("../middleware/auth");
const { createEvent , MyEvents } = require("../Controller/event");

router.post("/createEvent" , auth , createEvent);
router.get("/myEvents" , auth , MyEvents);

module.exports = router;