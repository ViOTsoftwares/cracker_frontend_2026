import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Flame, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";
import { getImageUrl } from "../utils/imageHelper";
import CartDrawer from "./CartDrawer";
import { getCategories, type Category } from "../api/categories";

export default function Navbar() {
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.result || []));
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMenuOpen(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const renderLogoText = (name: string) => {
    if (name.toLowerCase().startsWith("crackers")) {
      const rest = name.substring(8);
      return (
        <>
          Crackers<span>{rest}</span>
        </>
      );
    }
    return <>{name}</>;
  };

  return (
    <>
      <nav className="navbar">
        {/* ── Main Nav Bar ── */}
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            {settings.logo ? (
              <img
                src={getImageUrl(settings.logo, "logos")}
                alt={settings.project}
                className="navbar-logo-img"
              />
            ) : (
              <>
                <div className="navbar-logo-icon"><Flame size={20} color="#fff" /></div>
                <span className="navbar-logo-text">{renderLogoText(settings.project || "Crackers Siva")}</span>
              </>
            )}
          </Link>

          {/* Desktop Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search crackers, fireworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="navbar-search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            <Link to="/products" className="nav-btn nav-offers-btn">
              <Flame size={16} />
              <span>Offers</span>
            </Link>
            <button
              className="nav-btn nav-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>
              )}
            </button>
            {user ? (
              <div className="nav-user-dropdown-container" style={{ display: "flex", gap: "6px" }}>
                <Link to="/profile" className="nav-btn" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img
                    src={getImageUrl(user.profileImage, "profiles")}
                    alt="User"
                    style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-avatar.svg";
                    }}
                  />
                  <span>{user.name || user.email.split("@")[0]}</span>
                </Link>
                <button onClick={handleLogoutClick} className="nav-btn" title="Logout" style={{ padding: "8px 10px", background: "rgba(239, 68, 68, 0.2)" }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-btn nav-login-btn" style={{ background: "var(--primary)" }}>
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="mobile-nav-icons">
            <button
              className="mobile-icon-btn"
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="mobile-icon-btn nav-cart-btn-mobile"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              style={{ position: "relative" }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>
              )}
            </button>
            <button
              className="mobile-icon-btn"
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="mobile-search-bar">
            <form onSubmit={handleSearch} style={{ display: "flex", width: "100%" }}>
              <input
                autoFocus
                type="text"
                className="mobile-search-input"
                placeholder="Search crackers, fireworks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="mobile-search-submit">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="mobile-menu">
            {/* Top User Card / Login Section */}
            <div className="mobile-menu-header">
              {user ? (
                <div className="mobile-menu-user-card">
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.profileImage ? (
                        <img src={getImageUrl(user.profileImage, "users")} alt="" />
                      ) : (
                        <span>{(user.name || user.email || "U")[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">{user.name || "My Account"}</div>
                      <div className="mobile-user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="mobile-user-actions">
                    <Link to="/profile" className="mobile-action-pill" onClick={() => setMenuOpen(false)}>
                      <UserIcon size={14} /> My Profile
                    </Link>
                    <button onClick={handleLogoutClick} className="mobile-action-pill logout" type="button">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mobile-menu-auth-card">
                  <div className="mobile-auth-text">
                    <div className="mobile-auth-title">Welcome!</div>
                    <div className="mobile-auth-sub">Sign in to track orders & view offers</div>
                  </div>
                  <Link to="/login" className="mobile-login-btn" onClick={() => setMenuOpen(false)}>
                    <UserIcon size={16} /> Login / Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Cart Bar */}
            <div className="mobile-menu-quick-bar">
              <Link 
                to="/cart" 
                className="mobile-quick-cart-btn" 
                onClick={() => setMenuOpen(false)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ShoppingCart size={18} />
                  <span>My Cart</span>
                </div>
                <span className="mobile-quick-cart-count">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </Link>
            </div>

            {/* Category Section Header */}
            <div className="mobile-menu-section-header">
              <span>Categories</span>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="mobile-view-all-link">
                All Products →
              </Link>
            </div>

            {/* Scrollable Categories List */}
            <div className="mobile-menu-items">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug}`}
                  className="mobile-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={15} style={{ opacity: 0.4 }} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon-circle">
              <LogOut size={26} color="#ef4444" />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-modal-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-modal-confirm-btn"
                onClick={confirmLogout}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


