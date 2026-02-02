import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Sparkles, Moon, Zap, Music, Waves, Activity, Target, Eye, 
  Shield, Flame, ChevronRight, Play, Info, Layers, Radio, Star, Compass,
  Sunrise, Battery, BookOpen, Lightbulb, Coffee, Bed, Palette, Focus,
  Crown, Diamond, Infinity, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

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
}

interface FrequencyCombination {
  id: string;
  name: string;
  carrier: number;
  beat: number;
  brainwave: string;
  purpose: string;
  description: string;
  benefits: string[];
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  intensity: 'gentle' | 'moderate' | 'deep';
  category: 'manifestation' | 'healing' | 'performance' | 'spiritual' | 'sleep' | 'focus';
}

// ============================================================================
// DATA: BRAINWAVE STATES
// ============================================================================

const brainwaveStates: BrainwaveState[] = [
  {
    id: 'delta',
    name: 'Delta',
    range: '0.5 – 4 Hz',
    rangeMin: 0.5,
    rangeMax: 4,
    description: 'The slowest brainwaves, dominant during deep dreamless sleep. Essential for healing, regeneration, and immune system function.',
    mentalState: 'Unconscious, Deep Sleep',
    benefits: ['Deep restorative sleep', 'Physical healing & repair', 'Growth hormone release', 'Immune system boost', 'Cellular regeneration'],
    bestFor: ['Insomnia relief', 'Physical recovery', 'Chronic pain', 'Deep rest'],
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
    description: 'Present during light sleep, deep meditation, and hypnagogic states. The gateway to the subconscious mind and creativity.',
    mentalState: 'Deeply Relaxed, Dreaming',
    benefits: ['Deep meditation', 'Enhanced creativity', 'Subconscious access', 'Memory consolidation', 'Intuition enhancement', 'Emotional healing'],
    bestFor: ['Meditation', 'Creative work', 'Visualization', 'Past trauma healing'],
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
    description: 'The bridge between conscious and subconscious. Present during relaxed alertness, light meditation, and creative flow states.',
    mentalState: 'Relaxed Alertness, Flow',
    benefits: ['Calm focus', 'Stress reduction', 'Learning enhancement', 'Mind-body integration', 'Creative problem solving', 'Relaxation'],
    bestFor: ['Study sessions', 'Creative work', 'Stress relief', 'Light meditation'],
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
    description: 'Dominant during waking consciousness, active thinking, and concentration. Higher beta associated with anxiety if sustained.',
    mentalState: 'Active, Alert, Focused',
    benefits: ['Active concentration', 'Logical thinking', 'Problem solving', 'Alert cognition', 'Task performance', 'Quick thinking'],
    bestFor: ['Work tasks', 'Analysis', 'Learning new skills', 'Active problem-solving'],
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
    description: 'The fastest brainwaves, associated with peak cognitive function, transcendental states, and information binding across brain regions.',
    mentalState: 'Peak Performance, Insight',
    benefits: ['Peak cognition', 'Information processing', 'Memory formation', 'Transcendent states', 'Binding of senses', 'Higher consciousness'],
    bestFor: ['Peak performance', 'Memory enhancement', 'Spiritual practice', 'Complex problem-solving'],
    icon: Sparkles,
    color: 'hsl(var(--primary))',
    gradientClass: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
];

// ============================================================================
// DATA: CARRIER/MANIFESTATION FREQUENCIES
// ============================================================================

const carrierFrequencies: CarrierFrequency[] = [
  {
    hz: 174,
    name: 'Foundation Tone',
    tradition: 'Solfeggio',
    description: 'The lowest Solfeggio frequency. Creates a foundation of security and serves as a natural anesthetic.',
    benefits: ['Pain reduction', 'Sense of security', 'Physical grounding', 'Organ healing'],
    chakra: 'Root (grounding)',
    icon: Shield,
    color: 'from-stone-500 to-stone-700',
  },
  {
    hz: 285,
    name: 'Quantum Cognition',
    tradition: 'Solfeggio',
    description: 'Influences the energy field, helping with tissue regeneration and restructuring damaged organs.',
    benefits: ['Tissue regeneration', 'Energy restructuring', 'Wound healing', 'Cellular repair'],
    chakra: 'Sacral',
    icon: Activity,
    color: 'from-red-500 to-rose-600',
  },
  {
    hz: 396,
    name: 'Liberation',
    tradition: 'Solfeggio',
    description: 'Liberates from guilt and fear. Turns grief into joy. Cleanses the feeling of guilt and enables achievement of goals.',
    benefits: ['Fear release', 'Guilt liberation', 'Goal achievement', 'Emotional grounding'],
    chakra: 'Root',
    icon: Flame,
    color: 'from-red-600 to-orange-500',
  },
  {
    hz: 417,
    name: 'Facilitating Change',
    tradition: 'Solfeggio',
    description: 'Undoes situations and facilitates change. Cleanses traumatic experiences and clears destructive influences.',
    benefits: ['Trauma clearing', 'Change facilitation', 'Negative energy removal', 'Fresh start energy'],
    chakra: 'Sacral',
    icon: Waves,
    color: 'from-orange-500 to-amber-500',
  },
  {
    hz: 432,
    name: 'Universal Harmony',
    tradition: 'Natural/Cosmic',
    description: 'Mathematically aligned with nature and the cosmos. Creates a sense of peace and well-being by resonating with Earth\'s heartbeat.',
    benefits: ['Natural harmony', 'Heart coherence', 'Calm listening', 'Universal alignment', 'Reduced anxiety'],
    chakra: 'Heart',
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    hz: 528,
    name: 'Miracle / Love',
    tradition: 'Solfeggio',
    description: 'The "Miracle Tone" used by biochemists to repair DNA. Associated with transformation, miracles, and signs.',
    benefits: ['DNA repair', 'Transformation', 'Increased energy', 'Clarity of mind', 'Manifestation power'],
    chakra: 'Heart/Solar Plexus',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
  },
  {
    hz: 639,
    name: 'Connecting / Relationships',
    tradition: 'Solfeggio',
    description: 'Enables connection and harmonious interpersonal relationships. Enhances communication, understanding, tolerance.',
    benefits: ['Relationship healing', 'Communication enhancement', 'Understanding', 'Tolerance', 'Love attraction'],
    chakra: 'Heart/Throat',
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    hz: 741,
    name: 'Awakening Intuition',
    tradition: 'Solfeggio',
    description: 'Cleans the cells from toxins and leads to a healthier life. Solves problems and awakens intuition.',
    benefits: ['Cellular cleansing', 'Problem solving', 'Self-expression', 'Pure intuition', 'Toxin removal'],
    chakra: 'Throat',
    icon: Lightbulb,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    hz: 852,
    name: 'Returning to Spiritual Order',
    tradition: 'Solfeggio',
    description: 'Awakens intuition and returns you to spiritual order. Opens third eye and raises awareness.',
    benefits: ['Spiritual awakening', 'Third eye activation', 'Higher awareness', 'Inner strength'],
    chakra: 'Third Eye',
    icon: Eye,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    hz: 963,
    name: 'Divine Consciousness',
    tradition: 'Solfeggio',
    description: 'Awakens any system to its original, perfect state. Enables direct experience of the light and oneness.',
    benefits: ['Pineal activation', 'Divine connection', 'Unity consciousness', 'Enlightenment', 'Pure light'],
    chakra: 'Crown',
    icon: Crown,
    color: 'from-violet-500 to-purple-600',
  },
];

// ============================================================================
// DATA: FREQUENCY COMBINATIONS (Carrier + Beat + Purpose)
// ============================================================================

const frequencyCombinations: FrequencyCombination[] = [
  // === MANIFESTATION COMBINATIONS ===
  {
    id: 'abundance-manifest',
    name: 'Abundance Manifestation',
    carrier: 528,
    beat: 7.83,
    brainwave: 'Theta (Schumann)',
    purpose: 'Manifest wealth, prosperity, and abundance',
    description: 'The Miracle Tone (528 Hz) combined with Earth\'s resonance (7.83 Hz) creates a powerful field for abundance manifestation. This combination aligns your energy with universal flow.',
    benefits: ['Attract abundance', 'Remove scarcity blocks', 'Align with prosperity', 'Open receiving channels'],
    duration: '20-40 min',
    icon: Diamond,
    intensity: 'moderate',
    category: 'manifestation',
  },
  {
    id: 'love-attraction',
    name: 'Love Attraction Field',
    carrier: 639,
    beat: 6,
    brainwave: 'Theta',
    purpose: 'Attract love and harmonious relationships',
    description: 'The Connecting frequency (639 Hz) with mid-Theta (6 Hz) opens the heart chakra and subconscious to attract and receive love.',
    benefits: ['Attract soulmate', 'Heal past relationships', 'Open heart chakra', 'Enhance self-love'],
    duration: '30-45 min',
    icon: Heart,
    intensity: 'gentle',
    category: 'manifestation',
  },
  {
    id: 'reality-shift',
    name: 'Reality Shifting Protocol',
    carrier: 432,
    beat: 4,
    brainwave: 'Deep Theta',
    purpose: 'Access parallel realities and shift timelines',
    description: 'Universal Harmony (432 Hz) at the Theta/Delta border (4 Hz) creates a liminal state optimal for reality shifting and quantum jumping.',
    benefits: ['Timeline shifting', 'Reality manifestation', 'Lucid dreaming prep', 'Parallel access'],
    duration: '45-60 min',
    icon: Infinity,
    intensity: 'deep',
    category: 'manifestation',
  },
  {
    id: 'success-programming',
    name: 'Success Programming',
    carrier: 852,
    beat: 10,
    brainwave: 'Alpha Peak',
    purpose: 'Program subconscious for success and achievement',
    description: 'Third Eye activation (852 Hz) at Alpha peak (10 Hz) creates the ideal state for subconscious reprogramming and success visualization.',
    benefits: ['Goal achievement', 'Success mindset', 'Confidence boost', 'Clarity of purpose'],
    duration: '20-30 min',
    icon: Target,
    intensity: 'moderate',
    category: 'manifestation',
  },

  // === HEALING COMBINATIONS ===
  {
    id: 'dna-repair',
    name: 'DNA Repair & Regeneration',
    carrier: 528,
    beat: 2.5,
    brainwave: 'Delta',
    purpose: 'Cellular repair and physical healing',
    description: 'The Miracle Tone known for DNA repair (528 Hz) combined with deep Delta (2.5 Hz) for maximum cellular regeneration during deep rest.',
    benefits: ['DNA repair', 'Cellular regeneration', 'Physical healing', 'Immune boost'],
    duration: '45-90 min (during sleep)',
    icon: Activity,
    intensity: 'deep',
    category: 'healing',
  },
  {
    id: 'emotional-release',
    name: 'Emotional Release & Healing',
    carrier: 396,
    beat: 5,
    brainwave: 'Theta',
    purpose: 'Release trauma and emotional blocks',
    description: 'Liberation frequency (396 Hz) at Theta (5 Hz) accesses subconscious to release stored emotions, guilt, and fear patterns.',
    benefits: ['Trauma release', 'Guilt release', 'Fear dissolution', 'Emotional freedom'],
    duration: '30-45 min',
    icon: Flame,
    intensity: 'moderate',
    category: 'healing',
  },
  {
    id: 'pain-relief',
    name: 'Natural Pain Relief',
    carrier: 174,
    beat: 1.5,
    brainwave: 'Deep Delta',
    purpose: 'Natural anesthetic and pain management',
    description: 'The Foundation Tone (174 Hz) at deep Delta (1.5 Hz) creates a natural analgesic effect for chronic pain and physical discomfort.',
    benefits: ['Pain reduction', 'Natural anesthesia', 'Physical comfort', 'Deep relaxation'],
    duration: '30-60 min',
    icon: Shield,
    intensity: 'deep',
    category: 'healing',
  },

  // === PERFORMANCE COMBINATIONS ===
  {
    id: 'peak-focus',
    name: 'Peak Focus & Flow',
    carrier: 432,
    beat: 14,
    brainwave: 'Low Beta',
    purpose: 'Maximum concentration and productivity',
    description: 'Natural harmony base (432 Hz) with focused Beta (14 Hz) for sustained concentration without stress or fatigue.',
    benefits: ['Laser focus', 'Flow state', 'Productivity boost', 'Mental clarity'],
    duration: '30-90 min',
    icon: Focus,
    intensity: 'moderate',
    category: 'focus',
  },
  {
    id: 'gamma-cognition',
    name: 'Gamma Cognitive Enhancement',
    carrier: 528,
    beat: 40,
    brainwave: 'Gamma',
    purpose: 'Peak mental performance and learning',
    description: 'Transformation frequency (528 Hz) at Gamma (40 Hz) for enhanced cognition, memory formation, and peak mental performance.',
    benefits: ['Memory enhancement', 'Learning acceleration', 'Peak cognition', 'Information binding'],
    duration: '15-30 min',
    icon: Zap,
    intensity: 'moderate',
    category: 'performance',
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius State',
    carrier: 432,
    beat: 7,
    brainwave: 'Theta',
    purpose: 'Unlock creative potential and innovation',
    description: 'Universal Harmony (432 Hz) at creative Theta (7 Hz) accesses the subconscious creative reservoir for breakthrough ideas.',
    benefits: ['Creative breakthrough', 'Innovation', 'Artistic inspiration', 'Problem solving'],
    duration: '30-45 min',
    icon: Palette,
    intensity: 'gentle',
    category: 'performance',
  },

  // === SPIRITUAL COMBINATIONS ===
  {
    id: 'deep-meditation',
    name: 'Deep Meditation Journey',
    carrier: 432,
    beat: 4.5,
    brainwave: 'Theta',
    purpose: 'Profound meditative states',
    description: 'Universal tuning (432 Hz) at deep Theta (4.5 Hz) for accessing profound meditative states and inner wisdom.',
    benefits: ['Deep meditation', 'Inner peace', 'Spiritual insight', 'Ego dissolution'],
    duration: '30-60 min',
    icon: Compass,
    intensity: 'deep',
    category: 'spiritual',
  },
  {
    id: 'crown-activation',
    name: 'Crown Chakra Activation',
    carrier: 963,
    beat: 7.83,
    brainwave: 'Theta (Schumann)',
    purpose: 'Divine connection and spiritual awakening',
    description: 'Divine Consciousness (963 Hz) synced with Earth\'s resonance (7.83 Hz) for crown chakra opening and cosmic alignment.',
    benefits: ['Spiritual awakening', 'Divine connection', 'Cosmic consciousness', 'Enlightenment'],
    duration: '30-45 min',
    icon: Crown,
    intensity: 'deep',
    category: 'spiritual',
  },

  // === SLEEP COMBINATIONS ===
  {
    id: 'sleep-induction',
    name: 'Sleep Induction',
    carrier: 432,
    beat: 2,
    brainwave: 'Delta',
    purpose: 'Fall asleep quickly and naturally',
    description: 'Calming Universal frequency (432 Hz) with deep Delta (2 Hz) guides the brain gently into restorative sleep.',
    benefits: ['Quick sleep onset', 'Natural relaxation', 'Calm mind', 'Sleep preparation'],
    duration: '20-30 min',
    icon: Moon,
    intensity: 'gentle',
    category: 'sleep',
  },
  {
    id: 'lucid-dream',
    name: 'Lucid Dream Induction',
    carrier: 528,
    beat: 3.5,
    brainwave: 'Theta/Delta Border',
    purpose: 'Enhance dream awareness and control',
    description: 'Miracle Tone (528 Hz) at the lucid dreaming sweet spot (3.5 Hz) for conscious dream access and control.',
    benefits: ['Lucid dreams', 'Dream recall', 'Dream control', 'Subconscious access'],
    duration: 'Full night (low volume)',
    icon: Star,
    intensity: 'gentle',
    category: 'sleep',
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
// COMPONENT: Brainwave Detail Card
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
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${state.gradientClass} shadow-lg`}>
              <state.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-foreground">{state.name} Waves</h4>
              <p className="text-sm sm:text-base text-primary font-medium">{state.range}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Mental State</div>
            <div className="text-sm font-medium text-foreground">{state.mentalState}</div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          {state.description}
        </p>
        
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
// COMPONENT: Combination Recipe Card
// ============================================================================

const CombinationCard = ({ combo, index }: { combo: FrequencyCombination; index: number }) => {
  const navigate = useNavigate();
  
  const categoryColors = {
    manifestation: 'from-violet-500 to-purple-600',
    healing: 'from-emerald-500 to-teal-500',
    performance: 'from-amber-500 to-orange-500',
    spiritual: 'from-indigo-500 to-violet-500',
    sleep: 'from-blue-600 to-indigo-600',
    focus: 'from-cyan-500 to-blue-500',
  };
  
  const intensityColors = {
    gentle: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    moderate: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    deep: 'bg-violet-500/20 text-violet-600 dark:text-violet-400',
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
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[combo.category]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="relative p-5 sm:p-6">
        {/* Category & Intensity badges */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryColors[combo.category]} text-white font-medium capitalize`}>
            {combo.category}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${intensityColors[combo.intensity]} font-medium capitalize`}>
            {combo.intensity}
          </span>
        </div>
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[combo.category]} shadow-lg flex-shrink-0`}>
            <combo.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1">{combo.name}</h4>
            <p className="text-xs sm:text-sm text-primary">{combo.purpose}</p>
          </div>
        </div>
        
        {/* Frequency Recipe */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border mb-4">
          <div className="text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Carrier</div>
            <div className="text-lg sm:text-xl font-bold text-foreground">{combo.carrier}</div>
            <div className="text-[9px] text-muted-foreground">Hz</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-[10px] text-muted-foreground mb-1">Beat</div>
            <div className="text-lg sm:text-xl font-bold text-primary">{combo.beat}</div>
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
          {combo.benefits.map((b) => (
            <span key={b} className="text-[9px] sm:text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {b}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Radio className="w-3 h-3" />
            <span>{combo.duration}</span>
          </div>
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
  const healingCombos = frequencyCombinations.filter(c => c.category === 'healing');
  const performanceCombos = frequencyCombinations.filter(c => c.category === 'performance' || c.category === 'focus');
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
          <Radio className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Advanced Frequency Science</span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Frequency Reference & Combinations
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
          Master the science of binaural beats with our comprehensive guide to brainwave states, 
          carrier frequencies, and proven combinations for manifestation, healing, and peak performance.
        </p>
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
            <p className="text-xs sm:text-sm text-muted-foreground">Click to explore each state</p>
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
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-secondary/50">
          <TabsTrigger value="combinations" className="gap-2 py-2.5 data-[state=active]:bg-card">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Combinations</span>
            <span className="sm:hidden">Combos</span>
          </TabsTrigger>
          <TabsTrigger value="manifestation" className="gap-2 py-2.5 data-[state=active]:bg-card">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Manifestation</span>
            <span className="sm:hidden">Manifest</span>
          </TabsTrigger>
          <TabsTrigger value="carrier" className="gap-2 py-2.5 data-[state=active]:bg-card">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Carrier Frequencies</span>
            <span className="sm:hidden">Carriers</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2 py-2.5 data-[state=active]:bg-card">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Guide</span>
            <span className="sm:hidden">Guide</span>
          </TabsTrigger>
        </TabsList>

        {/* ============ ALL COMBINATIONS TAB ============ */}
        <TabsContent value="combinations" className="mt-8 space-y-8">
          {/* Healing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-500" />
              <h5 className="text-lg font-semibold text-foreground">Healing & Recovery</h5>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {healingCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Performance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h5 className="text-lg font-semibold text-foreground">Focus & Performance</h5>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Sleep */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              <h5 className="text-lg font-semibold text-foreground">Sleep & Dreams</h5>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sleepCombos.map((combo, i) => (
                <CombinationCard key={combo.id} combo={combo} index={i} />
              ))}
            </div>
          </div>
          
          {/* Spiritual */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-violet-500" />
              <h5 className="text-lg font-semibold text-foreground">Spiritual & Meditation</h5>
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
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  These specific carrier and beat frequency combinations are designed to access subconscious programming states, 
                  align with universal energy, and amplify your manifestation intentions. Best used during visualization practices.
                </p>
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
                    <span>Set clear intentions before starting your session</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Visualize your desired outcome as already achieved</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Engage all senses in your visualization</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Feel the emotions of achieving your goal</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Practice consistently at the same time daily</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Release attachment to outcomes after session</span>
                  </p>
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
                  { purpose: 'Deep Sleep', icon: Bed, beat: '0.5–2 Hz', carrier: '432 Hz', color: 'text-indigo-500', recommendation: 'Delta waves with calming 432 Hz base' },
                  { purpose: 'Meditation', icon: Compass, beat: '4–7 Hz', carrier: '432/528 Hz', color: 'text-purple-500', recommendation: 'Theta access with harmonic carriers' },
                  { purpose: 'Focus & Work', icon: Coffee, beat: '12–20 Hz', carrier: '432 Hz', color: 'text-amber-500', recommendation: 'Beta concentration without stress' },
                  { purpose: 'Creative Flow', icon: Palette, beat: '7–10 Hz', carrier: '432 Hz', color: 'text-cyan-500', recommendation: 'Theta-Alpha bridge for inspiration' },
                  { purpose: 'Energy Boost', icon: Battery, beat: '18–25 Hz', carrier: '528 Hz', color: 'text-orange-500', recommendation: 'High Beta with transformation tone' },
                  { purpose: 'Stress Relief', icon: Heart, beat: '8–10 Hz', carrier: '432 Hz', color: 'text-emerald-500', recommendation: 'Alpha relaxation with natural harmony' },
                  { purpose: 'Manifestation', icon: Sparkles, beat: '4–8 Hz', carrier: '528 Hz', color: 'text-violet-500', recommendation: 'Theta programming with Miracle Tone' },
                  { purpose: 'Peak Performance', icon: Zap, beat: '40 Hz', carrier: '528 Hz', color: 'text-rose-500', recommendation: 'Gamma cognition with DNA repair tone' },
                  { purpose: 'Morning Awakening', icon: Sunrise, beat: '10–14 Hz', carrier: '432 Hz', color: 'text-yellow-500', recommendation: 'Alpha-Beta transition for alertness' },
                  { purpose: 'Study & Learning', icon: BookOpen, beat: '10–12 Hz', carrier: '432/528 Hz', color: 'text-blue-500', recommendation: 'Alpha peak for memory encoding' },
                ].map((row, i) => (
                  <motion.div
                    key={row.purpose}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <row.icon className={`w-5 h-5 ${row.color} flex-shrink-0`} />
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
                  <p>• Lower beats (0.5-4 Hz) need longer sessions</p>
                  <p>• Gamma (40 Hz) works in short bursts (15-30 min)</p>
                  <p>• Schumann (7.83 Hz) syncs with Earth's rhythm</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
