const BusinessCard = require("../models/businessCard.model");
const path = require("path");

class BusinessCardService {
  static async index() {
    return BusinessCard.find({});
  }

  static async show(businessCardId, userId) {
    return BusinessCard.findOne({ _id: businessCardId, userId });
  }

  static async create(businessCard, userId) {
    return BusinessCard.create({ ...businessCard, userId });
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

  static async upload(image, userId) {
    const imagePath = path.join(
      __dirname,
      "..",
      "/public/images/",
      image.name + Date.now()
    );
    if (image.mv(imagePath)) return true;

    //TODO: update busnies card with image path
  }
}

module.exports = BusinessCardService;
