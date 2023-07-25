test("register", () => {
  //should receive an object with: first namt, last name, password , email
  // should send the data to the service
  //should response 200
  //if faild should response 400
});
test("login", () => {
  //should receive an object with: email , password
  // should send the data to the service
  //shold add a cookie to the respons
  //sending the successfule user data
  //as an object
  // in the body
  //should response 200
  //if faild should response 401
});

test("google", () => {
  //sould call the passport.authenticae function
  //should redirect the user to the google login window
  // should get a url callback to  "/google/callback"
});

test("connectWithGoogle", () => {
  //should have a req.user.id
  //should have create a token
  //should add a cookie named "userId" with the token
  //should redirect the client to homepage
});
test("checkLogin", () => {
  //should  have a req.user
  //should response the req.user (200)
  // if fails response 401
});
test("setupGooglePassport", () => {
  //??????????????????????????????/
});
