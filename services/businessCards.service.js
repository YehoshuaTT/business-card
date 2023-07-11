const BusinessCard = require("../models/businessCard.model");

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
}

module.exports = BusinessCardService;
