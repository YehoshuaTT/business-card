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
    console.log(user);
    return BusinessCard.create({
      ...businessCard,
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.firstName + " " + user.lastName,
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

    //TODO: update busnies card with image path
  }
}

module.exports = BusinessCardService;
