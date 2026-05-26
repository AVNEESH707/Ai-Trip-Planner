const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripTitle: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String },
    highlights: [String],
    days: { type: Array, default: [] },
    localTips: [String],
    packingEssentials: [String],
    bestTimeToVisit: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);