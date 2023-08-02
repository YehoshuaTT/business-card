import bcrypt from "bcrypt";
import { createToken } from "../middleware/auth.js";
import User from "../models/user.model.js";

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
      let token = await createToken(user.id);
      return { token, user };
    } else throw new Error("Not excist error");
  }

  static async index() {
    return User.find({});
  }

  static async show(userId) {
    return await User.findById(userId);
  }

  static async findByMail(email) {
    return User.findOne({ email: email });
  }

  static async update(userId, userInfo) {
    return User.findByIdAndUpdate(userId, { ...userInfo }, { new: true });
  }

  static async delete(userId) {
    return User.findByIdAndDelete(userId);
  }
}
export default UserService;
