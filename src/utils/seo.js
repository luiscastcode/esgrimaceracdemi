
// src/utils/seo.js
export function generateMeta(title, description, url) {
  const siteTitle = 'Escuelas de Esgrima en Venezuela';
  const fullTitle = title ? `${title}` : siteTitle;
  const fullDescription = description || 'Escuelas de Esgrima en Venezuela, clubes de esgrima, horarios, precios de la clase, ubicación y guías de compra.';

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