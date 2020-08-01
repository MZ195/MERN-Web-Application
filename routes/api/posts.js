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

// @route   POST api/posts/like/:id
// @desc    Like a post by it's id
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked this post" });
          }

          // Add user to likes list
          post.likes.unshift({ user: req.user.id });

          post.save().then((post) => res.json(post));
        })
        .catch((err) => res.status(404).json({ noPost: "Post not found" }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unike a post by it's id
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not yet liked this post" });
          }

          // Get the remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // Remove user from likes list
          post.likes.splice(removeIndex, 1);

          post.save().then((post) => res.json(post));
        })
        .catch((err) => res.status(404).json({ noPost: "Post not found" }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add a comment to a post by id
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // We used the same validation file since the post and comment are similar
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // Add the new comment to comments list
        post.comments.unshift(newComment);

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ noPost: "Post not found" }));
  }
);

module.exports = router;
