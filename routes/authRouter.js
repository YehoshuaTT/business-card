const express = require("express");
const passport = require("passport");
const auth = require("../middleware/auth");
const authController = require("../contollers/user.controller");
const scope = {
  scope: ["profile", "email"],
};

const authRoutes = express.Router();

authRoutes.use(passport.initialize());
authRoutes.use(passport.session());

authRoutes.post("/", auth.validateToken);
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/loggedcheck", auth.validateToken, authController.checkLogin);
authRoutes.get("/google", passport.authenticate("google", scope));
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", scope),
  authController.connectWithGoogle
);

module.exports = authRoutes;
