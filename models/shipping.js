const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ""
    },
    deliveryMethod: {
      type: String,
      required: true
    },
    mailingAddress: {
      type: String,
      default: ""
    },
    gmailDelivery: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);