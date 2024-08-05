const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {

    title: { 
      type: String,
    },
    member: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    } , 
    description: {
      type: String,
    },
    priority: {
      type: String,
    },
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

module.exports = mongoose.model("Task", taskSchema);
