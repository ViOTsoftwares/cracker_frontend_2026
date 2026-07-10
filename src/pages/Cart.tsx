import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, totalItems, totalPrice, removeFromCart, increment, decrement, clearCart } = useCart();
  const navigate = useNavigate();

  const savings = items.reduce(
    (sum, i) => sum + (i.product.originalPrice - i.product.offerPrice) * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty!</div>
          <p className="empty-sub">You haven't added any crackers yet.</p>
          <Link to="/products" className="empty-btn" style={{ display: "inline-block" }}>
            Start Shopping 🎆
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingCart size={20} style={{ color: "#f97316" }} />
            My Cart ({totalItems})
          </h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/products" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "#6b7280", fontWeight: 500 }}>
              <ArrowLeft size={15} /> Continue Shopping
            </Link>
            <button
              onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: 600, border: "none", background: "none", cursor: "pointer" }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="cart-page-layout">
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => (
              <div
                key={item.product._id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: "12px 14px",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                {/* Image */}
                <Link to={`/products/${item.product.slug}`} style={{ flexShrink: 0 }}>
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #f3f4f6" }}
                    />
                  ) : (
                    <div style={{ width: 80, height: 80, background: "#fff7ed", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                      🎆
                    </div>
                  )}
                </Link>

                {/* Info — takes remaining space, min-width:0 prevents overflow */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item.product.slug}`}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.3, marginBottom: 3,
                      overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {item.product.name}
                    </div>
                  </Link>
                  {item.product.brand && (
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                      {item.product.brand}
                    </div>
                  )}

                  {/* Price row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.98rem" }}>
                      ₹{item.product.offerPrice.toLocaleString()}
                    </span>
                    {item.product.originalPrice !== item.product.offerPrice && (
                      <span style={{ fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through" }}>
                        ₹{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {item.product.discountPercentage > 0 && (
                      <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.68rem", fontWeight: 700, padding: "1px 6px", borderRadius: 4 }}>
                        {item.product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Controls row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                    <div className="qty-control" style={{ transform: "scale(.9)", transformOrigin: "left" }}>
                      <button className="qty-btn" onClick={() => decrement(item.product._id)}><Minus size={13} /></button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => increment(item.product._id)}><Plus size={13} /></button>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827" }}>
                      = ₹{(item.product.offerPrice * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => { removeFromCart(item.product._id); toast.success("Removed from cart"); }}
                      style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: "#ef4444", border: "none", background: "none", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer" }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary — stacks below on mobile, sidebar on desktop */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px", position: "sticky", top: 76 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #e5e7eb" }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#6b7280" }}>
                <span>MRP ({totalItems} items)</span>
                <span>₹{items.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0).toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#10b981", fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#6b7280" }}>
                <span>Delivery</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 700, paddingTop: 14, borderTop: "1px solid #e5e7eb" }}>
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {savings > 0 && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px", fontSize: "0.83rem", color: "#15803d", fontWeight: 600, marginBottom: 14 }}>
                🎉 You save ₹{savings.toLocaleString()} on this order!
              </div>
            )}

            <button className="checkout-btn" onClick={() => toast("Checkout coming soon! 🚀")}>
              Proceed to Checkout →
            </button>
            <p style={{ textAlign: "center", fontSize: "0.76rem", color: "#9ca3af", marginTop: 10 }}>
              🔒 Secure & Safe Checkout
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
