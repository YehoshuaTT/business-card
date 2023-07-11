const mongoose = require("mongoose");
const { Schema } = mongoose;

const VisitCardSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    BuissnessType: {
      type: String,
      required: true,
    },
    webURL: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VisitCard = mongoose.model("VisitCard", VisitCardSchema);

module.exports = VisitCard;
