// Import the required modules
const express = require("express");
const router = express.Router();

const {TrailLogin  , AdminSignup , AdminLogin , EmployeeLogin} = require("../Controller/auth");

// Import the required controllers and middleware functions
router.post("/TrailLogin"  ,  TrailLogin);
router.post("/adminSignup"  ,  AdminSignup);
router.post("/adminLogin" ,  AdminLogin);
router.post("/employeeLogin" ,  EmployeeLogin);


module.exports = router;