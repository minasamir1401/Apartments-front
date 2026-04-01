import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Use this on every page
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} keywords - Optional keywords
 * @param {string} url - Full canonical URL
 * @param {string} image - OG image URL
 * @param {string} type - OG type (website, article, etc.)
 * @param {object} schema - Optional JSON-LD schema object
 */
const SEO = ({
  title = 'Red Gate Egypt | ريد غيت للعقارات الفاخرة',
  description = 'ريد غيت للعقارات - المنصة الأولى للعقارات الفاخرة في مصر. شقق ومشاريع راقية في الجونة والغردقة والقاهرة الجديدة.',
  keywords = 'Red Gate Egypt, ريد غيت, عقارات مصر, شقق فاخرة, مشاريع سكنية, الجونة, الغردقة, القاهرة الجديدة, Luxury Real Estate Egypt',
  url = 'https://red-gate.tech',
  image = 'https://red-gate.tech/favicon.jpg',
  type = 'website',
  schema = null,
}) => {
  const fullTitle = title.includes('Red Gate') ? title : `${title} | Red Gate Egypt`;
  const truncatedDesc = description && description.length > 160 ? description.substring(0, 157) + '...' : description;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Red Gate Egypt" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={url} />

      {/* Hreflang */}
      <link rel="alternate" hrefLang="ar" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="320" />
      <meta property="og:image:height" content="320" />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Red Gate Egypt | ريد غيت" />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@RedGateEgypt" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
