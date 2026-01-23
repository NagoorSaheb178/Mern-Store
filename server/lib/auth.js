const jwt = require("jsonwebtoken");

function signToken(payload) {
  const secret = process.env.JWT_SECRET || "default_super_secret_nexus_store_key";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (!auth) return res.status(401).json({ message: "Unauthorized: No token provided" });
  if (type !== "Bearer" || !token) return res.status(401).json({ message: "Unauthorized: Invalid token format" });

  try {
    const secret = process.env.JWT_SECRET || "default_super_secret_nexus_store_key";
    req.user = jwt.verify(token, secret);
    return next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}

module.exports = { signToken, authMiddleware };
