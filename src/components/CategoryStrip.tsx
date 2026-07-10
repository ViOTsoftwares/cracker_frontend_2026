import { useNavigate } from "react-router-dom";
import type { Category } from "../api/categories";

interface CategoryStripProps {
  categories: Category[];
  selected?: string;
  onSelect?: (id: string) => void;
}

const EMOJI_MAP: Record<string, string> = {
  sparklers: "✨", rockets: "🚀", "flower pots": "🌸", bombs: "💣",
  "ground chakkar": "🌀", "aerial shots": "🎆", "fancy crackers": "🎇",
  "gift boxes": "🎁", "kids special": "🧒", "sound crackers": "🔊",
};

export default function CategoryStrip({ categories, selected, onSelect }: CategoryStripProps) {
  const navigate = useNavigate();

  const allCategory = { _id: "", name: "All", slug: "", image: "" };
  const allCats = [allCategory, ...categories];

  const getEmoji = (name: string) =>
    EMOJI_MAP[name.toLowerCase()] || "🎇";

  const handleClick = (cat: typeof allCategory) => {
    if (onSelect) {
      onSelect(cat._id);
    } else {
      if (cat._id) navigate(`/products?category=${cat._id}`);
      else navigate("/products");
    }
  };

  return (
    <div className="category-section">
      <div className="container">
        <div className="category-strip-scroll">
          {allCats.map((cat) => (
            <button
              key={cat._id || "all"}
              className={`category-chip ${selected === cat._id ? "active" : ""}`}
              onClick={() => handleClick(cat)}
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="category-chip-img" />
              ) : (
                <div className="category-chip-placeholder">{getEmoji(cat.name)}</div>
              )}
              <span className="category-chip-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
