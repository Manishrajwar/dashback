// Import the required modules
const express = require("express");
const router = express.Router();

const {auth, isAdmin } = require("../middleware/auth");
const { createTask , GetAllTask ,GetMemTask , UpdateTaskStatus , UpdateTask ,DeleteTask } = require("../Controller/task");

router.post("/createTask" , auth , isAdmin , createTask);
router.get("/getAllProjectTask/:projectId" , auth , isAdmin , GetAllTask);
router.get("/getProjectMemberTask/:projectId" , auth  , GetMemTask);
router.put("/updateTaskStatus" , auth  , UpdateTaskStatus);
router.put("/updateTask" , auth  ,isAdmin ,  UpdateTask);
router.delete("/deleteTask/:taskId/:projectId" , auth  ,isAdmin ,  DeleteTask);

module.exports = router;