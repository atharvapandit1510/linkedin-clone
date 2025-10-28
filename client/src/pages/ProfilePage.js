import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../components/Avatar';
import Feed from '../components/Feed'; // Import our new Feed

// We get 'currentUser' to see if we're viewing our own profile
const ProfilePage = ({ apiUrl, currentUser }) => {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams(); // Get the user ID from the URL

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Fetch the user's profile data
        const res = await axios.get(`${apiUrl}/api/auth/${userId}`);
        setProfileUser(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, apiUrl]); // Re-fetch if the userId or apiUrl changes

  if (loading) {
    return <div className="card" style={{ textAlign: 'center' }}>Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="card" style={{ textAlign: 'center' }}>User not found.</div>;
  }

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = currentUser._id === profileUser._id;

  return (
    <div className="profile-page">
      <div className="card profile-page-header">
        <Avatar name={profileUser.name} className="profile-avatar" />
        <div className="profile-info">
          <h1>{profileUser.name}</h1>
          <p>{profileUser.email}</p>
          {isOwnProfile && (
            <button className="edit-profile-btn">(Edit Profile - TODO)</button>
          )}
        </div>
      </div>
      
      {/* This is the magic!
        We reuse the Feed component to show ONLY this user's posts.
      */}
      <Feed
        apiUrl={apiUrl}
        user={currentUser}
        fetchUrl={`${apiUrl}/api/posts/user/${profileUser._id}`}
      />
    </div>
  );
};

export default ProfilePage;
