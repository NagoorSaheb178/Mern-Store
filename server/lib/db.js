const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI or MONGO_URI in environment");

  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10
    });

    await client.connect();
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    console.log("Connected to MongoDB successfully");
    return db;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
}

module.exports = { getDb };
