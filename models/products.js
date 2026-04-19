const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "Magazine"
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true, collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);