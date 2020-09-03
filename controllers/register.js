const User = require("../models/User");
const url = require("url");

exports.register = async (req, res) => {
  const errorMsg = req.query.error;
  res.render("register", { errorMsg });
};

exports.storeUser = async (req, res) => {
  try {
    await User.create(req.body);
  } catch (error) {
    console.error("Username already existed ...");
    return res.redirect(
      url.format({
        pathname: "/register",
        query: {
          error: "Username already existed ...",
        },
      })
    );
  }
  return res.redirect("/");
};
