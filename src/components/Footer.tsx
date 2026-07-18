import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Flame, Heart } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { getImageUrl } from "../utils/imageHelper";

export default function Footer() {
  const { settings } = useSettings();

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
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              {settings.logo ? (
                <img
                  src={getImageUrl(settings.logo, "logos")}
                  alt={settings.project}
                  style={{ height: "32px", width: "auto", objectFit: "contain", borderRadius: "4px" }}
                />
              ) : (
                <span style={{ display: "flex", alignItems: "center" }}><Flame size={24} color="#f97316" /></span>
              )}
              {renderLogoText(settings.project)}
            </div>
            <p className="footer-brand-desc">
              India's most trusted crackers store. Celebrating every festival with the brightest
              fireworks since 1995.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
              <div className="footer-contact-item">
                <Phone size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>{settings.phone}</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>{settings.email}</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={13} style={{ color: "#f97316", flexShrink: 0 }} />
                <span>{settings.address}</span>
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
              <Link to="/about">About Us</Link>
              <a href="#">Safety Guidelines</a>
              <a href="#">Bulk Orders</a>
              <a href="#">Careers</a>
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="footer-col-title">Help</div>
            <div className="footer-links">
              <a href={`tel:${settings.phone || ""}`}>Contact Support</a>
              <Link to="/page/SHIPPING_POLICY">Shipping Policy</Link>
              <Link to="/page/REFUND_POLICY">Refund Policy</Link>
              <Link to="/page/PRIVACY_POLICY">Privacy Policy</Link>
              <Link to="/page/TEAMS_OF_SERVICES">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} {settings.project}. All rights reserved. Made with <Heart size={14} fill="#ef4444" color="#ef4444" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> in Sivakasi
        </div>
      </div>
    </footer>
  );
}
