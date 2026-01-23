const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDb } = require("../lib/db");
const { signToken } = require("../lib/auth");

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const db = await getDb();
    const users = db.collection("users");
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = {
      email: email.toLowerCase(),
      username: email.toLowerCase(), // Use email as username to satisfy unique index
      name: name || "User",
      passwordHash,
      createdAt: new Date()
    };
    const result = await users.insertOne(doc);

    const token = signToken({ userId: result.insertedId.toString(), email: doc.email });
    res.status(201).json({
      token,
      user: {
        id: result.insertedId.toString(),
        email: doc.email,
        username: doc.username,
        name: doc.name
      }
    });
  } catch (e) {
    console.error("Signup Error:", e.message);
    res.status(500).json({ message: e.message || "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    console.log("Login attempt for:", email);
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      console.warn("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.warn("Login failed: Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });
    console.log("Login successful, token generated");

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username || user.email,
        name: user.name
      }
    });
  } catch (e) {
    console.error("Login Error:", e.message);
    res.status(500).json({ message: e.message || "Server error" });
  }
});

module.exports = router;
