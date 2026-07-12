import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "../api/banners";
import { getImageUrl } from "../utils/imageHelper";

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = window.innerWidth < 768;

  const next = () => setCurrent((c) => (c + 1) % banners.length);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4500);
  };

  if (!banners.length) {
    return (
      <div className="banner-slider" style={{ background: "linear-gradient(135deg,#1e3a5f,#f97316)", height: 360, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 72 }}>🎆</div>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, textAlign: "center" }}>Festival of Lights Sale</h2>
        <p style={{ color: "rgba(255,255,255,.8)", fontSize: "1.1rem" }}>Best crackers at the best prices!</p>
      </div>
    );
  }

  return (
    <div className="banner-slider" style={{ position: "relative" }}>
      {banners.map((banner, idx) => (
        <div key={banner._id} className={`banner-slide ${idx === current ? "active" : ""}`}>
          {banner.link ? (
            <a href={banner.link} target="_blank" rel="noopener noreferrer">
              <img
                src={isMobile ? getImageUrl(banner.mobileImage, "banners") : getImageUrl(banner.desktopImage, "banners")}
                alt={banner.title}
              />
            </a>
          ) : (
            <img
              src={isMobile ? getImageUrl(banner.mobileImage, "banners") : getImageUrl(banner.desktopImage, "banners")}
              alt={banner.title}
            />
          )}
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button className="banner-arrow prev" onClick={() => { prev(); resetTimer(); }}>
            <ChevronLeft size={20} />
          </button>
          <button className="banner-arrow next" onClick={() => { next(); resetTimer(); }}>
            <ChevronRight size={20} />
          </button>
          <div className="banner-dots">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`banner-dot ${idx === current ? "active" : ""}`}
                onClick={() => { setCurrent(idx); resetTimer(); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
