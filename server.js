const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/products");
const CartItem = require("./models/CartItem");
const Billing = require("./models/billing");
const Shipping = require("./models/shipping");
const ReturnRequest = require("./models/returns");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* =========================
   PRODUCTS
========================= */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to get products." });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Failed to create product." });
  }
});

/* =========================
   CART / FAN SIGNUP
========================= */
app.get("/api/cart", async (req, res) => {
  try {
    const items = await CartItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to get cart items." });
  }
});

app.get("/api/cart/:id", async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found." });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to get cart item." });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const newItem = new CartItem({
      ...req.body,
      productName: "League Standard Magazine Subscription",
      quantity: 1,
      months: 1,
      total: 10,
      status: "Pending"
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to create cart item." });
  }
});

app.put("/api/cart/:id", async (req, res) => {
  try {
    const updated = await CartItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update cart item." });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.json({ message: "Cart item deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete cart item." });
  }
});

/* =========================
   BILLING
========================= */
app.get("/api/billing", async (req, res) => {
  try {
    const bills = await Billing.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Failed to get billing records." });
  }
});

app.post("/api/billing", async (req, res) => {
  try {
    const billing = new Billing(req.body);
    await billing.save();
    res.status(201).json(billing);
  } catch (err) {
    res.status(400).json({ message: "Failed to save billing info." });
  }
});

/* =========================
   SHIPPING
========================= */
app.get("/api/shipping", async (req, res) => {
  try {
    const shipping = await Shipping.find().sort({ createdAt: -1 });
    res.json(shipping);
  } catch (err) {
    res.status(500).json({ message: "Failed to get shipping records." });
  }
});

app.post("/api/shipping", async (req, res) => {
  try {
    const shipping = new Shipping(req.body);
    await shipping.save();
    res.status(201).json(shipping);
  } catch (err) {
    res.status(400).json({ message: "Failed to save shipping info." });
  }
});

/* =========================
   RETURNS
========================= */
app.get("/api/returns", async (req, res) => {
  try {
    const returns = await ReturnRequest.find().sort({ createdAt: -1 });
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Failed to get return records." });
  }
});

app.post("/api/returns", async (req, res) => {
  try {
    const returnRequest = new ReturnRequest(req.body);
    await returnRequest.save();
    res.status(201).json(returnRequest);
  } catch (err) {
    res.status(400).json({ message: "Failed to create return record." });
  }
});

/* =========================
   SUBSCRIPTION HELPERS
========================= */
app.get("/api/subscription/latest", async (req, res) => {
  try {
    const latest = await CartItem.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No subscription found." });
    }

    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: "Failed to get latest subscription." });
  }
});

app.put("/api/subscription/:id/activate", async (req, res) => {
  try {
    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { status: "Active", months: 1, total: 10 },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to activate subscription." });
  }
});

app.put("/api/subscription/:id/add-months", async (req, res) => {
  try {
    const monthsToAdd = Number(req.body.monthsToAdd);

    if (!monthsToAdd || monthsToAdd < 1) {
      return res.status(400).json({ message: "Months to add must be at least 1." });
    }

    const current = await CartItem.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    current.months += monthsToAdd;
    current.total += monthsToAdd * 10;
    current.status = "Active";

    await current.save();
    res.json(current);
  } catch (err) {
    res.status(400).json({ message: "Failed to add months." });
  }
});

app.put("/api/subscription/:id/cancel", async (req, res) => {
  try {
    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to cancel subscription." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});