require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const businessCardsRouts = require("./routes/businessCardsRouter");
const authRouts = require("./routes/authRouter");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.use("/auth", authRouts);
app.use("/businesscards", businessCardsRouts);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app };
