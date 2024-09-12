const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
    },
  teams:[
  {
    type: mongoose.Schema.Types.ObjectId , 
    ref: "Team",
  },
  ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
