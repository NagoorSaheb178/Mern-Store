const jwt = require("jsonwebtoken");

function signToken(payload) {
  const secret = process.env.JWT_SECRET || "default_super_secret_nexus_store_key";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const secret = process.env.JWT_SECRET || "default_super_secret_nexus_store_key";
    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { signToken, authMiddleware };
