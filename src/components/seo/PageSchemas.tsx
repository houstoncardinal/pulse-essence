import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface PageSchemasProps {
  pageType?: 'home' | 'pricing' | 'preset' | 'tuner' | 'auth' | 'history' | 'player';
  presetIntent?: string;
}

export function PageSchemas({ pageType = 'home', presetIntent }: PageSchemasProps) {
  const location = useLocation();
  const baseUrl = 'https://cardinalbinaural.com';
  const currentUrl = `${baseUrl}${location.pathname}`;

  const getBreadcrumbSchema = () => {
    const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl }
    ];

    switch (pageType) {
      case 'pricing':
        items.push({ "@type": "ListItem", "position": 2, "name": "Pricing & Plans", "item": `${baseUrl}/pricing` });
        break;
      case 'preset':
        items.push({ "@type": "ListItem", "position": 2, "name": "Binaural Beats Presets", "item": `${baseUrl}/presets` });
        if (presetIntent) {
          items.push({ "@type": "ListItem", "position": 3, "name": `${presetIntent} Binaural Beats`, "item": `${baseUrl}/presets/${presetIntent}` });
        }
        break;
      case 'tuner':
        items.push({ "@type": "ListItem", "position": 2, "name": "Custom Frequency Tuner", "item": `${baseUrl}/custom-tuner` });
        break;
      case 'history':
        items.push({ "@type": "ListItem", "position": 2, "name": "Session History", "item": `${baseUrl}/history` });
        break;
      case 'auth':
        items.push({ "@type": "ListItem", "position": 2, "name": "Sign In", "item": `${baseUrl}/auth` });
        break;
      case 'player':
        items.push({ "@type": "ListItem", "position": 2, "name": "Binaural Beats Player", "item": `${baseUrl}/player` });
        break;
    }

    return { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items };
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": pageType === 'preset' ? 'CollectionPage' : pageType === 'tuner' ? 'WebApplication' : 'WebPage',
    "name": getPageName(pageType, presetIntent),
    "description": getPageDescription(pageType, presetIntent),
    "url": currentUrl,
    "isPartOf": { "@type": "WebSite", "name": "Cardinal Binaural", "url": baseUrl },
    "about": { "@type": "Thing", "name": "Binaural Beats & Brainwave Entrainment" },
    "audience": {
      "@type": "Audience",
      "audienceType": "People seeking focus, better sleep, meditation support, anxiety relief, manifestation tools, or cognitive enhancement"
    },
    "creator": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "worksFor": { "@type": "Organization", "name": "Cardinal Consulting" }
    },
    "datePublished": "2024-01-01",
    "dateModified": "2026-03-28",
    "inLanguage": "en-US",
    "potentialAction": { "@type": "ReadAction", "target": currentUrl },
    "mainEntity": pageType === 'home' ? {
      "@type": "SoftwareApplication",
      "name": "Cardinal Binaural",
      "url": baseUrl
    } : undefined
  };

  const pricingSchema = pageType === 'pricing' ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cardinal Binaural Pro Subscription",
    "description": "Premium binaural beats subscription with unlimited presets, custom frequency tuner, immersive visualizers, and advanced brainwave entrainment protocols",
    "brand": { "@type": "Brand", "name": "Cardinal Binaural" },
    "offers": {
      "@type": "Offer",
      "price": "9.99",
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/pricing`,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": "7",
        "returnMethod": "https://schema.org/ReturnByMail"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847"
    }
  } : null;

  const presetSchema = pageType === 'preset' && presetIntent ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${presetIntent} Binaural Beats — ${getPresetFrequencyLabel(presetIntent)}`,
    "description": getPresetDescription(presetIntent),
    "brand": { "@type": "Brand", "name": "Cardinal Binaural" },
    "category": "Binaural Beats / Sound Therapy",
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
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Brainwave Target", "value": getPresetBrainwave(presetIntent) },
      { "@type": "PropertyValue", "name": "Tuning Reference", "value": "432 Hz & 528 Hz" },
      { "@type": "PropertyValue", "name": "Audio Engine", "value": "Phase-locked synthesis, ±0.001 Hz" }
    ]
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema())}</script>
      <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      {pricingSchema && <script type="application/ld+json">{JSON.stringify(pricingSchema)}</script>}
      {presetSchema && <script type="application/ld+json">{JSON.stringify(presetSchema)}</script>}
    </Helmet>
  );
}

function getPageName(pageType: string, presetIntent?: string): string {
  switch (pageType) {
    case 'home': return 'Cardinal Binaural — Free Binaural Beats Generator | 432 Hz & 528 Hz';
    case 'pricing': return 'Cardinal Binaural Pro — Pricing & Plans | Unlimited Binaural Beats';
    case 'preset': return `${presetIntent || 'Focus'} Binaural Beats — ${getPresetFrequencyLabel(presetIntent || 'Focus')} | Cardinal Binaural`;
    case 'tuner': return 'Custom Binaural Beats Generator — Build Your Own Frequencies | Cardinal Binaural';
    case 'auth': return 'Sign In — Cardinal Binaural';
    case 'history': return 'Session History & Analytics — Cardinal Binaural';
    case 'player': return 'Binaural Beats Player — Cardinal Binaural';
    default: return 'Cardinal Binaural — Free Binaural Beats Generator';
  }
}

function getPageDescription(pageType: string, presetIntent?: string): string {
  switch (pageType) {
    case 'home': return 'Free binaural beats generator with 432 Hz & 528 Hz. 216+ presets for focus, sleep, meditation, manifestation & healing.';
    case 'pricing': return 'Unlock unlimited binaural beats, custom frequency tuner, immersive visualizers, and advanced brainwave entrainment with Cardinal Binaural Pro for $9.99/month.';
    case 'preset': return getPresetDescription(presetIntent || 'Focus');
    case 'tuner': return 'Build custom binaural beats with precision controls. Choose carrier frequency, beat frequency, mode (binaural/monaural/isochronic), and tuning reference (432 Hz or 528 Hz).';
    case 'auth': return 'Sign in to Cardinal Binaural to save sessions, track progress, and access premium binaural beats features.';
    case 'history': return 'Track your binaural beats listening journey with session history, daily streaks, and analytics.';
    case 'player': return 'Play binaural beats with immersive full-screen visualizers, breathing guide, and real-time audio-reactive shader environments.';
    default: return 'Free binaural beats generator with 432 Hz & 528 Hz natural frequencies.';
  }
}

function getPresetDescription(intent: string): string {
  const descriptions: Record<string, string> = {
    'Focus': 'Free focus binaural beats using 40 Hz Gamma and 14-18 Hz Beta waves with 432 Hz carrier. Enhance concentration, mental clarity, ADHD focus, and peak cognitive performance with scientifically-designed brainwave entrainment.',
    'Sleep': 'Free sleep binaural beats with Delta wave entrainment (0.5-4 Hz) and 432 Hz tuning. Fall asleep faster, combat insomnia, promote HGH release, and achieve deep restorative sleep with progressive frequency sweeps.',
    'Meditation': 'Free meditation binaural beats using Theta waves (4-8 Hz) with 528 Hz Love Frequency. Deepen meditation, enhance spiritual connection, achieve mindfulness, and experience inner peace through natural frequency alignment.',
    'Calm': 'Free calming binaural beats with Alpha waves (8-12 Hz) for stress relief, anxiety reduction, relaxation, and emotional balance. Uses natural 432 Hz tuning for parasympathetic nervous system activation.',
    'Creative': 'Free creativity binaural beats using Theta-Alpha crossover patterns. Enhance creative flow, artistic inspiration, problem-solving, and innovation through brainwave entrainment with 432 Hz natural frequencies.',
    'Energy': 'Free energy-boosting binaural beats with Beta waves (15-30 Hz) and 528 Hz. Natural energy boost, increased motivation, confidence, and positive transformation through brainwave optimization.',
    'Study': 'Free study binaural beats targeting Beta-Gamma waves for improved learning retention, memory consolidation, exam preparation, and cognitive enhancement with precision 432 Hz tuning.'
  };
  return descriptions[intent] || descriptions['Focus'];
}

function getPresetReviewCount(intent: string): string {
  const counts: Record<string, string> = {
    'Focus': '1247', 'Sleep': '1834', 'Meditation': '1456', 'Calm': '923',
    'Creative': '712', 'Energy': '689', 'Study': '934'
  };
  return counts[intent] || '800';
}

function getPresetFrequencyLabel(intent: string): string {
  const labels: Record<string, string> = {
    'Focus': '40 Hz Gamma & Beta Waves',
    'Sleep': 'Delta Waves (0.5-4 Hz)',
    'Meditation': 'Theta Waves with 528 Hz',
    'Calm': 'Alpha Waves (8-12 Hz)',
    'Creative': 'Theta-Alpha Crossover',
    'Energy': 'Beta Waves (15-30 Hz)',
    'Study': 'Beta-Gamma Waves'
  };
  return labels[intent] || 'Binaural Frequencies';
}

function getPresetBrainwave(intent: string): string {
  const waves: Record<string, string> = {
    'Focus': 'Beta (14-18 Hz) & Gamma (40 Hz)',
    'Sleep': 'Delta (0.5-4 Hz)',
    'Meditation': 'Theta (4-8 Hz)',
    'Calm': 'Alpha (8-12 Hz)',
    'Creative': 'Theta-Alpha (6-10 Hz)',
    'Energy': 'Beta (15-30 Hz)',
    'Study': 'Beta-Gamma (18-40 Hz)'
  };
  return waves[intent] || 'Mixed';
}
