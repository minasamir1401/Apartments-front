import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  canonical, 
  type = 'website' 
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const siteName = lang === 'ar' ? 'ريد غيت | Red Gate Egypt' : 'Red Gate | Luxury Real Estate Egypt';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = lang === 'ar' 
    ? 'ريد غيت هي المنصة الأولى للعقارات الفاخرة في مصر والجونة والغردقة والقاهرة الجديدة.'
    : 'Red Gate is the premier luxury real estate platform in Egypt, El Gouna, Hurghada, and New Cairo.';
  
  const currentUrl = canonical || window.location.href;
  const defaultImage = 'https://redgate-egypt.com/og-image.jpg'; // Path to your OG image

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || 'Red Gate, ريد غيت, عقارات مصر, Luxury Real Estate Egypt, El Gouna, Hurghada'} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Language Alternates */}
      <link rel="alternate" href={currentUrl} hrefLang={lang} />
    </Helmet>
  );
};

export default SEO;
