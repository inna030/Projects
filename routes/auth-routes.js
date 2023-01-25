const router = require("express").Router();
const passport = require("passport");
const { nextTick } = require("process");
const flash = require("connect-flash");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.redirect("/");
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (password.length < 8) {
    req.flash("error_msg", "password length is too short");
    return res.redirect("/auth/signup");
  }
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash(
      "Error message",
      "This email is already signed. Please use another one."
    );
    return res.redirect("/auth/signup");
  }
  let hashedPasseword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email, password: hashedPasseword });
  await newUser.save();
  req.flash("success_msg", "Successfully registrated. You can login now.");
  return res.redirect("/auth/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "User account or password is not correct",
  }),
  (req, res) => {
    return res.redirect("/profile");
  }
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  return res.redirect("/profile");
});

module.exports = router;
