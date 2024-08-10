// Import the required modules
const express = require("express");
const router = express.Router();

const {GetUserDetails , UserClockIn ,ClockOutHandler ,UpdateTimerStatus ,  CreateAdminTeamId , GetTeamDetails , CreateTeamMember , EditMember,EditAdminTeam , ClockInDetails , CreateMeetLink} = require("../Controller/Dashboard");
const {auth, isAdmin } = require("../middleware/auth");

router.get("/getUserDetails"  ,auth , GetUserDetails);

router.post("/clockIn" , auth ,  UserClockIn);
router.put("/clockInStatus" , auth ,  UpdateTimerStatus);
router.put("/clockOutHandler" , auth ,  ClockOutHandler);
router.post("/clockInDetails" , auth , ClockInDetails);

router.post("/createTeamId" ,auth , isAdmin , CreateAdminTeamId);
router.get("/getTeamDetails" ,auth  , GetTeamDetails);
router.post("/createTeamMember" ,auth , isAdmin , CreateTeamMember);
router.post("/editMember" ,auth , isAdmin , EditMember);
router.put("/EditAdminTeam" ,auth , isAdmin , EditAdminTeam);


module.exports = router;