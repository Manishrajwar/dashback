const User = require("../Models/Users");
const Timer = require("../Models/Timer");
const jwt = require("jsonwebtoken");
const Team = require("../Models/Team");
const { formatDateToDayMonthYear } = require("./commonFunc");

function generateRandomId(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

async function generateUniqueTeamId() {
  let uniqueId = generateRandomId();
  let exists = await Team.findOne({ teamId: uniqueId }).exec();

  while (exists) {
    uniqueId = generateRandomId();
    exists = await Team.findOne({ teamId: uniqueId }).exec();
  }

  return uniqueId;
}

async function generateUniqueTeamId2() {
  let uniqueId = generateRandomId();
  let exists = await User.findOne({ employeeCode: uniqueId }).exec();

  while (exists) {
    uniqueId = generateRandomId();
    exists = await Team.findOne({ employeeCode: uniqueId }).exec();
  }

  return uniqueId;
}

const checkUser = async (userId) => {
  const userDetail = await User.findOne({ _id: userId });

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
      userDetail = await User.findOne({ _id: userId }).populate("additionalDetails").populate("timerDetail");

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
    const {  clockIn  , Note } = req.body;

    if (!clockIn) {
      return res.status(204).json({
        status: false,
        message: "please send the Require data",
      });
    }

    const userId = req.user.id;

    const userDetail = await checkUser(userId);

    const respDate = await formatDateToDayMonthYear(Date.now());
    const currentTime = new Date(); 

    const timerdetails = await Timer.create({
      User: userDetail?._id,
      clockIn: clockIn,
      Note,  
      clockInTime:currentTime , 
      date:respDate
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

exports.UpdateTimerStatus = async (req, res) => {
  try {
    const { timerId, status } = req.body;
    
    if (status === "break") {
      const currentTime = new Date(); 
      const timerDetail = await Timer.findByIdAndUpdate(
        timerId,
        {
          status: status,
          breakIn: currentTime, 
        },
        { new: true }
      );


      return res.status(200).json({
        status: true,
        data: timerDetail,
      });
    }
    else {
      const currentTime = new Date(); 
      const timerDetail = await Timer.findByIdAndUpdate(
        timerId,
        {
          status: status,
          breakOut: currentTime, 
        },
        { new: true }
      );


      return res.status(200).json({
        status: true,
        data: timerDetail,
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

exports.ClockOutHandler = async (req, res) => {
  try {
    const { timerId } = req.body;
    const userId = req.user.id;
    const currentTime = new Date(); 

    const userDetail = await User.findById(userId);
    userDetail.isClockIn = false;
    userDetail.timerDetail = null;
    await userDetail.save();

    const timerDetail = await Timer.findByIdAndUpdate(
      timerId,
      {
        clockOut: currentTime,
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      data: timerDetail,
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

exports.CreateAdminTeamId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ThreeLetter, dashboardAllow, teamName } = req.body;

    if (!ThreeLetter || !dashboardAllow || !teamName) {
      return res.status(400).json({
        success: false,
        message: "Insufficent data",
      });
    }
    const uniqueTeamId = await generateUniqueTeamId();

    const newTeam = new Team({
      teamName: teamName,
      teamId: `${ThreeLetter}${uniqueTeamId}`,
      ThreeLetter: ThreeLetter,
      dashboardAllow: dashboardAllow,
      Admin: userId,
    });

    const userDetail = await User.findById(userId);
    userDetail.teamId = `${ThreeLetter}${uniqueTeamId}`;
    userDetail.dashboardAllow = dashboardAllow;
    userDetail.team = newTeam?._id;
    await userDetail.save();

    await newTeam.save();

    return res.status(201).json({
      status: 201,
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
exports.EditAdminTeam = async (req, res) => {
  try {
    const { teamId, dashboardAllow, teamName } = req.body;

    if (!dashboardAllow || !teamName) {
      return res.status(400).json({
        success: false,
        message: "Insufficent data",
      });
    }

    const teamDtail = await Team.findById(teamId);
    teamDtail.dashboardAllow = dashboardAllow;
    teamDtail.teamName = teamName;

    await teamDtail.save();

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: teamDtail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.GetTeamDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const teamDetails = await Team.findOne({ Admin: userId }).populate(
      "Members"
    );
    if (!teamDetails) {
      return res.status(201).json({
        success: false,
        message: "Team Not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: teamDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.CreateTeamMember = async (req, res) => {
  try {
    const userId = req.user.id;

    const { email, fullName, ContactNumber } = req.body;

    if (!email || !fullName || !ContactNumber) {
      return res.status(400).json({
        success: false,
        message: "Insuffcient data",
      });
    }

    const isEmailExist = await User.findOne({ email: email });

    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email is Already Registered",
      });
    }

    const uniqueTeamId = await generateUniqueTeamId2();

    const teamDetail = await Team.findOne({ Admin: userId });

    if (!teamDetail) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }
    let employeeCode = `${teamDetail.ThreeLetter}${uniqueTeamId}`;

    const userCreate = await User.create({
      fullName: fullName,
      email: email,
      password: "",
      accountType: "Employee",
      teamId: teamDetail?.teamId,
      team: teamDetail?._id,
      employeeCode: employeeCode,
    });

    teamDetail.Members.push(userCreate?._id);
    await teamDetail.save();

    return res.status(200).json({
      success: true,
      message: "Successfuly Created User",
      userCreate,
      teamDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

exports.EditMember = async (req, res) => {
  try {
    const { fullName, dashboardAllow, email, employeeCode, _id } = req.body;

    const findMem = await User.findById(_id);
    if (!findMem) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    findMem.fullName = fullName;
    findMem.dashboardAllow = dashboardAllow;
    findMem.email = email;
    findMem.employeeCode = employeeCode;

    await findMem.save();

    return res.status(200).json({
      success: true,
      message: "Successfuly done",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};


exports.ClockInDetails = async (req, res) => {
  try {
    const { date } = req.body;
    const userId = req.user.id;

    const data = await Timer.find({ User: userId , date:date });

     return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.log("error",error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


