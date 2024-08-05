const Project = require("../Models/Project");
const Team = require("../Models/Team");
const User = require("../Models/user");
const ProjectInvite = require("../Models/ProjectInvite");
const Notification = require("../Models/Notification");

exports.CreateProject = async (req, res) => {
  try {
    const userId = req.user.id;

    const { Name, teamId, Description , dueDate } = req.body;

    if (!Name || !teamId  || !Description) {
      return res.status(403).json({
        success: false,
        message: "insufficient data ",
      });
    }

    const projectDetail = await Project.create({
      Name,
      team:teamId,
      CreatedBy: userId,
      Description,
      dueDate
    });
    const teamDetail = await Team.findById(teamId);

    teamDetail.Projects.push(projectDetail?._id);

    await teamDetail.save();

    return res.status(200).json({
      success: true,
      message: "Successful done",
      projectDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

exports.EditProject = async (req, res) => {
  try {
    const { Name, Description, projectId , dueDate } = req.body;

    if (!Name || !Description) {
      return res.status(403).json({
        success: false,
        message: "insufficient data ",
      });
    }

    const projectDetail = await Project.findById(projectId);
    projectDetail.Name = Name;
    projectDetail.dueDate = dueDate;
    projectDetail.Description = Description;

    await projectDetail.save();

    return res.status(200).json({
      success: true,
      message: "Successful done",
      projectDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

exports.deleteProject = async(req ,res)=>{
    try{

          const userId =req.user.id;
          const {projectId  , teamId} = req.body;

          if(!projectId ){
            return res.status(403).json({
                success: false,
                message: "insufficient data ",
              });
          }

await Project.findOneAndDelete({_id:projectId});

const teamDetail = await  Team.findById(teamId);

teamDetail.Projects.pull({ _id: projectId });
await teamDetail.save();

res.status(200).json({
    success: true,
    message: "Project successfully deleted",
  });

        
            } catch(error){
                console.log(error);
                return  res.status(500).json({
                    success:false ,
                    message:error?.message
                })
            }
}

exports.getAllAdminProjects = async(req ,res)=>{
    try{

          const userId = req.user.id;

          const userDetail = await User.findById(userId);

           const team = userDetail.team;

           const allProj = await Project.find({team:team}).populate("Members").sort({createdAt:-1});

           return res.status(200).json({
            success:true ,
            allProj
           })

        
            } catch(error){
                console.log(error);
                return  res.status(500).json({
                    success:false ,
                    message:error?.message
                })
            }
}


exports.GetMyProjects = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find all projects where the user is a member
      const projects = await Project.find({ Members: userId }).populate('Members').populate('CreatedBy').populate('team').sort({createdAt:-1});
  
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error("Error getting projects:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal server error"
      });
    }
  };

exports.SendProjectInvite = async(req ,res)=>{
    try{

 const {email , projectId , title} = req.body;
 const userId =req.user.id;

  const emailDetail = await User.findOne({email:email});

   if(!emailDetail){
    return res.status(404).json({
      success:false ,
      message:"No User register with this Email" , 
    })
   }

    if(emailDetail?._id == userId){
      return res.status(403).json({
        success:false ,
        message:"You cannot request yourself "
      })
    }

    const isPrevInvitationAvi = await ProjectInvite.findOne({
      project: projectId,
      user: emailDetail?._id,
      status: { $ne: "Reject" },
  });
 
   if(isPrevInvitationAvi){
    return res.status(203).json({
      success:false ,
      message:"User already send the Invitation"
    })
   }
   
     const invitedetail = await ProjectInvite.create({title , user:emailDetail?._id , sendBy:userId , project:projectId});

     return res.status(200).json({
      success:true ,
       message:"Successfuly send" , invitedetail
     })

    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}


exports.GetMyInvitation = async(req ,res)=>{
    try{

        const userId =req.user.id;

        const invitations = await ProjectInvite.find({
          user: userId,
          status: "No Action"
      }).populate("sendBy").populate("project");

      return res.status(200).json({
        success: true,
        data: invitations
    })

    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}

exports.InviResponse = async(req ,res)=>{
    try{

      const userId = req.user.id;
        const userEmail =req.user.email;
        const {status , invitationId} = req.body;

         const findInvitation = await ProjectInvite.findById(invitationId).populate("project");
         findInvitation.status = status;
         await findInvitation.save();
         
          let title = `Regarding Project Invitation`;
          let Description = `${findInvitation?.project?.Name} Invitation ${status} by ${userEmail}`
          const notifyCreate = await Notification.create({title ,Description , user: findInvitation.sendBy , sendBy:userId  });


           if(status  === "Accept"){
            const projectDetail = await Project.findById(findInvitation.project._id);
            if (!projectDetail.Members.includes(userId)) {
              projectDetail.Members.push(userId);
              await projectDetail.save(); 
            }
           }

          return res.status(200).json({
            success:true ,
            message:"Successfuly done" , 
            notifyCreate
          })


    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}

exports.GetNotification = async(req ,res)=>{
    try{

      const userId = req.user.id;

      // Retrieve all notifications for the user
      const allNotifications = await Notification.find({ user: userId }).populate("sendBy").sort({createdAt:-1});
  
      // Count notifications with status "No Seen"
      const unseenCount = await Notification.countDocuments({
        user: userId,
        status: "No Seen"
      });
  
      return res.status(200).json({
        success: true,
        notifications: allNotifications,
        unseenCount: unseenCount
      });

    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}




exports.MarkAllReadNotify = async(req ,res)=>{
    try{

      const userId = req.user.id;

  
      // Update the status of the specific notification
      const updatedNotification =  await Notification.updateMany(
          { user: userId },
          { $set: { status: "Seen" } }
        );

        return res.status(200).json({
          success: true,
          message: "Notification status updated successfully",
          notification: updatedNotification
        });

    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}


exports.DeleteNotification = async(req ,res)=>{
    try{

        const userId =req.user.id;
        const {notifyId} = req.params;

      const resp =   await Notification.findByIdAndDelete(notifyId);
      console.log('resp',resp);

        return res.status(200).json({
          success:true ,
          message:"Done "
        })

    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}


exports.DeleteAllNotification = async(req ,res)=>{
    try{

        const userId =req.user.id;
      await Notification.findByIdAndDelete({user:userId});

      return res.status(200).json({
        success:true ,
        message:"Done "
      })


    } catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false ,
            message:error?.message
        })
    }
}

// exports.CreateProject = async(req ,res)=>{
//     try{

//         const userId =req.user.id;

//     } catch(error){
//         console.log(error);
//         return  res.status(500).json({
//             success:false ,
//             message:error?.message
//         })
//     }
// }