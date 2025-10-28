const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- Models ---
const Post = require('../models/Post');
const User = require('../models/User');

// --- Configure Cloudinary ---
// (This will use keys from your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Configure Multer to use Cloudinary Storage ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkedin-clone', // A folder name in your Cloudinary account
    format: async (req, file) => 'jpg', // Supports promises as well
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/posts
// @desc    Create a new post
// We've changed this to use the new 'upload'
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    if (req.file) {
      // req.file.path now contains the full, permanent URL from Cloudinary
      imageUrl = req.file.path;
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

// --- All other routes (GET, LIKE, COMMENT, EDIT, DELETE) are unchanged ---
// (We'll just add the correct .populate() syntax)

// @route   GET /api/posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['name'])
      .populate({ path: 'comments.user', select: 'name' })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET /api/posts/user/:userId
router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.json([]);
    }
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const posts = await Post.find({ user: userId })
      .populate('user', ['name'])
      .populate({ path: 'comments.user', select: 'name' })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   PUT /api/posts/like/:id
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   POST /api/posts/comment/:id
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const newComment = { user: req.user.id, text: req.body.text };
    post.comments.unshift(newComment);
    await post.save();
    await post.populate({ path: 'comments.user', select: 'name' });
    res.json(post.comments);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   PUT /api/posts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.text = req.body.text;
    await post.save();
    await post.populate('user', ['name']);
    await post.populate({ path: 'comments.user', select: 'name' });
    res.json(post);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;

