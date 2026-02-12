import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  try {
    // get authorization header
    const authHeader = req.headers.authorization;

    // check header existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user data to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // allow request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
