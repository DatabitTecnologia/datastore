import React from 'react';
import { FaStar } from 'react-icons/fa';

export const StarRatingInput = ({ rating, onChange, size = 24 }) => {
  const handleClick = (value) => {
    onChange(value);
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          color={star <= rating ? '#f1c40f' : '#ccc'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};
