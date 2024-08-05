const mongoose = require("mongoose");

const TimerSchema = new mongoose.Schema(
  {

     User:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
     } ,
    clockIn: {
      type: String,
      required: true,
      trim: true,
    },
    clockOut:{
        type:String ,
        trim:true , 
    } ,
    date:{
        type:Date , 
        default:Date.now() ,
    } , 
    breakIn:{
        type:String ,
        trim:true , 
    } ,
     breakOut:{
        type:String ,
        trime:true ,
    }, 
    totalBreak:{
        type:String, 
        trim:true ,
    } , 
    Note:{
        type:String , 
        trim:true , 
    } , 
   
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timer", TimerSchema);
