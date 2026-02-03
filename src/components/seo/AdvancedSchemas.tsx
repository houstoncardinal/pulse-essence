import { Helmet } from 'react-helmet-async';

export function AdvancedSchemas() {
  // SoftwareApplication Schema (More specific than WebApplication)
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cardinal Binaural",
    "alternateName": ["Cardinal Binaural Beats", "Cardinal Frequency Tool", "432 Hz Generator"],
    "url": "https://cardinalbinaural.com",
    "description": "Professional-grade binaural beats generator using 432 Hz and 528 Hz natural frequencies for manifestation, healing, and transformation. Created by Hunain Qureshi of Cardinal Consulting.",
    "applicationCategory": "HealthApplication",
    "applicationSubCategory": "Meditation & Wellness",
    "operatingSystem": "Any (Web-based)",
    "permissions": "audio playback",
    "softwareVersion": "2.0.0",
    "releaseNotes": "Latest release with enhanced phase-locked synthesis and zero-drift audio engine.",
    "datePublished": "2024-01-01",
    "dateModified": "2025-02-03",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Tier",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Access to basic manifestation presets"
      },
      {
        "@type": "Offer",
        "name": "Cardinal Binaural Pro",
        "price": "9.99",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Unlimited access to all frequencies and custom tuning",
        "url": "https://cardinalbinaural.com/pricing"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Meditation Enthusiast"
        },
        "reviewBody": "The 432 Hz sessions have completely transformed my meditation practice. The precision is incredible."
      }
    ],
    "featureList": [
      "432 Hz Universal Harmony Tuning",
      "528 Hz DNA Repair & Love Frequency",
      "Zero-drift Phase-locked Synthesis",
      "±0.001 Hz Frequency Precision",
      "Binaural Beats (Delta, Theta, Alpha, Beta, Gamma)",
      "Isochronic Tones",
      "Pink & Brown Noise Layers",
      "Custom Frequency Tuner",
      "Session History & Analytics",
      "216+ Research-backed Presets"
    ],
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "url": "https://cardinalbinaural.com",
      "jobTitle": "Founder",
      "worksFor": {
        "@type": "Organization",
        "name": "Cardinal Consulting"
      }
    },
    "creator": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": "https://cardinalbinaural.com/screenshot-1.png",
        "caption": "Cardinal Binaural - Main Player Interface"
      }
    ]
  };

  // HowTo Schema for using the app
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Cardinal Binaural for Manifestation",
    "description": "Learn how to use 432 Hz and 528 Hz binaural beats for manifestation, healing, and transformation with Cardinal Binaural.",
    "image": "https://cardinalbinaural.com/favicon.png",
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Headphones (stereo required for binaural beats)"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Cardinal Binaural Web App"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Choose Your Frequency",
        "text": "Select either 432 Hz (Universal Harmony) or 528 Hz (Love Frequency) based on your intention.",
        "url": "https://cardinalbinaural.com/custom-tuner"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select Your Intent",
        "text": "Choose from Focus, Sleep, Meditation, Calm, Creative, Energy, or Study presets.",
        "url": "https://cardinalbinaural.com/presets/Focus"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Put On Headphones",
        "text": "Stereo headphones are essential for the binaural effect to work properly.",
        "url": "https://cardinalbinaural.com/"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Start Your Session",
        "text": "Press play and relax for 20-30 minutes for optimal frequency entrainment.",
        "url": "https://cardinalbinaural.com/player"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Track Your Progress",
        "text": "View your session history to monitor your manifestation journey.",
        "url": "https://cardinalbinaural.com/history"
      }
    ]
  };

  // ItemList Schema for preset categories
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cardinal Binaural Frequency Presets",
    "description": "Research-backed binaural beat presets for manifestation, focus, sleep, and transformation",
    "numberOfItems": 7,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Focus Presets",
        "url": "https://cardinalbinaural.com/presets/Focus",
        "description": "40 Hz Gamma waves for enhanced concentration and mental clarity"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sleep Presets",
        "url": "https://cardinalbinaural.com/presets/Sleep",
        "description": "Delta wave entrainment for deep restorative sleep and HGH release"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Meditation Presets",
        "url": "https://cardinalbinaural.com/presets/Meditation",
        "description": "Theta waves for deep meditation and spiritual connection"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Calm Presets",
        "url": "https://cardinalbinaural.com/presets/Calm",
        "description": "Alpha waves for relaxation and stress relief"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Creative Presets",
        "url": "https://cardinalbinaural.com/presets/Creative",
        "description": "Theta-Alpha crossover for enhanced creativity and inspiration"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Energy Presets",
        "url": "https://cardinalbinaural.com/presets/Energy",
        "description": "Beta waves for natural energy boost and motivation"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "Study Presets",
        "url": "https://cardinalbinaural.com/presets/Study",
        "description": "Beta-Gamma waves for learning retention and cognitive enhancement"
      }
    ]
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Cardinal Binaural Frequency Alignment",
    "description": "Professional frequency alignment service using 432 Hz and 528 Hz natural frequencies for manifestation and transformation.",
    "provider": {
      "@type": "Organization",
      "name": "Cardinal Consulting",
      "founder": {
        "@type": "Person",
        "name": "Hunain Qureshi"
      }
    },
    "serviceType": "Wellness Technology",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cardinal Binaural Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Binaural Beats Generator"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Frequency Tuning"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Session Tracking"
          }
        }
      ]
    }
  };

  // MedicalWebPage Schema (for health-related content)
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Cardinal Binaural - Sound Therapy & Brainwave Entrainment",
    "about": {
      "@type": "MedicalTherapy",
      "name": "Binaural Beat Therapy",
      "description": "Sound-based therapy using precise frequency differentials to entrain brainwaves for improved focus, sleep, and relaxation."
    },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient",
      "healthCondition": {
        "@type": "MedicalCondition",
        "name": "Stress, Anxiety, Sleep Disorders, Focus Issues"
      }
    },
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": "Complementary and Alternative Medicine"
    },
    "lastReviewed": "2025-02-01"
  };

  // VideoObject Schema (for potential video content)
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "How Cardinal Binaural Works - 432 Hz & 528 Hz Explained",
    "description": "Learn how Cardinal Binaural uses 432 Hz and 528 Hz natural frequencies with binaural beats for manifestation and transformation.",
    "thumbnailUrl": "https://cardinalbinaural.com/favicon.png",
    "uploadDate": "2024-01-01",
    "contentUrl": "https://cardinalbinaural.com/demo-video",
    "embedUrl": "https://cardinalbinaural.com/embed/demo",
    "duration": "PT5M30S",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": 45000
    }
  };

  // SpeakableSpecification for voice search
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cardinal Binaural",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".hero-headline", ".hero-description", ".faq-answer"]
    },
    "url": "https://cardinalbinaural.com"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareApplicationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(medicalWebPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(speakableSchema)}
      </script>
    </Helmet>
  );
}
