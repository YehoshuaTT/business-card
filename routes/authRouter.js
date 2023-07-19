const express = require("express");
const passport = require("passport");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const generatePassword = require("password-generator");
const authController = require("../contollers/auth.controller");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserService = require("../services/user.service");

const authRoutes = express.Router();
const scope = {
  scope: ["profile", "email"],
};

authRoutes.use(passport.initialize());
authRoutes.use(passport.session());

authRoutes.post("/", auth.validateToken);
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/loggedcheck", auth.validateToken, authController.checkLogin);
authRoutes.post("/google");
authRoutes.get("/google", passport.authenticate("google", scope));
authRoutes.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.connectWithGoogle
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({ email: profile._json.email });

        if (currentUser) {
          done(null, currentUser);
        } else {
          const userInfo = {
            googleId: profile.id,
            email: profile._json.email,
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            password: generatePassword(),
          };
          const newUser = await UserService.register(userInfo);
          done(null, newUser);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = authRoutes;
