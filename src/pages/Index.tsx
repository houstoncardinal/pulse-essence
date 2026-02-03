import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { IntentCard } from '@/components/IntentCard';
import { StructuredData } from '@/components/StructuredData';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { MobileToolbar } from '@/components/MobileToolbar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import SDFDreamscape from '@/components/ui/sdf-dreamscape';
import { FrequencyReferenceChart } from '@/components/FrequencyReferenceChart';
import { 
  Waves, 
  LogOut, 
  User, 
  Sliders, 
  Shield, 
  Cpu, 
  AudioWaveform,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  History,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

interface IntentGroup {
  intent: string;
  description: string;
  count: number;
  presets: Array<{ name: string; tuning_ref: number }>;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { isPro, isTrial, checkSubscription } = useSubscription();
  const { toast } = useToast();
  const [intents, setIntents] = useState<IntentGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle checkout success/cancel
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      toast({
        title: 'Welcome to Pro!',
        description: 'Your 7-day free trial has started. Enjoy all premium features!',
      });
      checkSubscription();
      // Clean up URL
      window.history.replaceState({}, '', '/');
    } else if (checkoutStatus === 'canceled') {
      toast({
        title: 'Checkout Canceled',
        description: 'No worries! You can upgrade anytime.',
        variant: 'default',
      });
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      const { data, error } = await supabase
        .from('presets')
        .select('intent, name, tuning_ref')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by intent with preset examples
      const intentMap = new Map<string, { count: number; presets: Array<{ name: string; tuning_ref: number }> }>();
      data?.forEach((item) => {
        const existing = intentMap.get(item.intent);
        if (existing) {
          existing.count++;
          if (existing.presets.length < 3) {
            existing.presets.push({ name: item.name, tuning_ref: item.tuning_ref });
          }
        } else {
          intentMap.set(item.intent, { 
            count: 1, 
            presets: [{ name: item.name, tuning_ref: item.tuning_ref }] 
          });
        }
      });

      const intentDescriptions: Record<string, string> = {
        Focus: 'Enhance concentration and mental clarity with precision-tuned Alpha and Beta waves.',
        Study: 'Optimize learning and memory retention with Theta to Alpha transitions.',
        Sleep: 'Drift into deep, restorative sleep with gradual Delta wave induction.',
        Calm: 'Find inner peace and stress relief with soothing Theta frequencies.',
        Creative: 'Unlock creative flow and problem-solving with Theta-Alpha bridges.',
        Meditation: 'Deepen your practice with resonant frequencies and sacred tones.',
        Energy: 'Boost alertness and vitality with invigorating Beta waves.',
      };

      const grouped = Array.from(intentMap.entries()).map(([intent, data]) => ({
        intent,
        description: intentDescriptions[intent] || 'Discover the power of precision audio.',
        count: data.count,
        presets: data.presets,
      }));

      setIntents(grouped);
    } catch (error) {
      console.error('Error fetching intents:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Cpu, title: 'Phase-Locked DSP', description: 'Real-time digital signal processing with zero drift' },
    { icon: AudioWaveform, title: 'Multi-Mode Audio', description: 'Binaural, monaural, and isochronic tones' },
    { icon: Shield, title: 'Safe Frequencies', description: 'Scientifically validated frequency ranges' },
    { icon: Sparkles, title: 'Manifestation Tuning', description: '432/528 Hz natural frequencies' },
  ];

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary shadow-soft">
              <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold tracking-tight">Cardinal Binaural</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Manifestation & Frequency Alignment</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {!isPro && (
              <Button 
                onClick={() => navigate('/pricing')}
                size="sm"
                className="gap-1 sm:gap-2 h-8 sm:h-10 bg-gradient-primary hover:opacity-90"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Upgrade</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/custom-tuner')}
              className="gap-1 sm:gap-2 h-8 sm:h-10"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Custom Tuner</span>
              <span className="sm:hidden text-xs">Tuner</span>
            </Button>
            <ThemeToggle />
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => navigate('/history')}
                >
                  <History className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 sm:h-10 sm:w-10">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline" size="sm" className="h-8 sm:h-10 text-xs sm:text-sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 md:py-32 text-center relative overflow-hidden">
          {/* WebGL SDF Dreamscape Background */}
          <div 
            className="absolute inset-0 -z-10"
            style={{ width: '100%', height: '100%', minHeight: '700px' }}
          >
            <SDFDreamscape 
              hue={158} 
              speed={0.35} 
              intensity={6} 
              complexity={2.5}
            />
            {/* Subtle overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60 pointer-events-none" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-primary">Natural Frequency Alignment</span>
              <Star className="w-3 h-3 text-primary fill-primary" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight px-2">
              <span className="text-foreground">Align Your Frequency</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Manifest Your Reality</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Attune to natural 432 Hz & 528 Hz frequencies for manifestation, healing, and transformation.<br className="hidden sm:block" />
              Align your energy with universal harmony and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4">
              <Button 
                onClick={() => navigate('/custom-tuner')}
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white shadow-hero gap-2 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
              >
                <Play className="w-4 h-4" />
                Start Session
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto gap-2 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base group"
              >
                Browse Presets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 sm:mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-float transition-all group"
                >
                  <div className="p-2 sm:p-2.5 rounded-xl bg-secondary w-fit mb-2 sm:mb-3 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
              {[
                { value: '±0.001 Hz', label: 'Frequency Accuracy' },
                { value: '0 ms', label: 'Phase Drift' },
                { value: '48 kHz', label: 'Sample Rate' },
                { value: '2 Refs', label: '432/528 Hz' },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm px-4">
              {['Phase-Locked', 'Web Audio API', 'Real-Time DSP', 'Studio Quality'].map((pill) => (
                <span key={pill} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary text-secondary-foreground border border-border">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Sessions Section */}
        <section id="sessions" className="py-8 sm:py-12 md:py-16 scroll-mt-20">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Curated Sessions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Scientifically-crafted binaural beats optimized for focus, deep relaxation, creativity, and peak performance
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 sm:h-64 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
              {intents.map((intent, index) => (
                <div 
                  key={intent.intent} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IntentCard
                    intent={intent.intent}
                    description={intent.description}
                    presetCount={intent.count}
                    presets={intent.presets}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 md:py-24 border-t border-border">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              How Binaural Beats Work
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding the science behind neural entrainment and brainwave synchronization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
            {/* The Science */}
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm sm:text-base">1</span>
                  </div>
                  The Frequency Following Response
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  When different pure tones are presented to each ear through headphones, the brain perceives a third tone—the binaural beat. This phenomenon occurs in the brain's superior olivary complex, where auditory signals converge.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold text-sm sm:text-base">2</span>
                  </div>
                  Neural Entrainment
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The brain naturally synchronizes its electrical activity to match external rhythmic stimuli—a process called entrainment. Binaural beats leverage this to guide brainwaves toward desired frequency ranges.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm sm:text-base">3</span>
                  </div>
                  Precision Matters
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Our phase-locked synthesis ensures zero frequency drift and sub-millisecond accuracy. This precision is critical—even small deviations can prevent effective entrainment and reduce the therapeutic benefit.
                </p>
              </div>
            </div>

            {/* Why Headphones */}
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 rounded-xl bg-gradient-primary text-white shadow-elevated">
                <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">Why Headphones Are Essential</h3>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-4">
                  Binaural beats require stereo separation to work effectively. Each ear must receive its designated frequency independently. Speakers allow frequencies to mix in the air before reaching your ears, eliminating the binaural effect.
                </p>
                <div className="p-3 sm:p-4 rounded-lg bg-white/10">
                  <p className="text-xs sm:text-sm opacity-90">
                    <strong>Pro tip:</strong> Use quality over-ear headphones in a quiet environment for best results.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3">The Tuning Difference</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Our platform supports multiple tuning references, each with unique properties:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="text-lg sm:text-xl font-bold text-primary mb-1">432 Hz</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Natural harmony, aligned with cosmic ratios and nature's frequencies</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="text-lg sm:text-xl font-bold text-accent mb-1">528 Hz</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">The "Miracle Tone" associated with DNA repair and transformation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Frequency Reference Chart */}
          <div className="mt-12 sm:mt-16 md:mt-20">
            <FrequencyReferenceChart />
          </div>

          {/* Safety Notice */}
          <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Important:</strong> This technology is not medical advice and should not replace professional healthcare. 
              Use at comfortable volumes. Avoid while driving or operating machinery. 
              Discontinue if you experience discomfort. Not recommended for individuals with epilepsy or seizure disorders.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center text-center">
            {/* Logo & Brand */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-primary shadow-soft">
                <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Cardinal Binaural</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Manifestation & Frequency Alignment</p>
              </div>
            </div>
            
            {/* Tech Specs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {['Phase-Locked Synthesis', 'Zero Drift', 'Sample-Accurate', '48kHz Audio'].map((spec) => (
                <span key={spec} className="px-3 py-1 text-[10px] sm:text-xs rounded-full bg-secondary text-muted-foreground border border-border">
                  {spec}
                </span>
              ))}
            </div>
            
            {/* Divider */}
            <div className="w-full max-w-md h-px bg-border mb-6 sm:mb-8" />
            
            {/* Creator Credit */}
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Created by <span className="font-semibold text-foreground">Hunain Qureshi</span>
              </p>
              <p className="text-[10px] sm:text-xs text-primary font-medium">Cardinal Consulting</p>
            </div>
            
            {/* Copyright */}
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              © {new Date().getFullYear()} Cardinal Binaural. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Toolbar */}
      <MobileToolbar />
      </div>
    </>
  );
};

export default Index;
