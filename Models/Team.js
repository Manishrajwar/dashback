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
                type:String ,
            }
        ] , 
        Members:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null ,
        }] ,
        Projects:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        }] ,
        Admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
