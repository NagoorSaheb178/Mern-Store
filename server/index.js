const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // for base64 images

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Health check or base API route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Serverless API is running." });
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log("Server running on port", port));
}

module.exports = app;
