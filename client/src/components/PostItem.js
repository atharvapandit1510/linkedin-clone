import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Avatar from './Avatar';

// (Keep the LikeIcon and CommentIcon SVGs as they were)
const LikeIcon = ({ liked }) => (
  <svg viewBox="0 0 24 24" fill={liked ? 'var(--primary-color)' : 'none'} stroke={liked ? 'none' : 'currentColor'} strokeWidth="2" width="20" height="20">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const Comment = ({ comment, formatTimeAgo }) => (
  <div className="comment">
    {/* Link comment author to their profile */}
    <Link to={`/profile/${comment.user}`}>
      <Avatar name={comment.name} />
    </Link>
    <div>
      <div className="comment-body">
        <Link to={`/profile/${comment.user}`} className="post-author-link">
          <span className="comment-author">{comment.name}</span>
        </Link>
        <p className="comment-text">{comment.text}</p>
      </div>
      <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
    </div>
  </div>
);
// --- End SVGs & Comment Component ---


// Add 'apiUrl' to props
const PostItem = ({ post, user, apiUrl, onLike, onComment, onEdit, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwner = user._id === post.user._id;
  const isLiked = post.likes.includes(user._id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText('');
  };
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  }

  return (
    <div className="card post" onMouseLeave={() => setShowActions(false)}>
      {isOwner && (
        <>
          <button 
            className="post-actions-btn" 
            onClick={() => setShowActions(!showActions)}
            aria-label="Post actions"
          >
            ...
          </button>
          {showActions && (
            <div className="post-actions-menu">
              <button onClick={() => { onEdit(post); setShowActions(false); }}>
                Edit
              </button>
              <button onClick={() => { onDelete(post._id); setShowActions(false); }} className="delete">
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {/* --- UPDATE POST HEADER --- */}
      <div className="post-header">
        {/* Wrap Avatar in Link */}
        <Link to={`/profile/${post.user._id}`}>
          <Avatar name={post.user.name} className="post-avatar" />
        </Link>
        <div className="post-author-info">
          {/* Wrap Author Name in Link */}
          <Link to={`/profile/${post.user._id}`} className="post-author-link">
            <span className="post-author">{post.user.name}</span>
          </Link>
          <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
        </div>
      </div>
      {/* --- END HEADER UPDATE --- */}
      
      {/* --- ADD IMAGE DISPLAY --- */}
      {post.imageUrl && (
        <div className="post-image-container">
          {/* Use apiUrl to build the full image source */}
          <img src={`${apiUrl}${post.imageUrl}`} alt="Post content" className="post-image" />
        </div>
      )}
      {/* --- END IMAGE DISPLAY --- */}

      <p className="post-text">{post.text}</p>
      
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="post-stats">
          {post.likes.length > 0 && (
            <span>{post.likes.length} Like{post.likes.length > 1 && 's'}</span>
          )}
          {post.comments.length > 0 && (
            <span onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer' }}>
              {post.comments.length} Comment{post.comments.length > 1 && 's'}
            </span>
          )}
        </div>
      )}

      <div className="post-interaction-bar">
        <button
          className={`post-interaction-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          <LikeIcon liked={isLiked} />
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          className="post-interaction-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <CommentIcon />
          <span>Comment</span>
        </button>
      </div>

      {showComments && (
        <div className="comment-section">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <Link to={`/profile/${user._id}`}>
              <Avatar name={user.name} />
            </Link>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" disabled={!commentText.trim()}>Post</button>
          </form>
          <div className="comment-list">
            {post.comments.map((comment) => (
              <Comment key={comment._id || comment.createdAt} comment={comment} formatTimeAgo={formatTimeAgo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;

