const { MongoClient } = require("mongodb");
let client;
async function getDb() {
  if (client) return client.db();
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI or MONGO_URI");
  client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB successfully");
  return client.db();
}
module.exports = { getDb };
