const express = require("express");
const auth = require("../middleware/auth");
const authController = require("../contollers/auth.controller");
const authRoutes = express.Router();

authRoutes.post("/", auth.validateToken);
authRoutes.post("/register", authController.register);

authRoutes.post(
  "/google/:credential",
  auth.GoogleCredential,
  authController.connectWithGoogle
);
// authRoutes.post("/google/:credential", authController.GoogleCredential);
authRoutes.post("/login", authController.login);
authRoutes.post("/loggedcheck", auth.validateToken, authController.checkLogin);

module.exports = authRoutes;
