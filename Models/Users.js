const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
  password: {
      type: String,
    },

    isClockIn:{
      type:Boolean ,
      default:false , 
    } , 
   
     accountType: {
      type: String,
      enum: ["Admin", "Employee", "Trial"],
      default:"Trial" , 
    },
    active: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    projects:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null ,
    } , 
    ] , 
  
    image: {
      type: String,
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    timerDetail:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timer",
      default: null ,
  } , 
  team:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null ,
  }, 
  employeeCode:{
    type:String ,
    default:"" ,
  } ,
  dashboardAllow:[
    {
      type:String, 
    }
  ] , 
   teamId:{
    type: String,
    default:null , 
   },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
