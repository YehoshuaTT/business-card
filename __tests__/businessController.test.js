import BusinessCardsController from "../contollers/businessCards.controller.js";
import BusinessCardService from "../services/businessCards.service.js";

describe("BusinessCard controller", () => {
  describe("indexCard controller", () => {
    const req = {};
    const res = {
      sendStatus: jest.fn(),
      send: jest.fn(),
    };

    it("will accept nothing, & return all business cards", async () => {
      jest
        .spyOn(BusinessCardService, "index")
        .mockReturnValueOnce({ cardA: "cardA", cardB: "cardB" });
      await BusinessCardsController.index(req, res);
      expect(BusinessCardService.index).toHaveBeenCalledWith();
      expect(res.send).toHaveBeenCalledWith({ cardA: "cardA", cardB: "cardB" });
    });
    it("will throw 500 on failed attempt", async () => {
      jest
        .spyOn(BusinessCardService, "index")
        .mockRejectedValueOnce(new Error());
      await BusinessCardsController.index(req, res);
      expect(BusinessCardService.index).toHaveBeenCalledWith();
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("createCard controller", () => {
    const req = { body: "card", user: "user" };
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it("will accept card & user object, & return a business card", async () => {
      jest
        .spyOn(BusinessCardService, "create")
        .mockReturnValueOnce({ cardA: "cardA" });
      await BusinessCardsController.create(req, res);
      expect(BusinessCardService.create).toHaveBeenCalledWith("card", "user");
      expect(res.send).toHaveBeenCalledWith({ cardA: "cardA" });
      expect(res.send).toHaveBeenCalledWith(expect.any(Object));
    });
    it("will throw 500 on failed attempt", async () => {
      jest
        .spyOn(BusinessCardService, "create")
        .mockRejectedValueOnce(new Error());
      await BusinessCardsController.create(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("showCard controller", () => {
    const req = { params: { id: "cardId" }, user: { id: "user" } };
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it("will accept cardId & user object, & return a business card", async () => {
      jest
        .spyOn(BusinessCardService, "show")
        .mockReturnValueOnce({ cardA: "cardA" });
      await BusinessCardsController.show(req, res);
      expect(BusinessCardService.show).toHaveBeenCalledWith("cardId", "user");
      expect(res.send).toHaveBeenCalledWith({ cardA: "cardA" });
      expect(res.send).toHaveBeenCalledWith(expect.any(Object));
    });
    it("will throw 500 on failed attempt", async () => {
      BusinessCardService.show.mockRejectedValueOnce(new Error());

      await BusinessCardsController.show(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("updateCard controller", () => {
    const req = {
      params: { id: "cardId" },
      user: { id: "user" },
      body: { fakeBody: "fakeData" },
    };
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it("will accept cardId & user object, & return a business card", async () => {
      jest
        .spyOn(BusinessCardService, "update")
        .mockReturnValueOnce({ cardA: "cardA" });
      await BusinessCardsController.update(req, res);
      expect(BusinessCardService.update).toHaveBeenCalledWith(
        "cardId",
        "user",
        {
          fakeBody: "fakeData",
        }
      );
      expect(res.send).toHaveBeenCalledWith({ cardA: "cardA" });
      expect(res.send).toHaveBeenCalledWith(expect.any(Object));
    });
    it("will throw 500 on failed attempt", async () => {
      jest
        .spyOn(BusinessCardService, "update")
        .mockRejectedValueOnce(new Error());
      await BusinessCardsController.update(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteCard controller", () => {
    const req = { params: { id: "cardId" }, user: { id: "user" } };
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it("will accept cardId & user object, & return ", async () => {
      jest.spyOn(BusinessCardService, "delete").mockReturnValueOnce(true);
      await BusinessCardsController.delete(req, res);
      expect(BusinessCardService.delete).toHaveBeenCalledWith("cardId", "user");
      expect(res.send).toHaveBeenCalled();
    });
    it("will throw 500 on failed attempt", async () => {
      jest
        .spyOn(BusinessCardService, "delete")
        .mockRejectedValueOnce(new Error());
      await BusinessCardsController.delete(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("uploadCard image controller", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 400 if no files were uploaded", async () => {
      const req = { files: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await BusinessCardsController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No files were uploaded.");
    });

    it("should upload and update image if files were uploaded", async () => {
      const req = {
        files: { image: { data: "fileData" } },
        params: { id: "businessCardId" },
        user: { id: "userId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
      };
      jest.spyOn(BusinessCardService, "update").mockReturnValue(true);

      jest
        .spyOn(BusinessCardService, "upload")
        .mockReturnValue("lhost/uploads/mockImalocage.jpg");

      await BusinessCardsController.upload(req, res);

      expect(BusinessCardService.upload).toHaveBeenCalledWith(req.files.image);
      expect(BusinessCardService.update).toHaveBeenCalledWith(
        "businessCardId",
        "userId",
        { image: "lhost/uploads/mockImalocage.jpg" }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should handle errors and return 500", async () => {
      const req = {
        files: { image: { data: "fileData" } },
        params: { id: "businessCardId" },
        user: { id: "userId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
      };

      BusinessCardService.upload.mockRejectedValueOnce(
        new Error("Upload error")
      );

      await BusinessCardsController.upload(req, res);

      expect(BusinessCardService.upload).toHaveBeenCalledWith(req.files.image);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
