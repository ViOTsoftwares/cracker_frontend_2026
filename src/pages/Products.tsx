import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { getProducts, type Product } from "../api/products";
import { getCategories, type Category } from "../api/categories";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import CategoryStrip from "../components/CategoryStrip";
import { ProductsGridSkeleton } from "../components/Skeleton";
import SEO from "../components/SEO";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const LIMIT = 20;

  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = parseInt(searchParams.get("page") || "1") || 1;

  const setPage = (p: number | ((prev: number) => number)) => {
    const nextVal = typeof p === "function" ? p(page) : p;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(nextVal));
    setSearchParams(newParams);
  };

  useEffect(() => {
    getCategories().then((r) => setCategories(r.result || []));
  }, []);

  // Reset page when search query changes
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

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };
  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSortChange = (s: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (s) {
      newParams.set("sort", s);
    } else {
      newParams.delete("sort");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePriceChange = (min: string, max: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set("minPrice", min);
    else newParams.delete("minPrice");

    if (max) newParams.set("maxPrice", max);
    else newParams.delete("maxPrice");

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set("search", searchQuery);
    }
    setSearchParams(newParams);
  };

  return (
    <main style={{ minHeight: "80vh" }}>
      <SEO 
        title={category && category !== "all" ? `${categories.find(c => c.slug === category)?.name || "Products"}` : "All Products"} 
        description="Browse our wide selection of premium crackers for all occasions."
      />
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
                  onClick={handleClearAll}
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
                    {getPageNumbers().map((p, index) => (
                      <button
                        key={index}
                        className={`page-btn ${page === p ? "active" : ""} ${p === "..." ? "dots" : ""}`}
                        disabled={p === "..."}
                        onClick={() => p !== "..." && setPage(p as number)}
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
