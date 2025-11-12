import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAudioEngine } from '@/lib/audioEngine';
import { Waves, Play, Pause, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomTuner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreq] = useState(220);
  const [beatFreq, setBeatFreq] = useState(10);
  const [tuningRef, setTuningRef] = useState(440);
  const [mode, setMode] = useState<'binaural' | 'monaural' | 'isochronic'>('binaural');
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isochronicDepth, setIsochronicDepth] = useState(0.5);

  const engine = getAudioEngine();

  useEffect(() => {
    return () => {
      if (isPlaying) {
        engine.stop();
      }
    };
  }, []);

  const handlePlay = async () => {
    try {
      if (!isPlaying) {
        await engine.initialize();
        
        const modeMap: Record<string, 0 | 1 | 2> = { binaural: 0, monaural: 1, isochronic: 2 };
        engine.updateParams({
          baseFreq,
          beatHz: beatFreq,
          amp: 0.2,
          mode: modeMap[mode],
          tuningRef,
          noiseLevel,
          isochronicDepth,
        });

        await engine.start();
        setIsPlaying(true);
        
        toast({
          title: "Session Started",
          description: `Playing ${mode} at ${baseFreq}Hz base frequency`,
        });
      } else {
        await engine.stop();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Error",
        description: "Failed to start audio playback",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const modeMap: Record<string, 0 | 1 | 2> = { binaural: 0, monaural: 1, isochronic: 2 };
      engine.updateParams({
        baseFreq,
        beatHz: beatFreq,
        mode: modeMap[mode],
        tuningRef,
        noiseLevel,
        isochronicDepth,
      });
    }
  }, [baseFreq, beatFreq, mode, tuningRef, noiseLevel, isochronicDepth]);

  const getBrainwaveInfo = (freq: number) => {
    if (freq < 4) return { name: 'Delta', color: 'text-purple-600', desc: 'Deep sleep & healing' };
    if (freq < 8) return { name: 'Theta', color: 'text-blue-600', desc: 'Meditation & creativity' };
    if (freq < 14) return { name: 'Alpha', color: 'text-emerald-600', desc: 'Relaxation & focus' };
    if (freq < 30) return { name: 'Beta', color: 'text-amber-600', desc: 'Alert & active' };
    return { name: 'Gamma', color: 'text-rose-600', desc: 'Peak performance' };
  };

  const waveInfo = getBrainwaveInfo(beatFreq);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary">
              <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold">Custom Frequency Tuner</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Precision neural entrainment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="text-foreground font-medium mb-1">Professional-Grade Audio Synthesis</p>
              <p className="text-muted-foreground">
                This tool generates phase-accurate binaural beats, monaural beats, or isochronic tones at your exact specifications. 
                Adjust the base carrier frequency, beat frequency (brainwave target), and tuning reference for precise neural entrainment.
              </p>
            </div>
          </div>

          <Tabs defaultValue="basic" className="mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Controls</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
              {/* Mode Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Entrainment Mode</Label>
                <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binaural">Binaural (Requires Headphones)</SelectItem>
                    <SelectItem value="monaural">Monaural (Any Speaker)</SelectItem>
                    <SelectItem value="isochronic">Isochronic (Pulsed Tone)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {mode === 'binaural' && 'Different frequencies in each ear create the beat perception in your brain'}
                  {mode === 'monaural' && 'Both frequencies mixed together, works without headphones'}
                  {mode === 'isochronic' && 'Single pulsing tone at the target frequency'}
                </p>
              </div>

              {/* Base Frequency */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Base Carrier Frequency</Label>
                  <span className="text-sm font-mono text-primary">{baseFreq} Hz</span>
                </div>
                <Slider
                  value={[baseFreq]}
                  onValueChange={([v]) => setBaseFreq(v)}
                  min={100}
                  max={500}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  The underlying tone that carries the binaural beat (typically 100-500 Hz)
                </p>
              </div>

              {/* Beat Frequency */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Beat Frequency (Brainwave Target)</Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${waveInfo.color}`}>{waveInfo.name}</span>
                    <span className="text-sm font-mono text-primary">{beatFreq.toFixed(1)} Hz</span>
                  </div>
                </div>
                <Slider
                  value={[beatFreq]}
                  onValueChange={([v]) => setBeatFreq(v)}
                  min={0.5}
                  max={40}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {waveInfo.desc} • The target brainwave frequency for entrainment
                </p>
              </div>

              {/* Tuning Reference */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tuning Reference</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <Button
                    variant={tuningRef === 440 ? "default" : "outline"}
                    onClick={() => setTuningRef(440)}
                    className="w-full flex flex-col h-auto py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold">440 Hz</span>
                    <span className="text-[10px] sm:text-xs opacity-70">Standard</span>
                  </Button>
                  <Button
                    variant={tuningRef === 432 ? "default" : "outline"}
                    onClick={() => setTuningRef(432)}
                    className="w-full flex flex-col h-auto py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold">432 Hz</span>
                    <span className="text-[10px] sm:text-xs opacity-70">Universal</span>
                  </Button>
                  <Button
                    variant={tuningRef === 528 ? "default" : "outline"}
                    onClick={() => setTuningRef(528)}
                    className="w-full flex flex-col h-auto py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold">528 Hz</span>
                    <span className="text-[10px] sm:text-xs opacity-70">Solfeggio</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
              {/* Noise Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Background Noise</Label>
                  <span className="text-sm font-mono text-primary">{(noiseLevel * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[noiseLevel]}
                  onValueChange={([v]) => setNoiseLevel(v)}
                  min={0}
                  max={0.5}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Pink noise can help mask external sounds and enhance focus
                </p>
              </div>

              {/* Isochronic Depth (only for isochronic mode) */}
              {mode === 'isochronic' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Pulse Depth</Label>
                    <span className="text-sm font-mono text-primary">{(isochronicDepth * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[isochronicDepth]}
                    onValueChange={([v]) => setIsochronicDepth(v)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the intensity of the pulsing effect
                  </p>
                </div>
              )}

              {/* Technical Info */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-xs">
                <p className="font-medium text-foreground">Technical Specifications</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>Left Ear: {mode === 'binaural' ? `${baseFreq} Hz` : 'Mixed'}</div>
                  <div>Right Ear: {mode === 'binaural' ? `${(baseFreq + beatFreq).toFixed(1)} Hz` : 'Mixed'}</div>
                  <div>Sample Rate: {engine.getSampleRate()} Hz</div>
                  <div>Bit Depth: 32-bit Float</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Play/Pause Button */}
          <Button 
            onClick={handlePlay}
            size="lg"
            className="w-full h-12 sm:h-14 text-sm sm:text-base"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Custom Session
              </>
            )}
          </Button>
        </Card>

        {/* Brainwave Reference Guide */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Brainwave Frequency Reference</h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-mono text-purple-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">0.5-4 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Delta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Deep sleep, healing, regeneration</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-mono text-blue-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">4-8 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Theta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Meditation, creativity, deep relaxation</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-mono text-emerald-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">8-14 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Alpha</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Relaxed focus, learning, meditation</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-mono text-amber-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">14-30 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Beta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Active thinking, focus, problem-solving</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-mono text-rose-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">30-100 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Gamma</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Peak concentration, cognitive enhancement</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CustomTuner;
