import express from "express";
import passport from "passport";
import { validateToken } from "../middleware/auth.js";
import userController from "../contollers/user.controller.js";

const scope = {
  scope: ["profile", "email"],
};

const authRoutes = express.Router();
authRoutes.use(passport.initialize());
authRoutes.use(passport.session());

authRoutes.post("/register", userController.register);
authRoutes.post("/login", userController.login);
authRoutes.post("/loggedcheck", validateToken, userController.checkLogin);
authRoutes.get("/google", passport.authenticate("google", scope));
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", scope),
  userController.connectWithGoogle
);

export default authRoutes;
