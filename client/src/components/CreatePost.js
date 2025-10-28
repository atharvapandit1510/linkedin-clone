import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from './Avatar';

// 'onPostCreated' will be injected by the new Feed component
const CreatePost = ({ apiUrl, onPostCreated, user }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null); // State for the image file
  const [preview, setPreview] = useState(null); // State for the image preview URL

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    // This is a cleanup function to prevent memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a temporary local URL for the image preview
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setFile(null);
    setPreview(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return; // Don't post if empty

    // We must use FormData to send a file
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('image', file);
    }

    try {
      // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
      const res = await axios.post(`${apiUrl}/api/posts`, formData);
      
      onPostCreated(res.data); // Add the new post to the feed
      
      // Reset form
      setText('');
      setFile(null);
      setPreview(null);
      if (preview) URL.revokeObjectURL(preview);

    } catch (err) {
      console.error('Error creating post', err);
      alert('Error creating post. Check console for details.');
    }
  };

  return (
    <div className="card">
      <form onSubmit={onSubmit} className="create-post-form">
        <div className="create-post-top">
          <Avatar name={user.name} className="post-avatar" />
          <textarea
            rows="3"
            placeholder={`What's on your mind, ${user.name}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        {/* --- IMAGE PREVIEW --- */}
        {preview && (
          <div className="create-post-preview">
            <img src={preview} alt="Upload preview" />
            <button type="button" onClick={clearPreview} className="preview-clear-btn">X</button>
          </div>
        )}
        {/* --- END PREVIEW --- */}
        
        <div className="create-post-actions">
          
          {/* --- UPDATED FILE INPUT --- */}
          <label className={`file-input-label ${file ? 'file-selected' : ''}`}>
            {/* Simple inline SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            
            {/* Show filename if selected, otherwise "Add Image" */}
            <span>{file ? file.name : 'Add Image'}</span>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
              key={file ? file.name : 'empty'}
            />
          </label>
          {/* --- END FILE INPUT --- */}

          <button type="submit" className="post-submit-btn" disabled={!text.trim() && !file}>
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

