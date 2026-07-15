import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import baseAPI from "../api/axios";
import { useSettings } from "../context/SettingsContext";
import { Shield, FileText, RefreshCw, Truck, ChevronRight, Clock, HelpCircle } from "lucide-react";

interface CMSContent {
  _id: string;
  title: string;
  identifier: string;
  content: string;
  updatedAt?: string;
}

export default function HelpPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const { settings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<CMSContent | null>(null);

  const policyLinks = [
    {
      title: "Terms of Service",
      id: "TEAMS_OF_SERVICES",
      path: "/page/TEAMS_OF_SERVICES",
      icon: <FileText size={18} />,
      color: "#3b82f6",
    },
    {
      title: "Privacy Policy",
      id: "PRIVACY_POLICY",
      path: "/page/PRIVACY_POLICY",
      icon: <Shield size={18} />,
      color: "#10b981",
    },
    {
      title: "Refund Policy",
      id: "REFUND_POLICY",
      path: "/page/REFUND_POLICY",
      icon: <RefreshCw size={18} />,
      color: "#ef4444",
    },
    {
      title: "Shipping Policy",
      id: "SHIPPING_POLICY",
      path: "/page/SHIPPING_POLICY",
      icon: <Truck size={18} />,
      color: "#f59e0b",
    },
  ];

  useEffect(() => {
    const fetchPage = async () => {
      if (!identifier) return;
      setLoading(true);
      try {
        const response = await baseAPI.get(`/cms/${identifier}`);
        if (response.data && response.data.success) {
          setPageData(response.data.result);
        } else {
          setPageData(null);
        }
      } catch (error) {
        console.error("Failed to load CMS page:", error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [identifier]);

  // Dynamic document title for SEO
  useEffect(() => {
    if (pageData) {
      document.title = `${pageData.title} | ${settings.project || "Crackers Siva"}`;
    } else {
      const activeLink = policyLinks.find(link => link.id === identifier);
      document.title = `${activeLink ? activeLink.title : "Help Page"} | ${settings.project || "Crackers Siva"}`;
    }
  }, [pageData, identifier, settings.project]);

  const activePolicy = policyLinks.find((link) => link.id === identifier);

  return (
    <main className="help-page-wrapper">
      {/* Top Banner section */}
      <section className="help-hero" style={{ "--hero-color": activePolicy?.color || "var(--primary)" } as React.CSSProperties}>
        <div className="container">
          <div className="help-hero-content">
            <span className="help-badge">Support Center</span>
            <h1>{pageData?.title || activePolicy?.title || "Help Center"}</h1>
            <p>
              Please read our dynamic policies, terms, and guidelines for {settings.project || "Crackers Siva"} below.
            </p>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="container help-main-container">
        <div className="help-grid">
          
          {/* Left Sidebar navigation */}
          <aside className="help-sidebar">
            <div className="help-sidebar-card">
              <h3 className="help-sidebar-title">Documents & Policies</h3>
              <nav className="help-sidebar-nav">
                {policyLinks.map((link) => {
                  const isActive = identifier === link.id;
                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={`help-nav-link ${isActive ? "active" : ""}`}
                      style={{
                        "--active-color": link.color,
                        "--active-bg": `${link.color}0c`,
                      } as React.CSSProperties}
                    >
                      <div className="help-nav-icon" style={{ color: isActive ? link.color : "var(--text-muted)" }}>
                        {link.icon}
                      </div>
                      <span className="help-nav-text">{link.title}</span>
                      <ChevronRight size={14} className="help-nav-arrow" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="help-sidebar-support-card">
              <HelpCircle size={24} className="support-card-icon" />
              <h4>Need Help?</h4>
              <p>For custom delivery orders or bulk inquiries, please connect with us.</p>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="support-tel-btn">
                  Call: {settings.phone}
                </a>
              )}
            </div>
          </aside>

          {/* Right Content Panel */}
          <section className="help-content-panel">
            {loading ? (
              <div className="help-skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <br />
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ) : pageData ? (
              <article className="help-article-card">
                <div className="help-article-header">
                  <div className="help-article-title-row">
                    <h2>{pageData.title}</h2>
                    {pageData.updatedAt && (
                      <span className="help-updated-date">
                        <Clock size={12} />
                        Last Updated: {new Date(pageData.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div 
                  className="help-article-body cms-rendered-content"
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              </article>
            ) : (
              <div className="help-empty-card">
                <div className="empty-icon-circle">
                  <FileText size={32} />
                </div>
                <h3>Draft Mode / Pending Content</h3>
                <p>
                  No content has been published yet for the CMS identifier: <strong>{identifier}</strong>. 
                  Please login to the Admin Dashboard and add a CMS page with identifier <code>{identifier}</code>.
                </p>
                <Link to="/" className="back-home-btn">
                  Back to Homepage
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
