import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-title">Page Not Found</div>
                  <p className="empty-sub">The page you're looking for doesn't exist.</p>
                  <a href="/" className="empty-btn" style={{ display: "inline-block", padding: "10px 24px" }}>
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e3a5f",
              color: "#fff",
              borderRadius: "10px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.88rem",
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: "#f97316", secondary: "#fff" },
            },
          }}
        />
      </BrowserRouter>
    </CartProvider>
  );
}
