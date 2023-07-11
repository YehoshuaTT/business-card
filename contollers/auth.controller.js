const UserService = require("../services/user.service");

class UserClass {
  static async register(req, res) {
    try {
      await UserService.register(req.body);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      if (err.message === "duplication error")
        res.status(400).send("email already exists in the system");
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
      res.sendStatus(500);
    }
  }
}
module.exports = UserClass;
