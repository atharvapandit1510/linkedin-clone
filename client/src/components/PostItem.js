import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

// Your requested emoji icon for "Like"
const LikeIcon = ({ liked }) => (
  <span style={{ color: liked ? '#0073b1' : '#aaa', transition: 'color 0.15s' }}>
    👍
  </span>
);

// Your requested emoji icon for "Comment"
const CommentIcon = () => (
  <span style={{ color: "#0073b1", transition: 'color 0.15s' }}>
    💬
  </span>
);

// A single comment component
const Comment = ({ comment }) => (
  <div className="post-comment">
    {/* Check if comment.user exists, as populate might not have run on old posts */}
    <strong>{comment.user ? comment.user.name : 'User'}:</strong> {comment.text}
  </div>
);

// This is the final PostItem component
// Notice it no longer needs the 'apiUrl' prop for images
const PostItem = ({ post, user, onLike, onComment, onEdit, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false); // For toggling
  const liked = post.likes.includes(user?._id);
  const isOwner = user?._id === post.user._id;

  // Animation: Fade-in effect on mount (from your previous code)
  const [show, setShow] = useState(false);
  React.useEffect(() => {
    setShow(true);
  }, []);

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className={`post-card ${show ? 'show' : ''}`}>
      <div className="post-header">
        <Avatar src={post.user.avatar} name={post.user.name} className="post-avatar" />
        <div className="post-user">
          <Link to={`/profile/${post.user._id}`} className="post-username">{post.user.name}</Link>
          <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        {/* Show Edit/Delete buttons only for the post owner */}
        {isOwner && (
          <div className="post-settings">
            <button className="post-edit" onClick={onEdit}>Edit</button>
            <button className="post-delete" onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>

      {/* Show text content if it exists */}
      {post.text && <div className="post-content">{post.text}</div>}

      {/* --- CLOUDINARY IMAGE FIX --- */}
      {/* Show image content if it exists */}
      {post.imageUrl && (
        <div className="post-image-container">
          {/* The 'src' is now post.imageUrl directly from Cloudinary */}
          <img src={post.imageUrl} alt="Post" className="post-image" />
        </div>
      )}
      {/* --- END FIX --- */}

      {/* Show stats if there are any likes or comments */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="post-stats">
          <span className="post-likes">{post.likes.length} Likes</span>
          <span className="post-comments">{post.comments.length} Comments</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="post-actions">
        <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
          <LikeIcon liked={liked} /> Like
        </button>
        {/* This button now toggles the comment section */}
        <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
          <CommentIcon /> Comment
        </button>
      </div>

      {/* --- COMMENT TOGGLE SECTION --- */}
      {/* This whole section only appears if showComments is true */}
      {showComments && (
        <div className="comment-section">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" className="submit-comment">Send</button>
          </form>
          <div className="comments-list">
            {post.comments.map((comment, idx) => (
              <Comment key={idx} comment={comment} />
            ))}
          </div>
        </div>
      )}
      {/* --- END TOGGLE SECTION --- */}
    </div>
  );
};

export default PostItem;

