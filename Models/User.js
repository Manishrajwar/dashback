const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
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
      required: true,
    },

    isClockIn:{
      type:Boolean ,
      default:false , 
    } , 
     accountType: {
      type: String,
      enum: ["Admin", "Employee", "Trial"],
      default:"Trial" , 
      // required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    // whichDashboard: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Dashboard",
    // },
    image: {
      type: String,
      // required: true,
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
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
