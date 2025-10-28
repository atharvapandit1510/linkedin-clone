import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../components/Avatar';
import Feed from '../components/Feed';

// This is also a "SMART" component that fetches data.
const ProfilePage = ({ apiUrl, currentUser }) => {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]); // State for this page's posts
  const [loading, setLoading] = useState(true);
  
  const { userId } = useParams();
  const isOwnProfile = profileUser && currentUser && profileUser._id === currentUser._id;

  // Function to fetch profile and posts
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch profile user
      const profileRes = await axios.get(`${apiUrl}/api/auth/${userId}`);
      setProfileUser(profileRes.data);
      
      // Fetch this user's posts
      const postsRes = await axios.get(`${apiUrl}/api/posts/user/${userId}`);
      setPosts(postsRes.data);
      
    } catch (err) {
      console.error('Error fetching profile data', err);
    } finally {
      setLoading(false);
    }
  }, [userId, apiUrl]);

  // Fetch data on mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading || !profileUser) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <Avatar src={profileUser.avatar} name={profileUser.name} className="profile-avatar" />
        <div className="profile-details">
          <h2>{profileUser.name}</h2>
          <p>{profileUser.headline}</p> {/* Make sure your model has 'headline' or remove this */}
          <span>{profileUser.email}</span>
          {isOwnProfile && <button className="profile-edit-btn">Edit Profile</button>}
        </div>
      </div>
      <div className="profile-feed">
        <Feed
          apiUrl={apiUrl}
          user={currentUser} // 'user' prop for Feed is the *logged in* user
          posts={posts}       // Pass down the posts
          setPosts={setPosts}   // Pass down the setter function
          loading={loading}   // Pass down loading state
        />
      </div>
    </div>
  );
};

export default ProfilePage;

