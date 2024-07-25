// !   sendOTP
// const OTP = require("../models/OTP");
const User = require("../Models/user");
// const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../Models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const mailSender = require("../utils/mailSender");


//! signup

exports.AdminSignup = async (req, res) => {
  try {
    const {
      email,
      password,
   
    } = req.body;

    console.log("email ",email , password);
    if (
    
      !password ||
      !email
    ) {
      return res.status(403).json({
        success: false,
        message: "all field are require",
      });
    }

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user is alreay registered",
      });
    }


    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

  

    const user = await User.create({
    
      email,
      password: hashedPassword,
      accountType:"Admin",
    });
    console.log("user ",user);

    // return res
    return res.status(200).json({
      success: true,
      message: `user is registered successfullly`,
      user,
    });
  } catch (error) {
    console.log(`error in signup `, error);
    return res.status(500).json({
      success: false,
      message: "user cannot be register please try again",
    });
  }
};


// !login
exports.TrailLogin = async (req, res) => {
  try {
  
    const payload = {
      email: "trailemail@gmail.com",
      accountType: "Trail",
    };

   
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // todo: toObject ki jrurt ho skti hai fat skta hai
      let user = {};
      user.token = token;
      user.name = "Trail User";
       user.email = "trailemail@gmail.com";

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `login successfully`,
      });
   
  } catch (error) {
    console.log(`error in login `, error);
    return res.status().json({
      success: false,
      message: ` login failure , please try again `,
    });
  }
};
