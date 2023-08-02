import BusinessCard from "../models/businessCard.model.js";
import path from "path";
class BusinessCardService {
  static async index() {
    return BusinessCard.find({});
  }

  static async show(businessCardId, userId) {
    return BusinessCard.findOne({ _id: businessCardId, userId });
  }

  static async create(businessCard, user) {
    return BusinessCard.create({
      ...businessCard,
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.firstName + " The User",
    });
  }

  static async update(businessCardId, userId, updates) {
    return BusinessCard.findOneAndUpdate(
      { _id: businessCardId, userId },
      { ...updates },
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

export default BusinessCardService;
