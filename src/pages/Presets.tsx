import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TuningSelector } from '@/components/TuningSelector';

interface Preset {
  id: string;
  name: string;
  description: string;
  mode: string;
  beat_hz_start: number;
  beat_hz_end: number;
  duration_min: number;
  tuning_ref: number;
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
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-bold capitalize bg-gradient-primary bg-clip-text text-transparent">
                {intent} Sessions
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground">
              Select a scientifically-tuned preset to begin your session
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Card className="p-6 bg-glass-bg backdrop-blur-xl border-2 border-glass-border shadow-card">
            <TuningSelector selected={selectedTuning} onChange={setSelectedTuning} />
          </Card>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse bg-glass-bg backdrop-blur-xl border-2 border-glass-border">
                <div className="h-6 bg-gradient-primary/20 rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : presets.length === 0 ? (
          <Card className="p-12 text-center bg-glass-bg backdrop-blur-xl border-2 border-glass-border shadow-card">
            <p className="text-muted-foreground text-lg">
              No presets available for {selectedTuning} Hz tuning in this category.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try selecting a different tuning frequency above.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset, index) => (
              <Card
                key={preset.id}
                className="group relative overflow-hidden p-6 bg-glass-bg backdrop-blur-xl border-2 border-glass-border shadow-card hover:shadow-luxury transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:border-primary/50"
                onClick={() => handleStartSession(preset)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Animated shimmer on hover */}
                <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-20 group-hover:animate-shimmer" />
                
                {/* Gradient accent corner */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {preset.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        <span className="px-3 py-1.5 bg-gradient-primary text-white rounded-full font-medium capitalize shadow-sm">
                          {preset.mode}
                        </span>
                        <span className="px-3 py-1.5 bg-gradient-accent text-white rounded-full font-medium shadow-sm">
                          {preset.duration_min} min
                        </span>
                        <span className="px-3 py-1.5 bg-gradient-success text-white rounded-full font-medium shadow-sm">
                          {preset.tuning_ref} Hz
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="bg-gradient-primary hover:shadow-glow shadow-card opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {preset.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-glass-border">
                    <div className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {preset.beat_hz_start === preset.beat_hz_end ? (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          {preset.beat_hz_start} Hz steady
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-gradient-primary" />
                          {preset.beat_hz_start} → {preset.beat_hz_end} Hz
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      START →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
