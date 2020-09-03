const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.login = (req, res) => {
  console.log(req.param.error);
  res.render("login");
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          return res.redirect("/");
        } else {
          return res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
};
