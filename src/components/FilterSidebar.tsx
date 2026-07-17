import { useState } from "react";
import type { Category } from "../api/categories";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  sort,
  onSortChange,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handleApplyPrice = () => onPriceChange(localMin, localMax);
  const handleClearAll = () => {
    onCategoryChange("");
    setLocalMin(""); setLocalMax("");
    onPriceChange("", "");
    onSortChange("newest");
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-title">
        Filters
        <button className="filter-clear" onClick={handleClearAll}>Clear All</button>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <div className="filter-group-title">Sort By</div>
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="filter-group">
        <div className="filter-group-title">Category</div>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={selectedCategory === ""}
            onChange={() => onCategoryChange("")}
          />
          All Categories
        </label>
        {categories.map((cat) => (
          <label key={cat._id} className="filter-option">
            <input
              type="checkbox"
              checked={selectedCategory === cat.slug}
              onChange={() => onCategoryChange(cat.slug === selectedCategory ? "" : cat.slug)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <div className="filter-group-title">Price Range (₹)</div>
        <div className="price-range-inputs">
          <input
            type="number"
            className="price-input"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
          />
          <span style={{ color: "#9ca3af", fontWeight: 600 }}>—</span>
          <input
            type="number"
            className="price-input"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
          />
        </div>
        <button className="apply-btn" onClick={handleApplyPrice}>Apply Price</button>
      </div>
    </div>
  );
}
