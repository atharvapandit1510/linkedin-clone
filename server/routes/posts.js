const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose'); // <-- Correctly imported at the top

// --- Multer Config for Image Upload ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This path is relative to the root of the server
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });
// --- End Multer Config ---

// @route   POST /api/posts
// @desc    Create a new post (now with image)
// We add upload.single('image') as middleware
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { text } = req.body;

  // Check if text or image exists
  if (!text && !req.file) {
    return res.status(400).json({ msg: 'Post must contain text or an image' });
  }

  // Construct the image URL
  const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const newPost = new Post({
      text: text,
      imageUrl: imageUrl, // Save the image URL
      user: req.user.id,
    });

    const post = await newPost.save();
    // We populate the user info right away to send back to the frontend
    await post.populate('user', ['name']);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts from all users
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['name'])
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get all posts by a specific user
router.get('/user/:userId', auth, async (req, res) => {
  console.log('Fetching posts for user ID:', req.params.userId);

  try {
    // Make sure we are querying with a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      console.log('Invalid User ID format.');
      return res.json([]); // Return empty array if ID is not valid
    }
    
    // Create an ObjectId instance for the query
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const posts = await Post.find({ user: userId }) // Use the ObjectId here
      .populate('user', ['name'])
      .sort({ createdAt: -1 });
      
    console.log(`Found ${posts.length} posts for this user.`);
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

    // Check if the post has already been liked by this user
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      // Already liked, so unlike it
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    } else {
      // Not liked, so like it
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    await post.populate('user', ['name']);
    await post.populate('comments.user', ['name']);
    res.json(post); // Send back the updated post
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Comment on a post
router.post('/comment/:id', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ msg: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: text,
    };

    post.comments.push(newComment);

    await post.save();
    await post.populate('user', ['name']);
    await post.populate('comments.user', ['name']);
    res.json(post); // Send back the updated post
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/edit/:id
// @desc    Edit your own post
router.put('/edit/:id', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ msg: 'Text is required' });
  }

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.text = text;
    // Note: This logic doesn't handle editing/removing the image, just text
    await post.save();
    await post.populate('user', ['name']);
    await post.populate('comments.user', ['name']);
    res.json(post); // Send back the updated post
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete your own post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(4404).json({ msg: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // TODO: We should also delete the image from the /uploads folder
    // but for simplicity, we'll just delete the post from the DB

    await post.deleteOne(); // Use deleteOne() on the document

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// This line is essential
module.exports = router;

