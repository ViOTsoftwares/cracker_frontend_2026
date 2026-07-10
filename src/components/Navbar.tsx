import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Flame, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const subNavItems = [
    "All Products", "Sparklers", "Ground Chakkar",
    "Aerial Shots", "Rockets", "Flower Pots",
  ];

  return (
    <>
      <nav className="navbar">
        {/* ── Main Nav Bar ── */}
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🎆</div>
            <div className="navbar-logo-text">
              Crackers<span>Siva</span>
            </div>
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

        {/* Sub Nav — Desktop */}
        <div className="subnav-bar">
          <div className="container subnav-inner">
            {subNavItems.map((item) => (
              <Link
                key={item}
                to={`/products?search=${encodeURIComponent(item === "All Products" ? "" : item)}`}
                className="subnav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-items">
              {subNavItems.map((item) => (
                <Link
                  key={item}
                  to={`/products?search=${encodeURIComponent(item === "All Products" ? "" : item)}`}
                  className="mobile-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link to="/cart" className="mobile-menu-item mobile-menu-cart" onClick={() => setMenuOpen(false)}>
                <ShoppingCart size={16} /> My Cart
                {totalItems > 0 && <span className="cart-badge" style={{ position: "static", marginLeft: 4 }}>{totalItems}</span>}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
