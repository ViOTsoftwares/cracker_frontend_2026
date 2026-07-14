import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { Address, Order } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Home as HomeIcon,
  Briefcase,
  Star,
  X,
  Upload,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { getImageUrl } from "../utils/imageHelper";

export default function Profile() {
  const {
    user,
    token,
    loading,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchOrders,
  } = useAuth();
  const navigate = useNavigate();

  // Active Tab: "profile" | "addresses" | "orders"
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">("profile");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !token) {
      navigate("/login?redirect=/profile");
    }
  }, [loading, token, navigate]);

  // Profile Edit State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressTitle, setAddressTitle] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Load profile variables
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setProfileImagePreview(getImageUrl(user.profileImage, "profiles"));
    }
  }, [user]);

  // Load orders history when clicking the orders tab
  useEffect(() => {
    if (activeTab === "orders" && token) {
      const getOrders = async () => {
        setLoadingOrders(true);
        const list = await fetchOrders();
        setOrders(list);
        setLoadingOrders(false);
      };
      getOrders();
    }
  }, [activeTab, token, fetchOrders]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="skeleton-body" style={{ width: 300 }}>
          <div className="skeleton skeleton-line w-full" style={{ height: 40 }} />
          <div className="skeleton skeleton-line w-3-4" style={{ height: 20 }} />
        </div>
      </div>
    );
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    await updateProfile(name, phone, profileImageFile);
    setUpdatingProfile(false);
    setProfileImageFile(null);
  };

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddressTitle("Home");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPincode("");
    setAddressPhone(user.phone || "");
    setIsDefault(user.addresses.length === 0);
    setModalOpen(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddress(addr);
    setAddressTitle(addr.title);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || "");
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setAddressPhone(addr.phone);
    setIsDefault(addr.isDefault);
    setModalOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressTitle || !addressLine1 || !city || !state || !pincode || !addressPhone) return;

    setSubmittingAddress(true);
    const payload = {
      title: addressTitle,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      phone: addressPhone,
      isDefault,
    };

    let success = false;
    if (editingAddress) {
      success = await updateAddress(editingAddress._id, payload);
    } else {
      success = await addAddress(payload);
    }

    setSubmittingAddress(false);
    if (success) {
      setModalOpen(false);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    await updateAddress(addrId, { isDefault: true });
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addrId);
    }
  };

  const getAddressIcon = (title: string) => {
    const lowTitle = title.toLowerCase();
    if (lowTitle.includes("home")) return <HomeIcon size={16} />;
    if (lowTitle.includes("work") || lowTitle.includes("office")) return <Briefcase size={16} />;
    return <MapPin size={16} />;
  };

  const getOrderStatusPill = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="status-pill status-pending"><Clock size={12} /> Pending</span>;
      case "processing":
        return <span className="status-pill status-processing"><Clock size={12} /> Processing</span>;
      case "shipped":
        return <span className="status-pill status-shipped"><Truck size={12} /> Shipped</span>;
      case "delivered":
        return <span className="status-pill status-delivered"><CheckCircle size={12} /> Delivered</span>;
      case "cancelled":
        return <span className="status-pill status-cancelled"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  const getPaymentStatusPill = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="status-pill status-delivered">Paid</span>;
      case "failed":
        return <span className="status-pill status-cancelled">Failed</span>;
      default:
        return <span className="status-pill status-pending">Pending</span>;
    }
  };

  return (
    <div className="profile-container container">
      <div className="dashboard-grid">
        {/* Navigation Sidebar */}
        <div className="dashboard-sidebar">
          <div className="user-sidebar-card">
            <div className="sidebar-avatar-wrap">
              <img
                src={profileImagePreview}
                alt={user.name || "Customer"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.svg";
                }}
              />
            </div>
            <h3>{user.name || "Customer"}</h3>
            <p>{user.email}</p>
          </div>

          <div className="sidebar-menu">
            <button
              className={`sidebar-menu-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
            <button
              className={`sidebar-menu-btn ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <MapPin size={18} />
              <span>Saved Addresses</span>
            </button>
            <button
              className={`sidebar-menu-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="dashboard-content">
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div className="dashboard-pane animate-fade-in">
              <div className="pane-header">
                <h2>Account Profile</h2>
                <p>Configure your personal display details and contact number.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="avatar-upload-container">
                  <div className="avatar-preview-wrap">
                    <img
                      src={profileImagePreview}
                      alt="Avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.svg";
                      }}
                    />
                    <label htmlFor="avatar-file" className="avatar-edit-overlay">
                      <Upload size={16} />
                    </label>
                  </div>
                  <input
                    id="avatar-file"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: "none" }}
                  />
                  <span className="avatar-upload-hint">Click image to upload custom profile picture</span>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="text" value={user.email} disabled className="readonly-input" />
                  <span className="input-info-text">Email address is bound to account and cannot be changed.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="profile-name">Full Name</label>
                  <div className="input-with-icon">
                    <User className="input-icon" size={18} />
                    <input
                      id="profile-name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="profile-phone">Mobile Phone</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={18} />
                    <input
                      id="profile-phone"
                      type="text"
                      placeholder="10-digit Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <button type="submit" className="profile-submit-btn" disabled={updatingProfile}>
                  {updatingProfile ? "Updating Account..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="dashboard-pane animate-fade-in">
              <div className="pane-header flex-row-between">
                <div>
                  <h2>Saved Addresses</h2>
                  <p>Configure multiple delivery addresses for checking out quickly.</p>
                </div>
                <button className="add-address-btn" onClick={openAddAddressModal}>
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="address-list">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div key={addr._id} className={`address-card ${addr.isDefault ? "active" : ""}`}>
                      <div className="address-card-header">
                        <div className="address-type-label">
                          {getAddressIcon(addr.title)}
                          <span>{addr.title}</span>
                        </div>
                        {addr.isDefault && (
                          <span className="default-pill">
                            <Star size={12} fill="currentColor" />
                            Default
                          </span>
                        )}
                      </div>

                      <div className="address-details">
                        <p className="address-lines">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        </p>
                        <p className="address-city-state">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="address-phone-num">
                          <Phone size={13} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                          <span>{addr.phone}</span>
                        </p>
                      </div>

                      <div className="address-actions-bar">
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr._id)} className="action-btn set-default-action">
                            Set Default
                          </button>
                        )}
                        <button onClick={() => openEditAddressModal(addr)} className="action-btn edit-action" title="Edit Address">
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="action-btn delete-action" title="Delete Address">
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-address-state">
                    <div className="empty-address-icon">📍</div>
                    <h3>No Saved Address</h3>
                    <p>Add a shipping address to place orders seamlessly.</p>
                    <button className="empty-address-btn" onClick={openAddAddressModal}>
                      Add Address Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="dashboard-pane animate-fade-in">
              <div className="pane-header">
                <h2>Order History</h2>
                <p>View your past order invoices and real-time delivery status.</p>
              </div>

              {loadingOrders ? (
                <div style={{ padding: "40px 0" }}>
                  <div className="skeleton skeleton-line w-full" style={{ height: 100, marginBottom: 16 }} />
                  <div className="skeleton skeleton-line w-full" style={{ height: 100 }} />
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-history-list">
                  {orders.map((ord) => (
                    <div key={ord._id} className="order-history-card">
                      <div className="order-history-header">
                        <div className="order-main-meta">
                          <span className="order-id-txt">{ord.orderId}</span>
                          <span className="order-date-txt">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="order-status-badge-wrap">
                          {getOrderStatusPill(ord.orderStatus)}
                        </div>
                      </div>

                      <div className="order-items-preview-row">
                        <div className="preview-thumbnails-wrap">
                          {ord.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="preview-thumb-img">
                              <img
                                src={getImageUrl(item.product?.images?.[0], "products")}
                                alt={item.product?.name || "Product"}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                }}
                              />
                              <span className="thumb-qty">x{item.quantity}</span>
                            </div>
                          ))}
                          {ord.items.length > 3 && (
                            <div className="preview-thumb-more">
                              +{ord.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="order-total-block">
                          <span className="tot-lbl">Total Amount</span>
                          <span className="tot-val">₹{ord.total.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="order-footer-bar">
                        <span className="payment-method-lbl">
                          Payment: <strong>{ord.paymentMethod.toUpperCase()}</strong> ({ord.paymentStatus})
                        </span>
                        <button
                          className="view-details-action"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setOrderModalOpen(true);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-address-state">
                  <div className="empty-address-icon">📦</div>
                  <h3>No Orders Found</h3>
                  <p>You haven't placed any orders yet. Start shopping Diwali premium fireworks!</p>
                  <button className="empty-address-btn" onClick={() => navigate("/products")}>
                    Shop Fireworks
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card animate-slide-up">
            <div className="modal-header">
              <h3>{editingAddress ? "Update Address" : "Add Shipping Address"}</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Address Type / Title</label>
                  <div className="address-title-selects">
                    {["Home", "Work", "Office", "Other"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`title-pill-btn ${addressTitle === t ? "active" : ""}`}
                        onClick={() => setAddressTitle(t)}
                      >
                        {t}
                      </button>
                    ))}
                    {addressTitle !== "Home" && addressTitle !== "Work" && addressTitle !== "Office" && addressTitle !== "Other" && (
                      <input
                        type="text"
                        placeholder="Custom Title"
                        value={addressTitle}
                        onChange={(e) => setAddressTitle(e.target.value)}
                        className="custom-title-input"
                      />
                    )}
                  </div>
                </div>

                <div className="form-group span-2">
                  <label htmlFor="addr-line1">Address Line 1</label>
                  <input
                    id="addr-line1"
                    type="text"
                    placeholder="Door No, Street Name, Locality"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group span-2">
                  <label htmlFor="addr-line2">Address Line 2 (Optional)</label>
                  <input
                    id="addr-line2"
                    type="text"
                    placeholder="Apartment, Landmark, Area"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addr-city">City / Town</label>
                  <input
                    id="addr-city"
                    type="text"
                    placeholder="Sivakasi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addr-state">State</label>
                  <input
                    id="addr-state"
                    type="text"
                    placeholder="Tamil Nadu"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addr-pin">Pincode</label>
                  <input
                    id="addr-pin"
                    type="text"
                    maxLength={6}
                    placeholder="626123"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addr-phone">Contact Phone</label>
                  <input
                    id="addr-phone"
                    type="text"
                    placeholder="10-digit number"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <div className="form-group span-2 flex-row">
                  <input
                    id="addr-default"
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    disabled={editingAddress?.isDefault}
                  />
                  <label htmlFor="addr-default" style={{ cursor: "pointer", textTransform: "none", fontSize: "0.86rem" }}>
                    Set this as my default shipping address
                  </label>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={submittingAddress}>
                  {submittingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {orderModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-card animate-slide-up" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>Order Invoice Details</h3>
              <button className="modal-close-btn" onClick={() => setOrderModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="order-details-modal-body">
              <div className="order-quick-summary">
                <div>
                  <span className="lbl">Order ID</span>
                  <span className="val">{selectedOrder.orderId}</span>
                </div>
                <div>
                  <span className="lbl">Order Date</span>
                  <span className="val">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="lbl">Status</span>
                  <span className="val">{getOrderStatusPill(selectedOrder.orderStatus)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="details-section">
                <h4>Shipping details</h4>
                <div className="shipping-address-summary">
                  <strong>{selectedOrder.shippingAddress.title}</strong>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="details-section">
                <h4>Items purchased</h4>
                <div className="details-items-table">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="details-item-row">
                      <img
                        src={getImageUrl(item.product?.images?.[0], "products")}
                        alt={item.product?.name || "Product"}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                        className="details-item-thumb"
                      />
                      <div className="details-item-meta">
                        <strong className="item-name">{item.product?.name || "Fireworks Item"}</strong>
                        <span className="item-brand">{item.product?.brand || "Brand"}</span>
                      </div>
                      <div className="details-item-price-qty">
                        <span>₹{item.price.toLocaleString("en-IN")} x {item.quantity}</span>
                        <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tally Summary */}
              <div className="details-section tally-section">
                <div className="tally-row">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="tally-row">
                  <span>Discount</span>
                  <span>₹{selectedOrder.discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="tally-row">
                  <span>Delivery Fee</span>
                  <span>{selectedOrder.deliveryFee && selectedOrder.deliveryFee > 0 ? `₹${selectedOrder.deliveryFee.toLocaleString("en-IN")}` : "FREE"}</span>
                </div>
                <div className="tally-row grand-total">
                  <span>Grand Total</span>
                  <span>₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="payment-info-tag">
                  <span>Method: <strong>{selectedOrder.paymentMethod.toUpperCase()}</strong></span>
                  <span>Payment status: {getPaymentStatusPill(selectedOrder.paymentStatus)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar" style={{ padding: 16 }}>
              <button className="btn-cancel" onClick={() => setOrderModalOpen(false)}>
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
