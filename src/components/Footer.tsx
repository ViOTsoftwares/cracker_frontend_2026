import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">🎆 Crackers<span>Siva</span></div>
            <p className="footer-brand-desc">
              India's most trusted crackers store. Celebrating every festival with the brightest
              fireworks since 1995.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
              <div className="footer-contact-item">
                <Phone size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>info@crackerssiva.com</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>Sivakasi, Tamil Nadu</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <div className="footer-col-title">Shop</div>
            <div className="footer-links">
              <Link to="/products">All Products</Link>
              <Link to="/products?search=sparklers">Sparklers</Link>
              <Link to="/products?search=rockets">Rockets</Link>
              <Link to="/products?search=aerial">Aerial Shots</Link>
              <Link to="/products?search=gift">Gift Boxes</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Safety Guidelines</a>
              <a href="#">Bulk Orders</a>
              <a href="#">Careers</a>
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="footer-col-title">Help</div>
            <div className="footer-links">
              <a href="#">Contact Us</a>
              <a href="#">Shipping Policy</a>
              <a href="#">Return Policy</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} CrackersSiva. All rights reserved. Made with ❤️ in Sivakasi
        </div>
      </div>
    </footer>
  );
}
