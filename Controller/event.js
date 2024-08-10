const Event = require("../Models/Events");
const User = require("../Models/Users");
const Notification = require("../Models/Notification");

exports.createEvent = async(req ,res)=>{
    try{

        const {year , month , date , title , meetLink , email} = req.body;
        const useremail = req.user.email;


        const userDetail = await User.findOne({email:email});
        const userid = req.user.id;

        if(!year || !month || !date || !title || !email){
            return res.status(403).json({
                success:false ,
                message:"Insufficient data alert"
            })
        }
        
        if(!userDetail){
            return res.status(404).json({
                success:false ,
                message:`No User found with email ${email}`
            })
        }

         

    const eventDetails= await Event.create({year , month , date ,title , meetLink , email});
    await Event.create({year , month , date ,title , meetLink ,email:useremail});

     
    let title2 = `New Event ` 
    await Notification.create({title:title2 , Description:title , sendBy:userid , user: userDetail?._id })

    return res.status(200).json({
        success:true , 
        message:"Successfuly created" , 
        eventDetails 
    })

    }catch(error){
        return res.status(500).json({
            success:false , 
            message:error.message
        })
    }
}

exports.MyEvents = async(req ,res)=>{
    try{

const userEmail = req.user.email;

 const myevents = await Event.find({email:userEmail});

  return res.status(200).json({
    success:true ,
    myevents
  })
       

    }catch(error){
        return res.status(500).json({
            success:false , 
            message:error.message
        })
    }
}