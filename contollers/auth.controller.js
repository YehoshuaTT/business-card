const UserService = require("../services/user.service");
const authService = require("../middleware/auth");
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
      let user = await UserService.findByMail(req.body.email);
      let token;
      if (user) {
        token = await authService.createToken(user.id);
      } else {
        req.body.password = generatePassword();
        user = await UserService.register(req.body);
      }
      res.cookie("userId", token);
      res.send({ user: user.toObject() });
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
