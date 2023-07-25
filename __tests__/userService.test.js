test("register", () => {
  //should receive an object with: first namt, last name, password , email
  //should cheack if a user exict
  //if so should throw new err
  // else should hass the password with bcrypt
  // should creat a user with the object
  //should response 200
  //if faild should response 400
});

test("login", () => {
  //should receive an object with: email , password
  // should cheack in the DB if the email exicets
  //if he dose not, throw a new error
  //it should compere the password from clint withe the one in the DB
  // if it pass, create a token with user.id
  //should return token
  //should return user
});

test("index", () => {
  //should find all users from DB
  //they will come back as an object?
  //if there are no users it will return an empty object
});

test("show", () => {
  //should accept  user id string
  //should return user from DB or null
});

test("findByMail", () => {
  //should accept  user email string
  //should return user from DB or null
});

test("create", () => {
  //should accept  user object
  //should create a user on the DB
  //should return user from DB
});

test("update", () => {
  //should accept  user id string
  //should accept an object with props to update
  //should findeAndUpdate the user (by Id)
  //should return the updated user from DB
});

test("delete", () => {
  //should accept  user id string
  //should return the deleted user from DB
});
