import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, X, Volume2, Waves, ChevronDown, ChevronUp } from 'lucide-react';
import { getAudioEngine } from '@/lib/audioEngine';
import { getAmbientEngine, type AmbientSoundType } from '@/lib/ambientEngine';
import { AMBIENT_SOUNDS } from '@/components/AmbientSoundCard';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Player() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const preset = location.state?.preset;

  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.2);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [audioEngine] = useState(() => getAudioEngine());
  const [ambientEngine] = useState(() => getAmbientEngine());
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.2);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);

  const totalSeconds = (preset?.duration_min || 30) * 60;

  useEffect(() => {
    if (!preset) {
      navigate('/');
      return;
    }

    return () => {
      if (audioEngine) audioEngine.stop();
      if (ambientEngine.getIsPlaying()) ambientEngine.stop();
    };
  }, [preset, navigate, audioEngine, ambientEngine]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= totalSeconds) {
            handleStop();
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const startSession = async () => {
    try {
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to track your sessions',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          preset_id: preset.id,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error: any) {
      console.error('Failed to start session:', error);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: elapsedSeconds,
        })
        .eq('id', sessionId);
    } catch (error: any) {
      console.error('Failed to end session:', error);
    }
  };

  const handlePlay = async () => {
    try {
      await audioEngine.initialize();

      // Schedule the preset
      const modeMap = { binaural: 0, monaural: 1, isochronic: 2 };
      const mode = modeMap[preset.mode as keyof typeof modeMap] || 0;

      audioEngine.schedulePreset(
        preset.base_freq_hz,
        preset.beat_hz_start,
        preset.beat_hz_end || preset.beat_hz_start,
        preset.duration_min,
        mode
      );

      audioEngine.updateParams({ amp: intensity });
      await audioEngine.start();
      setIsPlaying(true);

      if (elapsedSeconds === 0) {
        await startSession();
      }

      toast({
        title: 'Session started',
        description: 'Enjoy your session. Use headphones for best results.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to start audio engine',
        variant: 'destructive',
      });
    }
  };

  const handlePause = async () => {
    await audioEngine.stop();
    setIsPlaying(false);
  };

  const handleStop = async () => {
    await audioEngine.stop();
    if (ambientEngine.getIsPlaying()) await ambientEngine.stop();
    await endSession();
    setIsPlaying(false);
    navigate('/');
  };

  const toggleAmbient = async (type: AmbientSoundType) => {
    try {
      if (ambientSound === type) {
        await ambientEngine.stop();
        setAmbientSound(null);
      } else {
        if (ambientEngine.getIsPlaying()) {
          await ambientEngine.stop();
          await new Promise(r => setTimeout(r, 350));
        }
        await ambientEngine.start({ type, amp: ambientVolume, density: 0.5, brightness: 0.5 });
        setAmbientSound(type);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not start ambient sound', variant: 'destructive' });
    }
  };

  const handleAmbientVolumeChange = useCallback((val: number[]) => {
    setAmbientVolume(val[0]);
    ambientEngine.updateParams({ amp: val[0] });
  }, [ambientEngine]);

  const handleIntensityChange = useCallback(
    (value: number[]) => {
      const newIntensity = value[0];
      setIntensity(newIntensity);
      audioEngine.updateParams({ amp: newIntensity });
    },
    [audioEngine]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!preset) return null;

  const progress = (elapsedSeconds / totalSeconds) * 100;

  return (
    <div className="min-h-screen bg-gradient-calm p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 bg-glass-bg backdrop-blur-xl border-glass-border shadow-card">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{preset.name}</h1>
            <p className="text-muted-foreground">{preset.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleStop}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-8">
          <WaveformVisualizer
            isPlaying={isPlaying}
            beatHz={preset.beat_hz_start}
            baseFreq={preset.base_freq_hz}
            mode={preset.mode}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{formatTime(elapsedSeconds)}</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Intensity</span>
          </div>
          <Slider
            value={[intensity]}
            onValueChange={handleIntensityChange}
            min={0.05}
            max={0.5}
            step={0.05}
            className="w-full"
          />
        </div>

        {/* Ambient Sound Mixer */}
        <div className="mb-8">
          <button
            onClick={() => setShowAmbientMixer(!showAmbientMixer)}
            className="flex items-center gap-2 w-full text-left mb-3"
          >
            <Waves className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">
              Ambient Sounds {ambientSound ? `• ${AMBIENT_SOUNDS.find(s => s.id === ambientSound)?.name}` : ''}
            </span>
            {showAmbientMixer ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {showAmbientMixer && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {AMBIENT_SOUNDS.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => toggleAmbient(sound.id)}
                    className={`p-2 rounded-lg text-center transition-all text-xs border ${
                      ambientSound === sound.id
                        ? 'bg-primary/10 border-primary text-primary shadow-sm'
                        : 'bg-secondary/50 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{sound.icon}</span>
                    <span className="truncate block text-[10px]">{sound.name}</span>
                  </button>
                ))}
              </div>
              {ambientSound && (
                <div className="flex items-center gap-3 pt-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[ambientVolume]}
                    onValueChange={handleAmbientVolumeChange}
                    min={0.05}
                    max={0.6}
                    step={0.05}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">{Math.round(ambientVolume * 100)}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {!isPlaying ? (
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-gradient-primary hover:shadow-luxury shadow-glow px-16 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3 fill-white" />
              {elapsedSeconds > 0 ? 'Resume Session' : 'Start Session'}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handlePause}
              variant="secondary"
              className="px-16 py-6 text-lg font-bold hover:shadow-card transition-all duration-300 hover:scale-105"
            >
              <Pause className="w-6 h-6 mr-3" />
              Pause Session
            </Button>
          )}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-glass-border">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Mode</div>
              <div className="font-medium capitalize">{preset.mode}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Tuning</div>
              <div className="font-medium">{preset.tuning_ref} Hz</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Beat Range</div>
              <div className="font-medium">
                {preset.beat_hz_start}
                {preset.beat_hz_end && preset.beat_hz_end !== preset.beat_hz_start
                  ? ` → ${preset.beat_hz_end}`
                  : ''}{' '}
                Hz
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
