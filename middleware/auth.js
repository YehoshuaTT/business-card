import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: "10h" });
};

const validateToken = async (req, res, next) => {
  try {
    const cookie = req.cookies.userId;
    const user = jwt.verify(cookie, process.env.SECRET);
    req.user = user;

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

export { createToken, validateToken, findUserByToken };
