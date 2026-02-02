import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Sparkles, Moon, Zap, Music, Waves, Activity, Target, Eye, 
  Shield, Flame, ChevronRight, Play, Info, Layers, Radio, Star, Compass,
  Sunrise, Battery, BookOpen, Lightbulb, Coffee, Bed, Palette, Focus,
  Crown, Diamond, Infinity, ArrowRight, Clock, TrendingUp, Atom, Dna,
  Fingerprint, Globe, Lock, Unlock, Scale, Timer, Wind, AlertCircle,
  CheckCircle2, Gauge, HeartPulse, Leaf, Mountain, Snowflake, Sun, Thermometer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BrainwaveState {
  id: string;
  name: string;
  range: string;
  rangeMin: number;
  rangeMax: number;
  description: string;
  mentalState: string;
  benefits: string[];
  bestFor: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradientClass: string;
  scientificName: string;
  dominantDuring: string[];
  neurotransmitters: string[];
  optimalTime: string;
}

interface CarrierFrequency {
  hz: number;
  name: string;
  tradition: string;
  description: string;
  benefits: string[];
  chakra?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  scientificBasis: string;
  synergyWith: number[];
  contraindications?: string[];
}

interface FrequencyCombination {
  id: string;
  name: string;
  carrier: number;
  beat: number;
  beatEnd?: number; // For ramping protocols
  brainwave: string;
  purpose: string;
  description: string;
  benefits: string[];
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  intensity: 'gentle' | 'moderate' | 'deep' | 'intense';
  category: 'manifestation' | 'healing' | 'performance' | 'spiritual' | 'sleep' | 'focus' | 'emotional' | 'physical' | 'cognitive';
  scienceLevel: 1 | 2 | 3 | 4 | 5; // Research backing level
  optimalTime: string;
  prerequisites?: string[];
  contraindications?: string[];
  synergisticPractices: string[];
  expectedEffects: { timeframe: string; effect: string }[];
}

interface SpecialResonance {
  hz: number;
  name: string;
  type: 'earth' | 'cosmic' | 'biological' | 'sacred';
  description: string;
  discoverer?: string;
  effects: string[];
  applications: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ============================================================================
// DATA: BRAINWAVE STATES (ENHANCED)
// ============================================================================

const brainwaveStates: BrainwaveState[] = [
  {
    id: 'delta',
    name: 'Delta',
    range: '0.5 – 4 Hz',
    rangeMin: 0.5,
    rangeMax: 4,
    description: 'The slowest brainwaves, dominant during deep dreamless sleep. Essential for healing, regeneration, and immune system function. Delta is when your body performs its most critical repair work.',
    mentalState: 'Unconscious, Deep Sleep',
    scientificName: 'Slow-wave sleep (N3)',
    dominantDuring: ['Deep dreamless sleep', 'Coma states', 'Very deep meditation', 'Hypnotic trance'],
    neurotransmitters: ['Human Growth Hormone (HGH)', 'Melatonin', 'DHEA', 'Serotonin precursors'],
    benefits: ['Deep restorative sleep', 'Physical healing & repair', 'Growth hormone release (up to 300% increase)', 'Immune system boost', 'Cellular regeneration', 'Anti-aging effects', 'Cortisol reduction'],
    bestFor: ['Insomnia relief', 'Physical recovery', 'Chronic pain', 'Deep rest', 'Injury healing', 'Immune support'],
    optimalTime: 'Nighttime (10pm - 6am)',
    icon: Moon,
    color: 'hsl(var(--dream))',
    gradientClass: 'from-indigo-600 via-purple-600 to-violet-700',
  },
  {
    id: 'theta',
    name: 'Theta',
    range: '4 – 8 Hz',
    rangeMin: 4,
    rangeMax: 8,
    description: 'Present during light sleep, deep meditation, and hypnagogic states. The gateway to the subconscious mind and creativity. Theta is where profound insights and emotional healing occur.',
    mentalState: 'Deeply Relaxed, Dreaming',
    scientificName: 'Hypnagogic/Hypnopompic state',
    dominantDuring: ['REM sleep', 'Deep meditation', 'Hypnosis', 'Daydreaming', 'Creative visualization'],
    neurotransmitters: ['Acetylcholine', 'GABA increase', 'Endorphins', 'Serotonin'],
    benefits: ['Deep meditation access', 'Enhanced creativity (up to 500%)', 'Subconscious reprogramming', 'Memory consolidation', 'Intuition enhancement', 'Emotional trauma release', 'Limiting belief removal'],
    bestFor: ['Meditation practice', 'Creative projects', 'Visualization', 'Past trauma healing', 'Manifestation work', 'Hypnotherapy'],
    optimalTime: 'Early morning (5-7am) or Evening (7-9pm)',
    icon: Eye,
    color: 'hsl(280 69% 78%)',
    gradientClass: 'from-purple-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    range: '8 – 12 Hz',
    rangeMin: 8,
    rangeMax: 12,
    description: 'The bridge between conscious and subconscious. Present during relaxed alertness, light meditation, and creative flow states. Alpha represents the optimal state for learning and stress relief.',
    mentalState: 'Relaxed Alertness, Flow',
    scientificName: 'Berger wave / Posterior dominant rhythm',
    dominantDuring: ['Eyes closed relaxation', 'Light meditation', 'Creative flow', 'Mindfulness', 'Post-exercise recovery'],
    neurotransmitters: ['Serotonin', 'Dopamine (moderate)', 'Reduced Cortisol', 'GABA'],
    benefits: ['Calm focus without anxiety', 'Stress reduction (40-60%)', 'Accelerated learning', 'Mind-body integration', 'Creative problem solving', 'Positive mood enhancement', 'Optimal performance prep'],
    bestFor: ['Study sessions', 'Creative work', 'Stress relief', 'Light meditation', 'Sports visualization', 'Pre-performance preparation'],
    optimalTime: 'Anytime (especially mornings & afternoon)',
    icon: Brain,
    color: 'hsl(var(--accent))',
    gradientClass: 'from-cyan-500 via-teal-500 to-emerald-500',
  },
  {
    id: 'beta',
    name: 'Beta',
    range: '12 – 30 Hz',
    rangeMin: 12,
    rangeMax: 30,
    description: 'Dominant during waking consciousness, active thinking, and concentration. Low Beta (12-15 Hz) is calm focus, Mid Beta (15-20 Hz) is active thinking, High Beta (20-30 Hz) can cause anxiety if sustained.',
    mentalState: 'Active, Alert, Focused',
    scientificName: 'Desynchronized EEG',
    dominantDuring: ['Active problem-solving', 'Conversation', 'Work tasks', 'Logical analysis', 'Active learning'],
    neurotransmitters: ['Dopamine', 'Norepinephrine', 'Cortisol (variable)', 'Acetylcholine'],
    benefits: ['Active concentration', 'Logical thinking', 'Complex problem solving', 'Alert cognition', 'Task performance', 'Quick thinking', 'Verbal articulation'],
    bestFor: ['Work tasks', 'Analysis', 'Learning new skills', 'Active problem-solving', 'Debates & presentations', 'Physical training'],
    optimalTime: 'Working hours (9am - 5pm)',
    icon: Zap,
    color: 'hsl(45 93% 47%)',
    gradientClass: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    range: '30 – 100 Hz',
    rangeMin: 30,
    rangeMax: 100,
    description: 'The fastest brainwaves, associated with peak cognitive function, transcendental states, and information binding across brain regions. Present in experienced meditators and during moments of insight.',
    mentalState: 'Peak Performance, Insight',
    scientificName: 'High-frequency oscillations',
    dominantDuring: ['Peak concentration', 'Moments of insight', 'Advanced meditation', 'Complex cognition', 'Multi-sensory processing'],
    neurotransmitters: ['Glutamate', 'Dopamine surge', 'Acetylcholine peak', 'Endorphin release'],
    benefits: ['Peak cognition', 'Information processing (2-3x faster)', 'Memory formation & recall', 'Transcendent states', 'Binding of senses', 'Higher consciousness', 'Compassion enhancement'],
    bestFor: ['Peak performance', 'Memory enhancement', 'Spiritual practice', 'Complex problem-solving', 'Alzheimer\'s research applications', 'Insight meditation'],
    optimalTime: 'Peak hours (10am - 2pm)',
    icon: Sparkles,
    color: 'hsl(var(--primary))',
    gradientClass: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
];

// ============================================================================
// DATA: SPECIAL RESONANCE FREQUENCIES
// ============================================================================

const specialResonances: SpecialResonance[] = [
  {
    hz: 7.83,
    name: 'Schumann Resonance',
    type: 'earth',
    description: 'Earth\'s fundamental electromagnetic frequency. The "heartbeat" of the planet, generated by lightning strikes in the cavity between Earth\'s surface and ionosphere.',
    discoverer: 'Winfried Otto Schumann (1952)',
    effects: ['Grounding & centering', 'Circadian rhythm regulation', 'Stress reduction', 'Enhanced well-being', 'Improved sleep quality'],
    applications: ['Jet lag recovery', 'Grounding meditation', 'EMF protection protocols', 'Natural healing enhancement'],
    icon: Globe,
    color: 'from-emerald-500 to-green-600',
  },
  {
    hz: 40,
    name: '40 Hz Gamma',
    type: 'biological',
    description: 'The brain\'s "binding frequency" that synchronizes neural activity across regions. Currently researched for Alzheimer\'s disease treatment and cognitive enhancement.',
    discoverer: 'MIT Research (Li-Huei Tsai)',
    effects: ['Microglial activation', 'Amyloid plaque reduction', 'Memory enhancement', 'Cognitive clarity', 'Neural synchronization'],
    applications: ['Cognitive enhancement', 'Alzheimer\'s research', 'Peak mental performance', 'Memory training'],
    icon: Brain,
    color: 'from-pink-500 to-rose-600',
  },
  {
    hz: 111,
    name: 'Sacred Chamber Frequency',
    type: 'sacred',
    description: 'Found in ancient sacred sites worldwide including the Hypogeum of Malta and King\'s Chamber of the Great Pyramid. Associated with altered states of consciousness.',
    effects: ['Altered consciousness', 'Spiritual experiences', 'Prefrontal cortex activation', 'Reduced anxiety'],
    applications: ['Deep meditation', 'Spiritual ceremonies', 'Consciousness exploration'],
    icon: Mountain,
    color: 'from-violet-500 to-purple-600',
  },
  {
    hz: 136.1,
    name: 'OM Frequency',
    type: 'cosmic',
    description: 'The calculated frequency of Earth\'s year (orbital period around the sun) as determined by Hans Cousto. Represents cosmic harmony and universal consciousness.',
    discoverer: 'Hans Cousto (Cosmic Octave)',
    effects: ['Deep relaxation', 'Cosmic connection', 'Heart chakra activation', 'Tranquility'],
    applications: ['OM chanting', 'Yoga practice', 'Sound healing', 'Meditation'],
    icon: Sun,
    color: 'from-amber-500 to-orange-500',
  },
  {
    hz: 432,
    name: 'Verdi\'s A / Universal Harmony',
    type: 'sacred',
    description: 'Mathematical harmony with nature. A432 creates a ratio of 1.5 with 288 Hz (the frequency of healthy cells). Preferred by Verdi and many classical composers.',
    effects: ['Natural resonance', 'Heart coherence', 'Reduced listening fatigue', 'Enhanced emotional response'],
    applications: ['All binaural sessions', 'Music listening', 'Sound healing', 'Meditation'],
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    hz: 528,
    name: 'Miracle Tone / DNA Repair',
    type: 'biological',
    description: 'Central to the Solfeggio scale. Research by Dr. Leonard Horowitz links it to DNA repair. Chlorophyll absorbs light at 528nm. Bees buzz at 528 Hz.',
    discoverer: 'Dr. Leonard Horowitz',
    effects: ['DNA repair potential', 'Cellular regeneration', 'Transformation', 'Love frequency'],
    applications: ['Healing protocols', 'Manifestation', 'Transformation work', 'DNA activation'],
    icon: Dna,
    color: 'from-green-500 to-emerald-500',
  },
  {
    hz: 639,
    name: 'Heart Connection',
    type: 'sacred',
    description: 'Solfeggio frequency for harmonizing relationships and attracting love. Resonates with the heart chakra and promotes interpersonal connection.',
    effects: ['Relationship healing', 'Communication enhancement', 'Love attraction', 'Social harmony'],
    applications: ['Relationship work', 'Heart opening', 'Social anxiety relief'],
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    hz: 852,
    name: 'Third Eye Activation',
    type: 'sacred',
    description: 'Solfeggio frequency for returning to spiritual order. Associated with pineal gland activation and heightened intuition.',
    effects: ['Intuition enhancement', 'Third eye activation', 'Spiritual insight', 'Clarity'],
    applications: ['Intuition development', 'Psychic work', 'Meditation', 'Insight seeking'],
    icon: Eye,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    hz: 963,
    name: 'Divine Connection',
    type: 'cosmic',
    description: 'The highest Solfeggio frequency, associated with pineal gland activation and connection to source energy. Represents pure light and oneness.',
    effects: ['Pineal activation', 'Divine connection', 'Unity consciousness', 'Enlightenment states'],
    applications: ['Advanced meditation', 'Spiritual awakening', 'Kundalini work'],
    icon: Crown,
    color: 'from-violet-500 to-purple-600',
  },
];

// ============================================================================
// DATA: CARRIER/MANIFESTATION FREQUENCIES (ENHANCED)
// ============================================================================

const carrierFrequencies: CarrierFrequency[] = [
  {
    hz: 174,
    name: 'Foundation / Pain Relief',
    tradition: 'Solfeggio',
    description: 'The lowest Solfeggio frequency. Creates a foundation of security and serves as a natural anesthetic, reducing pain by up to 40% in some studies.',
    benefits: ['Pain reduction', 'Sense of security', 'Physical grounding', 'Organ healing', 'Anesthetic effect'],
    chakra: 'Root (grounding)',
    scientificBasis: 'Activates parasympathetic nervous system, reduces cortisol, increases endorphin production',
    synergyWith: [285, 432],
    contraindications: ['May cause drowsiness - avoid driving'],
    icon: Shield,
    color: 'from-stone-500 to-stone-700',
  },
  {
    hz: 285,
    name: 'Quantum Cognition / Tissue Healing',
    tradition: 'Solfeggio',
    description: 'Influences the quantum field and energy body. Particularly effective for tissue regeneration and restructuring damaged organs at the cellular level.',
    benefits: ['Tissue regeneration', 'Energy restructuring', 'Wound healing', 'Cellular repair', 'Burns & injuries'],
    chakra: 'Sacral',
    scientificBasis: 'May influence cellular mitosis and accelerate wound healing through resonance',
    synergyWith: [174, 528],
    icon: Activity,
    color: 'from-red-500 to-rose-600',
  },
  {
    hz: 396,
    name: 'Liberation / Fear Release',
    tradition: 'Solfeggio',
    description: 'Liberates from guilt and fear. Turns grief into joy. Cleanses the feeling of guilt and enables achievement of goals by removing subconscious blocks.',
    benefits: ['Fear release', 'Guilt liberation', 'Goal achievement', 'Emotional grounding', 'Trauma release'],
    chakra: 'Root',
    scientificBasis: 'Activates vagal tone, reduces amygdala hyperactivity, promotes emotional regulation',
    synergyWith: [417, 432],
    icon: Unlock,
    color: 'from-red-600 to-orange-500',
  },
  {
    hz: 417,
    name: 'Facilitating Change',
    tradition: 'Solfeggio',
    description: 'Undoes situations and facilitates change. Cleanses traumatic experiences and clears destructive influences from past events.',
    benefits: ['Trauma clearing', 'Change facilitation', 'Negative energy removal', 'Fresh start energy', 'Breaking patterns'],
    chakra: 'Sacral',
    scientificBasis: 'May help reorganize neural pathways associated with traumatic memories',
    synergyWith: [396, 528],
    icon: Waves,
    color: 'from-orange-500 to-amber-500',
  },
  {
    hz: 432,
    name: 'Universal Harmony',
    tradition: 'Natural/Cosmic',
    description: 'Mathematically aligned with nature and the cosmos. Creates heart coherence and resonates with the Schumann resonance. The most recommended carrier for all purposes.',
    benefits: ['Natural harmony', 'Heart coherence', 'Calm listening', 'Universal alignment', 'Reduced anxiety', 'Enhanced creativity'],
    chakra: 'Heart',
    scientificBasis: 'A432 = 2^4 × 3^3 (perfect mathematical harmony). Ratio of 1.5 with healthy cell frequency (288 Hz)',
    synergyWith: [528, 639, 852],
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    hz: 528,
    name: 'Miracle / Love / DNA Repair',
    tradition: 'Solfeggio',
    description: 'The "Miracle Tone" used by biochemists to repair DNA. Central frequency of the Solfeggio scale. Chlorophyll absorbs at 528nm. The frequency of love and transformation.',
    benefits: ['DNA repair', 'Transformation', 'Increased energy', 'Clarity of mind', 'Manifestation power', 'Cellular health'],
    chakra: 'Heart/Solar Plexus',
    scientificBasis: 'Research shows potential effects on water crystallization, DNA repair enzymes, and cellular resonance',
    synergyWith: [432, 639, 852],
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
  },
  {
    hz: 639,
    name: 'Connection / Relationships',
    tradition: 'Solfeggio',
    description: 'Enables connection and harmonious interpersonal relationships. Enhances communication, understanding, tolerance, and love attraction.',
    benefits: ['Relationship healing', 'Communication enhancement', 'Understanding', 'Tolerance', 'Love attraction', 'Social harmony'],
    chakra: 'Heart/Throat',
    scientificBasis: 'May influence oxytocin production and heart-brain coherence',
    synergyWith: [432, 528, 741],
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    hz: 741,
    name: 'Awakening Intuition',
    tradition: 'Solfeggio',
    description: 'Cleans the cells from toxins and leads to a healthier life. Solves problems and awakens intuition. Excellent for detox protocols.',
    benefits: ['Cellular cleansing', 'Problem solving', 'Self-expression', 'Pure intuition', 'Toxin removal', 'EMF protection'],
    chakra: 'Throat',
    scientificBasis: 'May support cellular detoxification pathways and lymphatic function',
    synergyWith: [639, 852],
    icon: Lightbulb,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    hz: 852,
    name: 'Spiritual Order / Third Eye',
    tradition: 'Solfeggio',
    description: 'Awakens intuition and returns you to spiritual order. Opens third eye and raises awareness to the highest level.',
    benefits: ['Spiritual awakening', 'Third eye activation', 'Higher awareness', 'Inner strength', 'Intuition', 'Clarity'],
    chakra: 'Third Eye',
    scientificBasis: 'May influence pineal gland function and melatonin/DMT production',
    synergyWith: [528, 963],
    contraindications: ['May cause vivid dreams or restlessness in sensitive individuals'],
    icon: Eye,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    hz: 963,
    name: 'Divine Consciousness',
    tradition: 'Solfeggio',
    description: 'Awakens any system to its original, perfect state. Enables direct experience of the light and oneness with source energy.',
    benefits: ['Pineal activation', 'Divine connection', 'Unity consciousness', 'Enlightenment', 'Pure light', 'Cosmic awareness'],
    chakra: 'Crown',
    scientificBasis: 'Highest Solfeggio frequency, may influence crown chakra energy center and spiritual experiences',
    synergyWith: [852, 528],
    contraindications: ['Intense for beginners - build up gradually'],
    icon: Crown,
    color: 'from-violet-500 to-purple-600',
  },
];

// ============================================================================
// DATA: FREQUENCY COMBINATIONS (MASSIVELY ENHANCED)
// ============================================================================

const frequencyCombinations: FrequencyCombination[] = [
  // === MANIFESTATION PROTOCOLS ===
  {
    id: 'abundance-manifest',
    name: 'Abundance Manifestation Protocol',
    carrier: 528,
    beat: 7.83,
    brainwave: 'Theta (Schumann)',
    purpose: 'Manifest wealth, prosperity, and abundance',
    description: 'The Miracle Tone (528 Hz) combined with Earth\'s resonance (7.83 Hz) creates a powerful quantum field for abundance manifestation. This combination aligns your biofield with Earth\'s natural prosperity frequency while accessing subconscious programming states.',
    benefits: ['Attract abundance', 'Remove scarcity blocks', 'Align with prosperity consciousness', 'Open receiving channels', 'Reprogram money beliefs'],
    duration: '20-40 min daily',
    icon: Diamond,
    intensity: 'moderate',
    category: 'manifestation',
    scienceLevel: 3,
    optimalTime: 'Morning (6-8am) or before sleep',
    synergisticPractices: ['Visualization', 'Gratitude journaling', 'Affirmations', 'Vision board meditation'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Deep relaxation, expanded awareness' },
      { timeframe: '1-2 weeks', effect: 'Shift in money mindset, new opportunities noticed' },
      { timeframe: '30 days', effect: 'Tangible manifestation of abundance' },
    ],
  },
  {
    id: 'love-attraction',
    name: 'Love Attraction Field',
    carrier: 639,
    beat: 6,
    brainwave: 'Theta',
    purpose: 'Attract love and harmonious relationships',
    description: 'The Connecting frequency (639 Hz) with mid-Theta (6 Hz) opens the heart chakra and accesses the subconscious to attract and receive love. Heals past relationship wounds and aligns you with your soulmate frequency.',
    benefits: ['Attract soulmate', 'Heal past relationships', 'Open heart chakra', 'Enhance self-love', 'Release attachment wounds'],
    duration: '30-45 min daily',
    icon: Heart,
    intensity: 'gentle',
    category: 'manifestation',
    scienceLevel: 2,
    optimalTime: 'Evening (sunset hours)',
    synergisticPractices: ['Heart-opening yoga', 'Rose quartz meditation', 'Loving-kindness practice', 'Mirror work'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Heart warmth, emotional softening' },
      { timeframe: '1-2 weeks', effect: 'Improved self-love, attracting positive attention' },
      { timeframe: '30 days', effect: 'Meaningful connections, potential partner meetings' },
    ],
  },
  {
    id: 'reality-shift',
    name: 'Reality Shifting Protocol',
    carrier: 432,
    beat: 4,
    beatEnd: 2,
    brainwave: 'Deep Theta → Delta',
    purpose: 'Access parallel realities and shift timelines',
    description: 'Universal Harmony (432 Hz) at the Theta/Delta border creates a liminal state optimal for reality shifting and quantum jumping. The beat frequency gradually descends to deepen the trance state.',
    benefits: ['Timeline shifting', 'Reality manifestation', 'Lucid dreaming prep', 'Parallel reality access', 'Quantum jumping'],
    duration: '45-60 min (do not disturb)',
    icon: Infinity,
    intensity: 'deep',
    category: 'manifestation',
    scienceLevel: 2,
    optimalTime: 'Late night (11pm-2am)',
    prerequisites: ['Prior meditation experience', 'Comfortable with deep trance states'],
    synergisticPractices: ['Reality scripting', 'Void state meditation', 'SATS method', 'Shifting scripts'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Deep trance, time distortion' },
      { timeframe: '1-2 weeks', effect: 'Vivid dreams, synchronicities increase' },
      { timeframe: '30 days', effect: 'Noticeable reality shifts, manifestations' },
    ],
  },
  {
    id: 'success-programming',
    name: 'Success Subconscious Programming',
    carrier: 852,
    beat: 10,
    brainwave: 'Alpha Peak',
    purpose: 'Program subconscious for success and achievement',
    description: 'Third Eye activation (852 Hz) at Alpha peak (10 Hz) creates the optimal state for subconscious reprogramming. The critical factor window where suggestions bypass the conscious mind.',
    benefits: ['Goal achievement acceleration', 'Success mindset installation', 'Confidence boost', 'Clarity of purpose', 'Limiting belief removal'],
    duration: '20-30 min daily',
    icon: Target,
    intensity: 'moderate',
    category: 'manifestation',
    scienceLevel: 4,
    optimalTime: 'Morning (upon waking) or before important events',
    synergisticPractices: ['Success affirmations', 'Goal visualization', 'Power poses', 'Success journaling'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Confidence surge, mental clarity' },
      { timeframe: '1 week', effect: 'Increased motivation, action-taking' },
      { timeframe: '30 days', effect: 'Measurable progress toward goals' },
    ],
  },
  {
    id: 'quantum-creation',
    name: 'Quantum Creation Matrix',
    carrier: 528,
    beat: 4.5,
    brainwave: 'Deep Theta',
    purpose: 'Access the quantum field for reality creation',
    description: 'The DNA repair frequency meets the deepest Theta for direct access to the quantum field. In this state, intention becomes matter as you collapse wave functions into your desired reality.',
    benefits: ['Quantum field access', 'Intention amplification', 'Reality design', 'Timeline selection', 'Probability wave collapse'],
    duration: '30-45 min',
    icon: Atom,
    intensity: 'deep',
    category: 'manifestation',
    scienceLevel: 2,
    optimalTime: 'Dawn or dusk (liminal hours)',
    synergisticPractices: ['Dr. Joe Dispenza meditations', 'Heart-brain coherence', 'Elevated emotions', 'Specific intention setting'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Expanded consciousness, time dissolution' },
      { timeframe: '1-2 weeks', effect: 'Increased synchronicities, intuitive hits' },
      { timeframe: '30 days', effect: 'Accelerated manifestation of intentions' },
    ],
  },

  // === HEALING PROTOCOLS ===
  {
    id: 'dna-repair',
    name: 'DNA Repair & Regeneration',
    carrier: 528,
    beat: 2.5,
    brainwave: 'Delta',
    purpose: 'Cellular repair and physical healing',
    description: 'The Miracle Tone known for DNA repair (528 Hz) combined with deep Delta (2.5 Hz) for maximum cellular regeneration during deep rest. This is when your body performs its most critical repair work.',
    benefits: ['DNA repair activation', 'Cellular regeneration', 'Physical healing acceleration', 'Immune boost (up to 200%)', 'HGH release', 'Telomere support'],
    duration: '45-90 min (during sleep)',
    icon: Dna,
    intensity: 'deep',
    category: 'healing',
    scienceLevel: 4,
    optimalTime: 'Sleep time (10pm-6am)',
    synergisticPractices: ['Quality sleep environment', 'Grounding/earthing', 'Anti-inflammatory diet', 'Adequate hydration'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Deep restorative sleep' },
      { timeframe: '1 week', effect: 'Improved energy, faster wound healing' },
      { timeframe: '30 days', effect: 'Significant health improvements' },
    ],
  },
  {
    id: 'emotional-release',
    name: 'Emotional Trauma Release',
    carrier: 396,
    beat: 5,
    brainwave: 'Theta',
    purpose: 'Release trauma and emotional blocks',
    description: 'Liberation frequency (396 Hz) at Theta (5 Hz) accesses subconscious to release stored emotions, guilt, and fear patterns. This is deep emotional housekeeping at the root level.',
    benefits: ['Trauma release', 'Guilt release', 'Fear dissolution', 'Emotional freedom', 'Nervous system reset', 'PTSD support'],
    duration: '30-45 min',
    icon: Flame,
    intensity: 'moderate',
    category: 'emotional',
    scienceLevel: 4,
    optimalTime: 'Evening (when you can fully process)',
    prerequisites: ['Emotional readiness', 'Safe space'],
    contraindications: ['Severe PTSD without professional support'],
    synergisticPractices: ['EFT tapping', 'Breathwork', 'Journaling after session', 'Somatic experiencing'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Emotional release, possible tears' },
      { timeframe: '1 week', effect: 'Lighter emotional state, old triggers reduced' },
      { timeframe: '30 days', effect: 'Freedom from emotional patterns' },
    ],
  },
  {
    id: 'pain-relief',
    name: 'Natural Pain Relief Protocol',
    carrier: 174,
    beat: 1.5,
    brainwave: 'Deep Delta',
    purpose: 'Natural anesthetic and pain management',
    description: 'The Foundation Tone (174 Hz) at deep Delta (1.5 Hz) creates a natural analgesic effect. Studies show up to 40% pain reduction. Excellent for chronic pain and physical discomfort.',
    benefits: ['Pain reduction (30-50%)', 'Natural anesthesia', 'Physical comfort', 'Deep relaxation', 'Inflammation reduction', 'Muscle tension release'],
    duration: '30-60 min',
    icon: Shield,
    intensity: 'deep',
    category: 'physical',
    scienceLevel: 5,
    optimalTime: 'When experiencing pain',
    synergisticPractices: ['Body scan meditation', 'Cold/heat therapy', 'Gentle stretching', 'Pain reframing'],
    expectedEffects: [
      { timeframe: '10-15 min', effect: 'Pain numbing begins' },
      { timeframe: '30 min', effect: 'Significant pain reduction' },
      { timeframe: 'Regular use', effect: 'Chronic pain management' },
    ],
  },
  {
    id: 'immune-boost',
    name: 'Immune System Activation',
    carrier: 285,
    beat: 2,
    brainwave: 'Delta',
    purpose: 'Boost immune function and cellular health',
    description: 'Tissue healing frequency (285 Hz) at Delta (2 Hz) maximizes immune cell production and activity. HGH release increases up to 300%, supporting overall immune function.',
    benefits: ['Immune boost', 'White blood cell activation', 'Faster recovery', 'Infection resistance', 'Cellular repair', 'Inflammation reduction'],
    duration: '45-60 min (during rest)',
    icon: Shield,
    intensity: 'moderate',
    category: 'physical',
    scienceLevel: 4,
    optimalTime: 'Bedtime or when feeling unwell',
    synergisticPractices: ['Vitamin C/D supplementation', 'Rest', 'Bone broth', 'Stress reduction'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Deep relaxation, sleepiness' },
      { timeframe: '24-48 hours', effect: 'Reduced symptoms if ill' },
      { timeframe: 'Ongoing', effect: 'Improved baseline immunity' },
    ],
  },
  {
    id: 'anxiety-dissolution',
    name: 'Anxiety Dissolution Protocol',
    carrier: 432,
    beat: 10,
    beatEnd: 8,
    brainwave: 'Alpha (calming ramp)',
    purpose: 'Eliminate anxiety and restore calm',
    description: 'Universal Harmony (432 Hz) at calming Alpha gradually reduces anxiety by activating the parasympathetic nervous system. Clinically shown to reduce cortisol by 40-60%.',
    benefits: ['Anxiety reduction (up to 65%)', 'Cortisol reduction', 'Nervous system calming', 'Panic attack prevention', 'Emotional regulation', 'HRV improvement'],
    duration: '15-30 min',
    icon: Wind,
    intensity: 'gentle',
    category: 'emotional',
    scienceLevel: 5,
    optimalTime: 'When anxious, or preventatively in morning',
    synergisticPractices: ['Box breathing', 'Progressive muscle relaxation', 'Grounding techniques', 'Nature exposure'],
    expectedEffects: [
      { timeframe: '5 min', effect: 'Heart rate slowing, calming begins' },
      { timeframe: '15 min', effect: 'Significant anxiety reduction' },
      { timeframe: 'Regular use', effect: 'Rewired stress response' },
    ],
  },
  {
    id: 'depression-lift',
    name: 'Mood Elevation Protocol',
    carrier: 528,
    beat: 10,
    brainwave: 'Alpha Peak',
    purpose: 'Lift depression and elevate mood naturally',
    description: 'The Love frequency (528 Hz) at Alpha peak (10 Hz) naturally elevates serotonin and dopamine. Creates the neurochemical environment for joy and optimism.',
    benefits: ['Mood elevation', 'Serotonin boost', 'Dopamine regulation', 'Hope restoration', 'Motivation increase', 'Anhedonia relief'],
    duration: '20-30 min daily',
    icon: Sun,
    intensity: 'moderate',
    category: 'emotional',
    scienceLevel: 4,
    optimalTime: 'Morning (for best daily impact)',
    synergisticPractices: ['Morning sunlight', 'Exercise', 'Social connection', 'Gratitude practice'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Subtle mood lift, relaxation' },
      { timeframe: '1 week', effect: 'Noticeable mood improvement' },
      { timeframe: '30 days', effect: 'Sustained mood elevation' },
    ],
  },

  // === COGNITIVE/PERFORMANCE PROTOCOLS ===
  {
    id: 'peak-focus',
    name: 'Peak Focus & Flow State',
    carrier: 432,
    beat: 14,
    brainwave: 'Low Beta',
    purpose: 'Maximum concentration and productivity',
    description: 'Natural harmony base (432 Hz) with focused Beta (14 Hz) for sustained concentration without stress or fatigue. This is the sweet spot for flow state work.',
    benefits: ['Laser focus', 'Flow state access', 'Productivity boost (2-3x)', 'Mental clarity', 'Distraction immunity', 'Sustained attention'],
    duration: '30-90 min (pomodoro compatible)',
    icon: Focus,
    intensity: 'moderate',
    category: 'focus',
    scienceLevel: 5,
    optimalTime: 'Work hours (when most productive)',
    synergisticPractices: ['Clear workspace', 'Single-tasking', 'Caffeine timing', 'Distraction blocking'],
    expectedEffects: [
      { timeframe: '5 min', effect: 'Focus sharpening begins' },
      { timeframe: '20 min', effect: 'Deep focus, flow state entry' },
      { timeframe: 'During session', effect: 'Sustained high performance' },
    ],
  },
  {
    id: 'gamma-cognition',
    name: 'Gamma Cognitive Enhancement',
    carrier: 528,
    beat: 40,
    brainwave: 'Gamma',
    purpose: 'Peak mental performance and learning',
    description: 'Transformation frequency (528 Hz) at Gamma (40 Hz) for enhanced cognition. MIT research shows 40 Hz stimulation increases memory, reduces amyloid plaques, and enhances neural synchrony.',
    benefits: ['Memory enhancement (40-60%)', 'Learning acceleration', 'Peak cognition', 'Information binding', 'Neural synchronization', 'Alzheimer\'s prevention'],
    duration: '15-30 min',
    icon: Zap,
    intensity: 'intense',
    category: 'cognitive',
    scienceLevel: 5,
    optimalTime: 'Before learning tasks or exams',
    synergisticPractices: ['Active learning', 'Spaced repetition', 'Memory palaces', 'Teaching others'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Mental clarity, alertness' },
      { timeframe: 'During session', effect: 'Enhanced recall and processing' },
      { timeframe: 'Long-term', effect: 'Improved baseline cognition' },
    ],
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius Activation',
    carrier: 432,
    beat: 7,
    brainwave: 'Theta',
    purpose: 'Unlock creative potential and innovation',
    description: 'Universal Harmony (432 Hz) at creative Theta (7 Hz) accesses the subconscious creative reservoir. This is where breakthroughs happen and impossible connections form.',
    benefits: ['Creative breakthrough', 'Innovation capacity', 'Artistic inspiration', 'Problem solving', 'Divergent thinking', 'Imagination expansion'],
    duration: '30-45 min',
    icon: Palette,
    intensity: 'gentle',
    category: 'performance',
    scienceLevel: 4,
    optimalTime: 'Morning (before creative work) or when stuck',
    synergisticPractices: ['Free writing', 'Mind mapping', 'Brainstorming', 'Nature walks'],
    expectedEffects: [
      { timeframe: 'During session', effect: 'Ideas flow, mental blocks dissolve' },
      { timeframe: 'Post-session', effect: 'Creative insights emerge' },
      { timeframe: 'Regular use', effect: 'Expanded creative capacity' },
    ],
  },
  {
    id: 'memory-palace',
    name: 'Memory Enhancement Protocol',
    carrier: 432,
    beat: 12,
    brainwave: 'Alpha-Beta Border',
    purpose: 'Enhance memory encoding and recall',
    description: 'At the Alpha-Beta crossover (12 Hz), the brain is primed for optimal memory formation. Combined with 432 Hz for natural harmony, this creates the perfect learning state.',
    benefits: ['Memory encoding boost', 'Faster recall', 'Study efficiency', 'Information retention', 'Learning acceleration', 'Exam preparation'],
    duration: '30-60 min (during study)',
    icon: BookOpen,
    intensity: 'moderate',
    category: 'cognitive',
    scienceLevel: 5,
    optimalTime: 'Study sessions',
    synergisticPractices: ['Active recall', 'Spaced repetition', 'Note-taking', 'Teaching concepts'],
    expectedEffects: [
      { timeframe: 'During session', effect: 'Enhanced focus and encoding' },
      { timeframe: 'Next day', effect: 'Improved recall of studied material' },
      { timeframe: '1 week', effect: 'Measurable learning improvement' },
    ],
  },
  {
    id: 'athletic-edge',
    name: 'Athletic Performance Edge',
    carrier: 528,
    beat: 18,
    brainwave: 'Mid-High Beta',
    purpose: 'Physical performance enhancement',
    description: 'High energy Beta with transformation frequency primes the body for peak physical performance. Increases reaction time, endurance, and competitive focus.',
    benefits: ['Reaction time improvement', 'Endurance boost', 'Competitive focus', 'Adrenaline optimization', 'Pain threshold increase', 'Recovery acceleration'],
    duration: '15-20 min (pre-workout)',
    icon: TrendingUp,
    intensity: 'intense',
    category: 'performance',
    scienceLevel: 4,
    optimalTime: '20-30 min before competition/training',
    synergisticPractices: ['Dynamic warm-up', 'Visualization of performance', 'Power breathing', 'Motivation playlist'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Increased alertness and energy' },
      { timeframe: 'During activity', effect: 'Enhanced performance' },
      { timeframe: 'Post-activity', effect: 'Faster recovery' },
    ],
  },

  // === SPIRITUAL PROTOCOLS ===
  {
    id: 'deep-meditation',
    name: 'Deep Meditation Journey',
    carrier: 432,
    beat: 4.5,
    brainwave: 'Deep Theta',
    purpose: 'Profound meditative states',
    description: 'Universal tuning (432 Hz) at deep Theta (4.5 Hz) for accessing profound meditative states and inner wisdom. This is the gateway to transcendence.',
    benefits: ['Deep meditation access', 'Inner peace', 'Spiritual insight', 'Ego dissolution', 'Timelessness', 'Unity experience'],
    duration: '30-60 min',
    icon: Compass,
    intensity: 'deep',
    category: 'spiritual',
    scienceLevel: 4,
    optimalTime: 'Dawn or dusk (sacred hours)',
    synergisticPractices: ['Breath awareness', 'Mantra meditation', 'Body scanning', 'Vipassana'],
    expectedEffects: [
      { timeframe: '10 min', effect: 'Mind quieting, relaxation deepening' },
      { timeframe: '30 min', effect: 'Profound stillness, insights arise' },
      { timeframe: 'Regular practice', effect: 'Expanded consciousness' },
    ],
  },
  {
    id: 'crown-activation',
    name: 'Crown Chakra Activation',
    carrier: 963,
    beat: 7.83,
    brainwave: 'Theta (Schumann)',
    purpose: 'Divine connection and spiritual awakening',
    description: 'Divine Consciousness (963 Hz) synced with Earth\'s resonance (7.83 Hz) for crown chakra opening and cosmic alignment. Experience oneness with all that is.',
    benefits: ['Spiritual awakening', 'Divine connection', 'Cosmic consciousness', 'Enlightenment experiences', 'Kundalini support', 'Unity awareness'],
    duration: '30-45 min',
    icon: Crown,
    intensity: 'deep',
    category: 'spiritual',
    scienceLevel: 2,
    optimalTime: 'Early morning (4-6am) or during meditation',
    prerequisites: ['Regular meditation practice', 'Grounded energy'],
    synergisticPractices: ['Crown chakra visualization', 'Kundalini practices', 'Silent meditation', 'Fasting'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Crown tingling, expansion feeling' },
      { timeframe: 'During session', effect: 'Transcendent experiences possible' },
      { timeframe: 'Long-term', effect: 'Sustained spiritual connection' },
    ],
  },
  {
    id: 'third-eye-opening',
    name: 'Third Eye Awakening',
    carrier: 852,
    beat: 6.3,
    brainwave: 'Theta (Pineal)',
    purpose: 'Activate pineal gland and intuition',
    description: 'Third Eye frequency (852 Hz) at the pineal-stimulating Theta (6.3 Hz) activates dormant intuitive abilities and enhances psychic perception.',
    benefits: ['Pineal gland activation', 'Intuition enhancement', 'Psychic abilities', 'Vivid dreams', 'Inner vision', 'Pattern recognition'],
    duration: '20-40 min',
    icon: Eye,
    intensity: 'moderate',
    category: 'spiritual',
    scienceLevel: 3,
    optimalTime: 'Night (in darkness)',
    synergisticPractices: ['Third eye focus', 'Darkness meditation', 'Dream journaling', 'Intuition exercises'],
    expectedEffects: [
      { timeframe: 'Immediate', effect: 'Third eye pressure/tingling' },
      { timeframe: '1-2 weeks', effect: 'Enhanced intuition, vivid dreams' },
      { timeframe: '30 days', effect: 'Awakened inner vision' },
    ],
  },
  {
    id: 'kundalini-prep',
    name: 'Kundalini Energy Preparation',
    carrier: 528,
    beat: 3.5,
    beatEnd: 7.83,
    brainwave: 'Delta → Theta',
    purpose: 'Prepare energy body for kundalini activation',
    description: 'Transformation frequency with ascending beat from Delta to Schumann resonance mimics the rising energy of kundalini. Clears energy channels and prepares the spine.',
    benefits: ['Energy channel clearing', 'Chakra alignment', 'Kundalini preparation', 'Spinal energy flow', 'Body-spirit integration'],
    duration: '45-60 min',
    icon: Flame,
    intensity: 'deep',
    category: 'spiritual',
    scienceLevel: 2,
    optimalTime: 'Early morning (before sunrise)',
    prerequisites: ['Regular meditation practice', 'Yoga/body work experience'],
    contraindications: ['Mental health conditions without guidance', 'Ungrounded individuals'],
    synergisticPractices: ['Kundalini yoga', 'Breath of fire', 'Root lock (mula bandha)', 'Spinal breathing'],
    expectedEffects: [
      { timeframe: 'During session', effect: 'Energy sensations in spine' },
      { timeframe: '1-2 weeks', effect: 'Increased vitality, sensitivity' },
      { timeframe: 'Long-term', effect: 'Spiritual awakening support' },
    ],
  },

  // === SLEEP PROTOCOLS ===
  {
    id: 'sleep-induction',
    name: 'Rapid Sleep Induction',
    carrier: 432,
    beat: 3,
    beatEnd: 1.5,
    brainwave: 'Theta → Delta',
    purpose: 'Fall asleep quickly and naturally',
    description: 'Calming Universal frequency (432 Hz) with descending beat from Theta to deep Delta guides the brain gently into restorative sleep within 20 minutes for most users.',
    benefits: ['Quick sleep onset (10-20 min)', 'Natural relaxation', 'Calm mind', 'Sleep preparation', 'Insomnia relief', 'Racing thoughts cessation'],
    duration: '20-30 min (auto-stop recommended)',
    icon: Moon,
    intensity: 'gentle',
    category: 'sleep',
    scienceLevel: 5,
    optimalTime: 'Bedtime',
    synergisticPractices: ['Sleep hygiene', 'Cool room', 'Dark environment', 'No screens 1hr before'],
    expectedEffects: [
      { timeframe: '5 min', effect: 'Relaxation begins, thoughts slow' },
      { timeframe: '15-20 min', effect: 'Sleep onset' },
      { timeframe: 'Regular use', effect: 'Improved sleep quality' },
    ],
  },
  {
    id: 'deep-sleep-maintenance',
    name: 'Deep Sleep All Night',
    carrier: 432,
    beat: 2,
    brainwave: 'Delta',
    purpose: 'Maintain deep restorative sleep all night',
    description: 'Sustained Delta (2 Hz) with Universal Harmony (432 Hz) keeps you in deep restorative sleep. HGH release peaks, cellular repair maximizes, immune system recharges.',
    benefits: ['All-night deep sleep', 'Maximum HGH release', 'Complete cellular repair', 'Immune recharge', 'Physical recovery', 'Dream quality'],
    duration: 'Full night (6-8 hours, low volume)',
    icon: Bed,
    intensity: 'gentle',
    category: 'sleep',
    scienceLevel: 5,
    optimalTime: 'Throughout sleep',
    synergisticPractices: ['Consistent sleep schedule', 'Cool temperature (65-68°F)', 'Complete darkness', 'No alcohol'],
    expectedEffects: [
      { timeframe: 'First night', effect: 'Deeper sleep, fewer wake-ups' },
      { timeframe: '1 week', effect: 'Morning energy increased' },
      { timeframe: '30 days', effect: 'Transformed sleep quality' },
    ],
  },
  {
    id: 'lucid-dream',
    name: 'Lucid Dream Induction',
    carrier: 528,
    beat: 3.5,
    brainwave: 'Theta/Delta Border',
    purpose: 'Enhance dream awareness and control',
    description: 'Miracle Tone (528 Hz) at the lucid dreaming sweet spot (3.5 Hz) maintains awareness at the edge of sleep. This is the optimal frequency for conscious dreaming.',
    benefits: ['Lucid dream induction', 'Dream recall boost', 'Dream control', 'Subconscious access', 'Astral preparation', 'Night learning'],
    duration: 'Full night (very low volume)',
    icon: Star,
    intensity: 'gentle',
    category: 'sleep',
    scienceLevel: 4,
    optimalTime: 'Throughout sleep (especially after 4-5 hours)',
    synergisticPractices: ['Reality checks', 'Dream journaling', 'WBTB technique', 'MILD affirmations'],
    expectedEffects: [
      { timeframe: 'First week', effect: 'Enhanced dream recall' },
      { timeframe: '2-3 weeks', effect: 'Lucid dream experiences' },
      { timeframe: 'Ongoing', effect: 'Regular lucid dreaming' },
    ],
  },
  {
    id: 'power-nap',
    name: 'Perfect Power Nap',
    carrier: 432,
    beat: 6,
    beatEnd: 10,
    brainwave: 'Theta → Alpha',
    purpose: 'Optimal 20-minute power nap',
    description: 'Descend into Theta for restoration, then ascend to Alpha for gentle awakening. Perfectly timed for the ideal 20-minute power nap that leaves you refreshed, not groggy.',
    benefits: ['Optimal 20-min nap', 'No sleep inertia', 'Energy restoration', 'Cognitive refresh', 'Alertness boost', 'Stress reduction'],
    duration: '20 min (includes wake-up)',
    icon: Battery,
    intensity: 'gentle',
    category: 'sleep',
    scienceLevel: 5,
    optimalTime: 'Early afternoon (1-3pm)',
    synergisticPractices: ['Coffee before nap (caffeine nap)', 'Eye mask', 'Quiet space', 'Alarm backup'],
    expectedEffects: [
      { timeframe: '0-10 min', effect: 'Relaxation and light rest' },
      { timeframe: '10-18 min', effect: 'Restorative Theta' },
      { timeframe: '18-20 min', effect: 'Gentle awakening to Alpha' },
    ],
  },
];

// ============================================================================
// COMPONENT: Animated Wave Background
// ============================================================================

const AnimatedWaveBackground = ({ color, speed = 1 }: { color: string; speed?: number }) => (
  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-30`}
        style={{
          clipPath: `polygon(0 ${70 + i * 10}%, 25% ${60 + i * 10}%, 50% ${70 + i * 10}%, 75% ${60 + i * 10}%, 100% ${70 + i * 10}%, 100% 100%, 0 100%)`,
        }}
        animate={{
          clipPath: [
            `polygon(0 ${70 + i * 10}%, 25% ${60 + i * 10}%, 50% ${70 + i * 10}%, 75% ${60 + i * 10}%, 100% ${70 + i * 10}%, 100% 100%, 0 100%)`,
            `polygon(0 ${60 + i * 10}%, 25% ${70 + i * 10}%, 50% ${60 + i * 10}%, 75% ${70 + i * 10}%, 100% ${60 + i * 10}%, 100% 100%, 0 100%)`,
            `polygon(0 ${70 + i * 10}%, 25% ${60 + i * 10}%, 50% ${70 + i * 10}%, 75% ${60 + i * 10}%, 100% ${70 + i * 10}%, 100% 100%, 0 100%)`,
          ],
        }}
        transition={{
          duration: 4 / speed + i,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// ============================================================================
// COMPONENT: Brainwave Spectrum Visualizer
// ============================================================================

const BrainwaveSpectrum = ({ 
  selectedState, 
  onSelect 
}: { 
  selectedState: string | null; 
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="relative">
      {/* Spectrum Bar */}
      <div className="relative h-16 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-cyan-500 via-50% via-amber-500 to-rose-500 p-[2px]">
        <div className="absolute inset-[2px] rounded-2xl bg-card/90 backdrop-blur-sm" />
        <div className="relative h-full flex">
          {brainwaveStates.map((state, i) => (
            <motion.button
              key={state.id}
              onClick={() => onSelect(state.id)}
              className={`relative flex-1 h-full transition-all duration-300 group ${
                selectedState === state.id ? 'z-10' : 'z-0'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {selectedState === state.id && (
                <motion.div
                  layoutId="brainwave-indicator"
                  className={`absolute inset-0 bg-gradient-to-br ${state.gradientClass} opacity-90`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-2">
                <state.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 transition-colors ${
                  selectedState === state.id ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                }`} />
                <span className={`text-[9px] sm:text-xs font-semibold transition-colors ${
                  selectedState === state.id ? 'text-white' : 'text-foreground'
                }`}>
                  {state.name}
                </span>
                <span className={`text-[8px] sm:text-[10px] transition-colors ${
                  selectedState === state.id ? 'text-white/80' : 'text-muted-foreground'
                }`}>
                  {state.range}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Frequency scale */}
      <div className="flex justify-between mt-2 px-2 text-[10px] text-muted-foreground">
        <span>0.5 Hz</span>
        <span>4 Hz</span>
        <span>8 Hz</span>
        <span>12 Hz</span>
        <span>30 Hz</span>
        <span>100+ Hz</span>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: Brainwave Detail Card (Enhanced)
// ============================================================================

const BrainwaveDetailCard = ({ state }: { state: BrainwaveState }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <AnimatedWaveBackground color={state.gradientClass} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${state.gradientClass} shadow-lg`}>
              <state.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-foreground">{state.name} Waves</h4>
              <p className="text-sm sm:text-base text-primary font-medium">{state.range}</p>
              <p className="text-xs text-muted-foreground">{state.scientificName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Mental State</div>
            <div className="text-sm font-medium text-foreground">{state.mentalState}</div>
            <div className="text-[10px] text-primary mt-1">{state.optimalTime}</div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          {state.description}
        </p>
        
        {/* Neurotransmitters */}
        <div className="mb-6">
          <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
            <Atom className="w-3.5 h-3.5 text-primary" />
            Associated Neurochemicals
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {state.neurotransmitters.map((nt) => (
              <span key={nt} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary">
                {nt}
              </span>
            ))}
          </div>
        </div>
        
        {/* Dominant During */}
        <div className="mb-6">
          <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-accent" />
            Dominant During
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {state.dominantDuring.map((d) => (
              <span key={d} className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                {d}
              </span>
            ))}
          </div>
        </div>
        
        {/* Benefits & Best For */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Benefits
            </h5>
            <div className="space-y-2">
              {state.benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${state.gradientClass}`} />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Best For
            </h5>
            <div className="flex flex-wrap gap-2">
              {state.bestFor.map((use, i) => (
                <motion.span
                  key={use}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {use}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Try Button */}
        <Button
          onClick={() => navigate('/custom-tuner')}
          className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white gap-2"
        >
          <Play className="w-4 h-4" />
          Try {state.name} Session
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: Carrier Frequency Card
// ============================================================================

const CarrierFrequencyCard = ({ freq, index }: { freq: CarrierFrequency; index: number }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div 
        className={`relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 transition-all duration-300 cursor-pointer ${
          isExpanded ? 'ring-2 ring-primary/20' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${freq.color}`} />
        
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${freq.color} shadow-soft`}>
                <freq.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{freq.hz} Hz</div>
                <div className="text-xs text-primary font-medium">{freq.name}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {freq.tradition}
              </span>
              {freq.chakra && (
                <span className="text-[9px] text-muted-foreground">{freq.chakra}</span>
              )}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {freq.description}
          </p>
          
          {/* Benefits preview */}
          <div className="flex flex-wrap gap-1.5">
            {freq.benefits.slice(0, isExpanded ? undefined : 2).map((b) => (
              <span key={b} className="text-[10px] px-2 py-1 rounded-full bg-secondary/70 text-secondary-foreground">
                {b}
              </span>
            ))}
            {!isExpanded && freq.benefits.length > 2 && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary">
                +{freq.benefits.length - 2} more
              </span>
            )}
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/custom-tuner');
                    }}
                    size="sm"
                    className="w-full bg-gradient-primary hover:opacity-90 text-white gap-2"
                  >
                    <Play className="w-3 h-3" />
                    Try {freq.hz} Hz
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: Science Level Indicator
// ============================================================================

const ScienceLevel = ({ level }: { level: number }) => {
  const labels = ['Anecdotal', 'Emerging', 'Promising', 'Strong', 'Clinical'];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-full transition-colors ${
              i <= level ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-[9px] text-muted-foreground">{labels[level - 1]}</span>
    </div>
  );
};

// ============================================================================
// COMPONENT: Special Resonance Card
// ============================================================================

const SpecialResonanceCard = ({ resonance, index }: { resonance: SpecialResonance; index: number }) => {
  const typeColors = {
    earth: 'from-emerald-500 to-green-600',
    cosmic: 'from-violet-500 to-purple-600',
    biological: 'from-pink-500 to-rose-500',
    sacred: 'from-amber-500 to-orange-500',
  };
  
  const typeLabels = {
    earth: 'Earth Frequency',
    cosmic: 'Cosmic Harmony',
    biological: 'Biological',
    sacred: 'Sacred Geometry',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
    >
      <div className={`h-1 bg-gradient-to-r ${typeColors[resonance.type]}`} />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${typeColors[resonance.type]} shadow-soft`}>
              <resonance.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{resonance.hz} Hz</div>
              <div className="text-xs text-primary font-medium">{resonance.name}</div>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
            {typeLabels[resonance.type]}
          </span>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
          {resonance.description}
        </p>
        
        {resonance.discoverer && (
          <p className="text-[10px] text-primary/80 mb-3 italic">
            Discovered by: {resonance.discoverer}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="text-[10px] font-medium text-foreground">Effects:</div>
          <div className="flex flex-wrap gap-1">
            {resonance.effects.slice(0, 3).map((effect) => (
              <span key={effect} className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/70 text-secondary-foreground">
                {effect}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: Combination Recipe Card (Enhanced)
// ============================================================================

const CombinationCard = ({ combo, index, expanded = false }: { combo: FrequencyCombination; index: number; expanded?: boolean }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const categoryColors: Record<string, string> = {
    manifestation: 'from-violet-500 to-purple-600',
    healing: 'from-emerald-500 to-teal-500',
    performance: 'from-amber-500 to-orange-500',
    spiritual: 'from-indigo-500 to-violet-500',
    sleep: 'from-blue-600 to-indigo-600',
    focus: 'from-cyan-500 to-blue-500',
    emotional: 'from-pink-500 to-rose-500',
    physical: 'from-green-500 to-emerald-500',
    cognitive: 'from-yellow-500 to-amber-500',
  };
  
  const intensityColors: Record<string, string> = {
    gentle: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    moderate: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    deep: 'bg-violet-500/20 text-violet-600 dark:text-violet-400',
    intense: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-elevated transition-all duration-500"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[combo.category] || 'from-primary to-accent'} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="relative p-5 sm:p-6">
        {/* Category, Intensity & Science Level */}
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryColors[combo.category] || 'from-primary to-accent'} text-white font-medium capitalize`}>
              {combo.category}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${intensityColors[combo.intensity]} font-medium capitalize`}>
              {combo.intensity}
            </span>
          </div>
          <ScienceLevel level={combo.scienceLevel} />
        </div>
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[combo.category] || 'from-primary to-accent'} shadow-lg flex-shrink-0`}>
            <combo.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1">{combo.name}</h4>
            <p className="text-xs sm:text-sm text-primary">{combo.purpose}</p>
          </div>
        </div>
        
        {/* Frequency Recipe - Enhanced with ramping indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border mb-4">
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Carrier</div>
            <div className="text-lg sm:text-xl font-bold text-foreground">{combo.carrier}</div>
            <div className="text-[9px] text-muted-foreground">Hz</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-[10px] text-muted-foreground mb-1">Beat</div>
            <div className="text-lg sm:text-xl font-bold text-primary">
              {combo.beat}
              {combo.beatEnd && <span className="text-xs text-muted-foreground">→{combo.beatEnd}</span>}
            </div>
            <div className="text-[9px] text-muted-foreground">Hz</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Target</div>
            <div className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{combo.brainwave}</div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          {combo.description}
        </p>
        
        {/* Benefits */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {combo.benefits.slice(0, isExpanded ? undefined : 4).map((b) => (
            <span key={b} className="text-[9px] sm:text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {b}
            </span>
          ))}
          {!isExpanded && combo.benefits.length > 4 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[9px] sm:text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              +{combo.benefits.length - 4} more
            </button>
          )}
        </div>
        
        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Expected Effects Timeline */}
                <div>
                  <div className="text-[10px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-primary" />
                    Expected Effects
                  </div>
                  <div className="space-y-1.5">
                    {combo.expectedEffects.map((effect, i) => (
                      <div key={i} className="flex gap-2 text-[10px]">
                        <span className="font-medium text-primary w-20 flex-shrink-0">{effect.timeframe}:</span>
                        <span className="text-muted-foreground">{effect.effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Synergistic Practices */}
                <div>
                  <div className="text-[10px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-accent" />
                    Synergistic Practices
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {combo.synergisticPractices.map((practice) => (
                      <span key={practice} className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground">
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Optimal Time */}
                <div className="flex items-center gap-2 text-[10px]">
                  <Timer className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Best time: <span className="text-foreground font-medium">{combo.optimalTime}</span></span>
                </div>
                
                {/* Prerequisites & Contraindications */}
                {(combo.prerequisites || combo.contraindications) && (
                  <div className="grid grid-cols-2 gap-3">
                    {combo.prerequisites && (
                      <div>
                        <div className="text-[9px] font-semibold text-foreground mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Prerequisites
                        </div>
                        <div className="space-y-0.5">
                          {combo.prerequisites.map((p) => (
                            <div key={p} className="text-[9px] text-muted-foreground">• {p}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {combo.contraindications && (
                      <div>
                        <div className="text-[9px] font-semibold text-foreground mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          Cautions
                        </div>
                        <div className="space-y-0.5">
                          {combo.contraindications.map((c) => (
                            <div key={c} className="text-[9px] text-muted-foreground">• {c}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-[10px] text-primary hover:underline"
                >
                  Show less
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Radio className="w-3 h-3" />
              <span>{combo.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="h-8 text-[10px] text-muted-foreground hover:text-foreground"
              >
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
            )}
            <Button
              onClick={() => navigate('/custom-tuner')}
              size="sm"
              className="bg-gradient-primary hover:opacity-90 text-white gap-1.5 h-8"
            >
              <Play className="w-3 h-3" />
              Try Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FrequencyReferenceChart() {
  const [selectedBrainwave, setSelectedBrainwave] = useState<string>('alpha');
  const [activeTab, setActiveTab] = useState('combinations');
  
  const selectedState = brainwaveStates.find(s => s.id === selectedBrainwave);
  
  const manifestationCombos = frequencyCombinations.filter(c => c.category === 'manifestation');
  const healingCombos = frequencyCombinations.filter(c => c.category === 'healing' || c.category === 'physical');
  const emotionalCombos = frequencyCombinations.filter(c => c.category === 'emotional');
  const performanceCombos = frequencyCombinations.filter(c => c.category === 'performance' || c.category === 'focus' || c.category === 'cognitive');
  const spiritualCombos = frequencyCombinations.filter(c => c.category === 'spiritual');
  const sleepCombos = frequencyCombinations.filter(c => c.category === 'sleep');

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Atom className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Precision Frequency Science</span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Frequency Intelligence System
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
          {frequencyCombinations.length} scientifically-grounded protocols combining carrier frequencies, 
          brainwave targets, and synergistic practices for life-changing transformation.
        </p>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{frequencyCombinations.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Protocols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-accent">{specialResonances.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Special Resonances</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{carrierFrequencies.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Carrier Frequencies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{brainwaveStates.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Brainwave States</div>
          </div>
        </div>
      </motion.div>

      {/* ================================================================== */}
      {/* BRAINWAVE EXPLORER */}
      {/* ================================================================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground">Brainwave States</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">Click to explore each state in detail</p>
          </div>
        </div>
        
        <BrainwaveSpectrum 
          selectedState={selectedBrainwave} 
          onSelect={setSelectedBrainwave} 
        />
        
        <AnimatePresence mode="wait">
          {selectedState && (
            <BrainwaveDetailCard key={selectedState.id} state={selectedState} />
          )}
        </AnimatePresence>
      </div>

      {/* ================================================================== */}
      {/* TABBED SECTIONS */}
      {/* ================================================================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-secondary/50">
          <TabsTrigger value="combinations" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">All</span>
          </TabsTrigger>
          <TabsTrigger value="manifestation" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Manifest</span>
          </TabsTrigger>
          <TabsTrigger value="resonances" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Special</span>
          </TabsTrigger>
          <TabsTrigger value="carrier" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Carriers</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="science" className="gap-1.5 py-2.5 data-[state=active]:bg-card">
            <Fingerprint className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Science</span>
          </TabsTrigger>
        </TabsList>

        {/* ============ ALL COMBINATIONS TAB ============ */}
        <TabsContent value="combinations" className="mt-8 space-y-10">
          {/* Healing & Physical */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-500" />
                <h5 className="text-lg font-semibold text-foreground">Healing & Physical</h5>
              </div>
              <span className="text-[10px] text-muted-foreground">{healingCombos.length} protocols</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {healingCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Emotional */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h5 className="text-lg font-semibold text-foreground">Emotional Wellness</h5>
              </div>
              <span className="text-[10px] text-muted-foreground">{emotionalCombos.length} protocols</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emotionalCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Performance & Cognitive */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h5 className="text-lg font-semibold text-foreground">Focus, Performance & Cognitive</h5>
              </div>
              <span className="text-[10px] text-muted-foreground">{performanceCombos.length} protocols</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Sleep */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h5 className="text-lg font-semibold text-foreground">Sleep & Dreams</h5>
              </div>
              <span className="text-[10px] text-muted-foreground">{sleepCombos.length} protocols</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sleepCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Spiritual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-500" />
                <h5 className="text-lg font-semibold text-foreground">Spiritual & Meditation</h5>
              </div>
              <span className="text-[10px] text-muted-foreground">{spiritualCombos.length} protocols</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {spiritualCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============ MANIFESTATION TAB ============ */}
        <TabsContent value="manifestation" className="mt-8">
          <div className="space-y-6">
            {/* Manifestation Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 p-6 sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground">Manifestation Protocols</h4>
                    <p className="text-sm text-muted-foreground">Frequency combinations designed for reality creation</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-4">
                  These specific carrier and beat frequency combinations are designed to access subconscious programming states, 
                  align with universal energy, and amplify your manifestation intentions. Each protocol includes expected timelines and synergistic practices.
                </p>
                
                {/* Key Principle */}
                <div className="p-4 rounded-xl bg-card/80 backdrop-blur border border-border">
                  <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    The Manifestation Formula
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <div className="text-center p-3 rounded-lg bg-secondary/50">
                      <div className="text-lg font-bold text-primary mb-1">528 Hz</div>
                      <div>Miracle/Love Carrier</div>
                      <div className="text-[10px] mt-1">DNA activation, transformation</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50">
                      <div className="text-lg font-bold text-accent mb-1">+</div>
                      <div>Combined with</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50">
                      <div className="text-lg font-bold text-primary mb-1">4-8 Hz</div>
                      <div>Theta Brainwave</div>
                      <div className="text-[10px] mt-1">Subconscious access</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
            
            {/* Manifestation Combos Grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {manifestationCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
            
            {/* Manifestation Tips */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Manifestation Best Practices
              </h5>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Set clear, specific intentions before starting</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Visualize as if already achieved (past tense)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Engage all senses in visualization</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Feel the emotions of achievement</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Practice at the same time daily for 21+ days</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Morning or before sleep are optimal times</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Release attachment to outcomes</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Take aligned action in waking life</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============ SPECIAL RESONANCES TAB ============ */}
        <TabsContent value="resonances" className="mt-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-violet-500/10 p-6 sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground">Special Resonance Frequencies</h4>
                    <p className="text-sm text-muted-foreground">Earth, cosmic, biological & sacred frequencies</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  These are specific frequencies discovered through research, ancient traditions, and natural observation. 
                  Each carries unique properties that can be incorporated into your binaural beat sessions.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
            </div>
            
            {/* Resonances Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialResonances.map((resonance, i) => (
                <SpecialResonanceCard key={resonance.hz} resonance={resonance} index={i} />
              ))}
            </div>
            
            {/* Key Insight */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                How to Use Special Resonances
              </h5>
              <p className="text-sm text-muted-foreground mb-4">
                These frequencies can be used as your carrier frequency in the Custom Tuner. For example:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="font-medium text-foreground mb-1">Schumann Grounding</div>
                  <div className="text-xs text-muted-foreground">
                    Set beat frequency to 7.83 Hz to sync with Earth's resonance during meditation
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="font-medium text-foreground mb-1">40 Hz Gamma Boost</div>
                  <div className="text-xs text-muted-foreground">
                    Use 40 Hz beat frequency for cognitive enhancement (MIT research-backed)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============ CARRIER FREQUENCIES TAB ============ */}
        <TabsContent value="carrier" className="mt-8">
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              Carrier frequencies form the base tone of your binaural beat. Each frequency carries unique 
              energetic properties from ancient Solfeggio traditions and natural cosmic harmonics.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {carrierFrequencies.map((freq, i) => (
                <CarrierFrequencyCard key={freq.hz} freq={freq} index={i} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============ QUICK GUIDE TAB ============ */}
        <TabsContent value="guide" className="mt-8">
          <div className="space-y-6">
            {/* Purpose-based quick reference */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-5 border-b border-border">
                <h5 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Quick Reference: What Do You Need?
                </h5>
              </div>
              <div className="divide-y divide-border">
                {[
                  { purpose: 'Deep Sleep', icon: Bed, beat: '0.5–2 Hz', carrier: '432 Hz', recommendation: 'Delta waves with calming 432 Hz base' },
                  { purpose: 'Meditation', icon: Compass, beat: '4–7 Hz', carrier: '432/528 Hz', recommendation: 'Theta access with harmonic carriers' },
                  { purpose: 'Focus & Work', icon: Coffee, beat: '12–20 Hz', carrier: '432 Hz', recommendation: 'Beta concentration without stress' },
                  { purpose: 'Creative Flow', icon: Palette, beat: '7–10 Hz', carrier: '432 Hz', recommendation: 'Theta-Alpha bridge for inspiration' },
                  { purpose: 'Energy Boost', icon: Battery, beat: '18–25 Hz', carrier: '528 Hz', recommendation: 'High Beta with transformation tone' },
                  { purpose: 'Stress Relief', icon: Heart, beat: '8–10 Hz', carrier: '432 Hz', recommendation: 'Alpha relaxation with natural harmony' },
                  { purpose: 'Manifestation', icon: Sparkles, beat: '4–8 Hz', carrier: '528 Hz', recommendation: 'Theta programming with Miracle Tone' },
                  { purpose: 'Peak Performance', icon: Zap, beat: '40 Hz', carrier: '528 Hz', recommendation: 'Gamma cognition with DNA repair tone' },
                  { purpose: 'Pain Relief', icon: Shield, beat: '1–2 Hz', carrier: '174 Hz', recommendation: 'Deep Delta with anesthetic frequency' },
                  { purpose: 'Emotional Healing', icon: Flame, beat: '5–6 Hz', carrier: '396 Hz', recommendation: 'Theta with liberation frequency' },
                  { purpose: 'Morning Awakening', icon: Sunrise, beat: '10–14 Hz', carrier: '432 Hz', recommendation: 'Alpha-Beta transition for alertness' },
                  { purpose: 'Study & Learning', icon: BookOpen, beat: '10–12 Hz', carrier: '432/528 Hz', recommendation: 'Alpha peak for memory encoding' },
                ].map((row, i) => (
                  <motion.div
                    key={row.purpose}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <row.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{row.purpose}</div>
                      <div className="text-xs text-muted-foreground">{row.recommendation}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-primary">{row.beat}</div>
                      <div className="text-[10px] text-muted-foreground">{row.carrier}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Key insights */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  The Formula
                </h5>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Carrier Frequency</strong> = The base tone (what you consciously hear)</p>
                  <p><strong className="text-foreground">Beat Frequency</strong> = The entrainment target (the brainwave you want)</p>
                  <p><strong className="text-foreground">Result</strong> = Left ear hears carrier, right ear hears carrier + beat</p>
                </div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  Pro Tips
                </h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 432 Hz is calming, 528 Hz is energizing/transformative</p>
                  <p>• Lower beats (0.5-4 Hz) need longer sessions (45+ min)</p>
                  <p>• Gamma (40 Hz) works in short bursts (15-30 min)</p>
                  <p>• Schumann (7.83 Hz) syncs with Earth's rhythm</p>
                  <p>• Consistency matters more than session length</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============ SCIENCE TAB ============ */}
        <TabsContent value="science" className="mt-8">
          <div className="space-y-6">
            {/* Science Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 p-6 sm:p-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground">The Science Behind It</h4>
                    <p className="text-sm text-muted-foreground">Evidence-based frequency entrainment</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  Our protocols are grounded in neuroscience research, from peer-reviewed studies to clinical trials. 
                  Each protocol includes a science level indicator showing the strength of research backing.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
            </div>
            
            {/* Science Levels Explained */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                Science Level Ratings
              </h5>
              <div className="grid sm:grid-cols-5 gap-4">
                {[
                  { level: 1, name: 'Anecdotal', desc: 'Based on user reports and traditional use' },
                  { level: 2, name: 'Emerging', desc: 'Early research shows promise' },
                  { level: 3, name: 'Promising', desc: 'Multiple studies with positive results' },
                  { level: 4, name: 'Strong', desc: 'Well-replicated findings' },
                  { level: 5, name: 'Clinical', desc: 'Clinical trials and meta-analyses' },
                ].map((item) => (
                  <div key={item.level} className="text-center p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex justify-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded-full ${i <= item.level ? 'bg-primary' : 'bg-muted'}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-foreground">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Key Research Areas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <h6 className="font-semibold text-foreground">Brainwave Entrainment</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  The brain naturally synchronizes to external rhythmic stimuli. This is called the "frequency following response" (FFR).
                </p>
                <div className="text-[10px] text-primary">Hundreds of peer-reviewed studies</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h6 className="font-semibold text-foreground">40 Hz Gamma Research</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  MIT research shows 40 Hz stimulation activates microglia and reduces amyloid plaques associated with Alzheimer's.
                </p>
                <div className="text-[10px] text-primary">Li-Huei Tsai, MIT 2016-present</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <h6 className="font-semibold text-foreground">Delta & Sleep Quality</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Studies show delta-range binaural beats can increase slow-wave sleep duration and improve sleep quality metrics.
                </p>
                <div className="text-[10px] text-primary">Multiple clinical sleep studies</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h6 className="font-semibold text-foreground">Anxiety Reduction</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Alpha-range binaural beats (8-12 Hz) consistently show anxiety reduction in pre-operative and general anxiety studies.
                </p>
                <div className="text-[10px] text-primary">Systematic reviews available</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Focus className="w-5 h-5 text-cyan-500" />
                  <h6 className="font-semibold text-foreground">Focus & Attention</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Beta-range entrainment (14-30 Hz) shows improvements in sustained attention and cognitive task performance.
                </p>
                <div className="text-[10px] text-primary">Cognitive enhancement research</div>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  <h6 className="font-semibold text-foreground">Schumann Resonance</h6>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Earth's 7.83 Hz resonance has been linked to circadian rhythm regulation and general well-being in isolation studies.
                </p>
                <div className="text-[10px] text-primary">NASA & space research applications</div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="rounded-xl border border-border bg-muted/50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> While binaural beats show promising results in research, 
                  they are not a replacement for medical treatment. Consult a healthcare professional for any medical concerns. 
                  Individual results may vary based on headphone quality, session duration, and personal neurophysiology.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
