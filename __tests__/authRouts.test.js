const { app } = require("../index.js");
const request = require("supertest");
describe("loggedcheck", () => {
  describe("given the user is unauthorized", () => {
    it("should return a 401", async () => {
      const mockCookie =
        "eyJhbGciOiJIUzI1NiIsInR5cC46IkpXVCJ9.eyJpZCI6IjY0YjdjNDdlY2ExMDk1NzdlYThiMzk4YiIsImlhdCI6MTY5MDE4Mjk5MSwiZXhwIjoxNjkwMjE4OTkxfQ.x4CK9WmHv83h7ITB-Lrd9XBPRsynx6DHXrEvugm4Rqs";
      const response = await request(app)
        .post("/auth/loggedcheck")
        .set("cookie", [`userId=${mockCookie}`]);

      expect(response.status).toBe(401);
    });
  });

  describe("given the user is authorized", () => {
    it("should return body", async () => {
      const realCookie =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjA5OTRhMGQyY2EwMmQ3NTkwOWE0OSIsImlhdCI6MTY5MDI3MDA1NiwiZXhwIjoxNzIxODI3NjU2fQ.1ui_yv5AD9VWDeqpoMMGysp_PqBoAIhp_oOYOgRxbdk";
      const response = await request(app)
        .post("/auth/loggedcheck")
        .set("cookie", [`userId=${realCookie}`]);

      expect(response.status).toBe(200);
      expect(response.body._id).toBeTruthy();
      expect(response.body.email).toBeTruthy();
      expect(response.body.password.length === 60).toBeTruthy();
    });
  });
});

test("login", () => {
  //should receive an object with: first namt, last name, password
  // should set a cookie header res.cookie
  //should send back a user object
});

test("register", () => {
  //should receive an object with: first namt, last name, password , email
  // should set a cookie header res.cookie
  //should send back a user object
});

test("google", () => {
  //sould call the passport.authenticae function
  //should redirect the user to the google login window
  // should get a url callback to  "/google/callback"
});

test("google/callback", () => {
  //should call the passport.authenticae function
  //should call the connectWithGoogle function
  //should redirect the client to homepage
});

test("loggedcheck", () => {
  //should call auth.validateToken
  //should then call the authController.checkLogin function
});
