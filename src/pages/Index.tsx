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

      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Neural Audio Engineering</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="text-foreground">Precision</span>
            <br />
            <span className="text-primary">Brainwave Entrainment</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Sample-accurate phase synthesis. Zero-drift generation. <br />Professional-grade neural modulation at 440Hz, 432Hz, and 528Hz.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>Phase-Locked</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Drift-Free</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Studio Quality</span>
          </div>
        </div>

        {/* Intent Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-3 text-foreground">
            Sessions
          </h2>
          <p className="text-muted-foreground">
            Scientifically-crafted audio for focus, relaxation, and performance
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

        <div className="mt-24 p-8 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Not medical advice. Use at comfortable volumes. Avoid while driving or operating machinery.
            Discontinue if discomfort occurs. Best experienced with quality headphones.
          </p>
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
