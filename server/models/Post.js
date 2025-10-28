const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- This is the new, correct schema for a comment ---
const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This allows us to .populate() the user's name
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    //required: true
  },
  imageUrl: {
    type: String
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // --- This line tells Mongoose to use the CommentSchema ---
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);

