// Import the required modules
const express = require("express");
const router = express.Router();

const {CreateProject , EditProject ,deleteProject ,GetNotification , DeleteNotification ,  MarkAllReadNotify ,  getAllAdminProjects ,GetMyInvitation , DeleteAllNotification ,  GetMyProjects ,InviResponse ,  SendProjectInvite} = require("../Controller/Projects");
const { isAdmin ,auth } = require("../middleware/auth");

// Import the required controllers and middleware functions
router.post("/getMyProjectcreateProject" , auth , isAdmin, CreateProject);
router.put("/editProject" , auth , isAdmin, EditProject);
router.delete("/deleteProject" , auth , isAdmin, deleteProject);
router.get("/getAllProjects" , auth ,isAdmin ,  getAllAdminProjects);
router.get("/getMyProject" , auth , GetMyProjects);
router.post("/sendProjectInvite" , auth , isAdmin , SendProjectInvite);
router.get("/getMyInvitation" , auth  , GetMyInvitation);
router.post("/inviResponse" , auth  , InviResponse);
router.get("/getNotification"  , auth , GetNotification);
router.put("/markAllReadNotify" , auth , MarkAllReadNotify);
router.delete("/deleteNotification/:notifyId" , auth , DeleteNotification);
router.delete("/deleteAllNotification" , auth , DeleteAllNotification);


module.exports = router;