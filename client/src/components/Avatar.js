import React from 'react';

// Generates a simple avatar with initials
const Avatar = ({ name, className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    // Handle single-word names
    if (parts.length === 1) {
      return name.charAt(0);
    }
    // Use first and last initial
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  };

  return (
    // Uses CSS classes to be flexible
    <div className={`avatar ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
