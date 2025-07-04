import { Star, StarHalf, StarOff } from 'lucide-react';

export const StarRatingView = ({ rating, max = 5, size, showrating = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} size={size} color="#ffc107" fill="#ffc107" />
        ))}
      {hasHalf && <StarHalf size={size} color="#ffc107" fill="#ffc107" />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <StarOff key={`empty-${i}`} size={size} color="#ccc" />
        ))}
      {showrating && <label>({rating})</label>}
    </div>
  );
};
