const jwt = require("jsonwebtoken");

//middleware

function verifyToken(req, res, next) {
  if (req.headers.authorization !== undefined) {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "nutrify", (err, data) => {
      if (!err) {
        next();
      } else {
        res.status(403).send({ message: "Invalid token" });
      }
    });
  } else {
    res.send({ message: "Please send auth token" });
  }
}

module.exports = verifyToken;
