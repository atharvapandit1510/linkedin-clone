import React from 'react';

const Avatar = ({ src, name, className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length === 1
      ? name.charAt(0)
      : parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  };
  return (
    <span className={`avatar ${className}`}>
      {src
        ? <img src={src} alt={name} className="avatar-img" />
        : <span className="avatar-initials">{getInitials(name)}</span>
      }
    </span>
  );
};

export default Avatar;
