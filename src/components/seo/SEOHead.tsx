import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const BASE_URL = 'https://cardinalbinaural.com';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/nTne89dIdqMwvcwTIDSqJv5dAP13/social-images/social-1767265152753-Cardinal%20Binaural%20-%20Manifestation%20Through%20Natural%20Frequencies%20_%20432%20Hz%20%26%20528%20Hz%20(2).png';

export function SEOHead({
  title = 'Cardinal Binaural - Manifestation Through Natural Frequencies | 432 Hz & 528 Hz',
  description = 'Align your frequency with 432 Hz & 528 Hz for manifestation, healing, and transformation. Natural frequency alignment tool created by Hunain Qureshi of Cardinal Consulting.',
  keywords = 'manifestation tool, 432 Hz, 528 Hz, frequency alignment, binaural beats, healing frequencies, transformation, universal harmony, law of attraction, brainwave entrainment, meditation music, solfeggio frequencies, DNA repair, Cardinal Binaural, Hunain Qureshi, Cardinal Consulting',
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />
      <meta 
        name="googlebot" 
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />
      <meta 
        name="bingbot" 
        content={noindex ? 'noindex, nofollow' : 'index, follow'} 
      />
      
      {/* Canonical */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Hreflang for international SEO */}
      <link rel="alternate" hrefLang="en" href={fullCanonical || BASE_URL} />
      <link rel="alternate" hrefLang="en-US" href={fullCanonical || BASE_URL} />
      <link rel="alternate" hrefLang="en-GB" href={fullCanonical || BASE_URL} />
      <link rel="alternate" hrefLang="x-default" href={fullCanonical || BASE_URL} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical || BASE_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Cardinal Binaural - 432 Hz & 528 Hz Manifestation Tool" />
      <meta property="og:site_name" content="Cardinal Binaural" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      
      {/* Article-specific Open Graph */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === 'article' && <meta property="article:author" content="Hunain Qureshi" />}
      {ogType === 'article' && <meta property="article:publisher" content="Cardinal Consulting" />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cardinalbinaural" />
      <meta name="twitter:creator" content="@cardinalbinaural" />
      <meta name="twitter:url" content={fullCanonical || BASE_URL} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Cardinal Binaural - 432 Hz & 528 Hz Manifestation Tool" />
      
      {/* Additional Search Engine Meta */}
      <meta name="author" content="Hunain Qureshi, Cardinal Consulting" />
      <meta name="creator" content="Hunain Qureshi" />
      <meta name="publisher" content="Cardinal Consulting" />
      <meta name="copyright" content="Cardinal Binaural by Cardinal Consulting" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="3 days" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="classification" content="Health, Wellness, Meditation, Manifestation" />
      <meta name="category" content="Health & Wellness" />
      
      {/* Apple / iOS */}
      <meta name="apple-mobile-web-app-title" content="Cardinal Binaural" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Microsoft */}
      <meta name="msapplication-tooltip" content="Cardinal Binaural - Manifestation Frequencies" />
      <meta name="msapplication-starturl" content={BASE_URL} />
      <meta name="msapplication-navbutton-color" content="#34d399" />
      
      {/* Pinterest */}
      <meta name="pinterest" content="nopin" />
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Helmet>
  );
}
