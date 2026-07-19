import { Helmet } from "react-helmet-async";
import { useSettings } from "../context/SettingsContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
  const { settings } = useSettings();

  const siteName = settings.title || "CrackersSiva";
  const defaultDesc = "India's most trusted crackers store. Celebrating every festival with the brightest fireworks since 1995.";
  
  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoDesc = description || defaultDesc;
  const seoImage = image || (settings.logo ? `/image/logos/${settings.logo}` : "");

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      {seoImage && <meta property="og:image" content={seoImage} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      {seoImage && <meta name="twitter:image" content={seoImage} />}
    </Helmet>
  );
}
