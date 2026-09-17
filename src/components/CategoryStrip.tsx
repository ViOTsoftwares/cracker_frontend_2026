import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Rocket, 
  Flower2, 
  Bomb, 
  Loader, 
  Aperture, 
  Gift, 
  Smile, 
  Volume2, 
  Flame 
} from "lucide-react";
import type { Category } from "../api/categories";
import { getImageUrl } from "../utils/imageHelper";

interface CategoryStripProps {
  categories: Category[];
  selected?: string;
  onSelect?: (id: string) => void;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("sparkler")) return <Sparkles size={24} color="#f97316" />;
  if (n.includes("rocket")) return <Rocket size={24} color="#f97316" />;
  if (n.includes("flower pot")) return <Flower2 size={24} color="#f97316" />;
  if (n.includes("bomb")) return <Bomb size={24} color="#f97316" />;
  if (n.includes("chakkar")) return <Loader size={24} color="#f97316" />;
  if (n.includes("aerial")) return <Aperture size={24} color="#f97316" />;
  if (n.includes("fancy")) return <Sparkles size={24} color="#f97316" />;
  if (n.includes("gift")) return <Gift size={24} color="#f97316" />;
  if (n.includes("kid")) return <Smile size={24} color="#f97316" />;
  if (n.includes("sound")) return <Volume2 size={24} color="#f97316" />;
  return <Flame size={24} color="#f97316" />;
};

export default function CategoryStrip({ categories, selected, onSelect }: CategoryStripProps) {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const existingAllCat = categories.find((c) => c.name.toLowerCase() === "all" || c.slug === "all");
  
  const allCategory: Category = { 
    _id: existingAllCat?._id || "", 
    name: "All", 
    slug: "", 
    description: existingAllCat?.description || "",
    image: existingAllCat?.image || "" 
  };
  
  const filteredCategories = categories.filter((c) => c.name.toLowerCase() !== "all" && c.slug !== "all");
  const allCats = [allCategory, ...filteredCategories];

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    const timer = setTimeout(checkScroll, 250);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [allCats.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.65, 300);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleClick = (cat: Category) => {
    if (onSelect) {
      onSelect(cat.slug);
    } else {
      if (cat.slug) navigate(`/products?category=${cat.slug}`);
      else navigate("/products");
    }
  };

  return (
    <div className="category-section">
      <div className="container category-strip-container">
        <button
          type="button"
          className={`category-nav-btn prev ${canScrollLeft ? "visible" : ""}`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="category-strip-scroll" ref={scrollContainerRef}>
          {allCats.map((cat) => (
            <button
              key={cat._id || "all"}
              className={`category-chip ${selected === cat.slug || (cat.slug === "" && selected === "all") ? "active" : ""}`}
              onClick={() => handleClick(cat)}
            >
              {cat.image ? (
                <img src={getImageUrl(cat.image, "categories")} alt={cat.name} className="category-chip-img" />
              ) : (
                <div className="category-chip-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getCategoryIcon(cat.name)}
                </div>
              )}
              <span className="category-chip-name">{cat.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`category-nav-btn next ${canScrollRight ? "visible" : ""}`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll categories right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
