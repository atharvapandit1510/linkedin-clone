const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // --- NEW FEATURES ---
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: { type: String, required: true }, // Store name for easy display
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
  // --- END NEW FEATURES ---
});

module.exports = mongoose.model('Post', PostSchema);
