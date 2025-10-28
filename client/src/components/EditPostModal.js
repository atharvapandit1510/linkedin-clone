import React, { useState } from 'react';

// This component is a pop-up modal for editing a post
const EditPostModal = ({ post, onSave, onClose }) => {
  const [text, setText] = useState(post.text);

  const handleSave = () => {
    if (text.trim()) {
      onSave(post._id, text);
    }
  };

  return (
    // The backdrop darkens the screen and closes the modal on click
    <div className="modal-backdrop" onClick={onClose}>
      {/* This stops the modal from closing when you click inside it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Post</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn-cancel">
            Cancel
          </button>
          <button onClick={handleSave} className="modal-btn-save">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
