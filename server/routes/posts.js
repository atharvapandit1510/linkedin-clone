const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// --- Multer Config ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- Models ---
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ msg: 'Post cannot be empty' });
    }

    const newPost = new Post({
      text: text,
      imageUrl: imageUrl,
      user: req.user.id
    });

    const post = await newPost.save();
    await post.populate('user', ['name']);
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['name'])
      .populate({ path: 'comments.user', select: 'name' }) // Correct populate
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.json([]);
    }
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const posts = await Post.find({ user: userId })
      .populate('user', ['name'])
      .populate({ path: 'comments.user', select: 'name' }) // Correct populate
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like or unlike a post
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Add a comment
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    // This save will now work because 'newComment' matches the 'CommentSchema'
    post.comments.unshift(newComment);
    await post.save();
    
    // This populate will now work
    await post.populate({ path: 'comments.user', select: 'name' });
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/:id
// @desc    Edit a post
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.text = req.body.text;
    await post.save();
    
    await post.populate('user', ['name']);
    await post.populate({ path: 'comments.user', select: 'name' }); // Correct populate
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(44).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

