const BusinessCard = require("../models/businessCard.model");
const path = require("path");
const { promises: fsPromises } = require("fs");

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
      username: "Name: " + businessCard.businessType,
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
    const card = await BusinessCard.findOne({ _id: businessCardId, userId });
    this.deleteImage(card.image);
    return BusinessCard.findOneAndDelete({ _id: businessCardId, userId });
  }

  static async deleteImage(imagePath) {
    try {
      const fullPath = path.join(__dirname, "..", "/public", imagePath);
      await fsPromises.unlink(fullPath);
    } catch (error) {
      console.error("Error deleting the image:", error);
    }
  }

  static async upload(image) {
    const imageName = "/images/" + Date.now() + image.name;
    const imagePath = path.join(__dirname, "..", "public", imageName);
    try {
      await fsPromises.writeFile(imagePath, image.data);
      return imageName;
    } catch (error) {
      console.error("Error uploading the image:", error);
      return null;
    }
  }
}

module.exports = BusinessCardService;
