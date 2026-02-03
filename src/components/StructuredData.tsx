import { Helmet } from 'react-helmet-async';

export function StructuredData() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cardinal Binaural",
    "alternateName": ["Cardinal Binaural Beats", "Cardinal Frequency Tool"],
    "url": "https://cardinalbinaural.com",
    "description": "Align your frequency with 432 Hz & 528 Hz for manifestation, healing, and transformation. Natural frequency alignment tool for unlocking your full potential. Created by Hunain Qureshi of Cardinal Consulting.",
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
      "ratingValue": "4.9",
      "ratingCount": "2847",
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
      "Zero-drift Phase-locked Synthesis",
      "±0.001 Hz Precision",
      "216+ Research-backed Presets"
    ],
    "screenshot": "https://cardinalbinaural.com/screenshot.png",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.0.0",
    "applicationSubCategory": "Meditation, Wellness, Manifestation",
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "jobTitle": "Founder"
    },
    "creator": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cardinal Binaural",
    "legalName": "Cardinal Binaural by Cardinal Consulting",
    "url": "https://cardinalbinaural.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cardinalbinaural.com/favicon.png",
      "width": 512,
      "height": 512
    },
    "description": "Leading platform for natural frequency alignment and manifestation through 432 Hz and 528 Hz binaural beats. Created by Hunain Qureshi of Cardinal Consulting.",
    "founder": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "jobTitle": "Founder & CEO",
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
      "https://instagram.com/cardinalbinaural",
      "https://linkedin.com/company/cardinalbinaural",
      "https://youtube.com/@cardinalbinaural"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@cardinalbinaural.com",
      "availableLanguage": ["English"]
    },
    "foundingDate": "2024",
    "areaServed": "Worldwide",
    "knowsAbout": [
      "Binaural Beats",
      "432 Hz Frequency",
      "528 Hz Frequency",
      "Brainwave Entrainment",
      "Sound Therapy",
      "Meditation",
      "Manifestation"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cardinal Binaural Pro",
    "description": "Premium subscription with unlimited access to all manifestation frequencies, custom tuning, and advanced features. Created by Hunain Qureshi.",
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
      "reviewCount": "1523"
    },
    "category": "Wellness Software"
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
          "text": "Cardinal Binaural is a professional manifestation tool created by Hunain Qureshi of Cardinal Consulting. It uses natural frequencies (432 Hz and 528 Hz) with binaural beats to help you align your energy, manifest your desires, and transform your reality through precision frequency alignment."
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
        "name": "How do binaural beats work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Binaural beats work by playing slightly different frequencies in each ear, creating a third frequency perceived by your brain. This entrains your brainwaves to desired states (delta, theta, alpha, beta, gamma) that enhance focus, relaxation, meditation, and the receptive state needed for manifestation."
        }
      },
      {
        "@type": "Question",
        "name": "Is Cardinal Binaural free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Cardinal Binaural offers a free version with access to basic manifestation presets. For unlimited access to all premium presets, custom frequency tuning, and advanced features, upgrade to Cardinal Binaural Pro for $9.99/month."
        }
      },
      {
        "@type": "Question",
        "name": "How long should I use Cardinal Binaural?",
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
      },
      {
        "@type": "Question",
        "name": "Do I need headphones for binaural beats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, stereo headphones are essential for the binaural effect to work. The slightly different frequencies must reach each ear separately to create the entrainment effect in your brain."
        }
      },
      {
        "@type": "Question",
        "name": "Who created Cardinal Binaural?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cardinal Binaural was created by Hunain Qureshi, founder of Cardinal Consulting. The platform combines cutting-edge audio engineering with research-backed frequency protocols for optimal manifestation and transformation."
        }
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cardinal Binaural",
    "alternateName": "Cardinal Binaural Beats",
    "url": "https://cardinalbinaural.com",
    "description": "Professional binaural beats platform for manifestation using 432 Hz and 528 Hz natural frequencies",
    "publisher": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://cardinalbinaural.com/presets/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Cardinal Binaural",
    "description": "Digital wellness platform providing binaural beats and frequency alignment tools",
    "url": "https://cardinalbinaural.com",
    "priceRange": "$-$$",
    "founder": {
      "@type": "Person",
      "name": "Hunain Qureshi"
    },
    "knowsAbout": [
      "Binaural Beats",
      "Sound Therapy",
      "Meditation Technology",
      "Brainwave Entrainment"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
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
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}
