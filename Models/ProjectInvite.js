const mongoose = require("mongoose");

const projectInviteSchema = new mongoose.Schema(
  {
    title: { 
      type: String,
    },
    user:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    project:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", 
    } ,
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    status:{
        type:String, 
        default:"No Action", 
        
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectInvite", projectInviteSchema);
