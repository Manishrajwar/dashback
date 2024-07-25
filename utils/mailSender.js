// const otpTemplate  = require("../mail/template/emailVerificationTemplate")
  const nodemailer = require("nodemailer");
  require("dotenv").config();

  const mailSender = async(email , title , body)=>{
    try{
       let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
       })


       let info = await transporter.sendMail({
        from: 'studyNotion || codeHelp - by babbar',
        to: `${email}`,
        subject: `${title}`,
        html:`${(body)}`
       })

       console.log("this is email send info ",info);
       return info;
    }
     catch(error){
        console.log(error);

     }
  }

 module.exports = mailSender;