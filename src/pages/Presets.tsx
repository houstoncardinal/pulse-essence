import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Sparkles, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TuningSelector } from '@/components/TuningSelector';
import { SEOHead, PageSchemas } from '@/components/seo';
import { motion } from 'framer-motion';
import cardinalLogo from '@/assets/cardinal-logo.png';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Preset {
  id: string;
  name: string;
  description: string;
  mode: string;
  beat_hz_start: number;
  beat_hz_end: number;
  duration_min: number;
  tuning_ref: number;
  base_freq_hz: number;
}

export default function Presets() {
  const { intent } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTuning, setSelectedTuning] = useState<number>(432);

  useEffect(() => {
    fetchPresets();
  }, [intent, selectedTuning]);

  const fetchPresets = async () => {
    try {
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .ilike('intent', intent || '')
        .eq('tuning_ref', selectedTuning)
        .order('name');

      if (error) throw error;
      setPresets(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (preset: Preset) => {
    navigate('/player', { state: { preset } });
  };

  return (
    <>
      <SEOHead 
        title={`${intent} Binaural Beats - Cardinal Binaural | 432 Hz & 528 Hz`}
        description={`${intent} binaural beats using 432 Hz and 528 Hz natural frequencies. Research-backed presets for optimal brainwave entrainment and ${intent?.toLowerCase()} enhancement.`}
        canonical={`/presets/${intent}`}
        keywords={`${intent?.toLowerCase()} binaural beats, ${intent?.toLowerCase()} frequencies, 432 Hz ${intent?.toLowerCase()}, 528 Hz ${intent?.toLowerCase()}, brainwave entrainment, meditation music`}
      />
      <PageSchemas pageType="preset" presetIntent={intent} />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <img src={cardinalLogo} alt="Cardinal Binaural" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-soft" />
                <div>
                  <h1 className="text-sm sm:text-lg font-bold">{intent} Sessions</h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Select a preset to begin</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Tuning Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="p-4 sm:p-6 bg-card border-border">
              <TuningSelector selected={selectedTuning} onChange={setSelectedTuning} />
            </Card>
          </motion.div>

          {/* Headphones Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 mb-6 text-xs text-primary"
          >
            <Headphones className="w-4 h-4 flex-shrink-0" />
            <span>For best results, use headphones with binaural mode</span>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-52 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : presets.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-base font-medium mb-1">
                No presets available for {selectedTuning} Hz
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different tuning frequency above.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {presets.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="group relative overflow-hidden p-5 sm:p-6 bg-card border-border hover:border-primary/30 hover:shadow-float transition-all duration-300 cursor-pointer h-full"
                    onClick={() => handleStartSession(preset)}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors pr-2">
                          {preset.name}
                        </h3>
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Button
                            size="icon"
                            className="bg-gradient-primary shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9"
                          >
                            <Play className="w-4 h-4 fill-white" />
                          </Button>
                        </motion.div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[11px] font-medium capitalize">
                          {preset.mode}
                        </span>
                        <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-full text-[11px] font-medium">
                          {preset.duration_min} min
                        </span>
                        <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-[11px] font-medium">
                          {preset.tuning_ref} Hz
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {preset.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {preset.beat_hz_start === preset.beat_hz_end ? (
                            <span>{preset.beat_hz_start} Hz steady</span>
                          ) : (
                            <span>{preset.beat_hz_start} → {preset.beat_hz_end} Hz</span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          START →
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
