const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      trim: true,
    },
    month: {
      type: Number,
      trim: true,
    },
    date: {
      type: Number,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    meetLink: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
