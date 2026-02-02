// BinauralEngineWorklet - Phase-locked binaural/monaural/isochronic tone generator
class BinauralEngineWorklet extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'baseFreq', defaultValue: 220, minValue: 20, maxValue: 2000 },
      { name: 'beatHz', defaultValue: 10, minValue: 0.1, maxValue: 120 },
      { name: 'amp', defaultValue: 0.2, minValue: 0, maxValue: 1 },
      { name: 'mode', defaultValue: 0, minValue: 0, maxValue: 2 }, // 0=binaural, 1=monaural, 2=isochronic
      { name: 'tuningRef', defaultValue: 432, minValue: 400, maxValue: 600 },
      { name: 'noiseLevel', defaultValue: 0.0, minValue: 0, maxValue: 1 },
      { name: 'isochronicDepth', defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ];
  }

  constructor(options) {
    super();
    this.sr = options.processorOptions?.sampleRate || sampleRate;
    this.phiL = 0.0;
    this.phiR = 0.0;
    this.phiM = 0.0;
    this.phiBeat = 0.0;
    this.noiseState = 22222;
  }

  // Simple TPDF dither
  dither() {
    return (Math.random() + Math.random() - 1) * 1e-5;
  }

  // Pink noise generator (simple approximation)
  pinkNoise() {
    let white = Math.random() * 2 - 1;
    return white * 0.1; // Simplified pink noise
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outL = output[0];
    const outR = output[1];
    const n = outL.length;

    for (let i = 0; i < n; i++) {
      const fBase = this.getParamValue(parameters.baseFreq, i);
      const beat = this.getParamValue(parameters.beatHz, i);
      const amp = this.getParamValue(parameters.amp, i);
      const mode = Math.floor(this.getParamValue(parameters.mode, i));
      const depth = this.getParamValue(parameters.isochronicDepth, i);
      const noiseLevel = this.getParamValue(parameters.noiseLevel, i);
      const tuningRef = this.getParamValue(parameters.tuningRef, i);

      // Apply tuning reference scaling (432Hz is natural base, 528Hz for transformation)
      const tuningScale = tuningRef / 432.0;
      const fBaseScaled = fBase * tuningScale;

      const fL = fBaseScaled;
      const fR = fBaseScaled + beat;

      let sampleL = 0;
      let sampleR = 0;

      if (mode === 0) {
        // Binaural
        this.phiL += (2 * Math.PI * fL) / this.sr;
        this.phiR += (2 * Math.PI * fR) / this.sr;
        sampleL = Math.sin(this.phiL) * amp;
        sampleR = Math.sin(this.phiR) * amp;
      } else if (mode === 1) {
        // Monaural
        this.phiL += (2 * Math.PI * fBaseScaled) / this.sr;
        this.phiR += (2 * Math.PI * (fBaseScaled + beat)) / this.sr;
        const s = (Math.sin(this.phiL) + Math.sin(this.phiR)) * 0.5 * amp;
        sampleL = s;
        sampleR = s;
      } else {
        // Isochronic
        this.phiBeat += (2 * Math.PI * beat) / this.sr;
        const lfo = (1 - depth) + depth * (0.5 + 0.5 * Math.sin(this.phiBeat));
        this.phiL += (2 * Math.PI * fBaseScaled) / this.sr;
        const s = Math.sin(this.phiL) * amp * lfo;
        sampleL = s;
        sampleR = s;
      }

      // Add pink noise if requested
      if (noiseLevel > 0) {
        const noise = this.pinkNoise() * noiseLevel;
        sampleL += noise;
        sampleR += noise;
      }

      // Apply dither and write
      outL[i] = sampleL + this.dither();
      outR[i] = sampleR + this.dither();

      // Wrap phase to prevent accumulation
      if (this.phiL > Math.PI * 2) this.phiL -= Math.PI * 2;
      if (this.phiR > Math.PI * 2) this.phiR -= Math.PI * 2;
      if (this.phiM > Math.PI * 2) this.phiM -= Math.PI * 2;
      if (this.phiBeat > Math.PI * 2) this.phiBeat -= Math.PI * 2;
    }

    return true;
  }

  getParamValue(param, index) {
    return param.length > 1 ? param[index] : param[0];
  }
}

registerProcessor('binaural-engine', BinauralEngineWorklet);
