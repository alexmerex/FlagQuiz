const jwt = require("jsonwebtoken");

function createToken(user, secret) {
  return jwt.sign({ sub: user.id, username: user.username }, secret, { expiresIn: "7d", issuer: "flag-quiz" });
}

function authMiddleware(secret) {
  return (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Bạn cần đăng nhập để tiếp tục." });
    try { req.auth = jwt.verify(token, secret, { issuer: "flag-quiz" }); next(); }
    catch { res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." }); }
  };
}

module.exports = { createToken, authMiddleware };
