let mockUsers = [
  {
    firstName: "mocka loka",
    lastName: "chokalata",
    password: "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW",
    email: "chau@bambino.com",
    id: "64b0994a0d2ca02d75909a49",
  },
];

let mockBusinessCard = {
  firstName: "mocka loka",
  lastName: "chokalata",
  email: "chau@bambino.com",
  userId: "64b0994a0d2ca02d75909a49",
  id: "64b09c590d2ca02d75909a50",
  username: "mocka loka The User",
  phoneNumber: "0521234567",
  businessType: "Programming",
  webURL: "www.closeapp.co.il/",
  image: "/images/1689295979286sunset.jpg",
};

const mockUserLoginInput = [
  {
    email: "chau@bambino.com",
    password: "123456",
  },
  {
    email: "chau@bambino2.com",
    password: "1234567",
  },
];

const mockUserRegisterInput = [
  {
    email: "chau@bambino1.com",
    password: "123456",
    firstName: "mocka loka",
    lastName: "chokalata",
  },
  {
    email: "chau@bambino.com",
    password: "123456",
    firstName: "mocka loka",
    lastName: "chokalata",
  },
];

const mockBcryptData =
  "$2b$10$2xxatu5K3yjqCIyinkE36.1r8XjciiRdhqTRfjG2w7au6qntj8wlW";

module.exports = {
  mockBcryptData,
  mockBusinessCard,
  mockUserLoginInput,
  mockUserRegisterInput,
  mockUsers,
};
