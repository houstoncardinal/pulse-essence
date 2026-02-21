export type AmbientSoundType =
  | 'rain' | 'ocean' | 'wind' | 'birds' | 'campfire'
  | 'waterfall' | 'crickets' | 'farmhouse' | 'camping'
  | 'thunderstorm' | 'stream' | 'whitenoise';

const SOUND_TYPE_MAP: Record<AmbientSoundType, number> = {
  rain: 0, ocean: 1, wind: 2, birds: 3, campfire: 4,
  waterfall: 5, crickets: 6, farmhouse: 7, camping: 8,
  thunderstorm: 9, stream: 10, whitenoise: 11,
};

export interface AmbientParams {
  type: AmbientSoundType;
  amp: number;
  density: number;
  brightness: number;
}

export class AmbientAudioEngine {
  private context: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private isPlaying = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.context = new AudioContext({ latencyHint: 'playback' });
      await this.context.audioWorklet.addModule('/ambient-worklet.js');

      this.workletNode = new AudioWorkletNode(this.context, 'ambient-engine', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        processorOptions: { sampleRate: this.context.sampleRate },
      });

      this.gainNode = this.context.createGain();
      this.gainNode.gain.value = 0;
      this.workletNode.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ambient engine:', error);
      throw error;
    }
  }

  async start(params: Partial<AmbientParams> = {}) {
    if (!this.isInitialized) await this.initialize();
    if (!this.context || !this.gainNode) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    if (params.type !== undefined) {
      this.setParam('type', SOUND_TYPE_MAP[params.type]);
    }
    if (params.density !== undefined) this.setParam('density', params.density);
    if (params.brightness !== undefined) this.setParam('brightness', params.brightness);

    const targetAmp = params.amp ?? 0.3;
    this.setParam('amp', targetAmp);

    // Fade in
    this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.3);

    this.isPlaying = true;
  }

  async stop() {
    if (!this.context || !this.gainNode) return;

    this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);

    setTimeout(() => {
      if (this.context?.state === 'running') {
        this.context.suspend();
      }
      this.isPlaying = false;
    }, 350);
  }

  updateParams(params: Partial<AmbientParams>) {
    if (!this.workletNode || !this.context) return;

    if (params.type !== undefined) {
      this.setParam('type', SOUND_TYPE_MAP[params.type]);
    }
    if (params.amp !== undefined) this.setParam('amp', params.amp);
    if (params.density !== undefined) this.setParam('density', params.density);
    if (params.brightness !== undefined) this.setParam('brightness', params.brightness);
  }

  private setParam(name: string, value: number) {
    if (!this.workletNode || !this.context) return;
    const param = this.workletNode.parameters.get(name);
    if (param) {
      const t = this.context.currentTime;
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(value, t + 0.1);
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  dispose() {
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
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

let ambientInstance: AmbientAudioEngine | null = null;

export function getAmbientEngine() {
  if (!ambientInstance) {
    ambientInstance = new AmbientAudioEngine();
  }
  return ambientInstance;
}
