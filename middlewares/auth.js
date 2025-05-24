const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Autoriser sans token pour certaines routes
  if (
    ((req.path === "/login" || req.path === "/loginEnfant") && req.method === "POST") ||
    (req.path === "/" && req.method === "POST")
  ) {
    return next(); // ne pas vérifier le token
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
