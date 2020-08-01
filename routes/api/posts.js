const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post model
const Post = require("../../models/Post");
// Load Profile model
const Profile = require("../../models/Profile");

// Load post validatior
const validatePostInput = require("../../validation/post-validation");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Posts works",
  });
});

// @route   GET api/posts/
// @desc    Get all posts
// @access  Publick
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ noPosts: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get posts by id
// @access  Publick
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ noPost: "No post found with that ID" })
    );
});

// @route   POST api/posts/
// @desc    Create new post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post by id
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "user not autherized" });
          }

          // Delete

          post.remove().then(() => res.json({ sucess: true }));
        })
        .catch((err) => res.status(404).json({ noPost: "Post not found" }));
    });
  }
);

module.exports = router;
