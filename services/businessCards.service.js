const BusinessCard = require("../models/businessCard.model");
const path = require("path");
const User = require("../models/user.model");

class BusinessCardService {
  static async index() {
    return BusinessCard.find({});
  }

  static async show(businessCardId, userId) {
    return BusinessCard.findOne({ _id: businessCardId, userId });
  }

  static async create(businessCard, userId) {
    const user = await User.findById(userId);
    return BusinessCard.create({
      ...businessCard,
      userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.firstName + " The User",
    });
  }

  static async update(businessCardId, userId, businessCard) {
    return BusinessCard.findOneAndUpdate(
      { _id: businessCardId, userId },
      { ...businessCard },
      { new: true }
    );
  }

  static async delete(businessCardId, userId) {
    return BusinessCard.findOneAndDelete({ _id: businessCardId, userId });
  }

  static async upload(image) {
    const imageName = "/images/" + Date.now() + image.name;
    if (image.mv(path.join(__dirname, "..", "/public", imageName)))
      return imageName;
  }
}

module.exports = BusinessCardService;
