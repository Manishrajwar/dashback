
const Task = require("../Models/Task")
const Notification = require("../Models/Notification");
const Project = require("../Models/Project");

exports.createTask =async(req ,res)=>{
    try{

        const userId = req.user.id;
        const { title ,member , project , description , priority , dueDate} = req.body;

        if (!title || !member  || !project || !description || !priority || !dueDate) {
            return res.status(403).json({
              success: false,
              message: "insufficient data ",
            });
          }

          const projectDetail = await Project.findById(project);

          const taskDetail = await Task.create({title ,member , CreatedBy:userId , project , description , priority , dueDate});

           let title2 = `Task Assign ${projectDetail.Name}`;


           const notify = await Notification.create({title:title2 ,Description:title , user:member , sendBy:userId });
           

          return res.status(200).json({
            success:true ,
            message:"done" , 
            taskDetail 
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:error.message
        })
    }
}

exports.UpdateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, member, project, description, priority, dueDate, taskId } = req.body;

        if (!title || !member || !project || !description || !priority || !dueDate || !taskId) {
            return res.status(403).json({
                success: false,
                message: "Insufficient data",
            });
        }

        const projectDetail = await Project.findById(project);

        const taskDetail = await Task.findByIdAndUpdate(
            taskId, 
            { title, member, CreatedBy: userId, project, description, priority, dueDate }, 
            { new: true, runValidators: true }
        );

        if (!taskDetail) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        let title2 = `Updates on Task ${projectDetail.Name}`;
        const notify = await Notification.create({title:title2 ,Description:title , user:member , sendBy:userId });
        

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            taskDetail,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.GetAllTask =async(req ,res)=>{
    try{

        const userId = req.user.id;
        const {projectId} = req.params;

        if (!userId) {
            return res.status(403).json({
              success: false,
              message: "insufficient data ",
            });
          }

           const allTask = await Task.find({project:projectId}).populate("member").sort({createdAt:-1});

          return res.status(200).json({
            success:true ,
            message:"done" , 
            allTask
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:error.message
        })
    }
}

exports.GetMemTask =async(req ,res)=>{
    try{

        const userId = req.user.id;
        const {projectId} = req.params;

        if (!userId) {
            return res.status(403).json({
              success: false,
              message: "insufficient data ",
            });
          }

           const allTask = await Task.find({member:userId , project:projectId}).sort({createdAt:-1});

          return res.status(200).json({
            success:true ,
            message:"done" , 
            allTask
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:error.message
        })
    }
}

exports.UpdateTaskStatus =async(req ,res)=>{
    try{

        const userId = req.user.id;
        const {status , taskId} = req.body;
        console.log("status ",status , taskId);

        if (!userId || !status)  {
            return res.status(403).json({
              success: false,
              message: "insufficient data ",
            });
          }

          const taskdetail = await Task.findById(taskId);
          taskdetail.status = status;
          await taskdetail.save();

          let title = `Change In Task Status`;
           let desc = `${taskdetail.title} Status ${taskdetail.status}`
          
          const notify = await Notification.create({title:title ,Description:desc , user:taskdetail.CreatedBy , sendBy:userId });
          

          return res.status(200).json({
            success:true ,
            message:"done" , 
            
        })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:error.message
        })
    }
}

exports.DeleteTask =async(req ,res)=>{
    try{

        const {taskId} = req.params;

         await Task.findByIdAndDelete(taskId);

        return res.status(200).json({
            success:true ,
            message:"Successfuly done" ,
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:error.message
        })
    }
}


// exports.createTask =async(req ,res)=>{
//     try{

//     } catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false ,
//             message:error.message
//         })
//     }
// }