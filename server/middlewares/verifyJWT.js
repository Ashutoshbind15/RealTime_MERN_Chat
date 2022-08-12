const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization || req.headers.Authorization;

    const jwtToken = authHeaders.split(" ")[1];

    await jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decode) => {
      if (err) return res.sendStatus(401);

      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorised" });
  }
};

module.exports = verifyJWT;
