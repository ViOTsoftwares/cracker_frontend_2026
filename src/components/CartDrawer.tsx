import { X, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeFromCart, increment, decrement } = useCart();
  const navigate = useNavigate();

  const savings = items.reduce(
    (sum, i) => sum + (i.product.originalPrice - i.product.offerPrice) * i.quantity,
    0
  );

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingCart size={20} />
            My Cart
            {totalItems > 0 && (
              <span style={{ background: "#f97316", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
                {totalItems}
              </span>
            )}
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div className="cart-empty-text">Your cart is empty!</div>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Add crackers to get started
              </p>
              <button
                className="empty-btn"
                onClick={() => { navigate("/products"); onClose(); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="cart-item">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                ) : (
                  <div className="cart-item-img-placeholder">🎆</div>
                )}

                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">
                    ₹{(item.product.offerPrice * item.quantity).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                    ₹{item.product.offerPrice.toLocaleString()} × {item.quantity}
                  </div>

                  <div className="cart-item-controls">
                    <button className="qty-btn-sm" onClick={() => decrement(item.product._id)}>
                      <Minus size={12} />
                    </button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button className="qty-btn-sm" onClick={() => increment(item.product._id)}>
                      <Plus size={12} />
                    </button>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="cart-summary-row" style={{ color: "#10b981" }}>
                  <span>🎉 You save</span>
                  <span>₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>FREE</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button
              className="checkout-btn"
              onClick={() => { navigate("/cart"); onClose(); }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
