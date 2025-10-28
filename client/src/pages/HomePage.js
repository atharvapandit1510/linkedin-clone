import React from 'react';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed'; // Import the new Feed component

// HomePage now just sets up the main feed
const HomePage = ({ apiUrl, user }) => {
  return (
    <div>
      {/* Pass the main "all posts" URL to the Feed.
        Nest CreatePost inside. The Feed component will
        automatically connect them.
      */}
      <Feed
        apiUrl={apiUrl}
        user={user}
        fetchUrl={`${apiUrl}/api/posts`}
      >
        <CreatePost apiUrl={apiUrl} user={user} />
      </Feed>
    </div>
  );
};

export default HomePage;

