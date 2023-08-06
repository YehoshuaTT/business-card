require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const middlewere = require("../middleware/auth");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValueOnce("token"),
  verify: jest.fn().mockReturnValue(),
}));

describe("auth middelwere", () => {
  describe("createToken", () => {
    it("will accept userId & return a token", async () => {
      jest.spyOn(jwt, "sign").mockReturnValueOnce("Token");

      await middlewere.createToken("userId");

      expect(jwt.sign).toBeCalledWith({ id: "userId" }, expect.anything(), {
        expiresIn: "10h",
      });
    });
  });

  describe("validate token", () => {
    it("will accept userId get the user from DB & attach it to the request ", async () => {
      const req = { cookies: { userId: "cookie" } };
      const res = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      jest.spyOn(jwt, "verify").mockReturnValueOnce("userId");
      jest.spyOn(User, "findById").mockReturnValueOnce("DbUser");
      const next = jest.fn();

      await middlewere.validateToken(req, res, next);

      expect(jwt.verify).toBeCalledWith("cookie", expect.anything());
      expect(next).toBeCalled();
      expect(req.user).toBe("DbUser");
    });

    it("on any  fail will send 401 err", async () => {
      const req = {};
      const res = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await middlewere.validateToken(req, res, next);

      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith("Unauthorized");
    });
  });

  describe("findUserByToken", () => {
    it("will accept token & return user object", async () => {
      jest.spyOn(jwt, "verify").mockReturnValueOnce({ id: "userId" });
      jest.spyOn(User, "findById").mockReturnValueOnce({ user: "userObject" });

      await middlewere.findUserByToken("token");

      expect(jwt.verify).toBeCalledWith("token", expect.anything());
      expect(User.findById).toBeCalledWith("userId");
    });
  });
});
