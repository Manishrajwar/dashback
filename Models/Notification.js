const mongoose = require("mongoose");

const NotifcationSchema = new mongoose.Schema(
  {
    title: { 
      type: String,
    },
    Description:{
        type:String, 
    },
    user:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    status:{
        type:String, 
        default:"No Seen", 
        
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notifcation", NotifcationSchema);
