import React, { useState } from 'react';

const EditPostModal = ({ post, onSave, onClose }) => {
  const [text, setText] = useState(post.text);

  const handleSave = () => {
    if (text.trim()) {
      onSave(post._id, text);
    }
  };

  // Animation: smooth fade-in
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <h3>Edit Post</h3>
        <textarea
          className="edit-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
