import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap } from "lucide-react";
import { getBanners, type Banner } from "../api/banners";
import { getCategories, type Category } from "../api/categories";
import { getFeaturedProducts, getProducts, type Product } from "../api/products";
import BannerSlider from "../components/BannerSlider";
import CategoryStrip from "../components/CategoryStrip";
import ProductCard from "../components/ProductCard";
import { BannerSkeleton, ProductsGridSkeleton } from "../components/Skeleton";

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  useEffect(() => {
    getBanners()
      .then((r) => setBanners(r.result || []))
      .finally(() => setLoadingBanners(false));

    getCategories()
      .then((r) => setCategories(r.result || []));

    getFeaturedProducts()
      .then((r) => setFeatured(r.result || []))
      .finally(() => setLoadingFeatured(false));

    getProducts({ limit: 10, sort: "newest" })
      .then((r) => setNewArrivals(r.result?.list || []))
      .finally(() => setLoadingNew(false));
  }, []);

  return (
    <main>
      {/* Banner Slider */}
      <div className="banner-section">
        {loadingBanners ? <BannerSkeleton /> : <BannerSlider banners={banners} />}
      </div>

      {/* Category Strip */}
      <CategoryStrip categories={categories} />

      {/* Promo Strip */}
      <div className="promo-strip">
        <div className="container">
          <div className="promo-strip-inner">
            {[
              { icon: "🚚", text: "FREE Delivery on ₹500+" },
              { icon: "✅", text: "100% Authentic" },
              { icon: "🔒", text: "Safety Certified" },
              { icon: "🎆", text: "Factory Price" },
            ].map((item) => (
              <div key={item.text} className="promo-item">
                <span className="promo-item-icon">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {(loadingFeatured || featured.length > 0) && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-title">
                <Zap size={16} style={{ color: "#f97316", flexShrink: 0 }} />
                Featured Products
              </div>
              <Link to="/products" className="section-link">
                View All <ChevronRight size={15} />
              </Link>
            </div>
            {loadingFeatured ? (
              <ProductsGridSkeleton count={8} />
            ) : (
              <div className="products-grid">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Deal Banner */}
      <div className="deal-banner">
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎆🎇✨</div>
        <h2>Diwali Mega Sale is LIVE!</h2>
        <p>Up to 60% off on all premium crackers. Limited stock!</p>
        <Link to="/products" className="deal-btn">Shop Now →</Link>
      </div>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">New Arrivals</div>
            <Link to="/products?sort=newest" className="section-link">
              View All <ChevronRight size={15} />
            </Link>
          </div>
          {loadingNew ? (
            <ProductsGridSkeleton count={8} />
          ) : newArrivals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎆</div>
              <div className="empty-title">No products yet</div>
              <p className="empty-sub">Products will appear here once added.</p>
            </div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ background: "#fff", padding: "32px 0" }}>
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: "🏆", title: "30+ Years Experience", desc: "Trusted retailer since 1995" },
              { icon: "🌟", title: "10,000+ Customers", desc: "Celebrating across India" },
              { icon: "🛡️", title: "Safety Certified", desc: "IS:9766 certified products" },
              { icon: "📦", title: "Pan India Delivery", desc: "All major cities covered" },
            ].map((b) => (
              <div key={b.title} className="trust-card">
                <span className="trust-icon">{b.icon}</span>
                <div>
                  <div className="trust-title">{b.title}</div>
                  <div className="trust-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
