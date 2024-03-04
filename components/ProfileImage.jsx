import React from 'react';

const ProfileImage = ({ src, alt }) => {
  return (
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  );
};

export default ProfileImage;
