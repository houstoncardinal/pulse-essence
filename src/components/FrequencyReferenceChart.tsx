import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles, Moon, Zap, Music, Waves, Activity, Target, Eye, Shield, Flame } from 'lucide-react';

interface FrequencyEntry {
  frequency: string;
  name: string;
  category: 'brainwave' | 'solfeggio' | 'schumann' | 'special';
  description: string;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const frequencies: FrequencyEntry[] = [
  // Brainwave Frequencies
  {
    frequency: '0.5-4 Hz',
    name: 'Delta Waves',
    category: 'brainwave',
    description: 'Deep dreamless sleep, healing, and regeneration',
    benefits: ['Deep restorative sleep', 'Physical healing', 'Immune boost', 'HGH release'],
    icon: Moon,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    frequency: '4-8 Hz',
    name: 'Theta Waves',
    category: 'brainwave',
    description: 'Deep meditation, creativity, and subconscious access',
    benefits: ['Deep meditation', 'Enhanced creativity', 'Memory consolidation', 'Intuition'],
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
  },
  {
    frequency: '8-12 Hz',
    name: 'Alpha Waves',
    category: 'brainwave',
    description: 'Relaxed alertness, calm focus, and learning readiness',
    benefits: ['Calm focus', 'Stress reduction', 'Learning enhancement', 'Mind-body integration'],
    icon: Brain,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    frequency: '12-30 Hz',
    name: 'Beta Waves',
    category: 'brainwave',
    description: 'Active thinking, concentration, and problem-solving',
    benefits: ['Active concentration', 'Logical thinking', 'Alert cognition', 'Task performance'],
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
  },
  {
    frequency: '30-100 Hz',
    name: 'Gamma Waves',
    category: 'brainwave',
    description: 'Peak performance, cognitive binding, and insight',
    benefits: ['Peak cognition', 'Information processing', 'Transcendent states', 'Memory formation'],
    icon: Sparkles,
    color: 'from-rose-500 to-red-500',
  },
  // Solfeggio Frequencies
  {
    frequency: '174 Hz',
    name: 'Foundation',
    category: 'solfeggio',
    description: 'Pain reduction and security. The lowest Solfeggio frequency.',
    benefits: ['Pain relief', 'Sense of security', 'Physical grounding', 'Anesthetic effect'],
    icon: Shield,
    color: 'from-stone-500 to-stone-600',
  },
  {
    frequency: '285 Hz',
    name: 'Quantum Cognition',
    category: 'solfeggio',
    description: 'Tissue regeneration and energy field healing',
    benefits: ['Cellular repair', 'Energy restructuring', 'Wound healing', 'Organ regeneration'],
    icon: Activity,
    color: 'from-red-500 to-rose-500',
  },
  {
    frequency: '396 Hz',
    name: 'Liberation',
    category: 'solfeggio',
    description: 'Liberating guilt and fear. Root chakra activation.',
    benefits: ['Fear release', 'Guilt liberation', 'Grounding', 'Security'],
    icon: Flame,
    color: 'from-red-600 to-orange-500',
  },
  {
    frequency: '417 Hz',
    name: 'Undoing Situations',
    category: 'solfeggio',
    description: 'Facilitating change and clearing negative energy',
    benefits: ['Trauma clearing', 'Negative energy removal', 'Change facilitation', 'Fresh start'],
    icon: Waves,
    color: 'from-orange-500 to-amber-500',
  },
  {
    frequency: '432 Hz',
    name: 'Universal Harmony',
    category: 'solfeggio',
    description: 'Natural tuning aligned with nature and the cosmos',
    benefits: ['Natural harmony', 'Heart coherence', 'Calm listening', 'Universal alignment'],
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    frequency: '528 Hz',
    name: 'Miracle Tone',
    category: 'solfeggio',
    description: 'DNA repair, transformation, and love frequency',
    benefits: ['DNA repair', 'Transformation', 'Miracles', 'Heart activation'],
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
  },
  {
    frequency: '639 Hz',
    name: 'Connecting',
    category: 'solfeggio',
    description: 'Harmonizing relationships and emotional connection',
    benefits: ['Relationship healing', 'Communication', 'Understanding', 'Tolerance'],
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    frequency: '741 Hz',
    name: 'Awakening Intuition',
    category: 'solfeggio',
    description: 'Solving problems and expressing truth',
    benefits: ['Problem solving', 'Self-expression', 'Cellular cleansing', 'Intuition'],
    icon: Eye,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    frequency: '852 Hz',
    name: 'Returning to Spiritual Order',
    category: 'solfeggio',
    description: 'Awakening intuition and third eye activation',
    benefits: ['Spiritual awakening', 'Inner strength', 'Third eye', 'Higher perspective'],
    icon: Brain,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    frequency: '963 Hz',
    name: 'Divine Consciousness',
    category: 'solfeggio',
    description: 'Activation of pineal gland and connection to source',
    benefits: ['Pineal activation', 'Divine connection', 'Unity consciousness', 'Enlightenment'],
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
  },
  // Special Frequencies
  {
    frequency: '7.83 Hz',
    name: 'Schumann Resonance',
    category: 'schumann',
    description: "Earth's fundamental electromagnetic frequency",
    benefits: ['Grounding', 'Natural rhythm sync', 'Circadian balance', 'Anti-stress'],
    icon: Waves,
    color: 'from-emerald-600 to-green-500',
  },
  {
    frequency: '40 Hz',
    name: 'Gamma Focus',
    category: 'special',
    description: 'Peak cognitive performance and neural binding',
    benefits: ['Memory enhancement', 'Cognitive clarity', 'Information processing', 'Learning'],
    icon: Target,
    color: 'from-yellow-500 to-amber-500',
  },
  {
    frequency: '10 Hz',
    name: 'Alpha Peak',
    category: 'special',
    description: 'Optimal relaxed alertness and creative flow',
    benefits: ['Relaxed focus', 'Creative flow', 'Stress relief', 'Mind clarity'],
    icon: Music,
    color: 'from-sky-500 to-blue-500',
  },
];

const categoryLabels = {
  brainwave: { label: 'Brainwave States', description: 'Neural oscillation frequencies' },
  solfeggio: { label: 'Solfeggio Scale', description: 'Ancient healing frequencies' },
  schumann: { label: 'Earth Resonance', description: 'Natural planetary frequencies' },
  special: { label: 'Targeted Frequencies', description: 'Research-backed specific frequencies' },
};

export function FrequencyReferenceChart() {
  const brainwaves = frequencies.filter(f => f.category === 'brainwave');
  const solfeggio = frequencies.filter(f => f.category === 'solfeggio');
  const special = frequencies.filter(f => f.category === 'schumann' || f.category === 'special');

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
          Frequency Reference Guide
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          A comprehensive reference of brainwave states, solfeggio frequencies, and scientifically-studied resonances
        </p>
      </div>

      {/* Brainwave States - Visual Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h4 className="text-lg sm:text-xl font-semibold">{categoryLabels.brainwave.label}</h4>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-4 sm:p-6">
          {/* Frequency spectrum visualization */}
          <div className="relative h-20 sm:h-24 mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-600 via-cyan-500 via-amber-500 to-rose-500 opacity-20" />
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 h-20 sm:h-24 flex items-end">
            {brainwaves.map((wave, i) => (
              <motion.div
                key={wave.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 flex flex-col items-center"
              >
                <div className={`w-full h-12 sm:h-16 bg-gradient-to-t ${wave.color} rounded-t-lg opacity-80 relative group cursor-pointer hover:opacity-100 transition-opacity`}>
                  <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs font-medium text-foreground">
                    {wave.frequency}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Labels */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {brainwaves.map((wave, i) => (
              <motion.div
                key={wave.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${wave.color} mb-1 sm:mb-2`}>
                  <wave.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-foreground">{wave.name.split(' ')[0]}</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block">{wave.description.slice(0, 30)}...</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Solfeggio Frequencies - Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <h4 className="text-lg sm:text-xl font-semibold">{categoryLabels.solfeggio.label}</h4>
          <span className="text-xs text-muted-foreground ml-2">Ancient healing tones</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {solfeggio.map((freq, i) => (
            <motion.div
              key={freq.frequency}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group relative p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-float transition-all cursor-pointer overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${freq.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                <div className={`inline-flex p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${freq.color} mb-2`}>
                  <freq.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground mb-0.5">{freq.frequency}</div>
                <div className="text-[10px] sm:text-xs font-medium text-primary mb-1">{freq.name}</div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                  {freq.description}
                </div>
                
                {/* Hover benefits */}
                <div className="mt-2 pt-2 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-wrap gap-1">
                    {freq.benefits.slice(0, 2).map(b => (
                      <span key={b} className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Special/Research Frequencies */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h4 className="text-lg sm:text-xl font-semibold">Key Research Frequencies</h4>
          <span className="text-xs text-muted-foreground ml-2">Scientifically studied</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {special.map((freq, i) => (
            <motion.div
              key={freq.frequency}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-4 sm:p-5 rounded-xl bg-gradient-to-br from-card to-secondary/30 border border-border hover:border-primary/40 hover:shadow-float transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${freq.color} flex-shrink-0`}>
                  <freq.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-lg sm:text-xl font-bold text-foreground">{freq.frequency}</span>
                    {freq.category === 'schumann' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                        Earth
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-primary mb-1">{freq.name}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed mb-2">
                    {freq.description}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {freq.benefits.map(b => (
                      <span key={b} className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-secondary text-secondary-foreground">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-secondary/50 p-3 sm:p-4 border-b border-border">
              <h4 className="font-semibold text-sm sm:text-base">Quick Reference: Frequencies by Purpose</h4>
            </div>
            <div className="divide-y divide-border">
              {[
                { purpose: 'Deep Sleep & Recovery', frequencies: ['0.5-4 Hz Delta', '174 Hz', '285 Hz'], color: 'bg-indigo-500' },
                { purpose: 'Meditation & Relaxation', frequencies: ['4-8 Hz Theta', '7.83 Hz Schumann', '432 Hz'], color: 'bg-purple-500' },
                { purpose: 'Focus & Learning', frequencies: ['8-12 Hz Alpha', '10 Hz', '40 Hz Gamma'], color: 'bg-cyan-500' },
                { purpose: 'Energy & Performance', frequencies: ['12-30 Hz Beta', '741 Hz', '852 Hz'], color: 'bg-amber-500' },
                { purpose: 'Healing & Transformation', frequencies: ['528 Hz Miracle', '639 Hz', '963 Hz'], color: 'bg-emerald-500' },
                { purpose: 'Emotional Balance', frequencies: ['396 Hz Liberation', '417 Hz', '639 Hz Connecting'], color: 'bg-rose-500' },
              ].map((row, i) => (
                <div key={row.purpose} className="flex items-center p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3 w-1/3 sm:w-1/4">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${row.color}`} />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{row.purpose}</span>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1 sm:gap-2">
                    {row.frequencies.map(f => (
                      <span key={f} className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-card border border-border text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
