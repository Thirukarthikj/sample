import { useEffect } from 'react';

export default function useDocumentHead({ title, meta = [], canonical, schemas = [] }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const addedTags = [];

    meta.forEach(({ name, property, content }) => {
      if (!content) return;
      const key = property ? 'property' : 'name';
      const val = property || name;
      let el = document.querySelector(`meta[${key}="${val}"]`);
      if (el) {
        el.content = content;
      } else {
        el = document.createElement('meta');
        el.setAttribute(key, val);
        el.content = content;
        document.head.appendChild(el);
        addedTags.push(el);
      }
    });

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
        addedTags.push(link);
      }
      link.href = canonical;
    }

    const scriptTags = schemas.map((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      addedTags.forEach((el) => el.remove());
      scriptTags.forEach((el) => el.remove());
    };
  }, [title, canonical, meta, schemas]);
}
