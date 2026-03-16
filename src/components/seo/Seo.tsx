import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SITE_NAME = 'Seattle Startup Pulse';
const SITE_URL = 'https://seattlestartuppulse.lovable.app';
const DEFAULT_IMAGE = 'https://lovable.dev/opengraph-image-p98pqg.png';
const DEFAULT_TWITTER = '@Lovable';
const JSON_LD_ID = 'lovable-seo-jsonld';

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [],
  jsonLd,
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const pathname = path ?? `${location.pathname}${location.search}`;
    const canonicalUrl = new URL(pathname || '/', SITE_URL).toString();
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    document.documentElement.lang = 'en';

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: DEFAULT_TWITTER });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    const existingJsonLd = document.getElementById(JSON_LD_ID);
    if (existingJsonLd) existingJsonLd.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById(JSON_LD_ID);
      if (script) script.remove();
    };
  }, [description, image, jsonLd, keywords, location.pathname, location.search, path, title]);

  return null;
}
