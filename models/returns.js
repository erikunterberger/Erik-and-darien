const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Submitted"
    }
  },
  { timestamps: true, collection: "returns" }
);

module.exports = mongoose.model("ReturnRequest", returnSchema);