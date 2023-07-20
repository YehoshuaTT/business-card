const bcrypt = require("bcrypt");
const authService = require("../middleware/auth");

const User = require("../models/user.model");

class UserService {
  static async register(userInfo) {
    if (await User.findOne({ email: userInfo.email }, { email: 1, _id: 0 }))
      throw new Error("duplication error");

    return await User.create({
      ...userInfo,
      password: bcrypt.hashSync(userInfo.password, 10),
    });
  }

  static async login(userInfo) {
    const user = await User.findOne({ email: userInfo.email });
    if (!user) throw new Error("Not excist error");
    if (await bcrypt.compare(userInfo.password, user.password)) {
      let token = await authService.createToken(user.id);
      return { token, user };
    }
  }

  static async index() {
    return User.find({});
  }

  static async show(userId) {
    return User.findById(userId);
  }

  static async findByMail(email) {
    return User.findOne({ email: email });
  }

  static async create(userInfo) {
    return User.create({ userInfo });
  }

  static async update(userId, userInfo) {
    return User.findByIdAndUpdate(userId, { userInfo }, { new: true });
  }

  static async delete(userId) {
    return User.findOneAndDelete({ userId });
  }
}
module.exports = UserService;
