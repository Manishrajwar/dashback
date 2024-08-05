// !   sendOTP
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();

//! signup


exports.AdminLogin = async (req, res) => {
  try {
    //  get data from req.body
    const { email, password } = req.body;

    //  validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required ,please try again`,
      });
    }
    // user check exist of not
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `please register before login`,
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    // password match and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      //  creating token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // todo: toObject ki jrurt ho skti hai fat skta hai
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      console.log('token',token);
      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `login successfully`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `password inccorrect`,
      });
    }
  } catch (error) {
    console.log(`error in login `, error);
    return res.status().json({
      success: false,
      message: ` login failure , please try again `,
    });
  }
};

exports.EmployeeLogin = async (req, res) => {
  try {
    //  get data from req.body
    const { employeeCode, password } = req.body;

    //  validation data
    if (!employeeCode || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required ,please try again`,
      });
    }
    
     const user = await User.findOne({employeeCode:employeeCode});
     
   if(!user){
    return res.status(404).json({
      success:false ,
      message:"No Employee found"
    })
   }

    const passExist =user?.password;

       // password exist 
       const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };


     if(passExist === ""){
      const hashedPassword = await bcrypt.hash(password, 10);
     user.password = hashedPassword;
     user.active = true;
    await user.save();

     }
     else {
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          success: false,
          message: `password inccorrect`,
        });
      } 
     }

     const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // todo: toObject ki jrurt ho skti hai fat skta hai
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

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

exports.AdminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
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
      accountType: "Admin",
    });

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
