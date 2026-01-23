const router = require("express").Router();
const { ObjectId } = require("mongodb");
const { getDb } = require("../lib/db");
const { authMiddleware } = require("../lib/auth");

router.get("/", authMiddleware, async (req, res) => {
  const db = await getDb();
  const list = await db.collection("products")
    .find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(list.map(p => ({ ...p, _id: p._id.toString() })));
});

router.get("/category/:category", authMiddleware, async (req, res) => {
  const db = await getDb();
  const list = await db.collection("products")
    .find({ userId: req.user.userId, category: req.params.category })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(list.map(p => ({ ...p, _id: p._id.toString() })));
});

router.get("/:id", authMiddleware, async (req, res) => {
  const db = await getDb();
  const p = await db.collection("products").findOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.userId
  });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ ...p, _id: p._id.toString() });
});

router.post("/", authMiddleware, async (req, res) => {
  const { title, price, description, category, imageUrl, imageBase64 } = req.body || {};
  if (!title || price == null) return res.status(400).json({ message: "Title and price are required" });
  const db = await getDb();
  const doc = {
    userId: req.user.userId,
    title,
    price: Number(price),
    description: description || "",
    category: category || "general",
    imageUrl: imageUrl || "",
    imageBase64: imageBase64 || "",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const r = await db.collection("products").insertOne(doc);
  res.status(201).json({ ...doc, _id: r.insertedId.toString() });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const db = await getDb();
  const r = await db.collection("products").deleteOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.userId
  });
  if (!r.deletedCount) return res.status(404).json({ message: "Product not found or unauthorized" });
  res.json({ success: true });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { title, price, description, category, imageUrl, imageBase64 } = req.body || {};
  if (!title || price == null) return res.status(400).json({ message: "Title and price are required" });
  const db = await getDb();
  const u = await db.collection("products").findOneAndUpdate(
    { _id: new ObjectId(req.params.id), userId: req.user.userId },
    {
      $set: {
        title, price: Number(price), description: description || "", category: category || "general",
        imageUrl: imageUrl || "", imageBase64: imageBase64 || "", updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );
  if (!u.value) return res.status(404).json({ message: "Product not found or unauthorized" });
  res.json({ ...u.value, _id: u.value._id.toString() });
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const allowed = ["title", "price", "description", "category", "imageUrl", "imageBase64"];
  const set = {};
  for (const k of allowed) if (req.body[k] !== undefined) set[k] = k === "price" ? Number(req.body[k]) : req.body[k];
  set.updatedAt = new Date();
  const db = await getDb();
  const u = await db.collection("products").findOneAndUpdate(
    { _id: new ObjectId(req.params.id), userId: req.user.userId },
    { $set: set },
    { returnDocument: "after" }
  );
  if (!u.value) return res.status(404).json({ message: "Product not found or unauthorized" });
  res.json({ ...u.value, _id: u.value._id.toString() });
});

module.exports = router;
