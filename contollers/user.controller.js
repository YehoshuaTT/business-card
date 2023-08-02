import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
import UserService from "../services/user.service.js";
import { createToken } from "../middleware/auth.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import generatePassword from "password-generator";

const UserSchema = z.object({
  firstName: z.string().require(true),
  lastName: z.string().require(true),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
    .require(true),
  email: z.email().require(true),
  id: z.string().require(false),
});

const user = {
  firstName: "josh",
  lastName: "tar",
  password: "dassd33F$#&*f1fd",
  email: "josh@email.com",
};
console.log(UserSchema.parse(user));

class UserController {
  static async register(req, res) {
    try {
      await UserService.register(req.body);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      if (err.message === "duplication error")
        res.status(400).send("user already exists in the system");
      else res.sendStatus(500);
    }
  }

  static async login(req, res) {
    try {
      const logged = await UserService.login(req.body);
      res.cookie("userId", logged.token);
      res.send({ user: logged.user.toObject() });
    } catch (err) {
      if (err.message === "Not exist error")
        res.status(401).send("Unauthorized");
      else res.sendStatus(500);
    }
  }

  static async checkLogin(req, res) {
    try {
      res.send(req.user);
    } catch (err) {
      res.sendStatus(500);
      console.log(err);
    }
  }

  static async connectWithGoogle(req, res) {
    try {
      const token = await createToken(req.user.id);
      res.cookie("userId", token);
      res.redirect("http://localhost:3000");
    } catch (err) {
      res.sendStatus(500);
      console.log(err);
    }
  }

  static setupGooglePassport() {
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      UserService.show(id).then((user) => {
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
            const currentUser = await UserService.findByMail(
              profile._json.email
            );

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
  }
}

UserController.setupGooglePassport();

export default UserController;
