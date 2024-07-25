const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", userSchema);
