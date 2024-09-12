const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema( 
    {

        teamName:{
            type:String , 
            
        }, 
        teamId: {
            type: String,
            ref: "Team",
        } , 
        dashboardAllow:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Page",
            }
        ] , 
        Members:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: null ,
        }] ,
        Projects:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        }] ,
        Admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }, 
     ThreeLetter:{
        type:String, 
     } , 
        CreatedAt:{
   type:Date , 
   default:Date.now() ,
        }
        
    } ,
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
