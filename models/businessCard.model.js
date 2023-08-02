import mongoose from "mongoose";
const { Schema } = mongoose;

const BusinessCardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    webURL: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const BusinessCard = mongoose.model("BusinessCard", BusinessCardSchema);

export default BusinessCard;
