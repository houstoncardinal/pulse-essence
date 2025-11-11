import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { IntentCard } from '@/components/IntentCard';
import { useAuth } from '@/contexts/AuthContext';
import { Waves, LogOut, User, Sparkles, Brain, Zap, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-calm">
      <header className="border-b border-glass-border bg-glass-bg/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AuralForge</h1>
              <p className="text-xs text-muted-foreground">Scientifically precise. Effortlessly calm.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in relative">
          {/* Floating orbs background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-luxury opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-glass-bg backdrop-blur-xl border border-glass-border shadow-glow mb-8 animate-scale-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium bg-gradient-accent bg-clip-text text-transparent">
                Scientifically Engineered Neural Entrainment
              </span>
            </div>

            <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-luxury bg-clip-text text-transparent">
                Mind State
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Phase-locked generation at your device's native sample rate—no resampling, no drift.
              <span className="block mt-2 text-foreground/80">Experience the precision of million-dollar audio engineering.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-primary/50 transition-all duration-500 hover:shadow-glow">
                <Brain className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Neural Precision</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/50 transition-all duration-500 hover:shadow-glow">
                <Zap className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Zero Drift</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-primary/50 transition-all duration-500 hover:shadow-glow">
                <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Sample Accurate</span>
              </div>
            </div>

            {/* Tuning Options */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-xl">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-glow" />
                <div className="text-left">
                  <div className="font-bold text-foreground">440 Hz Standard</div>
                  <div className="text-xs text-muted-foreground">Concert Pitch</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 backdrop-blur-xl">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-glow" />
                <div className="text-left">
                  <div className="font-bold text-foreground">432 Hz Universal</div>
                  <div className="text-xs text-muted-foreground">Natural Harmony</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 backdrop-blur-xl">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
                <div className="text-left">
                  <div className="font-bold text-foreground">528 Hz Solfeggio</div>
                  <div className="text-xs text-muted-foreground">Miracle Tone</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intent Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Choose Your Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from scientifically-crafted sessions designed for every aspect of human performance
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-glass-bg backdrop-blur-xl rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
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

        <div className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-glass-bg to-glass-bg/50 backdrop-blur-xl border-2 border-glass-border shadow-luxury max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-10 animate-shimmer pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-center">Safety & Responsibility</h3>
            </div>
            <p className="text-muted-foreground text-center leading-relaxed text-lg">
              This is not medical advice. Use responsibly at comfortable volumes. Avoid while driving or
              operating machinery. If you experience discomfort, discontinue use immediately.
              <span className="block mt-4 text-sm text-muted-foreground/80">
                For optimal results, use high-quality headphones in a quiet environment.
              </span>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-glass-border bg-glass-bg/30 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AuralForge. All rights reserved.</p>
          <p className="mt-2">Phase-locked synthesis • Zero drift • Sample-accurate</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
