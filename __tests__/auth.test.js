import * as jwt from "jsonwebtoken";
import User from "../models/user.model";
import * as auth from "../middleware/auth";
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),

  verify: jest.fn((params) => params),
}));
describe("auth middelwere", () => {
  describe("createToken", () => {
    it("will accept userId & return a token", async () => {
      const token = await auth.createToken("userId");
      console.log(token);
      expect(typeof token).toBe("string");
      expect(jwt.sign).toBeCalledWith({ id: "userId" }, expect.anything(), {
        expiresIn: "10h",
      });
    });
  });

  describe("validate token", () => {
    it("will accept userId get the user from DB & attach it to the request ", async () => {
      const req = { cookies: { userId: "cookie" }, user: "user" };
      const res = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await auth.validateToken(req, res, next);

      expect(jwt.verify).toBeCalledWith("cookie", expect.anything());
      expect(next).toBeCalled();
      expect(req.user).toBe("cookie");
    });

    it("on any  fail will send 401 err", async () => {
      const req = {};
      const res = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await auth.validateToken(req, res, next);

      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith("Unauthorized");
    });
  });

  describe("findUserByToken", () => {
    it("will accept token & return user object", async () => {
      jest.spyOn(jwt, "verify").mockReturnValueOnce({ id: "userId" });
      jest.spyOn(User, "findById").mockReturnValueOnce({ user: "userObject" });

      await auth.findUserByToken("token");

      expect(jwt.verify).toBeCalledWith("token", expect.anything());
      expect(User.findById).toBeCalledWith("userId");
    });
  });
});
