import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    fetchPresets();
  }, [intent]);

  const fetchPresets = async () => {
    try {
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .ilike('intent', intent || '')
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
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 capitalize">{intent} Sessions</h1>
          <p className="text-muted-foreground">
            Select a preset to begin your session
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse bg-glass-bg backdrop-blur-xl border-glass-border">
                <div className="h-6 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presets.map((preset) => (
              <Card
                key={preset.id}
                className="group p-6 bg-glass-bg backdrop-blur-xl border-glass-border shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => handleStartSession(preset)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {preset.name}
                    </h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mb-3">
                      <span className="px-2 py-1 bg-primary/10 rounded capitalize">
                        {preset.mode}
                      </span>
                      <span className="px-2 py-1 bg-secondary rounded">
                        {preset.duration_min} min
                      </span>
                      <span className="px-2 py-1 bg-accent/10 rounded">
                        {preset.tuning_ref} Hz
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="bg-gradient-primary hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {preset.description}
                </p>

                <div className="mt-4 pt-4 border-t border-glass-border text-sm text-muted-foreground">
                  {preset.beat_hz_start === preset.beat_hz_end ? (
                    <span>{preset.beat_hz_start} Hz steady</span>
                  ) : (
                    <span>{preset.beat_hz_start} → {preset.beat_hz_end} Hz progression</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
