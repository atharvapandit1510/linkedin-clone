import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const LikeIcon = ({ liked }) => (
  <span style={{ color: liked ? '#0073b1' : '#aaa', transition: 'color 0.15s' }}>
    👍
  </span>
);

const CommentIcon = () => (
  <span style={{ color: "#0073b1", transition: 'color 0.15s' }}>
    💬
  </span>
);

// Updated Comment component to use new CSS classes
const Comment = ({ comment }) => (
  <div className="post-comment">
    <Avatar name={comment.user.name} className="comment-avatar" />
    <div className="comment-body">
      <span className="comment-author">{comment.user.name}</span>
      <p>{comment.text}</p>
    </div>
  </div>
);

// Added 'apiUrl' to the props
const PostItem = ({ apiUrl, post, user, onLike, onComment, onEdit, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false); // State for toggle
  const liked = post.likes.includes(user?._id);

  const [show, setShow] = useState(false);
  React.useEffect(() => {
    setShow(true);
  }, []);

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
        {user?._id === post.user._id && (
          <div className="post-settings">
            <button className="post-edit" onClick={onEdit}>Edit</button>
            <button className="post-delete" onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>

      {/* --- UPDATED POST CONTENT SECTION --- */}
      <div className="post-content">
        {post.text && <p>{post.text}</p>}
        
        {/* This is the new part to show the image */}
        {post.imageUrl && (
          <div className="post-image-container">
            <img 
              src={`${apiUrl}${post.imageUrl}`} 
              alt="Post content" 
              className="post-image" 
            />
          </div>
        )}
      </div>
      {/* --- END UPDATED SECTION --- */}

      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="post-stats">
          <span className="post-likes">{post.likes.length} Likes</span>
          <span className="post-comments">{post.comments.length} Comments</span>
        </div>
      )}

      <div className="post-actions">
        <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
          <LikeIcon liked={liked} /> Like
        </button>
        {/* This button now toggles the comment section */}
        <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
          <CommentIcon /> Comment
        </button>
      </div>

      {/* --- NEW: Comment section is now conditional --- */}
      {showComments && (
        <div className="comment-section">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <Avatar name={user.name} className="comment-avatar" />
            <input
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" className="submit-comment">Send</button>
          </form>
          <div className="comments-list">
            {post.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;

