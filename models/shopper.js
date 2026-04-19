const mongoose = require("mongoose");

const shopperSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      default: ""
    },
    favoriteTeam: {
      type: String,
      default: ""
    }
  },
  { timestamps: true, collection: "shopper" }
);

module.exports = mongoose.model("Shopper", shopperSchema);