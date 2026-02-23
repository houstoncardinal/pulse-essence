import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, X, Volume2, Waves, ChevronDown, ChevronUp, Headphones, Timer, Radio, Sparkles } from 'lucide-react';
import { getAudioEngine } from '@/lib/audioEngine';
import { getAmbientEngine, type AmbientSoundType } from '@/lib/ambientEngine';
import { AMBIENT_SOUNDS } from '@/components/AmbientSoundCard';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SEOHead, PageSchemas } from '@/components/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { ImmersiveVisualizer } from '@/components/ImmersiveVisualizer';

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
  const [showVisualizer, setShowVisualizer] = useState(false);

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
    <>
      <SEOHead
        title={`${preset.name} - Now Playing | Cardinal Binaural`}
        description={`Currently playing ${preset.name}: ${preset.description}. ${preset.mode} entrainment at ${preset.tuning_ref} Hz tuning.`}
        canonical="/player"
        noindex={true}
      />
      <PageSchemas pageType="home" />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              opacity: isPlaying ? [0.15, 0.25, 0.15] : 0.05,
              scale: isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              opacity: isPlaying ? [0.1, 0.18, 0.1] : 0.03,
              scale: isPlaying ? [1.1, 1, 1.1] : 1,
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[100px]"
          />
        </div>

        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-xl border-border shadow-elevated">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isPlaying && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {isPlaying ? 'Now Playing' : 'Ready'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{preset.name}</h1>
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                </motion.div>
                <Button variant="ghost" size="icon" onClick={handleStop} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Visualizer */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <WaveformVisualizer
                  isPlaying={isPlaying}
                  beatHz={preset.beat_hz_start}
                  baseFreq={preset.base_freq_hz}
                  mode={preset.mode}
                />
              </motion.div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
                  <span>{formatTime(elapsedSeconds)}</span>
                  <span>{formatTime(totalSeconds)}</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Intensity */}
              <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Intensity</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{Math.round(intensity * 200)}%</span>
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
              <div className="mb-6">
                <button
                  onClick={() => setShowAmbientMixer(!showAmbientMixer)}
                  className="flex items-center gap-2 w-full text-left p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors"
                >
                  <Waves className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium flex-1 text-foreground">
                    Ambient Sounds {ambientSound ? `· ${AMBIENT_SOUNDS.find(s => s.id === ambientSound)?.name}` : ''}
                  </span>
                  {showAmbientMixer ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {showAmbientMixer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {AMBIENT_SOUNDS.map((sound) => (
                            <motion.button
                              key={sound.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleAmbient(sound.id)}
                              className={`p-2.5 rounded-xl text-center transition-all text-xs border ${
                                ambientSound === sound.id
                                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                  : 'bg-secondary/50 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <span className="text-lg block mb-1">{sound.icon}</span>
                              <span className="truncate block text-[10px] font-medium">{sound.name}</span>
                            </motion.button>
                          ))}
                        </div>
                        {ambientSound && (
                          <div className="flex items-center gap-3 pt-2 px-1">
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                            <Slider
                              value={[ambientVolume]}
                              onValueChange={handleAmbientVolumeChange}
                              min={0.05}
                              max={0.6}
                              step={0.05}
                              className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-8 font-mono">{Math.round(ambientVolume * 100)}%</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Immersive Visualizer Button */}
              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVisualizer(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="text-sm font-medium text-foreground block">Immersive Visualizer</span>
                    <span className="text-[10px] text-muted-foreground">10 full-screen reactive scenes</span>
                  </div>
                  <span className="text-xs text-primary font-medium">Launch →</span>
                </motion.button>
              </div>

              {/* Play Controls */}
              <div className="flex gap-3 justify-center mb-6">
                {!isPlaying ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      onClick={handlePlay}
                      className="bg-gradient-primary hover:opacity-90 shadow-hero px-12 sm:px-16 py-6 text-base font-bold"
                    >
                      <Play className="w-5 h-5 mr-2 fill-white" />
                      {elapsedSeconds > 0 ? 'Resume' : 'Start Session'}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      onClick={handlePause}
                      variant="secondary"
                      className="px-12 sm:px-16 py-6 text-base font-bold"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <Radio className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <div className="text-xs text-muted-foreground mb-0.5">Mode</div>
                  <div className="text-sm font-semibold text-foreground capitalize">{preset.mode}</div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <Headphones className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <div className="text-xs text-muted-foreground mb-0.5">Tuning</div>
                  <div className="text-sm font-semibold text-foreground">{preset.tuning_ref} Hz</div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <Timer className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <div className="text-xs text-muted-foreground mb-0.5">Beat</div>
                  <div className="text-sm font-semibold text-foreground">
                    {preset.beat_hz_start}
                    {preset.beat_hz_end && preset.beat_hz_end !== preset.beat_hz_start
                      ? `→${preset.beat_hz_end}`
                      : ''} Hz
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Immersive Visualizer Overlay */}
        <ImmersiveVisualizer
          isOpen={showVisualizer}
          onClose={() => setShowVisualizer(false)}
          beatHz={preset?.beat_hz_start || 7}
          baseFreq={preset?.base_freq_hz || 200}
          intensity={intensity}
          isPlaying={isPlaying}
        />
      </div>
    </>
  );
}
