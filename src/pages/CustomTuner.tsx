import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAudioEngine } from '@/lib/audioEngine';
import cardinalLogo from '@/assets/cardinal-logo.png';
import { Play, Pause, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomTuner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreq] = useState(220);
  const [beatFreq, setBeatFreq] = useState(10);
  const [tuningRef, setTuningRef] = useState(432);
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
    if (freq < 0.5) return { name: 'Epsilon', color: 'text-violet-600', desc: 'Transcendental states & unity' };
    if (freq < 4) return { name: 'Delta', color: 'text-purple-600', desc: 'Deep sleep, healing & HGH release' };
    if (freq < 8) return { name: 'Theta', color: 'text-blue-600', desc: 'Meditation, creativity & REM' };
    if (freq < 12) return { name: 'Alpha', color: 'text-emerald-600', desc: 'Relaxed focus & learning' };
    if (freq < 15) return { name: 'SMR', color: 'text-teal-600', desc: 'Calm focus & motor control' };
    if (freq < 30) return { name: 'Beta', color: 'text-amber-600', desc: 'Active thinking & alertness' };
    if (freq < 42) return { name: 'Gamma', color: 'text-rose-600', desc: 'Peak cognition & memory' };
    if (freq < 70) return { name: 'High Gamma', color: 'text-red-600', desc: 'Hyper-learning & insight' };
    return { name: 'Hyper-Gamma', color: 'text-fuchsia-600', desc: 'Advanced consciousness states' };
  };

  const waveInfo = getBrainwaveInfo(beatFreq);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={cardinalLogo} 
              alt="Cardinal Binaural" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-soft"
            />
            <div>
              <h1 className="text-sm sm:text-lg font-bold">Custom Frequency Tuner</h1>
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
                  min={40}
                  max={1500}
                  step={1}
                  className="w-full"
                />
                {/* Solfeggio Quick Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { freq: 174, label: 'Pain Relief' },
                    { freq: 285, label: 'Tissue Healing' },
                    { freq: 396, label: 'Liberation' },
                    { freq: 417, label: 'Change' },
                    { freq: 432, label: 'Universal' },
                    { freq: 528, label: 'DNA Repair' },
                    { freq: 639, label: 'Connection' },
                    { freq: 741, label: 'Awakening' },
                    { freq: 852, label: 'Intuition' },
                    { freq: 963, label: 'Divine' },
                    { freq: 1000, label: '1kHz' },
                    { freq: 1500, label: 'Max' },
                  ].map(({ freq, label }) => (
                    <Button
                      key={freq}
                      variant={baseFreq === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBaseFreq(freq)}
                      className="h-7 px-2 text-[10px]"
                    >
                      {freq}Hz
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Professional range: 40-1500 Hz • Solfeggio frequencies for healing & transformation
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
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                {/* Brainwave Quick Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { freq: 0.5, label: 'Epsilon', color: 'bg-violet-500' },
                    { freq: 2, label: 'Delta', color: 'bg-purple-500' },
                    { freq: 6, label: 'Theta', color: 'bg-blue-500' },
                    { freq: 7.83, label: 'Schumann', color: 'bg-emerald-500' },
                    { freq: 10, label: 'Alpha', color: 'bg-green-500' },
                    { freq: 14, label: 'SMR', color: 'bg-yellow-500' },
                    { freq: 20, label: 'Beta', color: 'bg-orange-500' },
                    { freq: 40, label: 'Gamma', color: 'bg-rose-500' },
                    { freq: 100, label: 'HyperG', color: 'bg-red-500' },
                  ].map(({ freq, label, color }) => (
                    <Button
                      key={freq}
                      variant={Math.abs(beatFreq - freq) < 0.5 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBeatFreq(freq)}
                      className="h-7 px-2 text-[10px]"
                    >
                      {freq}Hz {label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {waveInfo.desc} • Full spectrum: 0.5-100 Hz (Epsilon to Hyper-Gamma)
                </p>
              </div>

              {/* Tuning Reference */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Manifestation Frequency</Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant={tuningRef === 432 ? "default" : "outline"}
                    onClick={() => setTuningRef(432)}
                    className="w-full flex flex-col h-auto py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold">432 Hz</span>
                    <span className="text-[10px] sm:text-xs opacity-70">Universal Harmony</span>
                  </Button>
                  <Button
                    variant={tuningRef === 528 ? "default" : "outline"}
                    onClick={() => setTuningRef(528)}
                    className="w-full flex flex-col h-auto py-2 sm:py-3"
                  >
                    <span className="text-xs sm:text-sm font-semibold">528 Hz</span>
                    <span className="text-[10px] sm:text-xs opacity-70">DNA Transformation</span>
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
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Complete Brainwave Spectrum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-violet-500/10">
              <span className="font-mono text-violet-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">0.1-0.5 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Epsilon</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Transcendental, unity consciousness</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-purple-500/10">
              <span className="font-mono text-purple-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">0.5-4 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Delta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Deep sleep, HGH release, healing</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-blue-500/10">
              <span className="font-mono text-blue-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">4-8 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Theta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Meditation, creativity, REM dreams</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-emerald-500/10">
              <span className="font-mono text-emerald-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">8-12 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Alpha</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Relaxed focus, learning, flow</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-teal-500/10">
              <span className="font-mono text-teal-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">12-15 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">SMR</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Calm focus, motor control</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-amber-500/10">
              <span className="font-mono text-amber-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">15-30 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Beta</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Active thinking, alertness</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-rose-500/10">
              <span className="font-mono text-rose-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">30-42 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Gamma</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Peak cognition, 40Hz memory</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-fuchsia-500/10">
              <span className="font-mono text-fuchsia-600 font-semibold w-16 sm:w-20 text-[10px] sm:text-xs flex-shrink-0">42-100 Hz</span>
              <div>
                <p className="font-medium text-xs sm:text-sm">Hyper-Gamma</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">Advanced states, insight</p>
              </div>
            </div>
          </div>
          
          {/* Solfeggio Reference */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-2">Solfeggio Carrier Frequencies</h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[10px]">
              {[
                { hz: 174, name: 'Pain Relief' },
                { hz: 285, name: 'Tissue' },
                { hz: 396, name: 'Liberation' },
                { hz: 417, name: 'Change' },
                { hz: 432, name: 'Universal' },
                { hz: 528, name: 'DNA Repair' },
                { hz: 639, name: 'Connection' },
                { hz: 741, name: 'Awakening' },
                { hz: 852, name: 'Intuition' },
                { hz: 963, name: 'Divine' },
              ].map(f => (
                <div key={f.hz} className="text-center p-1.5 rounded bg-primary/5">
                  <div className="font-mono font-bold text-primary">{f.hz}</div>
                  <div className="text-muted-foreground">{f.name}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CustomTuner;
