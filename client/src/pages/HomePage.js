import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';

// This is now a "SMART" component that fetches data.
const HomePage = ({ apiUrl, user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch posts on component mount
  useEffect(() => {
    if (user) { // Only fetch if user is loaded
      fetchPosts();
    }
  }, [fetchPosts, user]);

  // This function is passed to CreatePost
  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the feed
    setPosts([newPost, ...posts]);
  };

  if (!user) return null; // Wait for user to be loaded

  return (
    <div className="homepage-container">
      <div className="homepage-main">
        <CreatePost apiUrl={apiUrl} user={user} onPostCreated={handlePostCreated} />
        <Feed
          apiUrl={apiUrl}
          user={user}
          posts={posts}       // Pass down the posts
          setPosts={setPosts}   // Pass down the setter function
          loading={loading}   // Pass down loading state
        />
      </div>
    </div>
  );
};

export default HomePage;

