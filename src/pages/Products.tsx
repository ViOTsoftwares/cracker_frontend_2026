import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getProducts, type Product } from "../api/products";
import { getCategories, type Category } from "../api/categories";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import CategoryStrip from "../components/CategoryStrip";
import { ProductsGridSkeleton } from "../components/Skeleton";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const LIMIT = 20;

  const searchQuery = searchParams.get("search") || "";
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    getCategories().then((r) => setCategories(r.result || []));
  }, []);

  // Reset page when params change
  useEffect(() => { setPage(1); }, [searchQuery]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: LIMIT, sort };
      if (searchQuery) params.search = searchQuery;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await getProducts(params);
      setProducts(res.result?.list || []);
      setTotal(res.result?.count || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, category, sort, minPrice, maxPrice]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleCategoryChange = (id: string) => { setCategory(id); setPage(1); };
  const handleSortChange = (s: string) => { setSort(s); setPage(1); };
  const handlePriceChange = (min: string, max: string) => { setMinPrice(min); setMaxPrice(max); setPage(1); };

  return (
    <main style={{ minHeight: "80vh" }}>
      {/* Category strip */}
      <CategoryStrip categories={categories} selected={category} onSelect={handleCategoryChange} />

      <div className="container section">
        {/* Page Title */}
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
          </h1>
          {!loading && (
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: 3 }}>
              {total.toLocaleString()} products found
            </p>
          )}
        </div>

        {/* ── Mobile: Filter/Sort Bar ── */}
        <div className="mobile-filter-bar">
          <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
            {filterOpen ? "Hide Filters" : "Filters"}
          </button>
          <div className="mobile-sort-row">
            <label>Sort:</label>
            <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {filterOpen && (
          <div className="mobile-filter-panel">
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              sort={sort}
              onSortChange={handleSortChange}
            />
          </div>
        )}

        {/* ── Main Layout ── */}
        <div className="products-layout">
          {/* Desktop Sidebar */}
          <div className="desktop-filter-sidebar">
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              sort={sort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Products */}
          <div>
            {loading ? (
              <ProductsGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No products found</div>
                <p className="empty-sub">Try adjusting your filters or search term</p>
                <button
                  className="empty-btn"
                  onClick={() => { setCategory(""); setMinPrice(""); setMaxPrice(""); setSort("newest"); setPage(1); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`page-btn ${page === p ? "active" : ""}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    ))}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
