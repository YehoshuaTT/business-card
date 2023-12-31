require("dotenv").config();
const UserController = require("../contollers/user.controller");
const UserService = require("../services/user.service");
const User = require("../models/user.model");
const authService = require("../middleware/auth");

jest.mock("passport-google-oauth20", () => {
  return {
    Strategy: jest.fn((options, verify) => {
      return {
        name: "google",
        authenticate: jest.fn((req) => {
          const user = { id: "123", displayName: "Test User" };
          verify(user, (err, user) => {
            req.user = user;
            req.authInfo = { provider: "google" };
          });
        }),
      };
    }),
  };
});

describe("User controler", () => {
  describe("register a user", () => {
    let mockUser = new User({
      email: "user@gmail.com",
      password: "Password12#$",
      firstName: "the",
      lastName: "man",
    });

    const req = {
      body: mockUser,
    };
    const res = {
      sendStatus: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it("will register a user from users request and send back a 200 status", async () => {
      jest.spyOn(UserService, "register").mockReturnValueOnce(true);
      await UserController.register(req, res);
      expect(UserService.register).toHaveBeenCalledWith(req.body);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return status 500 on server fail", async () => {
      const req = {
        body: mockUser,
      };
      const res = {
        sendStatus: jest.fn(),
      };
      UserService.register.mockRejectedValueOnce(new Error("internal Error"));

      await UserController.register(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
      jest.clearAllMocks();
    });

    it("should return status 400 if user is already registered", async () => {
      const req = {
        body: mockUser,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
        send: jest.fn(),
      };
      jest.spyOn(UserService, "register").mockImplementation(() => {
        throw new Error("duplication error");
      });

      await UserController.register(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(
        "user already exists in the system"
      );
    });
  });

  describe("login", () => {
    jest.spyOn(UserService, "login").mockReturnValueOnce({
      user: new User({
        email: "user@gmail.com",
      }),
      token: "userToken",
    });

    const req = {
      body: { email: "user@gmail.com", password: "password" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      sendStatus: jest.fn(),
      send: jest.fn(),
    };
    it("should accept a login object and send back the user object & session token", async () => {
      await UserController.login(req, res);
      expect(req.body).toHaveProperty("email");
      expect(req.body).toHaveProperty("password");
      expect(typeof req.body).toBe("object");
      expect(UserService.login).toHaveBeenCalledWith({
        email: "user@gmail.com",
        password: "password",
      });
      expect(UserService.login).toReturnWith(expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("userId", "userToken");
      expect(res.send).toHaveBeenCalledWith({
        user: {
          _id: expect.anything(),
          email: "user@gmail.com",
        },
      });
    });
    it("should response 401 if no such user ", async () => {
      UserService.login.mockRejectedValueOnce(new Error("Not exist error"));

      await UserController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Unauthorized");
    });
    it("should response 500 on server fail ", async () => {
      UserService.login.mockRejectedValueOnce(new Error());

      await UserController.login(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("checkLogin", () => {
    const sampleUser = { id: "user_id", name: "John Doe" };
    it("should return the user object and set the token in the response cookie", async () => {
      const req = {
        user: sampleUser,
        cookie: jest.fn(),
        cookies: { userId: "userId token" },
      };
      const res = {
        req: req,
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        body: jest.fn(),
      };

      await UserController.checkLogin(req, res);

      expect(res.send).toHaveBeenCalledWith(sampleUser);
      expect(res.req.cookies.userId).toBeDefined();
      expect(req.cookie).toBeDefined();
    });
    it("should return staus 500 on internal server fail", async () => {
      const req = {
        user: sampleUser,
        cookie: jest.fn(),
        cookies: { userId: "expierd token" },
      };
      const res = { status: null, sendStatus: jest.fn() };
      await UserController.checkLogin(req, res);
      expect(res.sendStatus).toBeCalledWith(500);
    });
  });

  describe("connect with google", () => {
    jest.spyOn(authService, "createToken").mockReturnValueOnce("returndToken");

    const req = {
      user: { id: "userID" },
      cookies: { userId: "userId token" },
    };
    const res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      cookie: jest.fn(),
    };
    it("will accept userId create token send a cookie and redirect the client", async () => {
      await UserController.connectWithGoogle(req, res);
      expect(authService.createToken).toHaveBeenCalledWith("userID");
      expect(res.cookie).toBeCalledWith("userId", expect.any(String));
      expect(res.redirect).toBeCalled();
    });
    it("should return staus 500 on internal server fail", async () => {
      const req = null;
      await UserController.connectWithGoogle(req, res);
      expect(res.sendStatus).toBeCalledWith(500);
    });
  });
});
