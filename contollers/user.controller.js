const UserService = require("../services/user.service");
const authService = require("../middleware/auth");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const generatePassword = require("password-generator");

class UserClass {
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

  static async connectWithGoogle(req, res) {
    try {
      const token = await authService.createToken(req.user.id);
      res.cookie("userId", token);
      res.cookie("user", req.user.toObject());
      res.redirect("http://localhost:3000");
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
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
      console.log(err);
      res.status(401).send("Unauthorized");
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

UserClass.setupGooglePassport();

module.exports = UserClass;