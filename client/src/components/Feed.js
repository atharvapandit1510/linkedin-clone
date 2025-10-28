import React, { useState } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import EditPostModal from './EditPostModal';

// This is the "DUMB" component. It receives posts and functions.
const Feed = ({ apiUrl, user, posts, setPosts, loading }) => {
  const [editingPost, setEditingPost] = useState(null);

  const updatePostInState = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`${apiUrl}/api/posts/like/${postId}`);
      const updatedPost = posts.find(p => p._id === postId);
      if (updatedPost) {
        updatedPost.likes = res.data;
        updatePostInState({ ...updatedPost });
      }
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const res = await axios.post(`${apiUrl}/api/posts/comment/${postId}`, { text: commentText });
      const updatedPost = posts.find(p => p._id === postId);
      if (updatedPost) {
        updatedPost.comments = res.data;
        updatePostInState({ ...updatedPost });
      }
    } catch (err) {
      console.error('Error commenting on post', err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (postId, newText) => {
    try {
      const res = await axios.put(`${apiUrl}/api/posts/${postId}`, { text: newText });
      updatePostInState(res.data);
      setEditingPost(null);
    } catch (err) {
      console.error('Error editing post', err);
    }
  };

  const handleDelete = async (postId) => {
    // We use window.confirm as a simple modal
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${apiUrl}/api/posts/${postId}`);
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post', err);
      }
    }
  };

  if (loading) return <div className="feed-loading">Loading posts...</div>;

  return (
    <div className="feed-list">
      {posts && posts.map(post => (
        <PostItem
          key={post._id}
          apiUrl={apiUrl} // <-- THIS IS THE FIX
          post={post}
          user={user}
          onLike={() => handleLike(post._id)}
          onComment={handleComment}
          onEdit={() => handleEdit(post)}
          onDelete={() => handleDelete(post._id)}
        />
      ))}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={handleSaveEdit}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default Feed;

