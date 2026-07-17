import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../api/products";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/imageHelper";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`, { duration: 2000 });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="product-card-img-wrap">
        <img
          src={getImageUrl(product.images?.[0], "products")}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith("/placeholder.jpg")) return;
            target.src = "/placeholder.jpg";
          }}
        />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">{product.discountPercentage}% OFF</span>
        )}
        {product.isFeatured && (
          <span className="featured-badge">⭐ Featured</span>
        )}
      </div>

      <div className="product-card-body">
        {product.brand && (
          <div className="product-card-brand">{product.brand}</div>
        )}
        <div className="product-card-name">{product.name}</div>

        <div className="product-card-prices">
          <span className="offer-price">₹{product.offerPrice.toLocaleString()}</span>
          {product.originalPrice !== product.offerPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {product.ratings > 0 && (
          <StarRating rating={product.ratings} count={product.reviews?.length} />
        )}

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={15} />
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
