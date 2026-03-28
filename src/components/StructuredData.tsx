import { Helmet } from 'react-helmet-async';

export function StructuredData() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cardinal Binaural",
    "alternateName": [
      "Cardinal Binaural Beats",
      "Cardinal Frequency Tool",
      "432 Hz Binaural Beats Generator",
      "528 Hz Frequency Generator",
      "Free Binaural Beats Online",
      "Binaural Beats App",
      "Manifestation Frequency Tool"
    ],
    "url": "https://cardinalbinaural.com",
    "description": "Free professional binaural beats generator using 432 Hz and 528 Hz natural frequencies. Scientifically-designed brainwave entrainment for manifestation, deep sleep, focus, meditation, anxiety relief, and healing. 216+ research-backed presets with zero-drift phase-locked synthesis.",
    "applicationCategory": "HealthApplication",
    "applicationSubCategory": "Meditation, Wellness, Manifestation, Brainwave Entrainment, Sound Therapy",
    "operatingSystem": "Any (Web-based — Chrome, Firefox, Safari, Edge)",
    "permissions": "audio playback",
    "softwareVersion": "3.0.0",
    "releaseNotes": "Major update with immersive WebGL visualizers, advanced audio-reactive scenes, breathing guide overlay, and 10 procedural shader environments.",
    "datePublished": "2024-01-01",
    "dateModified": "2026-03-28",
    "inLanguage": ["en", "en-US", "en-GB"],
    "isAccessibleForFree": true,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Tier",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Free access to curated binaural beats presets for focus, sleep, meditation, calm, creativity, energy, and study"
      },
      {
        "@type": "Offer",
        "name": "Cardinal Binaural Pro",
        "price": "9.99",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Unlimited access to all 216+ presets, custom frequency tuner, session history, immersive visualizers, and advanced brainwave entrainment protocols",
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
    "featureList": [
      "432 Hz Universal Harmony Tuning",
      "528 Hz DNA Repair & Love Frequency",
      "Zero-drift Phase-locked Synthesis",
      "±0.001 Hz Frequency Precision",
      "Binaural Beats (Delta, Theta, Alpha, Beta, Gamma)",
      "Monaural Beats",
      "Isochronic Tones",
      "Pink & Brown Noise Layers",
      "Custom Frequency Tuner (0.5–100 Hz beat range)",
      "Session History & Analytics Dashboard",
      "216+ Research-backed Presets",
      "Immersive Full-Screen WebGL Visualizers",
      "Audio-Reactive Shader Scenes",
      "Breathing Guide Overlay",
      "10 Procedural Environments (Tunnel, Fractal, Ocean, Aurora, Forest, Mountains, Nebula, Wormhole, Sacred Geometry, Energy Field)",
      "Real-Time Brainwave State Display",
      "Solfeggio Frequency Presets (174–963 Hz)",
      "Ambient Sound Mixer"
    ],
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi",
      "url": "https://cardinalbinaural.com",
      "jobTitle": "Founder & Audio Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "Cardinal Consulting"
      }
    },
    "creator": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "browserRequirements": "Requires JavaScript, Web Audio API, WebGL. Works on Chrome, Firefox, Safari, Edge.",
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": "https://cardinalbinaural.com/favicon.png",
        "caption": "Cardinal Binaural - Professional Binaural Beats Generator Interface"
      }
    ]
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
    "description": "Leading platform for binaural beats, brainwave entrainment, and natural frequency alignment using 432 Hz and 528 Hz. Free online binaural beats generator with 216+ presets for manifestation, focus, sleep, meditation, and healing.",
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
      "https://youtube.com/@cardinalbinaural",
      "https://tiktok.com/@cardinalbinaural",
      "https://pinterest.com/cardinalbinaural"
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
      "Manifestation",
      "Solfeggio Frequencies",
      "Delta Waves",
      "Theta Waves",
      "Alpha Waves",
      "Beta Waves",
      "Gamma Waves",
      "Isochronic Tones",
      "Monaural Beats",
      "Frequency Healing",
      "Sound Bath",
      "Sleep Music",
      "Focus Music",
      "ADHD Focus Sounds",
      "Anxiety Relief Sounds",
      "Chakra Frequencies",
      "Schumann Resonance"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cardinal Binaural Pro",
    "description": "Premium binaural beats subscription with unlimited access to 216+ presets, custom frequency tuner, immersive visualizers, session tracking, and advanced brainwave entrainment protocols using 432 Hz and 528 Hz natural frequencies.",
    "brand": {
      "@type": "Brand",
      "name": "Cardinal Binaural"
    },
    "offers": {
      "@type": "Offer",
      "price": "9.99",
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
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
      "reviewCount": "2847"
    },
    "category": "Wellness Software",
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Frequency Accuracy", "value": "±0.001 Hz" },
      { "@type": "PropertyValue", "name": "Phase Drift", "value": "0 ms" },
      { "@type": "PropertyValue", "name": "Sample Rate", "value": "48+ kHz" },
      { "@type": "PropertyValue", "name": "Preset Count", "value": "216+" }
    ]
  };

  // Massively expanded FAQ targeting all binaural beats long-tail queries
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are binaural beats and how do they work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Binaural beats are an auditory phenomenon created when two slightly different frequencies are played in each ear through stereo headphones. Your brain perceives a third frequency — the mathematical difference between the two tones. For example, if 432 Hz plays in your left ear and 442 Hz in your right ear, your brain perceives a 10 Hz Alpha wave binaural beat. This process, called brainwave entrainment or the frequency following response (FFR), synchronizes your brainwaves to the target frequency, promoting states like deep sleep (Delta, 0.5-4 Hz), meditation (Theta, 4-8 Hz), relaxation (Alpha, 8-12 Hz), focus (Beta, 12-30 Hz), or peak cognition (Gamma, 30-100 Hz). Cardinal Binaural uses precision phase-locked synthesis with ±0.001 Hz accuracy to generate clinical-grade binaural beats."
        }
      },
      {
        "@type": "Question",
        "name": "What is 432 Hz and why is it better than 440 Hz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "432 Hz is known as 'Verdi's A' or the natural frequency of the universe. Unlike the standard 440 Hz concert pitch adopted in 1953, 432 Hz is mathematically consistent with the patterns of nature — it aligns with the Fibonacci sequence, the golden ratio, and the Schumann Resonance (7.83 Hz). Many musicians, sound therapists, and researchers believe 432 Hz produces a warmer, more harmonious sound that resonates with the human body's natural vibrations. Benefits reported include reduced stress and anxiety, deeper meditation, enhanced creativity, better sleep quality, and a general sense of calm and well-being. Cardinal Binaural exclusively uses 432 Hz and 528 Hz tuning references — never 440 Hz."
        }
      },
      {
        "@type": "Question",
        "name": "What is 528 Hz and what are its benefits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "528 Hz is one of the ancient Solfeggio frequencies, known as the 'Love Frequency' or 'Miracle Tone.' It is associated with DNA repair, cellular regeneration, and transformation. Research by Dr. Leonard Horowitz suggests 528 Hz resonates at the heart of nature — it's the frequency of chlorophyll (the green pigment in plants) and is found in the buzzing of bees. Benefits include stress reduction, increased energy, enhanced clarity of mind, spiritual awakening, and deep emotional healing. Cardinal Binaural offers 528 Hz as a tuning reference for all presets."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best binaural beats for sleep?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best binaural beats for sleep use Delta frequencies (0.5-4 Hz), which correspond to the deepest stage of non-REM sleep. Cardinal Binaural's sleep presets use progressive entrainment — starting with relaxing Alpha waves (8-12 Hz) and gradually descending through Theta (4-8 Hz) into deep Delta, mimicking your brain's natural sleep onset process. For falling asleep faster, try 2-3 Hz Delta beats with a 432 Hz carrier. For lucid dreaming, use 4-7 Hz Theta beats. Our sleep presets are optimized for 30-60 minute sessions with gradual frequency sweeps."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best binaural beats for focus and concentration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For focus and concentration, Beta waves (12-30 Hz) and Gamma waves (30-100 Hz) are most effective. Cardinal Binaural's focus presets use 14-18 Hz Beta beats for sustained attention, 40 Hz Gamma beats for peak cognitive performance, and 18-24 Hz high-Beta for intense concentration. The 40 Hz Gamma frequency is particularly well-researched — studies show it enhances memory, attention, and neural binding. Our focus presets use a 432 Hz carrier frequency for natural harmony while targeting these brainwave states."
        }
      },
      {
        "@type": "Question",
        "name": "Can binaural beats help with anxiety and stress relief?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, binaural beats are widely used for anxiety and stress relief. Alpha waves (8-12 Hz) and Theta waves (4-8 Hz) are associated with relaxation and reduced anxiety. Research published in the Journal of Alternative and Complementary Medicine found that listening to Theta binaural beats (6 Hz) for 30 minutes significantly reduced anxiety levels. Cardinal Binaural's Calm presets use gentle Alpha-Theta transitions with 432 Hz tuning to promote parasympathetic nervous system activation, lowering heart rate and cortisol levels naturally."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need headphones for binaural beats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, stereo headphones are essential for binaural beats to work. The effect requires two slightly different frequencies to reach each ear separately — this is impossible with speakers, as the sounds mix in the air before reaching your ears. Use any comfortable over-ear or in-ear headphones. Cardinal Binaural also offers monaural beats and isochronic tones, which work without headphones through speakers, though headphones still provide the best experience."
        }
      },
      {
        "@type": "Question",
        "name": "What are Solfeggio frequencies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Solfeggio frequencies are a set of ancient musical tones used in Gregorian chants and believed to have specific healing properties. The six main Solfeggio frequencies are: 396 Hz (liberating guilt and fear), 417 Hz (undoing situations and facilitating change), 528 Hz (transformation and DNA repair — the 'Love Frequency'), 639 Hz (connecting relationships), 741 Hz (awakening intuition), and 852 Hz (returning to spiritual order). Extended Solfeggio frequencies include 174 Hz (pain reduction), 285 Hz (energy field healing), and 963 Hz (activation of the pineal gland). Cardinal Binaural uses these as carrier frequencies in its custom tuner."
        }
      },
      {
        "@type": "Question",
        "name": "What is brainwave entrainment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Brainwave entrainment is the process of synchronizing your brain's electrical activity to an external stimulus — typically sound or light. When your brain is exposed to a rhythmic stimulus at a specific frequency, it naturally adjusts its dominant brainwave frequency to match. This is called the Frequency Following Response (FFR). Methods include binaural beats (two tones creating a perceived third frequency), monaural beats (two tones mixed before reaching the ear), and isochronic tones (single tone pulsed on and off at regular intervals). Cardinal Binaural supports all three methods with precision phase-locked synthesis."
        }
      },
      {
        "@type": "Question",
        "name": "Are binaural beats scientifically proven?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Binaural beats have been the subject of numerous peer-reviewed studies. Research published in journals including Frontiers in Psychiatry, PLOS ONE, and the Journal of Neurotherapy has shown measurable effects on brainwave patterns, anxiety reduction, pain perception, focus, and sleep quality. A 2019 meta-analysis found significant effects on anxiety and memory. While more research is needed, the frequency following response (FFR) — the mechanism behind binaural beats — is well-established neuroscience. Cardinal Binaural's presets are designed based on published research protocols."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best frequency for meditation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For meditation, Theta waves (4-8 Hz) are ideal. The 6 Hz frequency is particularly effective for deep meditative states, promoting vivid imagery, intuition, and spiritual experiences. For beginners, Alpha waves (8-10 Hz) provide a gentle entry into a relaxed, meditative state. Advanced meditators may benefit from lower Theta (4-5 Hz) or even Delta-Theta crossover frequencies. Cardinal Binaural's meditation presets use 528 Hz carrier frequency combined with Theta beats for an optimal meditation experience enhanced by natural frequency alignment."
        }
      },
      {
        "@type": "Question",
        "name": "How long should I listen to binaural beats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For optimal results, listen to binaural beats for 15-30 minutes per session. Brainwave entrainment typically takes 7-10 minutes to take full effect. For sleep, sessions of 30-60 minutes are recommended. For focus and study, 25-minute sessions align well with the Pomodoro technique. For meditation, 20-30 minutes is ideal. Consistency matters more than duration — daily practice of even 15 minutes can produce noticeable benefits within 1-2 weeks. Cardinal Binaural's presets are pre-timed for optimal durations based on their intended purpose."
        }
      },
      {
        "@type": "Question",
        "name": "What is Cardinal Binaural?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cardinal Binaural is a free, professional-grade binaural beats generator created by Hunain Qureshi of Cardinal Consulting. It uses 432 Hz and 528 Hz natural frequencies with precision phase-locked synthesis (±0.001 Hz accuracy, zero drift) to generate clinical-quality binaural beats, monaural beats, and isochronic tones. Features include 216+ research-backed presets across 7 categories (Focus, Sleep, Meditation, Calm, Creative, Energy, Study), a custom frequency tuner, immersive full-screen WebGL visualizers, ambient sound mixer, session tracking, and a comprehensive frequency reference library."
        }
      },
      {
        "@type": "Question",
        "name": "Can binaural beats help with ADHD and focus problems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Research suggests binaural beats may help improve focus in individuals with ADHD. A study published in the Journal of Neurotherapy found that Beta and Gamma frequency brainwave entrainment improved attention and reduced hyperactivity symptoms. The 40 Hz Gamma frequency in particular has shown promise for enhancing sustained attention and cognitive processing. While binaural beats are not a replacement for medical treatment, many users with ADHD report improved concentration during work and study sessions. Cardinal Binaural's Focus presets target 14-40 Hz Beta-Gamma ranges optimized for attention enhancement."
        }
      },
      {
        "@type": "Question",
        "name": "What are Delta waves and what do they do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delta waves (0.5-4 Hz) are the slowest brainwave frequency, associated with deep dreamless sleep, physical healing, and regeneration. During Delta sleep, your body releases human growth hormone (HGH), repairs tissues, and consolidates memories. Delta brainwave entrainment is used for combating insomnia, promoting deep restorative sleep, reducing pain perception, and accelerating physical recovery. Cardinal Binaural's sleep presets progressively guide your brain into Delta states using gentle frequency sweeps."
        }
      },
      {
        "@type": "Question",
        "name": "What are Theta waves and their benefits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Theta waves (4-8 Hz) are associated with deep meditation, creativity, intuition, and the subconscious mind. They occur naturally during light sleep, deep relaxation, and meditative states. Benefits include enhanced creativity and problem-solving, vivid mental imagery, deep emotional processing, improved intuition, and access to subconscious insights. Theta waves are dominant during REM sleep and are associated with the hypnagogic state — the twilight between waking and sleeping where creative insights often occur."
        }
      },
      {
        "@type": "Question",
        "name": "What are Alpha waves and how do they reduce stress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alpha waves (8-12 Hz) are your brain's natural relaxation frequency, dominant when you're calm, relaxed, and not actively processing intense information. Alpha states are associated with reduced stress and anxiety, improved mood, enhanced learning readiness, a 'flow state' bridge between conscious thinking and subconscious processing, and increased serotonin production. Research shows Alpha wave binaural beat entrainment at 10 Hz significantly reduces cortisol levels and promotes parasympathetic nervous system activity."
        }
      },
      {
        "@type": "Question",
        "name": "Are binaural beats safe? Are there any side effects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Binaural beats are generally considered safe for most people. They are non-invasive and use only sound. However, individuals with epilepsy or seizure disorders should consult a doctor before use, as rhythmic auditory stimulation can potentially trigger seizures in susceptible individuals. Binaural beats should not be used while driving or operating machinery, as they can induce relaxed or drowsy states. Some users may experience mild headaches when first starting — this usually resolves with shorter initial sessions. Cardinal Binaural uses scientifically validated frequency ranges within safe parameters."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Schumann Resonance and how does it relate to binaural beats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Schumann Resonance is Earth's natural electromagnetic frequency at approximately 7.83 Hz, occurring in the cavity between the Earth's surface and the ionosphere. This frequency falls within the Theta-Alpha border range of human brainwaves. Many researchers believe that human brains evolved to resonate with this natural frequency, and that modern electromagnetic pollution disrupts this connection. Binaural beats at 7.83 Hz can help re-establish this natural resonance, promoting grounding, calm, and a sense of well-being. Cardinal Binaural includes Schumann Resonance presets in its frequency reference library."
        }
      },
      {
        "@type": "Question",
        "name": "Can binaural beats help with manifestation and the law of attraction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Many practitioners use binaural beats as a tool to enhance manifestation and law of attraction practices. The theory is that Theta waves (4-7 Hz) access the subconscious mind where beliefs and patterns are stored, making it an ideal state for visualization, affirmation, and intention-setting. Combined with 432 Hz (universal harmony) or 528 Hz (transformation), these frequencies create an optimal mental environment for manifestation work. Cardinal Binaural was specifically designed with manifestation in mind, offering presets that combine sacred frequencies with brainwave states conducive to focused intention and belief reprogramming."
        }
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cardinal Binaural",
    "alternateName": ["Cardinal Binaural Beats", "CardinalBinaural.com"],
    "url": "https://cardinalbinaural.com",
    "description": "Free professional binaural beats generator with 432 Hz & 528 Hz natural frequencies. 216+ presets for focus, sleep, meditation, manifestation, and healing.",
    "publisher": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://cardinalbinaural.com/presets/{search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ListenAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://cardinalbinaural.com/player"
        }
      }
    ],
    "inLanguage": "en-US",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Cardinal Consulting"
    },
    "copyrightYear": "2024"
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Cardinal Binaural",
    "description": "Free online binaural beats generator and brainwave entrainment platform using 432 Hz and 528 Hz natural frequencies for focus, sleep, meditation, manifestation, anxiety relief, and healing",
    "url": "https://cardinalbinaural.com",
    "priceRange": "Free - $9.99/mo",
    "founder": {
      "@type": "Person",
      "name": "Hunain Qureshi"
    },
    "knowsAbout": [
      "Binaural Beats",
      "Sound Therapy",
      "Meditation Technology",
      "Brainwave Entrainment",
      "432 Hz Tuning",
      "528 Hz Healing",
      "Solfeggio Frequencies",
      "Sleep Optimization",
      "Focus Enhancement",
      "Anxiety Relief",
      "Manifestation Tools"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Binaural Beats Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Free Binaural Beats",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Focus Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sleep Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Meditation Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Calm & Anxiety Relief Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Creative Flow Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Energy Boost Binaural Beats" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Study & Learning Binaural Beats" } }
          ]
        }
      ]
    }
  };

  // Course schema for educational content
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Complete Guide to Binaural Beats & Brainwave Entrainment",
    "description": "Learn how to use binaural beats, 432 Hz, 528 Hz, and Solfeggio frequencies for focus, sleep, meditation, manifestation, and healing. Includes interactive frequency reference chart and brainwave spectrum guide.",
    "provider": {
      "@type": "Organization",
      "name": "Cardinal Binaural"
    },
    "isAccessibleForFree": true,
    "educationalLevel": "Beginner to Advanced",
    "about": [
      { "@type": "Thing", "name": "Binaural Beats" },
      { "@type": "Thing", "name": "Brainwave Entrainment" },
      { "@type": "Thing", "name": "432 Hz Frequency" },
      { "@type": "Thing", "name": "528 Hz Solfeggio" },
      { "@type": "Thing", "name": "Sound Therapy" }
    ],
    "teaches": [
      "How binaural beats work",
      "Understanding brainwave states (Delta, Theta, Alpha, Beta, Gamma)",
      "Using 432 Hz and 528 Hz for wellness",
      "Solfeggio frequencies and their applications",
      "Manifestation through frequency alignment"
    ],
    "url": "https://cardinalbinaural.com/custom-tuner"
  };

  // CreativeWork for the frequency reference
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Binaural Beats Frequency Reference Chart",
    "description": "Comprehensive interactive reference chart covering all brainwave states, Solfeggio frequencies, special resonances, and 50+ frequency combination protocols for manifestation, healing, cognition, sleep, and spiritual growth.",
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cardinal Binaural"
    },
    "isAccessibleForFree": true,
    "educationalUse": "Reference",
    "learningResourceType": "Interactive Chart",
    "about": [
      { "@type": "Thing", "name": "Brainwave Frequencies" },
      { "@type": "Thing", "name": "Binaural Beats Protocols" },
      { "@type": "Thing", "name": "Solfeggio Frequencies" }
    ],
    "url": "https://cardinalbinaural.com/"
  };

  // TechArticle schema
  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "The Science of Binaural Beats: How Brainwave Entrainment Works",
    "description": "Detailed technical explanation of binaural beats, the frequency following response, phase-locked synthesis, and how different brainwave frequencies affect cognition, sleep, and emotional states.",
    "author": {
      "@type": "Person",
      "name": "Hunain Qureshi"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cardinal Binaural",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cardinalbinaural.com/favicon.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": "2026-03-28",
    "mainEntityOfPage": "https://cardinalbinaural.com/",
    "about": {
      "@type": "Thing",
      "name": "Binaural Beats Science"
    },
    "proficiencyLevel": "Beginner",
    "url": "https://cardinalbinaural.com/"
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
      <script type="application/ld+json">
        {JSON.stringify(courseSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(creativeWorkSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(techArticleSchema)}
      </script>
    </Helmet>
  );
}
