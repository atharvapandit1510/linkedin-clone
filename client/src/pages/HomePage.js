import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';

const HomePage = ({ apiUrl }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [apiUrl]);

  return (
    <div>
      <CreatePost apiUrl={apiUrl} onPostCreated={fetchPosts} />
      
      <div className="feed">
        {loading ? <p>Loading posts...</p> : posts.map(post => (
          <div key={post._id} className="post">
            <div className="post-header">
              <div className="post-author-info">
                <span className="post-author">{post.user.name}</span>
                <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <p className="post-text">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;