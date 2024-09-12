const Page = require("../Models/Page");
const User = require("../Models/Users");
const Team = require("../Models/Team");

exports.CreatePage = async(req ,res)=>{
    try{

         const {name } = req.body;

          await Page.create({name});

         return res.status(200).json({
            success:true , 
         })
         

    } catch(error){
        return res.status(500).json({
            success:false , 
            message: error.message
        })
    }
}

exports.GetAllPage = async(req ,res)=>{
    try{

        const allPages = await Page.find({});

        return res.status(200).json({
            success:true ,
            allPages
        })


    } catch(error){
        return res.status(500).json({
            success:false , 
            message: error.message
        })
    }
}

exports.GetMyTeamPage = async(req ,res)=>{
    try{
             const userId = req.user.id;
         const userDetails = await User.findById(userId);
          const teamId = userDetails.team;

          const teamDetail = await Team.findById(teamId);

          return res.status(200).json({
            success:true ,
            data: teamDetail.dashboardAllow
          })
          

    } catch(error){
        return res.status(500).json({
            success:false , 
            message: error.message
        })
    }
}