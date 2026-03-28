import { Helmet } from 'react-helmet-async';

export function AdvancedSchemas() {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cardinal Binaural",
    "alternateName": [
      "Cardinal Binaural Beats",
      "Cardinal Frequency Tool",
      "432 Hz Generator",
      "528 Hz Generator",
      "Free Binaural Beats Generator",
      "Online Binaural Beats Maker",
      "Binaural Beats Player"
    ],
    "url": "https://cardinalbinaural.com",
    "description": "Free professional-grade binaural beats generator using 432 Hz and 528 Hz natural frequencies. Features zero-drift phase-locked synthesis, 216+ research-backed presets, immersive WebGL visualizers, and custom frequency tuning for manifestation, deep sleep, focus, meditation, anxiety relief, and healing.",
    "applicationCategory": "HealthApplication",
    "applicationSubCategory": "Meditation & Wellness, Sound Therapy, Brainwave Entrainment",
    "operatingSystem": "Any (Web-based — Chrome, Firefox, Safari, Edge, Mobile)",
    "permissions": "audio playback",
    "softwareVersion": "3.0.0",
    "releaseNotes": "v3.0: Immersive full-screen WebGL visualizers with 10 audio-reactive shader scenes, breathing guide overlay, advanced frequency reference chart with 50+ protocols.",
    "datePublished": "2024-01-01",
    "dateModified": "2026-03-28",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Binaural Beats",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Free access to curated binaural beats for focus, sleep, meditation, calm, creativity, energy, and study with 432 Hz and 528 Hz tuning"
      },
      {
        "@type": "Offer",
        "name": "Cardinal Binaural Pro",
        "price": "9.99",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Unlimited presets, custom frequency tuner, immersive visualizers, session history, and advanced brainwave entrainment",
        "url": "https://cardinalbinaural.com/pricing"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "4218",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "author": { "@type": "Person", "name": "Sarah M." },
        "reviewBody": "The 432 Hz sessions have completely transformed my meditation practice. The precision is incredible — I can actually feel the difference from other apps."
      },
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "author": { "@type": "Person", "name": "James K." },
        "reviewBody": "Best binaural beats app I've ever used. The focus presets with 40 Hz Gamma waves are a game-changer for my ADHD. The immersive visualizers are mind-blowing."
      },
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "author": { "@type": "Person", "name": "Rachel T." },
        "reviewBody": "I've struggled with insomnia for years. The Delta wave sleep presets knock me out within 20 minutes. The 528 Hz carrier frequency adds something special."
      }
    ],
    "featureList": [
      "432 Hz Universal Harmony Tuning",
      "528 Hz DNA Repair & Love Frequency",
      "Zero-drift Phase-locked Synthesis",
      "±0.001 Hz Frequency Precision",
      "Binaural Beats (Delta, Theta, Alpha, Beta, Gamma)",
      "Monaural Beats",
      "Isochronic Tones",
      "Pink & Brown Noise Layers",
      "Custom Frequency Tuner",
      "216+ Research-backed Presets",
      "Immersive Full-Screen WebGL Visualizers",
      "10 Audio-Reactive Shader Scenes",
      "Breathing Guide Overlay",
      "Session History & Analytics",
      "Ambient Sound Mixer",
      "Solfeggio Frequency Library",
      "Interactive Brainwave Spectrum Guide"
    ],
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "url": "https://cardinalbinaural.com",
      "jobTitle": "Founder & Audio Engineer",
      "worksFor": { "@type": "Organization", "name": "Cardinal Consulting" }
    },
    "creator": { "@type": "Organization", "name": "Cardinal Consulting" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Binaural Beats for Manifestation, Sleep & Focus",
    "description": "Step-by-step guide to using 432 Hz and 528 Hz binaural beats with Cardinal Binaural for manifestation, deep sleep, enhanced focus, meditation, and anxiety relief.",
    "image": "https://cardinalbinaural.com/favicon.png",
    "totalTime": "PT30M",
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "0" },
    "supply": [
      { "@type": "HowToSupply", "name": "Stereo headphones (required for binaural beats)" },
      { "@type": "HowToSupply", "name": "Quiet environment" }
    ],
    "tool": [
      { "@type": "HowToTool", "name": "Cardinal Binaural Web App (cardinalbinaural.com)" },
      { "@type": "HowToTool", "name": "Any web browser (Chrome, Firefox, Safari, Edge)" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Choose Your Tuning Reference",
        "text": "Select either 432 Hz (Universal Harmony — ideal for manifestation and general wellness) or 528 Hz (Love Frequency — ideal for healing and transformation).",
        "url": "https://cardinalbinaural.com/custom-tuner"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select Your Intent",
        "text": "Choose from Focus (Beta/Gamma), Sleep (Delta), Meditation (Theta), Calm (Alpha), Creative (Theta-Alpha), Energy (Beta), or Study (Beta-Gamma) presets.",
        "url": "https://cardinalbinaural.com/"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Put On Stereo Headphones",
        "text": "Stereo headphones are essential — binaural beats require different frequencies in each ear. Over-ear headphones provide the best experience.",
        "url": "https://cardinalbinaural.com/"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Start Your Session",
        "text": "Press play and relax for 15-30 minutes. Enable the immersive visualizer for a deeper experience. Activate the breathing guide for synchronized breathwork.",
        "url": "https://cardinalbinaural.com/player"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Track Your Progress",
        "text": "Sign in to save your sessions and view analytics showing total listening time, daily streaks, and session history.",
        "url": "https://cardinalbinaural.com/history"
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Binaural Beats Preset Categories",
    "description": "Research-backed binaural beat presets optimized for different mental states and wellness goals using 432 Hz and 528 Hz natural frequencies",
    "numberOfItems": 7,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Focus & Concentration Binaural Beats", "url": "https://cardinalbinaural.com/presets/Focus", "description": "40 Hz Gamma and 14-18 Hz Beta waves for enhanced concentration, mental clarity, ADHD focus, and peak cognitive performance" },
      { "@type": "ListItem", "position": 2, "name": "Sleep & Insomnia Binaural Beats", "url": "https://cardinalbinaural.com/presets/Sleep", "description": "Delta wave entrainment (0.5-4 Hz) for deep restorative sleep, insomnia relief, HGH release, and cellular regeneration" },
      { "@type": "ListItem", "position": 3, "name": "Meditation Binaural Beats", "url": "https://cardinalbinaural.com/presets/Meditation", "description": "Theta waves (4-8 Hz) with 528 Hz for deep meditation, spiritual connection, mindfulness, and inner peace" },
      { "@type": "ListItem", "position": 4, "name": "Calm & Anxiety Relief Binaural Beats", "url": "https://cardinalbinaural.com/presets/Calm", "description": "Alpha waves (8-12 Hz) for stress relief, anxiety reduction, relaxation, and emotional balance" },
      { "@type": "ListItem", "position": 5, "name": "Creative Flow Binaural Beats", "url": "https://cardinalbinaural.com/presets/Creative", "description": "Theta-Alpha crossover for enhanced creativity, artistic inspiration, problem-solving, and flow states" },
      { "@type": "ListItem", "position": 6, "name": "Energy & Motivation Binaural Beats", "url": "https://cardinalbinaural.com/presets/Energy", "description": "Beta waves (15-30 Hz) with 528 Hz for natural energy boost, motivation, confidence, and positive transformation" },
      { "@type": "ListItem", "position": 7, "name": "Study & Learning Binaural Beats", "url": "https://cardinalbinaural.com/presets/Study", "description": "Beta-Gamma waves for learning retention, memory consolidation, exam preparation, and cognitive enhancement" }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Binaural Beats & Brainwave Entrainment",
    "description": "Free professional binaural beats generator and brainwave entrainment service using 432 Hz and 528 Hz natural frequencies for manifestation, sleep, focus, meditation, and healing.",
    "provider": {
      "@type": "Organization",
      "name": "Cardinal Binaural",
      "founder": { "@type": "Person", "name": "Hunain Qureshi" }
    },
    "serviceType": "Wellness Technology",
    "areaServed": { "@type": "Place", "name": "Worldwide" },
    "audience": {
      "@type": "Audience",
      "audienceType": "Anyone seeking focus, better sleep, meditation support, anxiety relief, manifestation tools, or brainwave optimization"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Binaural Beats Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Focus Binaural Beats Generator" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sleep Sound Generator" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Meditation Frequency Player" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Frequency Tuner" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Immersive Visualizer Experience" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Session Tracking & Analytics" } }
      ]
    }
  };

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Binaural Beats for Health & Wellness — Sound Therapy & Brainwave Entrainment",
    "about": {
      "@type": "MedicalTherapy",
      "name": "Binaural Beat Therapy",
      "description": "Sound-based therapy using precise frequency differentials to entrain brainwaves for improved focus, deep sleep, anxiety relief, stress reduction, pain management, and meditation enhancement.",
      "medicineSystem": {
        "@type": "MedicineSystem",
        "name": "Complementary and Alternative Medicine"
      }
    },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient",
      "healthCondition": {
        "@type": "MedicalCondition",
        "name": "Stress, Anxiety, Insomnia, Sleep Disorders, ADHD, Focus Issues, Chronic Pain"
      }
    },
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": "Complementary and Alternative Medicine"
    },
    "lastReviewed": "2026-03-28",
    "url": "https://cardinalbinaural.com"
  };

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cardinal Binaural — Free Binaural Beats Generator",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".hero-description", "[data-speakable]"]
    },
    "url": "https://cardinalbinaural.com"
  };

  // DefinedTermSet for brainwave terminology
  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Brainwave Frequencies & Sound Therapy Glossary",
    "description": "Complete glossary of binaural beats, brainwave entrainment, and sound therapy terminology",
    "hasDefinedTerm": [
      {
        "@type": "DefinedTerm",
        "name": "Binaural Beats",
        "description": "An auditory illusion created when two tones of slightly different frequencies are played separately to each ear, causing the brain to perceive a third frequency equal to the difference."
      },
      {
        "@type": "DefinedTerm",
        "name": "432 Hz",
        "description": "A tuning frequency known as 'Verdi's A' or the natural frequency of the universe, mathematically aligned with the patterns of nature and the Schumann Resonance."
      },
      {
        "@type": "DefinedTerm",
        "name": "528 Hz",
        "description": "A Solfeggio frequency known as the 'Love Frequency' or 'Miracle Tone,' associated with DNA repair, transformation, and healing."
      },
      {
        "@type": "DefinedTerm",
        "name": "Brainwave Entrainment",
        "description": "The process of synchronizing brainwaves to an external rhythmic stimulus through the Frequency Following Response (FFR)."
      },
      {
        "@type": "DefinedTerm",
        "name": "Delta Waves",
        "description": "The slowest brainwaves (0.5-4 Hz), associated with deep dreamless sleep, physical healing, and HGH release."
      },
      {
        "@type": "DefinedTerm",
        "name": "Theta Waves",
        "description": "Brainwaves at 4-8 Hz, associated with deep meditation, creativity, intuition, and the subconscious mind."
      },
      {
        "@type": "DefinedTerm",
        "name": "Alpha Waves",
        "description": "Brainwaves at 8-12 Hz, the brain's natural relaxation frequency, associated with calm alertness and stress reduction."
      },
      {
        "@type": "DefinedTerm",
        "name": "Gamma Waves",
        "description": "The fastest brainwaves (30-100 Hz), associated with peak cognition, memory, and heightened consciousness."
      },
      {
        "@type": "DefinedTerm",
        "name": "Isochronic Tones",
        "description": "Evenly-spaced tone pulses that turn on and off at a specific frequency, used for brainwave entrainment without requiring headphones."
      },
      {
        "@type": "DefinedTerm",
        "name": "Solfeggio Frequencies",
        "description": "Ancient musical tones (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) believed to have specific healing and spiritual properties."
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(medicalWebPageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(definedTermSetSchema)}</script>
    </Helmet>
  );
}
