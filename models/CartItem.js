const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
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
    signupDate: {
      type: String,
      required: true
    },
    favoriteTeam: {
      type: String,
      required: true
    },
    playersTrack: {
      type: String,
      default: ""
    },
    productName: {
      type: String,
      default: "League Standard Magazine Subscription"
    },
    quantity: {
      type: Number,
      default: 1
    },
    months: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 10
    },
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", cartItemSchema);