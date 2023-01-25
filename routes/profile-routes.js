const { request } = require("http");
const Post = require("../models/post-model");
const router = require("express").Router();
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};
router.get("/", authCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id });

  return res.render("profile", { user: req.user, posts: postFound });
});
router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user });
});
router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    req.flash("error_msg", "Title and content must be written");
    return res.redirect("/profile/post");
  }
});
module.exports = router;
