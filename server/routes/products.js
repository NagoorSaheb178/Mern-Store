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

  try {
    const db = await getDb();
    const productId = new ObjectId(req.params.id);

    // 1. Find the product first to diagnose the issue
    const product = await db.collection("products").findOne({ _id: productId });

    if (!product) {
      console.warn("Update failed: Product not found", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check ownership (Handle both string and ObjectId comparison)
    const ownerId = product.userId?.toString();
    if (ownerId !== req.user.userId) {
      console.warn("Update failed: Unauthorized", { productOwner: ownerId, requester: req.user.userId });
      return res.status(403).json({ message: "Unauthorized to update this product" });
    }

    // 3. Perform the update
    const u = await db.collection("products").findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          title, price: Number(price), description: description || "", category: category || "general",
          imageUrl: imageUrl || "", imageBase64: imageBase64 || "", updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    res.json({ ...u, _id: u._id.toString() });
  } catch (err) {
    console.error("PUT Product Error:", err.message);
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const productId = new ObjectId(req.params.id);
    const product = await db.collection("products").findOne({ _id: productId });

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowed = ["title", "price", "description", "category", "imageUrl", "imageBase64"];
    const set = {};
    for (const k of allowed) if (req.body[k] !== undefined) set[k] = k === "price" ? Number(req.body[k]) : req.body[k];
    set.updatedAt = new Date();

    const u = await db.collection("products").findOneAndUpdate(
      { _id: productId },
      { $set: set },
      { returnDocument: "after" }
    );

    res.json({ ...u, _id: u._id.toString() });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
