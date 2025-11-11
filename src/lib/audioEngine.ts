export interface AudioParams {
  baseFreq: number;
  beatHz: number;
  amp: number;
  mode: 0 | 1 | 2; // 0=binaural, 1=monaural, 2=isochronic
  tuningRef: number;
  noiseLevel: number;
  isochronicDepth: number;
}

export class BinauralAudioEngine {
  private context: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isInitialized = false;
  private isPlaying = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.context = new AudioContext({ latencyHint: 'playback' });
      await this.context.audioWorklet.addModule('/worklet.js');

      this.workletNode = new AudioWorkletNode(this.context, 'binaural-engine', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        processorOptions: { sampleRate: this.context.sampleRate }
      });

      this.workletNode.connect(this.context.destination);
      this.isInitialized = true;
      console.log('Audio engine initialized at', this.context.sampleRate, 'Hz');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  async start() {
    if (!this.isInitialized) await this.initialize();
    if (!this.context || !this.workletNode) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    // Smooth fade in
    const ampParam = this.workletNode.parameters.get('amp');
    if (ampParam) {
      ampParam.setValueAtTime(0, this.context.currentTime);
      ampParam.linearRampToValueAtTime(0.2, this.context.currentTime + 0.05);
    }

    this.isPlaying = true;
  }

  async stop() {
    if (!this.context || !this.workletNode) return;

    // Smooth fade out
    const ampParam = this.workletNode.parameters.get('amp');
    if (ampParam) {
      ampParam.cancelScheduledValues(this.context.currentTime);
      ampParam.setValueAtTime(ampParam.value, this.context.currentTime);
      ampParam.linearRampToValueAtTime(0, this.context.currentTime + 0.05);
    }

    setTimeout(() => {
      if (this.context && this.context.state === 'running') {
        this.context.suspend();
      }
      this.isPlaying = false;
    }, 60);
  }

  updateParams(params: Partial<AudioParams>) {
    if (!this.workletNode || !this.context) return;

    const time = this.context.currentTime;

    Object.entries(params).forEach(([key, value]) => {
      const param = this.workletNode!.parameters.get(key);
      if (param && value !== undefined) {
        param.cancelScheduledValues(time);
        param.setValueAtTime(param.value, time);
        param.linearRampToValueAtTime(value, time + 0.1);
      }
    });
  }

  schedulePreset(
    baseFreq: number,
    beatStart: number,
    beatEnd: number,
    duration: number,
    mode: number
  ) {
    if (!this.workletNode || !this.context) return;

    const time = this.context.currentTime;

    // Set base frequency
    const freqParam = this.workletNode.parameters.get('baseFreq');
    if (freqParam) {
      freqParam.setValueAtTime(baseFreq, time);
    }

    // Set mode
    const modeParam = this.workletNode.parameters.get('mode');
    if (modeParam) {
      modeParam.setValueAtTime(mode, time);
    }

    // Schedule beat frequency ramp
    const beatParam = this.workletNode.parameters.get('beatHz');
    if (beatParam) {
      beatParam.setValueAtTime(beatStart, time);
      if (beatEnd !== beatStart) {
        beatParam.linearRampToValueAtTime(beatEnd, time + duration * 60);
      }
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getSampleRate() {
    return this.context?.sampleRate || 48000;
  }

  dispose() {
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.isInitialized = false;
    this.isPlaying = false;
  }
}

// Singleton instance
let engineInstance: BinauralAudioEngine | null = null;

export function getAudioEngine() {
  if (!engineInstance) {
    engineInstance = new BinauralAudioEngine();
  }
  return engineInstance;
}
