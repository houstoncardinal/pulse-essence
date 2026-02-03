import { Helmet } from 'react-helmet-async';

export function StructuredData() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cardinal Binaural",
    "alternateName": "Cardinal Binaural Beats",
    "url": "https://cardinalbinaural.com",
    "description": "Align your frequency with 432 Hz & 528 Hz for manifestation, healing, and transformation. Natural frequency alignment tool for unlocking your full potential.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Free version with basic presets"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "432 Hz Natural Frequency Alignment",
      "528 Hz DNA Repair & Transformation",
      "Binaural Beats Generator",
      "Isochronic Tones",
      "Manifestation Frequencies",
      "Meditation & Focus Support",
      "Custom Frequency Tuner",
      "Zero-drift Phase-locked Synthesis"
    ],
    "screenshot": "https://cardinalbinaural.com/screenshot.png",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "applicationSubCategory": "Meditation, Wellness, Manifestation"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cardinal Binaural",
    "url": "https://cardinalbinaural.com",
    "logo": "https://cardinalbinaural.com/favicon.svg",
    "description": "Leading platform for natural frequency alignment and manifestation through 432 Hz and 528 Hz binaural beats. Created by Hunain Qureshi of Cardinal Consulting.",
    "founder": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "jobTitle": "Founder",
      "worksFor": {
        "@type": "Organization",
        "name": "Cardinal Consulting"
      }
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "sameAs": [
      "https://twitter.com/cardinalbinaural",
      "https://facebook.com/cardinalbinaural",
      "https://instagram.com/cardinalbinaural"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@cardinalbinaural.com",
      "availableLanguage": ["English"]
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cardinal Binaural Pro",
    "description": "Premium subscription with unlimited access to all manifestation frequencies, custom tuning, and advanced features.",
    "brand": {
      "@type": "Brand",
      "name": "Cardinal Binaural"
    },
    "offers": {
      "@type": "Offer",
      "price": "9.99",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://cardinalbinaural.com/pricing",
      "seller": {
        "@type": "Organization",
        "name": "Cardinal Binaural"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "523"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Cardinal Binaural?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cardinal Binaural is a manifestation tool that uses natural frequencies (432 Hz and 528 Hz) with binaural beats to help you align your energy, manifest your desires, and transform your reality through frequency alignment."
        }
      },
      {
        "@type": "Question",
        "name": "Why 432 Hz and 528 Hz instead of 440 Hz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "432 Hz is known as the natural frequency of the universe and promotes universal harmony and manifestation. 528 Hz is called the 'Love Frequency' or 'Miracle Tone' associated with DNA repair and transformation. We exclude 440 Hz as it is considered a disharmonious frequency that doesn't align with natural manifestation."
        }
      },
      {
        "@type": "Question",
        "name": "How do binaural beats help with manifestation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Binaural beats work by playing slightly different frequencies in each ear, creating a third frequency perceived by your brain. This entrains your brainwaves to desired states (alpha, theta, delta) that enhance focus, relaxation, meditation, and the receptive state needed for manifestation."
        }
      },
      {
        "@type": "Question",
        "name": "Is Cardinal Binaural free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Cardinal Binaural offers a free version with access to basic manifestation presets. For unlimited access to all premium presets, custom frequency tuning, and advanced features, upgrade to Cardinal Binaural Pro."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I use Cardinal Binaural for manifestation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For best results with manifestation, use Cardinal Binaural daily for 20-30 minutes. Consistency is key in aligning your frequency with your desires. Many users practice morning sessions for setting intentions and evening sessions for integration."
        }
      },
      {
        "@type": "Question",
        "name": "What are the benefits of 432 Hz tuning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "432 Hz tuning is mathematically consistent with the patterns of the universe. Benefits include enhanced meditation, reduced stress, natural harmony with the body's vibrations, improved manifestation abilities, and alignment with universal energy."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cardinalbinaural.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Custom Tuner",
        "item": "https://cardinalbinaural.com/custom-tuner"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Pricing",
        "item": "https://cardinalbinaural.com/pricing"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(webApplicationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}
