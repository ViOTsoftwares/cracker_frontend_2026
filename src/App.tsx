import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchSettings } from "./store/slices/settingsSlice";
import { initAuth } from "./store/slices/authSlice";
import { getImageUrl } from "./utils/imageHelper";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Fireworks from "./components/Fireworks";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import HelpPage from "./pages/HelpPage";
import About from "./pages/About";

function AppContent() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.settings);

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(initAuth());
  }, [dispatch]);

  // Update favicon dynamically when site settings logo is loaded
  useEffect(() => {
    if (settings?.logo) {
      const logoUrl = getImageUrl(settings.logo, "logos");
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [settings?.logo]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Fireworks />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/page/:identifier" element={<HelpPage />} />
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
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
