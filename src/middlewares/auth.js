const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Token is not valid"); // Use `return` to stop further execution.
    }

    const decodeobj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeobj;

    console.log(_id);

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found"); // Return to prevent calling `next()` after sending a response.
    }

    req.user = user; // Attach the user object to the request.
    next(); // Proceed to the next middleware or route handler.
  } catch (err) {
    console.error(err); // Log the error for debugging purposes.
    return res.status(400).send("Something went wrong"); // Ensure a return here too.
  }
};

module.exports = {
  userAuth,
};
