import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ apiUrl, onPostCreated }) => {
  const [text, setText] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`${apiUrl}/api/posts`, { text });
      setText('');
      onPostCreated();
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="create-post-form">
      <textarea
        rows="3"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;