import React, { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Shield, Target, Award, Users, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import baseAPI from "../api/axios";

export default function About() {
  const { settings } = useSettings();
  const [cmsContent, setCmsContent] = useState<string | null>(null);

  useEffect(() => {
    document.title = `About Us | ${settings.project || "Crackers"}`;
  }, [settings.project]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await baseAPI.get("/cms/ABOUT_US");
        if (response.data && response.data.success) {
          setCmsContent(response.data.result.content);
        }
      } catch (error) {
        console.error("Failed to load ABOUT_US CMS page:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section 
        className="about-hero" 
        style={{ 
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
          padding: "100px 20px", 
          color: "#fff", 
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div 
          style={{
            position: "absolute",
            top: "-50%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0) 70%)",
            borderRadius: "50%",
            zIndex: 0
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(249, 115, 22, 0.1)", padding: "6px 16px", borderRadius: "100px", color: "#f97316", fontWeight: 600, fontSize: "0.875rem", marginBottom: "20px" }}>
            <Flame size={16} /> Our Story
          </div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "20px", color: "#fff", letterSpacing: "-1px" }}>
            About <span style={{ color: "#f97316" }}>Us</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#cbd5e1", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Lighting up the skies and bringing joy to every festival since our inception. We are the most trusted name in Sivakasi for premium quality fireworks.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story" style={{ padding: "80px 0", backgroundColor: "#fff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "24px", letterSpacing: "-0.5px" }}>Our Legacy in Sivakasi</h2>
              <div 
                className="cms-rendered-content" 
                style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.8, marginBottom: "32px" }}
              >
                {cmsContent ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsContent }} />
                ) : (
                  <>
                    <p style={{ marginBottom: "16px" }}>
                      Rooted in the heart of Sivakasi, the fireworks capital of India, <strong>{settings.project || "our brand"}</strong> has grown from a humble beginning into a premier destination for high-quality, safe, and mesmerizing crackers.
                    </p>
                    <p>
                      Our mission is simple: to make every celebration unforgettable. Whether it's Diwali, a wedding, or a grand new year party, we believe in delivering fireworks that light up smiles as much as they light up the night sky. We combine traditional craftsmanship with modern safety standards.
                    </p>
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link to="/products" style={{ backgroundColor: "#f97316", color: "#fff", padding: "14px 28px", borderRadius: "10px", fontWeight: 600, textDecoration: "none", transition: "all 0.3s ease", display: "inline-block", boxShadow: "0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -1px rgba(249, 115, 22, 0.1)" }}>
                  Shop Collection
                </Link>
                <Link to="/page/CONTACT" style={{ backgroundColor: "#fff", color: "#0f172a", border: "2px solid #e2e8f0", padding: "12px 28px", borderRadius: "10px", fontWeight: 600, textDecoration: "none", transition: "all 0.3s ease", display: "inline-block" }}>
                  Contact Support
                </Link>
              </div>
            </div>
            <div style={{ position: "relative" }}>
               <div style={{ 
                 width: "100%", 
                 height: "450px", 
                 borderRadius: "24px", 
                 background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)", 
                 display: "flex", 
                 alignItems: "center", 
                 justifyContent: "center", 
                 color: "white", 
                 boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)",
                 position: "relative",
                 overflow: "hidden"
               }}>
                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')", opacity: 0.5 }} />
                 <h2 style={{ fontSize: "8rem", fontWeight: "900", fontStyle: "italic", opacity: 0.9, margin: 0, letterSpacing: "-5px" }}>
                   {settings.project?.[0] || "C"}
                 </h2>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-features" style={{ padding: "80px 0", backgroundColor: "#f8fafc" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>Why Choose {settings.project || "Us"}?</h2>
            <p style={{ color: "#64748b", marginTop: "12px", fontSize: "1.1rem" }}>We stand by our commitment to quality, safety, and customer satisfaction.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "30px" }}>
            {[
              { icon: <Shield size={32} color="#10b981" />, title: "100% Safe", desc: "Our crackers undergo strict quality checks to ensure they are safe for you and your family to use." },
              { icon: <Award size={32} color="#3b82f6" />, title: "Premium Quality", desc: "We source and manufacture using the highest grade materials for brighter, louder, and longer-lasting effects." },
              { icon: <Target size={32} color="#8b5cf6" />, title: "Best Prices", desc: "Straight from Sivakasi to your doorstep, we cut out the middlemen to give you incredible wholesale rates." },
              { icon: <Users size={32} color="#f59e0b" />, title: "Customer First", desc: "A dedicated support team is available to ensure your shopping and delivery experience is completely seamless." },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: "40px 30px", 
                  borderRadius: "20px", 
                  backgroundColor: "#fff", 
                  border: "1px solid rgba(226, 232, 240, 0.8)", 
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                  cursor: "default",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "translateY(-8px)"; 
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"; 
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"; 
                  e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.8)";
                }}
              >
                <div style={{ marginBottom: "20px", background: "rgba(248, 250, 252, 1)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", marginBottom: "12px" }}>{feature.title}</h3>
                <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
