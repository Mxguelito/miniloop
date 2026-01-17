
import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, "miniloop_secret");

    req.user = decoded; // { id, role, email }

    next();

  } catch (err) {
    console.log("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
