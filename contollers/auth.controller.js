const UserService = require("../services/user.service");
const authService = require("../middleware/auth");
const passport = require("passport");

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
      if (err.message === "Not excist error")
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
}
module.exports = UserClass;
