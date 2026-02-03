import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface PageSchemasProps {
  pageType?: 'home' | 'pricing' | 'preset' | 'tuner' | 'auth' | 'history';
  presetIntent?: string;
}

export function PageSchemas({ pageType = 'home', presetIntent }: PageSchemasProps) {
  const location = useLocation();
  const baseUrl = 'https://cardinalbinaural.com';
  const currentUrl = `${baseUrl}${location.pathname}`;

  // Dynamic breadcrumb based on current page
  const getBreadcrumbSchema = () => {
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ];

    switch (pageType) {
      case 'pricing':
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Pricing",
          "item": `${baseUrl}/pricing`
        });
        break;
      case 'preset':
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Presets",
          "item": `${baseUrl}/presets`
        });
        if (presetIntent) {
          items.push({
            "@type": "ListItem",
            "position": 3,
            "name": presetIntent,
            "item": `${baseUrl}/presets/${presetIntent}`
          });
        }
        break;
      case 'tuner':
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Custom Tuner",
          "item": `${baseUrl}/custom-tuner`
        });
        break;
      case 'history':
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Session History",
          "item": `${baseUrl}/history`
        });
        break;
      case 'auth':
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Sign In",
          "item": `${baseUrl}/auth`
        });
        break;
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  };

  // WebPage schema for current page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": pageType === 'pricing' ? 'WebPage' : 
            pageType === 'preset' ? 'CollectionPage' : 
            pageType === 'tuner' ? 'WebApplication' : 'WebPage',
    "name": getPageName(pageType, presetIntent),
    "description": getPageDescription(pageType, presetIntent),
    "url": currentUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Cardinal Binaural",
      "url": baseUrl
    },
    "about": {
      "@type": "Thing",
      "name": "Binaural Beats & Frequency Alignment"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Wellness Enthusiasts, Meditators, Manifestation Practitioners"
    },
    "creator": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "worksFor": {
        "@type": "Organization",
        "name": "Cardinal Consulting"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": "2025-02-03",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "ReadAction",
      "target": currentUrl
    }
  };

  // Pricing page specific schema
  const pricingSchema = pageType === 'pricing' ? {
    "@context": "https://schema.org",
    "@type": "PriceSpecification",
    "price": "9.99",
    "priceCurrency": "USD",
    "eligibleTransactionVolume": {
      "@type": "PriceSpecification",
      "name": "Monthly Subscription"
    },
    "valueAddedTaxIncluded": true
  } : null;

  // Preset page specific schema
  const presetSchema = pageType === 'preset' && presetIntent ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${presetIntent} Binaural Beats - Cardinal Binaural`,
    "description": getPresetDescription(presetIntent),
    "brand": {
      "@type": "Brand",
      "name": "Cardinal Binaural"
    },
    "category": "Wellness Audio",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": getPresetReviewCount(presetIntent)
    }
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbSchema())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
      {pricingSchema && (
        <script type="application/ld+json">
          {JSON.stringify(pricingSchema)}
        </script>
      )}
      {presetSchema && (
        <script type="application/ld+json">
          {JSON.stringify(presetSchema)}
        </script>
      )}
    </Helmet>
  );
}

function getPageName(pageType: string, presetIntent?: string): string {
  switch (pageType) {
    case 'home':
      return 'Cardinal Binaural - Manifestation Through Natural Frequencies';
    case 'pricing':
      return 'Cardinal Binaural Pro - Pricing & Plans';
    case 'preset':
      return `${presetIntent || 'Focus'} Binaural Beats - Cardinal Binaural`;
    case 'tuner':
      return 'Custom Frequency Tuner - Cardinal Binaural';
    case 'auth':
      return 'Sign In - Cardinal Binaural';
    case 'history':
      return 'Session History - Cardinal Binaural';
    default:
      return 'Cardinal Binaural';
  }
}

function getPageDescription(pageType: string, presetIntent?: string): string {
  switch (pageType) {
    case 'home':
      return 'Align your frequency with 432 Hz & 528 Hz for manifestation, healing, and transformation.';
    case 'pricing':
      return 'Unlock unlimited access to all frequencies and custom tuning with Cardinal Binaural Pro.';
    case 'preset':
      return `${presetIntent || 'Focus'} binaural beats using 432 Hz and 528 Hz natural frequencies for optimal brainwave entrainment.`;
    case 'tuner':
      return 'Create custom frequency combinations with our precision phase-locked audio engine.';
    case 'auth':
      return 'Sign in to Cardinal Binaural to save your sessions and unlock premium features.';
    case 'history':
      return 'Track your manifestation journey with detailed session history and analytics.';
    default:
      return 'Cardinal Binaural - Manifestation Through Natural Frequencies';
  }
}

function getPresetDescription(intent: string): string {
  const descriptions: Record<string, string> = {
    'Focus': '40 Hz Gamma waves combined with 432 Hz carrier for enhanced concentration, mental clarity, and peak cognitive performance.',
    'Sleep': 'Delta wave entrainment (0.5-4 Hz) with 432 Hz for deep restorative sleep, HGH release, and cellular regeneration.',
    'Meditation': 'Theta waves (4-8 Hz) with 528 Hz Love Frequency for deep meditation, spiritual connection, and inner peace.',
    'Calm': 'Alpha waves (8-12 Hz) for stress relief, relaxation, and emotional balance using natural 432 Hz tuning.',
    'Creative': 'Theta-Alpha crossover patterns for enhanced creativity, inspiration, and artistic flow states.',
    'Energy': 'Beta waves (15-30 Hz) with 528 Hz for natural energy boost, motivation, and positive transformation.',
    'Study': 'Beta-Gamma waves for learning retention, memory consolidation, and cognitive enhancement.'
  };
  return descriptions[intent] || descriptions['Focus'];
}

function getPresetReviewCount(intent: string): string {
  const counts: Record<string, string> = {
    'Focus': '847',
    'Sleep': '1234',
    'Meditation': '956',
    'Calm': '623',
    'Creative': '412',
    'Energy': '389',
    'Study': '534'
  };
  return counts[intent] || '500';
}
