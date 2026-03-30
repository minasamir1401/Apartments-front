import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Use this on every page
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} url - Full canonical URL (e.g. https://red-gate.tech/apartments)
 * @param {string} image - OG image URL
 * @param {string} type - OG type (website, article, etc.)
 * @param {object} schema - Optional JSON-LD schema object
 */
const SEO = ({
  title = 'Red Gate Egypt | ريد غيت للعقارات الفاخرة',
  description = 'ريد غيت للعقارات - المنصة الأولى للعقارات الفاخرة في مصر. شقق ومشاريع راقية في الجونة والغردقة والقاهرة الجديدة.',
  url = 'https://red-gate.tech',
  image = 'https://red-gate.tech/og-image.jpg',
  type = 'website',
  schema = null,
}) => {
  const fullTitle = title.includes('Red Gate') ? title : `${title} | Red Gate Egypt`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Red Gate Egypt" />
      <meta property="og:locale" content="ar_EG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
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
