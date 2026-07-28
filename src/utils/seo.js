
// src/utils/seo.js
export function generateMeta(title, description, url) {
  const siteTitle = 'Esgrima Cerca de Mí';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const fullDescription = description || 'Directorio de Escuelas de Esgrima en Venezuela. Encuentra clubes de esgrima, guías de compra y más en Venezuela.';

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `https://esgrimacercademi.vercel.app${url}`,
      siteName: 'Esgrima Cerca de Mí',
      locale: 'es_VE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
    },
  };
}