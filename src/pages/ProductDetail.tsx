import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, Star, Share2 } from "lucide-react";
import { getProductBySlug, getRelatedProducts, type Product } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const inCart = items.find((i) => i.product._id === product?._id);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setQty(1);
    setActiveImg(0);
    getProductBySlug(slug)
      .then((res) => {
        setProduct(res.result);
        return getRelatedProducts(slug);
      })
      .then((res) => {
        setRelatedProducts(res.result || []);
      })
      .catch(() => {
        setProduct(null);
        setRelatedProducts([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);


  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`Added ${qty} × ${product.name} to cart! 🛒`);
  };

  const handleShare = async () => {
    if (!product) return;

    const frontendUrl = `${window.location.origin}/products/${product.slug}`;
    const discountText = product.originalPrice !== product.offerPrice
      ? `\n🔥 Offer Price: ₹${product.offerPrice} (Original: ₹${product.originalPrice} - ${product.discountPercentage}% OFF)`
      : `\n💰 Price: ₹${product.offerPrice}`;

    const shareText = `Hey, check out this product on CrackersSiva! 🎆\n\n*${product.name}*${discountText}${product.notes ? `\n📝 Note: ${product.notes}` : ""}\n\n👉 Buy now here:\n${frontendUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Hey, check out this product on CrackersSiva! 🎆\n\n*${product.name}*${discountText}${product.notes ? `\n📝 Note: ${product.notes}` : ""}`,
          url: frontendUrl,
        });
        toast.success("Shared successfully! 📢");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Product details and link copied to clipboard! 📋");
      })
      .catch(() => {
        toast.error("Failed to copy share link.");
      });
  };

  if (loading) {
    return (
      <div className="container section">
        <div className="detail-layout">
          <div className="skeleton" style={{ aspectRatio: "1/1", borderRadius: 16 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[80, 60, 40, 100, 80].map((w, i) => (
              <div key={i} className="skeleton skeleton-line" style={{ width: `${w}%`, height: i === 2 ? 40 : 16 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <div className="empty-title">Product Not Found</div>
          <p className="empty-sub">This product may have been removed.</p>
          <button className="empty-btn" onClick={() => navigate("/products")}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container" style={{ paddingTop: 16, paddingBottom: 48 }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/products">Products</Link>
          {product.category && (
            <>
              <span className="breadcrumb-sep">›</span>
              <Link to={`/products?category=${product.category._id}`}>{product.category.name}</Link>
            </>
          )}
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="detail-layout" style={{ marginTop: 16 }}>
          {/* Image Gallery */}
          <div className="detail-img-gallery">
            <div className="gallery-main">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name} />
              ) : (
                <div style={{ fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#fff7ed" }}>
                  🎆
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`gallery-thumb ${idx === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="detail-info">
            {product.brand && <div className="detail-brand">{product.brand}</div>}
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            {product.ratings > 0 && (
              <div className="detail-rating">
                <span className="rating-pill" style={{ fontSize: "0.88rem", padding: "4px 10px" }}>
                  {product.ratings.toFixed(1)} <Star size={14} fill="#fff" />
                </span>
                <span style={{ fontSize: "0.88rem", color: "#6b7280" }}>
                  {product.reviews?.length || 0} reviews
                </span>
              </div>
            )}

            {/* Prices */}
            <div className="detail-prices">
              <span className="detail-offer-price">₹{product.offerPrice.toLocaleString()}</span>
              {product.originalPrice !== product.offerPrice && (
                <>
                  <span className="detail-original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="detail-discount">{product.discountPercentage}% OFF</span>
                </>
              )}
            </div>

            {/* Savings */}
            {product.originalPrice !== product.offerPrice && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", color: "#15803d", fontWeight: 600 }}>
                🎉 You save ₹{(product.originalPrice - product.offerPrice).toLocaleString()} on this item!
              </div>
            )}

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <span className="stock-badge in-stock">✅ In Stock ({product.stock} available)</span>
              ) : (
                <span className="stock-badge out-of-stock">❌ Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: 8 }}>Quantity</div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              {product.stock > 0 ? (
                <>
                  <button className="btn-add-cart" onClick={handleAddToCart}>
                    <ShoppingCart size={20} />
                    {inCart ? "Add More to Cart" : "Add to Cart"}
                  </button>
                  <button className="btn-buy-now" onClick={() => { handleAddToCart(); navigate("/cart"); }}>
                    Buy Now
                  </button>
                </>
              ) : (
                <button className="btn-buy-now" disabled style={{ background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "not-allowed" }}>
                  Out of Stock
                </button>
              )}
              <button className="btn-share" onClick={handleShare} title="Share Product">
                <Share2 size={20} />
              </button>
            </div>

            {/* Delivery info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Truck size={16} style={{ color: "#10b981" }} />, text: "FREE Delivery on orders above ₹500" },
                { icon: <Shield size={16} style={{ color: "#3b82f6" }} />, text: "Certified & safe fireworks" },
                { icon: <RotateCcw size={16} style={{ color: "#f97316" }} />, text: "Easy returns within 7 days" },
              ].map((d) => (
                <div key={d.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", color: "#374151" }}>
                  {d.icon} {d.text}
                </div>
              ))}
            </div>

            {/* Safety Info */}
            {product.safetyInfo && (
              <div className="info-card">
                <div className="info-card-title">⚠️ Safety Information</div>
                <p>{product.safetyInfo}</p>
              </div>
            )}

            {/* Notes */}
            {product.notes && (
              <div className="info-card">
                <div className="info-card-title">📝 Notes</div>
                <p>{product.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section style={{ marginTop: 48, background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
              Customer Reviews ({product.reviews.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {product.reviews.slice(0, 5).map((r) => (
                <div key={r._id} style={{ padding: "16px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                      {r.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.userName}</div>
                      <div className="rating-pill" style={{ fontSize: "0.72rem", display: "inline-flex", padding: "1px 6px" }}>
                        {r.rating} <Star size={10} fill="#fff" />
                      </div>
                    </div>
                  </div>
                  {r.comment && <p style={{ fontSize: "0.88rem", color: "#374151" }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 20 }}>
              Related Products
            </h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
