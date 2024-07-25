const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    pagesAllowed: [{
      type: String,
      trim: true,
    }],
    dashCode: {
      type: String,
      trim: true,
    },
    

  },
  { timestamps: true }
);

module.exports = mongoose.model("Dashboard", userSchema);
