require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const createToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: "10h" });
};
const validateToken = async (req, res, next) => {
  try {
    const cookie = req.cookies.userId;
    const user = jwt.verify(cookie, process.env.SECRET);
    req.user = await User.findById(user.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};

const findUserByToken = async (token) => {
  const reveal = jwt.verify(token, process.env.SECRET);
  return await User.findById(reveal.id);
};

module.exports = {
  createToken,
  validateToken,
  findUserByToken,
};
