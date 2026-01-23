const router = require("express").Router();
const { ObjectId } = require("mongodb");
const { getDb } = require("../lib/db");
const { authMiddleware } = require("../lib/auth");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.userId) }, { projection: { passwordHash: 0 } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (e) { res.status(500).json({ message: e.message || "Server error" }); }
});

module.exports = router;
