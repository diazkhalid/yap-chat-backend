const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.payload = payload;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ status: 403, message: "Forbidden" });
  }
};

module.exports = AuthMiddleware;
