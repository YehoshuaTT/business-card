const VisitCard = require("../models/visitCard.model");

class VisitCardService {
  static async index(userId) {
    return VisitCard.find({ userId });
  }

  static async show(visitCardId, userId) {
    return VisitCard.findOne({ _id: visitCardId, userId });
  }

  static async create(visitCard, userId) {
    return VisitCard.create({ ...visitCard, userId });
  }

  static async update(visitCardId, userId, visitCard) {
    return VisitCard.findOneAndUpdate(
      { _id: visitCardId, userId: userId },
      { ...visitCard },
      { new: true }
    );
  }

  static async delete(visitCardId, userId) {
    return VisitCard.findOneAndDelete({ _id: visitCardId, userId });
  }
}

module.exports = VisitCardService;
