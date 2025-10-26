const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const newPost = new Post({
      text: text,
      user: req.user.id // from auth middleware
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts from all users
router.get('/', async (req, res) => {
  try {
    // Find all posts, sort by date (latest first)
    const posts = await Post.find()
      .populate('user', ['name']) // Get user's name from User model
      .sort({ createdAt: -1 });
      
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;