import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Address } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { MapPin, Plus, ArrowLeft, ShoppingBag, FileText, CheckCircle, Package, Shield, Truck, X, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const { user, token, addAddress, placeOrder } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Redirect if no token or empty cart
  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [token, items, navigate]);

  // State variables
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [userNotes, setUserNotes] = useState<string>("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressTitle, setAddressTitle] = useState("Home");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressPhone, setAddressPhone] = useState(user?.phone || "");
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // Pre-select default address
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a: any) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [user]);

  if (!user || items.length === 0) {
    return null;
  }

  const selectedAddress = user.addresses.find((a: any) => a._id === selectedAddressId);
  let deliveryFee = 0;
  if (settings?.deliveryFeeType === "fixed") {
    deliveryFee = settings.deliveryFee || 0;
  } else if (settings?.deliveryFeeType === "percentage") {
    deliveryFee = (totalPrice * (settings.deliveryFee || 0)) / 100;
  }

  const grandTotal = totalPrice + deliveryFee;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressTitle || !addressLine1 || !city || !state || !pincode || !addressPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmittingAddress(true);
    const success = await addAddress({
      title: addressTitle,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      phone: addressPhone,
      isDefault: user.addresses.length === 0,
    });
    setSubmittingAddress(false);

    if (success) {
      setShowAddressModal(false);
      // Reset form
      setAddressTitle("Home");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPincode("");
      setAddressPhone(user.phone || "");
    }
  };

  // Common order placement API caller
  const submitOrderApi = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return null;
    }

    const orderPayload = {
      items: items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      })),
      shippingAddress: {
        title: selectedAddress.title,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || "",
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone,
      },
      paymentMethod: "cod",
      notes: userNotes,
    };

    return await placeOrder(orderPayload);
  };

  // Normal Checkout
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const result = await submitOrderApi();
      if (result) {
        clearCart();
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while placing order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="co-page">
      <div className="co-container container">

        {/* Breadcrumb / Back */}
        <button onClick={() => navigate("/cart")} className="co-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Cart</span>
        </button>

        {/* Page Header */}
        <div className="co-page-header">
          <h1 className="co-page-title">Checkout</h1>
          <p className="co-page-subtitle">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="co-steps-bar">
          <div className="co-step completed">
            <div className="co-step-circle"><ShoppingBag size={14} /></div>
            <span className="co-step-label">Cart</span>
          </div>
          <div className="co-step-line completed"></div>
          <div className="co-step active">
            <div className="co-step-circle"><FileText size={14} /></div>
            <span className="co-step-label">Checkout</span>
          </div>
          <div className="co-step-line"></div>
          <div className="co-step">
            <div className="co-step-circle"><CheckCircle size={14} /></div>
            <span className="co-step-label">Confirmation</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="co-grid">

          {/* LEFT — Form Sections */}
          <div className="co-left">

            {/* Step 1: Delivery Address */}
            <section className="co-card">
              <div className="co-card-header">
                <div className="co-card-number">1</div>
                <div>
                  <h2 className="co-card-title">Delivery Address</h2>
                  <p className="co-card-desc">Choose where you'd like your order delivered</p>
                </div>
                <button onClick={() => setShowAddressModal(true)} className="co-add-btn">
                  <Plus size={14} />
                  <span>Add New</span>
                </button>
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="co-addr-grid">
                  {user.addresses.map((addr: Address) => (
                    <div
                      key={addr._id}
                      className={`co-addr-card ${selectedAddressId === addr._id ? "selected" : ""}`}
                      onClick={() => setSelectedAddressId(addr._id)}
                    >
                      <div className="co-addr-radio">
                        <div className="co-radio-dot"></div>
                      </div>
                      <div className="co-addr-info">
                        <div className="co-addr-tag">
                          <MapPin size={12} />
                          <span>{addr.title}</span>
                        </div>
                        <p className="co-addr-line">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                        <p className="co-addr-city">{addr.city}, {addr.state} — <strong>{addr.pincode}</strong></p>
                        <p className="co-addr-phone"><Phone size={11} /> {addr.phone}</p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <div className="co-addr-check"><CheckCircle size={16} /></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="co-empty-addr">
                  <MapPin size={32} />
                  <p>No delivery address saved yet.</p>
                  <button onClick={() => setShowAddressModal(true)} className="co-empty-addr-btn">
                    <Plus size={14} /> Add Shipping Address
                  </button>
                </div>
              )}
            </section>

            {/* Step 2: Order Notes */}
            <section className="co-card">
              <div className="co-card-header">
                <div className="co-card-number">2</div>
                <div>
                  <h2 className="co-card-title">Special Instructions</h2>
                  <p className="co-card-desc">Add notes about delivery, packaging or timings</p>
                </div>
              </div>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Please call before delivery, deliver only after 5 PM, pack in double cardboard..."
                rows={3}
                className="co-notes-input"
              />
            </section>
          </div>

          {/* RIGHT — Order Summary Sidebar */}
          <aside className="co-right">
            <div className="co-summary-card">

              <h3 className="co-summary-title">
                <ShoppingBag size={18} />
                Order Summary
              </h3>

              {/* Item list */}
              <div className="co-summary-items">
                {items.map((item) => {
                  const price = item.product.offerPrice || item.product.originalPrice;
                  return (
                    <div key={item.product._id} className="co-summary-row">
                      <div className="co-item-info">
                        <span className="co-item-qty">{item.quantity}×</span>
                        <span className="co-item-name">{item.product.name}</span>
                      </div>
                      <span className="co-item-price">₹{(price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing */}
              <div className="co-pricing-section">
                <div className="co-price-row">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-price-row" style={{ alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Delivery Fee
                    {settings?.deliveryFeeType === "percentage" && (
                      <span style={{ fontSize: "0.7rem", background: "#f3f4f6", color: "#6b7280", padding: "2px 6px", borderRadius: 4 }}>
                        ({settings.deliveryFee}%)
                      </span>
                    )}
                  </span>
                  {deliveryFee > 0 ? (
                    <span style={{ fontWeight: 600, color: "#1f2937" }}>₹{deliveryFee.toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="co-free-tag" style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.02em" }}>FREE</span>
                  )}
                </div>
              </div>

              {/* Grand Total */}
              <div className="co-grand-total">
                <span>Total</span>
                <span className="co-grand-amount">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              {/* CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddressId}
                className="co-place-order-btn"
              >
                {isPlacingOrder ? (
                  <>
                    <span className="co-btn-spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    Place Order Now
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="co-trust-badges">
                <div className="co-trust-item">
                  <Shield size={14} />
                  <span>256-Bit SSL Secure</span>
                </div>
                <div className="co-trust-item">
                  <Truck size={14} />
                  <span>Direct from Sivakasi</span>
                </div>
                <div className="co-trust-item">
                  <CheckCircle size={14} />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="co-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="co-modal" onClick={(e) => e.stopPropagation()}>
            <div className="co-modal-top">
              <div>
                <h3 className="co-modal-title">Add New Address</h3>
                <p className="co-modal-desc">Enter your delivery address details</p>
              </div>
              <button className="co-modal-close" onClick={() => setShowAddressModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="co-modal-form">
              {/* Address Type Pills */}
              <div className="co-form-group co-full-width">
                <label>Address Type</label>
                <div className="co-type-pills">
                  {["Home", "Work", "Office", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`co-pill ${addressTitle === t ? "active" : ""}`}
                      onClick={() => setAddressTitle(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="co-form-group co-full-width">
                <label htmlFor="addr-line1">Address Line 1 <span className="co-req">*</span></label>
                <input
                  id="addr-line1"
                  type="text"
                  placeholder="Door No, Street Name, Locality"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                />
              </div>

              <div className="co-form-group co-full-width">
                <label htmlFor="addr-line2">Address Line 2 <span className="co-optional">(Optional)</span></label>
                <input
                  id="addr-line2"
                  type="text"
                  placeholder="Apartment, Landmark, Area"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>

              <div className="co-form-row">
                <div className="co-form-group">
                  <label htmlFor="addr-city">City / Town <span className="co-req">*</span></label>
                  <input
                    id="addr-city"
                    type="text"
                    placeholder="Sivakasi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="co-form-group">
                  <label htmlFor="addr-state">State <span className="co-req">*</span></label>
                  <input
                    id="addr-state"
                    type="text"
                    placeholder="Tamil Nadu"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="co-form-row">
                <div className="co-form-group">
                  <label htmlFor="addr-pin">Pincode <span className="co-req">*</span></label>
                  <input
                    id="addr-pin"
                    type="text"
                    placeholder="626123"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="co-form-group">
                  <label htmlFor="addr-phone">Phone Number <span className="co-req">*</span></label>
                  <input
                    id="addr-phone"
                    type="text"
                    placeholder="10-digit number"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={submittingAddress} className="co-modal-submit">
                {submittingAddress ? "Saving Address..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
