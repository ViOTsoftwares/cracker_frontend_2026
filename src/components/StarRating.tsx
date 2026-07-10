import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

export default function StarRating({ rating, count, size = 12 }: StarRatingProps) {
  return (
    <div className="product-card-rating">
      <span className="rating-pill">
        {rating.toFixed(1)} <Star size={size - 2} fill="#fff" />
      </span>
      {count !== undefined && (
        <span className="rating-count">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
