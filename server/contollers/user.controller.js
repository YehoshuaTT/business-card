const UserService = require("../services/user.service");
const authService = require("../middleware/auth");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const generatePassword = require("password-generator");
const { z } = require("zod");

const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/),
  email: z.string().email(),
  id: z.string().optional(),
});

class UserController {
  static async register(req, res) {
    try {
      const zodCheck = RegisterSchema.safeParse(req.body);
      if (zodCheck.success) {
        await UserService.register(req.body);
        res.sendStatus(200);
      } else res.status(400).send(zodCheck.error);
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
      // console.log(err);
      res.sendStatus(500);
    }
  }

  static async connectWithGoogle(req, res) {
    try {
      const token = await authService.createToken(req.user.id);
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

module.exports = UserController;
