import React, { useMemo } from 'react';
import useDocumentHead from '../../hooks/useDocumentHead';

export default function SEOMeta({
  title,
  description,
  canonical = '',
  ogImage = 'https://res.cloudinary.com/vpjbovlg/image/upload/v1783246352/imgi_15_kodaikanal_bna8gi.jpg',
  schemas = [],
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | RIR Tours and Travels`
    : 'RIR Tours and Travels – Kodaikanal Tour Packages & Cab Booking';

  const canonicalUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return canonical ? `${origin}${canonical}` : origin;
  }, [canonical]);

  const meta = useMemo(() => {
    const tags = [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'RIR Tours and Travels' },
      { property: 'og:locale', content: 'en_IN' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'geo.region', content: 'IN-TN' },
      { name: 'geo.placename', content: 'Kodaikanal' },
    ];

    if (noIndex) {
      tags.push({ name: 'robots', content: 'noindex, nofollow' });
    }

    return tags;
  }, [description, canonicalUrl, fullTitle, ogImage, noIndex]);

  useDocumentHead({
    title: fullTitle,
    meta,
    canonical: canonicalUrl,
    schemas,
  });

  return null;
}
