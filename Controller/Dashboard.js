const User = require("../Models/user");
const Timer = require("../Models/Timer");
const jwt = require("jsonwebtoken");


const checkUser = async (userId) => {
  const userDetail = await User.findOne({ _id: userId })
    .populate("additionalDetails")
    .populate("timerDetail");

  if (!userDetail) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  return userDetail;
};

exports.GetUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const accountType = req.user.accountType;
    let userDetail;

    if (accountType === "Trail") {
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
    } else {
      userDetail = await User.findOne({ _id: userId }).populate(
        "additionalDetails"
      );

      if (!userDetail) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        data: userDetail,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.UserClockIn = async (req, res) => {
  try {
    const { clockIn, Note } = req.body;

    if (!clockIn) {
      return res.status(204).json({
        status: false,
        message: "please send the Require data",
      });
    }

    const userId = req.user.id;

    const userDetail = await checkUser(userId);

    const timerdetails = await Timer.create({
      User: userDetail?._id,
      clockIn: clockIn,
      Note,
    });

    userDetail.isClockIn = true;
    userDetail.timerDetail = timerdetails?._id;
    await userDetail.save();

    return res.status(200).json({
      status: true,
      data: userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.UserBreakUpdate = async (req, res) => {
  try {
    const { breakIn, breakOut, timerId, totalBreak } = req.body;
    const userId = req.user.id;
    const userDetail = await checkUser(userId);
    const timerDetails = await Timer.findById(timerId);

    if (breakOut) {
      timerDetails.breakOut = breakOut;
      timerDetails.totalBreak = totalBreak;
      await timerDetails.save();
    } else {
      timerDetails.breakIn = breakIn;
      await timerDetails.save();
    }

    return res.status(200).json({
      status: true,
      data: timerDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.UserClockOut = async (req, res) => {
  try {
    const { clockOut, timerId } = req.body;

    if (!clockOut) {
      return res.status(204).json({
        status: false,
        message: "please send the Require data",
      });
    }

    const userId = req.user.id;

    const userDetail = await checkUser(userId);

    const timerdetails = await Timer.findById(timerId);

    timerdetails.clockOut = clockOut;

    userDetail.isClockIn = false;
    userDetail.timerDetail = null;
    await userDetail.save();

    return res.status(200).json({
      status: true,
      data: userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

// exports.GetUserDetails =async(req ,res)=>{
//     try{

//     } catch(error){
//         console.log(error);
//         return res.status(500).json({
//             status: 500 ,
//             message:error.message
//         })
//     }
// }
