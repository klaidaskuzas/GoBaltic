import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  title: string;
  titleLT?: string;
  titleFR?: string;
  titleDE?: string;
  titlePL?: string;
  description: string;
  descriptionLT?: string;
  descriptionFR?: string;
  descriptionDE?: string;
  descriptionPL?: string;
  keywords: string;
  keywordsLT?: string;
  keywordsFR?: string;
  keywordsDE?: string;
  keywordsPL?: string;
  canonicalPath: string;
  ogImage?: string;
}

const SEOHead = ({
  title,
  titleLT,
  titleFR,
  titleDE,
  titlePL,
  description,
  descriptionLT,
  descriptionFR,
  descriptionDE,
  descriptionPL,
  keywords,
  keywordsLT,
  keywordsFR,
  keywordsDE,
  keywordsPL,
  canonicalPath,
  ogImage = '/og-image.jpg'
}: SEOHeadProps) => {
  const { language } = useLanguage();
  
  // Determine page title, description, and keywords based on current language
  let pageTitle = title;
  let pageDescription = description;
  let pageKeywords = keywords;
  
  switch (language) {
    case 'lt':
      pageTitle = titleLT || title;
      pageDescription = descriptionLT || description;
      pageKeywords = keywordsLT || keywords;
      break;
    case 'fr':
      pageTitle = titleFR || title;
      pageDescription = descriptionFR || description;
      pageKeywords = keywordsFR || keywords;
      break;
    case 'de':
      pageTitle = titleDE || title;
      pageDescription = descriptionDE || description;
      pageKeywords = keywordsDE || keywords;
      break;
    case 'pl':
      pageTitle = titlePL || title;
      pageDescription = descriptionPL || description;
      pageKeywords = keywordsPL || keywords;
      break;
    default:
      // Use English (default) values
      break;
  }
  
  const siteUrl = window.location.origin;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  useEffect(() => {
    // Set page title
    document.title = pageTitle;
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);
    
    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', pageKeywords);
    
    // Set canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);
    
    // Set Open Graph meta tags
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', pageTitle);
    
    let ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescriptionTag) {
      ogDescriptionTag = document.createElement('meta');
      ogDescriptionTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescriptionTag);
    }
    ogDescriptionTag.setAttribute('content', pageDescription);
    
    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (!ogImageTag) {
      ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageTag);
    }
    ogImageTag.setAttribute('content', `${siteUrl}${ogImage}`);
    
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', canonicalUrl);
    
    // Set hreflang tags for internationalization
    const languageAlternates = [
      { hreflang: 'en', href: `${siteUrl}${canonicalPath}?lang=en` },
      { hreflang: 'lt', href: `${siteUrl}${canonicalPath}?lang=lt` },
      { hreflang: 'fr', href: `${siteUrl}${canonicalPath}?lang=fr` },
      { hreflang: 'de', href: `${siteUrl}${canonicalPath}?lang=de` },
      { hreflang: 'pl', href: `${siteUrl}${canonicalPath}?lang=pl` },
      { hreflang: 'x-default', href: `${siteUrl}${canonicalPath}` }
    ];
    
    // Remove any existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    
    // Add new hreflang tags
    languageAlternates.forEach(alternate => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      document.head.appendChild(link);
    });
    
    // Add language meta tag
    let metaLanguage = document.querySelector('meta[http-equiv="content-language"]');
    if (!metaLanguage) {
      metaLanguage = document.createElement('meta');
      metaLanguage.setAttribute('http-equiv', 'content-language');
      document.head.appendChild(metaLanguage);
    }
    metaLanguage.setAttribute('content', language);
    
    // Add viewport meta tag if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaViewport = document.createElement('meta');
      metaViewport.setAttribute('name', 'viewport');
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(metaViewport);
    }
    
  }, [pageTitle, pageDescription, pageKeywords, canonicalUrl, ogImage, language, siteUrl]);
  
  return null;
};

export default SEOHead;