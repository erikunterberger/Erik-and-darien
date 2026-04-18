const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true
    },
    cardName: {
      type: String,
      required: true,
      trim: true
    },
    cardNumber: {
      type: String,
      required: true,
      trim: true
    },
    billingAddress: {
      type: String,
      required: true,
      trim: true
    },
    expDate: {
      type: String,
      required: true
    },
    cvv: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", billingSchema);