import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { IntentCard } from '@/components/IntentCard';
import { useAuth } from '@/contexts/AuthContext';
import { Waves, LogOut, User } from 'lucide-react';

interface IntentGroup {
  intent: string;
  description: string;
  count: number;
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
        .select('intent')
        .eq('is_public', true);

      if (error) throw error;

      // Group by intent and count
      const intentMap = new Map<string, number>();
      data?.forEach((item) => {
        intentMap.set(item.intent, (intentMap.get(item.intent) || 0) + 1);
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

      const grouped = Array.from(intentMap.entries()).map(([intent, count]) => ({
        intent,
        description: intentDescriptions[intent] || 'Discover the power of precision audio.',
        count,
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Intent
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Phase-locked generation at your device's native sample rate—no resampling, no drift.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {intents.map((intent) => (
              <IntentCard
                key={intent.intent}
                intent={intent.intent}
                description={intent.description}
                presetCount={intent.count}
              />
            ))}
          </div>
        )}

        <div className="mt-16 p-8 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border shadow-card max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Safety Notice</h3>
          <p className="text-muted-foreground text-center leading-relaxed">
            This is not medical advice. Use responsibly at comfortable volumes. Avoid while driving or
            operating machinery. If you experience discomfort, discontinue use immediately.
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
