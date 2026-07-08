import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ title, description, schema }) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = `${title} | CommuteConnect`;
    document.title = formattedTitle;

    // Helper to select/create meta tags
    const updateOrCreateMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', nameOrProperty);
        } else {
          meta.name = nameOrProperty;
        }
        document.head.appendChild(meta);
      }
      meta.content = value;
    };

    // Helper to select/create link tags
    const updateOrCreateLink = (rel: string, value: string) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = value;
    };

    // 2. Update standard meta tags
    updateOrCreateMeta('description', description);

    // 3. Update Canonical Link
    const currentUrl = window.location.href;
    updateOrCreateLink('canonical', currentUrl);

    // 4. Update Open Graph (OG) tags
    updateOrCreateMeta('og:title', formattedTitle, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:url', currentUrl, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:image', 'https://commuteconnect.com/og-image.png', true);

    // 5. Update Twitter tags
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', formattedTitle);
    updateOrCreateMeta('twitter:description', description);
    updateOrCreateMeta('twitter:image', 'https://commuteconnect.com/og-image.png');

    // 6. Update/Inject JSON-LD Structured Data
    let scriptTag = document.getElementById('json-ld-structured-data') as HTMLScriptElement;
    if (scriptTag) {
      if (scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    }

    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-structured-data';
      scriptTag.type = 'application/ld+json';
      scriptTag.innerHTML = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      // Clean up dynamic structured data script on unmount
      const checkTag = document.getElementById('json-ld-structured-data');
      if (checkTag && checkTag.parentNode) {
        checkTag.parentNode.removeChild(checkTag);
      }
    };
  }, [title, description, schema]);

  return null;
};
