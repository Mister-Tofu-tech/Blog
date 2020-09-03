const express = require("express");
const app = new express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

mongoose.connect(process.env.MONGO_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const validateMiddleWare = (req, res, next) => {
  if (req.files == null || req.body.title == null) {
    console.error("Invalid Input Detected ...");
    return res.redirect("/posts/new");
  }
  next();
};
app.use("/post/store", validateMiddleWare);
app.listen(process.env.PORT || 5000, () => {
  console.log("App listening at 5000!!");
});

const homeController = require("./controllers/home");
app.get("/", homeController.getAllPosts);

const postActionController = require("./controllers/postAction");
app.get("/post/:id", postActionController.getPost);

app.get("/posts/new", postActionController.createPost);

app.post("/post/store", postActionController.storePost);

app.post("/post/search", postActionController.clickPost);

app.get("/search/:search?", postActionController.searchPost);

const registerController = require("./controllers/register");
app.get("/register", registerController.register);

app.post("/user/register", registerController.storeUser);

const loginController = require("./controllers/login");
app.get("/login", loginController.login);
app.post("/user/login", loginController.loginUser);
