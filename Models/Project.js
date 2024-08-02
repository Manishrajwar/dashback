const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    Name: { 
      type: String,
    },
   
    Members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Description: {
      type: String,
    },
    team:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team", 
    } ,
    status:{
      type:String ,
      default:"Not Started" , 

    } ,
    dueDate:{
      type:Date , 
    },
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
