const bcrypt = require("bcrypt");
const authService = require("../middleware/auth");
const UserService = require("../services/user.service");
const User = require("../models/user.model");
const {
  mockBcryptData,
  mockBusinessCard,
  mockUserLoginInput,
  mockUserRegisterInput,
  mockUsers,
} = require("./mockData");

jest.spyOn(User, "findOne").mockImplementation((query) => {
  return mockUsers.find((user) => user.email === query.email) || null;
});

jest.spyOn(User, "create").mockImplementation((userInfo) => {
  const user = {
    ...userInfo,
    id: "new_mocked_id",
  };
  mockUsers.push(user);
  return user;
});

jest
  .spyOn(User, "findById")
  .mockImplementation((userId) => mockUsers.find((user) => user.id === userId));

jest.spyOn(authService, "createToken").mockReturnValueOnce("token");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register ", () => {
    it("should create a new user", async () => {
      const newUser = await UserService.register(mockUserRegisterInput[0]);

      expect(User.findOne).toHaveBeenCalledWith(
        { email: mockUserRegisterInput[0].email },
        { email: 1, _id: 0 }
      );

      expect(User.create).toHaveBeenCalledWith({
        ...mockUserRegisterInput[0],
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
        await UserService.register(mockUserRegisterInput[0]);
      }).rejects.toThrow("duplication error");
    });
  });

  describe("login ", () => {
    it("should return user object and token on successful login", async () => {
      jest.spyOn(bcrypt, "compare").mockReturnValueOnce(true);
      jest.spyOn(authService, "createToken").mockReturnValueOnce("token");

      const loginResult = await UserService.login(mockUserLoginInput[0]);

      expect(User.findOne).toHaveBeenCalledWith({
        email: mockUserLoginInput[0].email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUserLoginInput[0].password,
        mockUsers[0].password
      );

      expect(authService.createToken).toHaveBeenCalledWith(mockUsers[0].id);
      expect(typeof loginResult).toBe("object");
      expect(typeof loginResult.token).toBe("string");
      expect(loginResult.user.email).toBe(mockUserLoginInput[0].email);
      expect(loginResult.user.password.length === 60).toBe(true);
      expect(loginResult.user).toHaveProperty("id");
      expect(loginResult.user).toHaveProperty("firstName");
      expect(loginResult.user).toHaveProperty("lastName");
    });

    it("should throw an error login details are wrong", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(UserService.login(mockUserLoginInput[1])).rejects.toThrow(
        "Not excist error"
      );
    });
  });
});

// test("register", () => {
//   expect(typeof mockUserRegisterInput).toBe("object");
//   expect(mockUserRegisterInput.password).toBeTruthy();
//   expect(mockUserRegisterInput.firstName).toBeTruthy();
//   expect(mockUserRegisterInput.lastName).toBeTruthy();
//   expect(mockUserRegisterInput.email).toBeTruthy();

//   let a = 2;
//   expect(2).toBe(2);
//   //should cheack if a user exict
//   //if so should throw new err
//   // else should hass the password with bcrypt
//   // should creat a user with the object
//   //should response 200
//   //if faild should response 400
// });

// test("login", () => {
//   expect(UserService.login)
//should receive an object with: email , password
// should cheack in the DB if the email exicets
//if he dose not, throw a new error
//it should compere the password from clint withe the one in the DB
// if it pass, create a token with user.id
//should return token
//should return user
/**
 * Create a mock hashed password, keep a copy of the original and hashed in memory (321123 | Jh23847867asd^%%$^823)
 * Create a mock user with all the user's data (include email, and the hashed password from above)
 * Mock the User.findOne method so it will accept and email and will find the user by its email
 * mock the bcrypt.compare method - so it will return true if the hashed password fits to the original password.
 * make sure that the login method returns the same user's details as from above
 */

// });

// test("index", () => {
//   //should find all users from DB
//   //they will come back as an object?
//   //if there are no users it will return an empty object
// });

// test("show", () => {
//   //should accept  user id string
//   //should return user from DB or null
// });

// test("findByMail", () => {
//   //should accept  user email string
//   //should return user from DB or null
// });

// test("create", () => {
//   //should accept  user object
//   //should create a user on the DB
//   //should return user from DB
// });

// test("update", () => {
//   //should accept  user id string
//   //should accept an object with props to update
//   //should findeAndUpdate the user (by Id)
//   //should return the updated user from DB
// });

// test("delete", () => {
//   //should accept  user id string
//   //should return the deleted user from DB
// });
