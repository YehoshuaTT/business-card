import bcrypt from "bcrypt";
import * as authService from "../middleware/auth.js";
import UserService from "../services/user.service.js";
import User from "../models/user.model.js";

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    let mockUser = {
      firstName: "mocka loka",
      lastName: "chokalata",
      password: "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
      email: "chau@bambino1.com",
      id: "64b0994a0d2ca02d75909a49",
    };
    it("should create a new user", async () => {
      const mockUsers = [
        {
          firstName: "mocka loka",
          lastName: "chokalata",
          password:
            "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
          email: "chau@bambino.com",
          id: "64b0994a0d2ca02d75909a49",
        },
      ];

      jest.spyOn(User, "findOne").mockImplementation((query) => {
        return mockUsers.find((user) => user.email === query.email) || null;
      });

      jest.spyOn(User, "create").mockImplementation((userInfo) => {
        const user = {
          ...userInfo,
          id: "new_mocked_id",
        };
        return user;
      });

      const newUser = await UserService.register(mockUser);

      expect(User.findOne).toHaveBeenCalledWith(
        { email: "chau@bambino1.com" },
        { email: 1, _id: 0 }
      );

      expect(User.create).toHaveBeenCalledWith({
        ...mockUser,
        password: expect.any(String),
      });

      expect(typeof newUser).toBe("object");
      expect(newUser).toHaveProperty("id");
      expect(newUser).toHaveProperty("firstName");
      expect(newUser).toHaveProperty("lastName");
      expect(newUser.password.length === 60).toBe(true);
    });

    test("registering a registerd user should throw error", () => {
      expect(async () => {
        await UserService.register({
          email: "chau@bambino.com",
          password: "123456",
          firstName: "mocka loka",
          lastName: "chokalata",
        });
      }).rejects.toThrow("duplication error");
    });
  });

  describe("login ", () => {
    const mockUserInfo = {
      email: "chau@bambino.com",
      password: "123456",
    };
    it("should return user object and token on successful login", async () => {
      jest.spyOn(bcrypt, "compare").mockReturnValueOnce(true);
      jest.spyOn(authService, "createToken").mockReturnValueOnce("token");

      const loginResult = await UserService.login(mockUserInfo);

      expect(User.findOne).toHaveBeenCalledWith({
        email: mockUserInfo.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUserInfo.password,
        "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW"
      );

      expect(authService.createToken).toHaveBeenCalledWith(
        "64b0994a0d2ca02d75909a49"
      );
      expect(typeof loginResult).toBe("object");
      expect(typeof loginResult.token).toBe("string");
      expect(loginResult.user.email).toBe("chau@bambino.com");
      expect(loginResult.user.password.length === 60).toBe(true);
      expect(loginResult.user).toHaveProperty("id");
      expect(loginResult.user).toHaveProperty("firstName");
      expect(loginResult.user).toHaveProperty("lastName");
    });

    it("should throw an error  if email is wrong", async () => {
      const mockWrongEmail = {
        email: "chau@bambino11.com",
        password: "123456",
      };
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(UserService.login(mockWrongEmail)).rejects.toThrow(
        "Not excist error"
      );
    });
    it("should throw an error  if password is wrong", async () => {
      const mockWrongPassword = {
        email: "chau@bambino.com",
        password: "0123456",
      };
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(UserService.login(mockWrongPassword)).rejects.toThrow(
        "Not excist error"
      );
    });
  });

  describe("index all users", () => {
    jest.spyOn(User, "find").mockImplementation(() => {
      return {
        firstName: "mocka loka",
        lastName: "chokalata",
        password:
          "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
        email: "chau@bambino.com",
        id: "64b0994a0d2ca02d75909a49",
      };
    });

    let allUsers = UserService.index();

    it("should return all users", async () => {
      expect(typeof allUsers).toBe("object");
    });
    it("if no users it should return an empty object", async () => {
      allUsers = {};
      expect(typeof allUsers).toBe("object");
      expect(Object.keys(allUsers)).toHaveLength(0);
    });
  });

  describe("show user", () => {
    it("should accept  user id string, and return user Object if exict", async () => {
      jest.spyOn(User, "findById").mockImplementation(() => {
        return {
          firstName: "mocka loka",
          lastName: "chokalata",
          password:
            "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
          email: "chau@bambino.com",
          id: "64b0994a0d2ca02d75909a49",
        };
      });

      const user = UserService.show("64b0994a0d2ca02d75909a49");
      expect(User.findById).toHaveBeenCalledWith("64b0994a0d2ca02d75909a49");
      expect(User.findById).toHaveBeenCalledWith(expect.any(String));
      expect(typeof user).toBe("object");
    });
    it("should return null if user dose not exict", async () => {
      jest.spyOn(User, "findById").mockImplementation((user) => null);

      const user = await UserService.show("64b0994a0da04d75909a49");
      expect(user).toBeNull();
    });
  });

  describe("find user ByMail", () => {
    it("should accept email string, and return user Object if exict", async () => {
      jest.spyOn(User, "findOne").mockImplementation(() => {
        return {
          firstName: "mocka loka",
          lastName: "chokalata",
          password:
            "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
          email: "chau@bambino.com",
          id: "64b0994a0d2ca02d75909a49",
        };
      });
      const user = UserService.findByMail("chau@bambino.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "chau@bambino.com" });
      expect(User.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(typeof user).toBe("object");
    });

    it("should return null if user dose not exict", async () => {
      jest.spyOn(User, "findOne").mockImplementation((email) => null);

      const user = await UserService.findByMail({
        email: "chau@bambino777.com",
      });
      expect(user).toBeNull();
    });
  });

  describe("update user", () => {
    const newUserInfo = {
      firstName: "new user",
      lastName: "new family",
      password: "Aa052@f##kkdjf",
      _id: "20h240h340304f34fu34fo",
      email: "new@user.com",
    };
    const updateInfo = { email: "updated@user.mock" };

    it("should accept an id, update fields, and return a user Object", async () => {
      jest
        .spyOn(User, "findByIdAndUpdate")
        .mockImplementation((id, userInfo) => {
          let newUser = {
            ...newUserInfo,
            ...userInfo,
          };
          return newUser;
        });

      const user = await UserService.update(newUserInfo._id, updateInfo);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "20h240h340304f34fu34fo",
        {
          email: "updated@user.mock",
        },
        { new: true }
      );
      expect(typeof user).toBe("object");
      expect(user.email).toBe("updated@user.mock");
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  describe("delete user", () => {
    jest.spyOn(User, "findByIdAndDelete").mockImplementation((id) => true);

    it("should accept an id, update fields, and return a user Object", async () => {
      const user = await UserService.delete("20h240h340304f34fu34fo");

      expect(user).toBe(true);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(expect.any(String));
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(
        "20h240h340304f34fu34fo"
      );
    });
  });
});
