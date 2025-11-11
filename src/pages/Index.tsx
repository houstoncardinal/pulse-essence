import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { IntentCard } from '@/components/IntentCard';
import { useAuth } from '@/contexts/AuthContext';
import { Waves, LogOut, User, Sliders } from 'lucide-react';

interface IntentGroup {
  intent: string;
  description: string;
  count: number;
  presets: Array<{ name: string; tuning_ref: number }>;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [intents, setIntents] = useState<IntentGroup[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary shadow-soft">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">AuralForge</h1>
              <p className="text-xs text-muted-foreground">Neural Entrainment Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/custom-tuner')}
              className="gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Custom Tuner</span>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 md:py-32 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Scientifically Validated Technology</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-foreground">Precision Neural</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Audio Engineering</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Phase-accurate binaural beat synthesis with zero-drift precision.<br className="hidden sm:block" />
              Professional-grade brainwave entrainment for focus, relaxation, and peak performance.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">±0.001 Hz</div>
                <div className="text-sm text-muted-foreground">Frequency Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">0 ms</div>
                <div className="text-sm text-muted-foreground">Phase Drift</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">48 kHz</div>
                <div className="text-sm text-muted-foreground">Sample Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">440/432/528</div>
                <div className="text-sm text-muted-foreground">Hz Tuning Options</div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border">Phase-Locked Synthesis</span>
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border">Web Audio API</span>
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border">Real-Time Processing</span>
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground border border-border">Studio Quality</span>
            </div>
          </div>
        </section>

        {/* Sessions Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Curated Sessions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scientifically-crafted binaural beats optimized for focus, deep relaxation, creativity, and peak performance
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
        <section className="py-24 border-t border-border">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How Binaural Beats Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding the science behind neural entrainment and brainwave synchronization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* The Science */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  The Frequency Following Response
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When different pure tones are presented to each ear through headphones, the brain perceives a third tone—the binaural beat. This phenomenon occurs in the brain's superior olivary complex, where auditory signals converge.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  Neural Entrainment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The brain naturally synchronizes its electrical activity to match external rhythmic stimuli—a process called entrainment. Binaural beats leverage this to guide brainwaves toward desired frequency ranges.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  Precision Matters
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our phase-locked synthesis ensures zero frequency drift and sub-millisecond accuracy. This precision is critical—even small deviations can prevent effective entrainment and reduce the therapeutic benefit.
                </p>
              </div>
            </div>

            {/* Brainwave States */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-primary text-white shadow-elevated">
                <h3 className="text-xl font-semibold mb-4">Brainwave States</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Delta (0.5-4 Hz)</span>
                      <span className="text-sm opacity-90">Deep Sleep</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[15%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Theta (4-8 Hz)</span>
                      <span className="text-sm opacity-90">Meditation, Creativity</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Alpha (8-12 Hz)</span>
                      <span className="text-sm opacity-90">Relaxed Focus</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[50%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Beta (12-30 Hz)</span>
                      <span className="text-sm opacity-90">Active Thinking</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[70%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Gamma (30-100 Hz)</span>
                      <span className="text-sm opacity-90">Peak Cognition</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <h3 className="text-xl font-semibold mb-3">Why Headphones Are Essential</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Binaural beats require stereo separation to work effectively. Each ear must receive its designated frequency independently. Speakers allow frequencies to mix in the air before reaching your ears, eliminating the binaural effect.
                </p>
                <p className="text-sm text-muted-foreground">
                  For best results, use quality over-ear headphones in a quiet environment.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="max-w-3xl mx-auto p-6 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Important:</strong> This technology is not medical advice and should not replace professional healthcare. 
              Use at comfortable volumes. Avoid while driving or operating machinery. 
              Discontinue if you experience discomfort. Not recommended for individuals with epilepsy or seizure disorders.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-primary">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">AuralForge</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">© 2025 AuralForge. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Phase-locked synthesis • Zero drift • Sample-accurate</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
