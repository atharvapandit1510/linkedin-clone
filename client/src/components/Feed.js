import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import EditPostModal from './EditPostModal';

// This component is a reusable feed.
// It fetches posts from any URL you give it.
const Feed = ({ apiUrl, user, fetchUrl, children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  // Use 'useCallback' to memoize the function
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(fetchUrl);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  // Fetch posts when the component mounts or the URL changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // This allows the CreatePost component to add a new post
  // to the top of this feed
  const addPostToFeed = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // --- All the post-handling logic is now here ---

  const updatePostInState = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
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
      const res = await axios.post(`${apiUrl}/api/posts/comment/${postId}`, {
        text: commentText,
      });
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
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${apiUrl}/api/posts/${postId}`);
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post', err);
      }
    }
  };

  // --- Render ---

  if (loading) {
    return <div className="card" style={{ textAlign: 'center' }}>Loading posts...</div>;
  }
  
  // This exposes the `addPostToFeed` function to parent components
  // We check `React.Children.map` to see if `CreatePost` was passed in
  const childrenWithProps = React.Children.map(
    // `children` is a special prop that holds any components nested inside <Feed>
    React.Children.toArray(children), 
    (child) => {
      // Find the CreatePost component and inject the addPostToFeed prop
      if (child.type.name === 'CreatePost') {
        return React.cloneElement(child, { onPostCreated: addPostToFeed });
      }
      return child;
    }
  );

  return (
    <div className="feed-container">
      {/* Render the children (e.g., CreatePost) */}
      {childrenWithProps}

      {/* Render the list of posts */}
      <div className="feed">
        {posts.length === 0 && !loading && (
          <div className="card" style={{ textAlign: 'center' }}>No posts found.</div>
        )}
        {posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            user={user}
            apiUrl={apiUrl} // Pass apiUrl for images
            onLike={handleLike}
            onComment={handleComment}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* The Edit Modal */}
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

