import { useState, useCallback, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume2, Waves, Sparkles } from 'lucide-react';
import { type AmbientSoundType, getAmbientEngine } from '@/lib/ambientEngine';
import { AmbientSoundCard, AMBIENT_SOUNDS } from '@/components/AmbientSoundCard';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function AmbientSoundSection() {
  const { toast } = useToast();
  const [activeSound, setActiveSound] = useState<AmbientSoundType | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [density, setDensity] = useState(0.5);
  const [engine] = useState(() => getAmbientEngine());

  useEffect(() => {
    return () => {
      if (engine.getIsPlaying()) {
        engine.stop();
      }
    };
  }, [engine]);

  const handlePlay = useCallback(async (type: AmbientSoundType) => {
    try {
      if (engine.getIsPlaying()) {
        await engine.stop();
        // Brief pause for fade out
        await new Promise(r => setTimeout(r, 350));
      }
      await engine.start({ type, amp: volume, density, brightness: 0.5 });
      setActiveSound(type);
      const sound = AMBIENT_SOUNDS.find(s => s.id === type);
      toast({
        title: `${sound?.icon} ${sound?.name}`,
        description: 'Playing ambient soundscape. Use headphones for best experience.',
      });
    } catch {
      toast({ title: 'Audio Error', description: 'Could not start audio. Try tapping the page first.', variant: 'destructive' });
    }
  }, [engine, volume, density, toast]);

  const handleStop = useCallback(async () => {
    await engine.stop();
    setActiveSound(null);
  }, [engine]);

  const handleVolumeChange = useCallback((val: number[]) => {
    setVolume(val[0]);
    engine.updateParams({ amp: val[0] });
  }, [engine]);

  const handleDensityChange = useCallback((val: number[]) => {
    setDensity(val[0]);
    engine.updateParams({ density: val[0] });
  }, [engine]);

  return (
    <section id="soundbath" className="py-8 sm:py-12 md:py-16 scroll-mt-20">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3 sm:mb-4">
          <Waves className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] sm:text-xs font-medium text-accent">Procedural Audio Synthesis</span>
          <Sparkles className="w-3 h-3 text-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
          Ambient Sound Bath
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Immersive nature soundscapes generated in real-time. Play standalone or layer with binaural beats for deeper sessions.
        </p>
      </div>

      {/* Mixer Controls (show when playing) */}
      {activeSound && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="max-w-md mx-auto mb-6 sm:mb-8 px-4"
        >
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-primary/20 shadow-float space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground w-16">Volume</span>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                min={0.05}
                max={0.8}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground w-16">Density</span>
              <Slider
                value={[density]}
                onValueChange={handleDensityChange}
                min={0.1}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(density * 100)}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sound Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {AMBIENT_SOUNDS.map((sound, index) => (
          <div key={sound.id} style={{ animationDelay: `${index * 0.05}s` }}>
            <AmbientSoundCard
              sound={sound}
              activeSound={activeSound}
              onPlay={handlePlay}
              onStop={handleStop}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
