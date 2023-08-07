const BusinessCard = require("../models/businessCard.model");
const BusinessCardService = require("../services/businessCards.service");
const { promises: fsPromises } = require("fs");

describe("BusinessCard service", () => {
  describe("indexCards service", () => {
    jest
      .spyOn(BusinessCard, "find")
      .mockReturnValueOnce(
        { username: "username", image: "imageAddress" },
        { username: "username2", image: "imageAddress2" }
      );

    it("should return all cards", async () => {
      const allcards = await BusinessCardService.index();
      expect(typeof allcards).toBe("object");
    });

    it("if no cards it should return an empty object", async () => {
      jest.spyOn(BusinessCard, "find").mockReturnValueOnce({});
      const allcards = await BusinessCardService.index();

      expect(typeof allcards).toBe("object");
      expect(Object.keys(allcards)).toHaveLength(0);
    });
  });

  describe("showCard service", () => {
    it("should accept cardId, userId and return user Object if exict", async () => {
      jest
        .spyOn(BusinessCard, "findOne")
        .mockReturnValueOnce({ username: "username", image: "imageAddress" });

      const card = BusinessCard.findOne();
      expect(BusinessCard.findOne).toHaveBeenCalled();
      expect(typeof card).toBe("object");
    });
  });

  describe("createCard service", () => {
    it("will accept cardInfo & user, and return a card", async () => {
      jest.spyOn(BusinessCard, "create").mockReturnValueOnce(
        new BusinessCard({
          businessType: "businessType",
          phoneNumber: 755555555,
          webURL: "www.website.com",
          email: "user@gmail.com",
          firstName: "firstName",
          lastName: "lastName",
          userId: "sjfhslhfsfdkjd",
          username: "firstname The User",
        })
      );

      const newCard = await BusinessCardService.create(
        {
          businessType: "businessType",
          phoneNumber: 755555555,
          webURL: "www.website.com",
        },
        {
          email: "user@gmail.com",
          firstName: "firstName",
          lastName: "lastName",
          id: "sjfhslhfsfdkjd",
        }
      );

      expect(newCard).toHaveProperty("_id");
      expect(typeof newCard).toBe("object");
      expect(BusinessCard.create).toHaveBeenCalledWith({
        businessType: "businessType",
        phoneNumber: 755555555,
        webURL: "www.website.com",
        email: "user@gmail.com",
        firstName: "firstName",
        lastName: "lastName",
        userId: "sjfhslhfsfdkjd",
        username: "firstName The User",
      });
    });
  });

  describe("updateCard service", () => {
    it("will accept businessCardId, userId, businessCard and return the updated card", async () => {
      jest
        .spyOn(BusinessCard, "findOneAndUpdate")
        .mockImplementationOnce(({ _id, userId }, updates) => {
          const card = {
            businessType: "businessType",
            phoneNumber: 755555555,
            webURL: "www.website.com",
            email: "user@gmail.com",
            firstName: "firstName",
            lastName: "lastName",
            userId: userId,
            username: "firstname The User",
            _id: _id,
            ...updates,
          };
          const result = {
            ...card,
            ...updates,
          };
          return result;
        });

      const updatedCard = await BusinessCardService.update("cardId", "userId", {
        email: "update@mail.com",
      });

      expect(updatedCard.email).toBe("update@mail.com");
    });
  });

  describe("deleteCard service", () => {
    it("will accept businessCardId, userId, and return the result attempt", async () => {
      jest.spyOn(BusinessCard, "findOne").mockReturnValue({
        _id: "cardId",
        userId: "userId",
        image: "imagePath",
      });
      jest
        .spyOn(BusinessCard, "findOneAndDelete")
        .mockReturnValue({ delete: "success" });
      jest
        .spyOn(BusinessCardService, "deleteImage")
        .mockImplementationOnce((prop) => prop);

      const deleted = await BusinessCardService.delete("cardId", "userId");

      expect(BusinessCard.findOne).toHaveBeenCalledWith({
        _id: "cardId",
        userId: "userId",
      });
      expect(BusinessCardService.deleteImage).toHaveBeenCalledWith("imagePath");
      expect(deleted).toEqual({ delete: "success" });
    });
  });

  describe("uploadfile service", () => {
    it("should return the image path if it is successfully moved", async () => {
      const image = {
        name: "test-image.jpg",
        data: "mock image data",
      };
      jest
        .spyOn(fsPromises, "writeFile")
        .mockImplementationOnce((prop) => prop);
      const result = await BusinessCardService.upload(image);

      expect(result).toMatch(/^\/images\/\d+test-image.jpg$/);
      expect(fsPromises.writeFile).toHaveBeenCalled();
    });

    it("should return undefined if the image cannot be moved", async () => {
      const image = {
        name: "test-image.jpg",
        data: "mock image data",
      };

      fsPromises.writeFile.mockRejectedValue(
        new Error("Mocked writeFile error")
      );

      const result = await BusinessCardService.upload(image);

      expect(result).toBeNull();
      expect(fsPromises.writeFile).toHaveBeenCalled();
    });
  });
});
