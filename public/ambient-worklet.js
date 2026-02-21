/**
 * Procedural Ambient Sound Worklet
 * Generates rain, ocean, wind, birds, campfire, waterfall, crickets, farm sounds
 * using mathematical synthesis - no samples needed.
 */
class AmbientEngineWorklet extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'type', defaultValue: 0, minValue: 0, maxValue: 11 },
      { name: 'amp', defaultValue: 0.3, minValue: 0, maxValue: 1 },
      { name: 'density', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'brightness', defaultValue: 0.5, minValue: 0, maxValue: 1 },
    ];
  }

  constructor(options) {
    super();
    this.sr = options.processorOptions?.sampleRate || 48000;
    this.phase = 0;
    this.t = 0;
    // Noise state
    this.b0 = 0; this.b1 = 0; this.b2 = 0; this.b3 = 0; this.b4 = 0; this.b5 = 0; this.b6 = 0;
    // Rain droplet state
    this.droplets = [];
    this.nextDrop = 0;
    // Bird chirp state
    this.chirps = [];
    this.nextChirp = 0;
    // Campfire state
    this.crackles = [];
    this.nextCrackle = 0;
    // Cricket state
    this.cricketPhases = [0, 0, 0, 0, 0];
    this.cricketRates = [3800, 4100, 3600, 4300, 3900];
    this.cricketTimings = [0.12, 0.15, 0.1, 0.13, 0.11];
    // Thunder
    this.thunderEnv = 0;
    this.thunderTimer = 0;
    // LFO phases
    this.lfo1 = 0;
    this.lfo2 = 0;
    this.lfo3 = 0;
    this.rng = 12345;
  }

  rand() {
    this.rng ^= this.rng << 13;
    this.rng ^= this.rng >> 17;
    this.rng ^= this.rng << 5;
    return (this.rng & 0x7fffffff) / 0x7fffffff;
  }

  white() {
    return this.rand() * 2 - 1;
  }

  pink() {
    const w = this.white();
    this.b0 = 0.99886 * this.b0 + w * 0.0555179;
    this.b1 = 0.99332 * this.b1 + w * 0.0750759;
    this.b2 = 0.96900 * this.b2 + w * 0.1538520;
    this.b3 = 0.86650 * this.b3 + w * 0.3104856;
    this.b4 = 0.55000 * this.b4 + w * 0.5329522;
    this.b5 = -0.7616 * this.b5 - w * 0.0168980;
    const out = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + w * 0.5362;
    this.b6 = w * 0.115926;
    return out * 0.11;
  }

  brown() {
    const w = this.white();
    this.b0 = (this.b0 + (0.02 * w)) / 1.02;
    return this.b0 * 3.5;
  }

  // Sound type 0: Rain
  genRain(density, brightness) {
    // Filtered noise base
    let out = this.pink() * 0.4;
    
    // Add random droplet impulses
    this.nextDrop -= 1;
    if (this.nextDrop <= 0) {
      const freq = 800 + this.rand() * 3000 * brightness;
      const decay = 0.002 + this.rand() * 0.01;
      this.droplets.push({ phase: 0, freq, decay, amp: 0.1 + this.rand() * 0.3 * density });
      this.nextDrop = Math.floor((1 - density * 0.9) * 200 + this.rand() * 100);
    }
    
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const d = this.droplets[i];
      d.phase += d.freq / this.sr;
      d.amp *= (1 - d.decay);
      out += Math.sin(d.phase * 6.2832) * d.amp * 0.15;
      if (d.amp < 0.001) this.droplets.splice(i, 1);
    }
    
    // Keep max 80 droplets
    if (this.droplets.length > 80) this.droplets.splice(0, this.droplets.length - 80);
    
    return out;
  }

  // Sound type 1: Ocean waves
  genOcean(density, brightness) {
    this.lfo1 += 0.08 / this.sr; // ~0.08 Hz wave cycle
    this.lfo2 += 0.13 / this.sr;
    this.lfo3 += 0.05 / this.sr;
    
    const wave1 = (Math.sin(this.lfo1 * 6.2832) + 1) * 0.5;
    const wave2 = (Math.sin(this.lfo2 * 6.2832) + 1) * 0.5;
    const wave3 = (Math.sin(this.lfo3 * 6.2832) + 1) * 0.5;
    
    const envelope = wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2;
    
    // Mix of pink and brown noise shaped by wave envelope
    const noise = this.pink() * 0.5 * brightness + this.brown() * 0.5;
    
    // Crashing sound at wave peaks
    const crash = envelope > 0.7 ? this.white() * (envelope - 0.7) * 3 * brightness * 0.3 : 0;
    
    return (noise * (0.2 + envelope * 0.8 * density) + crash) * 0.6;
  }

  // Sound type 2: Wind
  genWind(density, brightness) {
    this.lfo1 += (0.15 + density * 0.2) / this.sr;
    this.lfo2 += 0.07 / this.sr;
    
    const mod = (Math.sin(this.lfo1 * 6.2832) + 1) * 0.5;
    const mod2 = (Math.sin(this.lfo2 * 6.2832) + 1) * 0.5;
    
    const noise = this.pink() * (0.3 + mod * 0.7 * density);
    
    // Gusty whoosh
    const gust = this.brown() * mod2 * mod * density * 0.4;
    
    // Whistling
    const whistle = Math.sin(this.phase * 6.2832) * mod * brightness * 0.05;
    this.phase += (600 + mod2 * 400 * brightness) / this.sr;
    
    return (noise + gust + whistle) * 0.5;
  }

  // Sound type 3: Birds chirping
  genBirds(density, brightness) {
    let out = 0;
    
    this.nextChirp -= 1;
    if (this.nextChirp <= 0) {
      const baseFreq = 1800 + this.rand() * 3000 * brightness;
      const chirpLen = Math.floor(0.05 * this.sr + this.rand() * 0.15 * this.sr);
      const sweepDir = this.rand() > 0.5 ? 1 : -1;
      const sweepAmt = 200 + this.rand() * 800;
      this.chirps.push({
        phase: 0, freq: baseFreq, len: chirpLen, pos: 0,
        sweepDir, sweepAmt, amp: 0.05 + this.rand() * 0.1,
        pan: this.rand() * 2 - 1
      });
      this.nextChirp = Math.floor((1 - density * 0.8) * this.sr * 0.8 + this.rand() * this.sr * 0.5);
    }
    
    for (let i = this.chirps.length - 1; i >= 0; i--) {
      const c = this.chirps[i];
      const progress = c.pos / c.len;
      const env = Math.sin(progress * 3.14159);
      const freq = c.freq + c.sweepDir * c.sweepAmt * progress;
      c.phase += freq / this.sr;
      out += Math.sin(c.phase * 6.2832) * env * c.amp;
      // Add harmonic
      out += Math.sin(c.phase * 6.2832 * 2) * env * c.amp * 0.3;
      c.pos++;
      if (c.pos >= c.len) this.chirps.splice(i, 1);
    }
    
    if (this.chirps.length > 20) this.chirps.splice(0, this.chirps.length - 20);
    
    return out * 0.6;
  }

  // Sound type 4: Campfire
  genCampfire(density, brightness) {
    // Base warm rumble
    let out = this.brown() * 0.3;
    
    // Add crackling
    this.nextCrackle -= 1;
    if (this.nextCrackle <= 0) {
      const freq = 500 + this.rand() * 4000 * brightness;
      const decay = 0.01 + this.rand() * 0.03;
      this.crackles.push({ phase: 0, freq, decay, amp: 0.1 + this.rand() * 0.4 * density });
      this.nextCrackle = Math.floor((1 - density * 0.8) * 400 + this.rand() * 300);
    }
    
    for (let i = this.crackles.length - 1; i >= 0; i--) {
      const c = this.crackles[i];
      c.phase += c.freq / this.sr;
      c.amp *= (1 - c.decay);
      // Noise burst with resonance
      out += (this.white() * 0.5 + Math.sin(c.phase * 6.2832) * 0.5) * c.amp * 0.2;
      if (c.amp < 0.001) this.crackles.splice(i, 1);
    }
    
    if (this.crackles.length > 50) this.crackles.splice(0, this.crackles.length - 50);
    
    // Warm low hum
    this.phase += 80 / this.sr;
    out += Math.sin(this.phase * 6.2832) * 0.02;
    
    return out * 0.5;
  }

  // Sound type 5: Waterfall
  genWaterfall(density, brightness) {
    // Dense broadband noise
    const pink = this.pink() * 0.6;
    const white = this.white() * 0.15 * brightness;
    const brown = this.brown() * 0.3;
    
    // Slow modulation for natural variation
    this.lfo1 += 0.03 / this.sr;
    const mod = (Math.sin(this.lfo1 * 6.2832) + 1) * 0.5;
    
    return (pink + white + brown) * (0.6 + mod * 0.4 * density) * 0.5;
  }

  // Sound type 6: Night crickets
  genCrickets(density, brightness) {
    let out = 0;
    
    for (let i = 0; i < 5; i++) {
      // Each cricket chirps at its own rhythm
      const rate = this.cricketTimings[i] * (1 + (1 - density) * 2);
      const cyclePos = (this.t % (rate * this.sr)) / (rate * this.sr);
      const chirpOn = cyclePos < 0.4 + density * 0.3;
      
      if (chirpOn) {
        this.cricketPhases[i] += this.cricketRates[i] * brightness / this.sr;
        const env = Math.sin(cyclePos / (0.4 + density * 0.3) * 3.14159);
        out += Math.sin(this.cricketPhases[i] * 6.2832) * env * 0.04;
      }
    }
    
    // Gentle background noise
    out += this.pink() * 0.05;
    
    return out * 0.6;
  }

  // Sound type 7: Farm house (wind + distant animals + rustic)
  genFarmhouse(density, brightness) {
    // Gentle wind base
    this.lfo1 += 0.1 / this.sr;
    const windMod = (Math.sin(this.lfo1 * 6.2832) + 1) * 0.5;
    let out = this.pink() * windMod * 0.2;
    
    // Distant rooster/animal sounds (occasional FM chirps)
    this.nextChirp -= 1;
    if (this.nextChirp <= 0) {
      const freq = 400 + this.rand() * 600;
      const len = Math.floor(0.3 * this.sr + this.rand() * 0.5 * this.sr);
      this.chirps.push({
        phase: 0, freq, len, pos: 0,
        sweepDir: 1, sweepAmt: 100 + this.rand() * 200,
        amp: 0.02 + this.rand() * 0.04 * density,
        pan: 0
      });
      this.nextChirp = Math.floor(this.sr * 2 + this.rand() * this.sr * 5 * (1 - density * 0.5));
    }
    
    for (let i = this.chirps.length - 1; i >= 0; i--) {
      const c = this.chirps[i];
      const progress = c.pos / c.len;
      const env = Math.sin(progress * 3.14159);
      c.phase += (c.freq + Math.sin(progress * 20) * c.sweepAmt) / this.sr;
      out += Math.sin(c.phase * 6.2832) * env * c.amp;
      c.pos++;
      if (c.pos >= c.len) this.chirps.splice(i, 1);
    }
    
    // Creaking wood sound
    this.lfo2 += 0.02 / this.sr;
    const creak = Math.sin(this.lfo2 * 6.2832 * 80) * Math.max(0, Math.sin(this.lfo2 * 6.2832) - 0.9) * 0.1 * brightness;
    out += creak;
    
    return out * 0.5;
  }

  // Sound type 8: Night camping
  genCamping(density, brightness) {
    // Combine crickets + campfire + gentle wind
    const crickets = this.genCrickets(density * 0.7, brightness);
    
    // Campfire crackle (simplified)
    let fire = this.brown() * 0.15;
    this.nextCrackle -= 1;
    if (this.nextCrackle <= 0) {
      this.crackles.push({
        phase: 0,
        freq: 800 + this.rand() * 2000,
        decay: 0.02 + this.rand() * 0.03,
        amp: 0.05 + this.rand() * 0.15 * density
      });
      this.nextCrackle = Math.floor(300 + this.rand() * 500);
    }
    
    for (let i = this.crackles.length - 1; i >= 0; i--) {
      const c = this.crackles[i];
      c.phase += c.freq / this.sr;
      c.amp *= (1 - c.decay);
      fire += this.white() * c.amp * 0.1;
      if (c.amp < 0.001) this.crackles.splice(i, 1);
    }
    
    // Gentle wind
    this.lfo3 += 0.05 / this.sr;
    const wind = this.pink() * (Math.sin(this.lfo3 * 6.2832) + 1) * 0.1;
    
    return (crickets + fire + wind) * 0.5;
  }

  // Sound type 9: Thunderstorm  
  genThunderstorm(density, brightness) {
    // Heavy rain base
    let out = this.genRain(Math.min(density + 0.3, 1), brightness);
    
    // Thunder
    this.thunderTimer -= 1;
    if (this.thunderTimer <= 0) {
      this.thunderEnv = 0.5 + this.rand() * 0.5;
      this.thunderTimer = Math.floor(this.sr * (3 + this.rand() * 10 * (1 - density * 0.5)));
    }
    
    if (this.thunderEnv > 0.001) {
      out += this.brown() * this.thunderEnv * 0.6;
      out += this.white() * this.thunderEnv * 0.1;
      this.thunderEnv *= 0.99995;
    }
    
    // Wind gusts
    this.lfo1 += 0.12 / this.sr;
    out += this.pink() * (Math.sin(this.lfo1 * 6.2832) + 1) * 0.15 * density;
    
    return out * 0.5;
  }

  // Sound type 10: Stream/Brook
  genStream(density, brightness) {
    // Bubbling water
    this.lfo1 += 0.3 / this.sr;
    this.lfo2 += 0.47 / this.sr;
    
    const bubble1 = (Math.sin(this.lfo1 * 6.2832) + 1) * 0.5;
    const bubble2 = (Math.sin(this.lfo2 * 6.2832) + 1) * 0.5;
    
    let out = this.pink() * 0.3 * (0.5 + bubble1 * 0.5);
    
    // Water trickle
    this.phase += (200 + bubble2 * 300 * brightness) / this.sr;
    out += Math.sin(this.phase * 6.2832) * bubble1 * bubble2 * 0.03;
    
    // Random splashes
    this.nextDrop -= 1;
    if (this.nextDrop <= 0) {
      this.droplets.push({
        phase: 0,
        freq: 1000 + this.rand() * 4000 * brightness,
        decay: 0.005 + this.rand() * 0.015,
        amp: 0.03 + this.rand() * 0.08 * density
      });
      this.nextDrop = Math.floor(100 + this.rand() * 400 * (1 - density * 0.7));
    }
    
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const d = this.droplets[i];
      d.phase += d.freq / this.sr;
      d.amp *= (1 - d.decay);
      out += Math.sin(d.phase * 6.2832) * d.amp * 0.15;
      if (d.amp < 0.001) this.droplets.splice(i, 1);
    }
    
    if (this.droplets.length > 40) this.droplets.splice(0, this.droplets.length - 40);
    
    return out * 0.5;
  }

  // Sound type 11: White Noise (clean)
  genWhiteNoise(density, brightness) {
    // Mix of white and pink based on brightness
    return (this.white() * brightness + this.pink() * (1 - brightness)) * 0.3;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const left = output[0];
    const right = output[1] || left;
    const len = left.length;

    for (let i = 0; i < len; i++) {
      const type = Math.round(this.getVal(parameters.type, i));
      const amp = this.getVal(parameters.amp, i);
      const density = this.getVal(parameters.density, i);
      const brightness = this.getVal(parameters.brightness, i);

      let sample = 0;

      switch (type) {
        case 0: sample = this.genRain(density, brightness); break;
        case 1: sample = this.genOcean(density, brightness); break;
        case 2: sample = this.genWind(density, brightness); break;
        case 3: sample = this.genBirds(density, brightness); break;
        case 4: sample = this.genCampfire(density, brightness); break;
        case 5: sample = this.genWaterfall(density, brightness); break;
        case 6: sample = this.genCrickets(density, brightness); break;
        case 7: sample = this.genFarmhouse(density, brightness); break;
        case 8: sample = this.genCamping(density, brightness); break;
        case 9: sample = this.genThunderstorm(density, brightness); break;
        case 10: sample = this.genStream(density, brightness); break;
        case 11: sample = this.genWhiteNoise(density, brightness); break;
        default: sample = 0;
      }

      const out = sample * amp;
      left[i] = out;
      right[i] = out;
      this.t++;
    }

    return true;
  }

  getVal(param, index) {
    return param.length > 1 ? param[index] : param[0];
  }
}

registerProcessor('ambient-engine', AmbientEngineWorklet);
