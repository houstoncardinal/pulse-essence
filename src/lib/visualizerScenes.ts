// Visualizer scene definitions for immersive full-screen experiences

export interface VisualizerScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'abstract' | 'nature' | 'cosmic';
  fragmentShader: string;
}

// Common GLSL utilities shared across shaders — now includes u_mouse for interactivity
const GLSL_COMMON = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_beatHz;
uniform float u_intensity;
uniform float u_baseFreq;
uniform vec2 u_mouse; // normalised 0-1
uniform float u_transition; // 0-1 fade-in for scene transitions
#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash3(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

float fbm3(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

// Signed distance functions for 3D-like effects
float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }

mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
`;

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const COMMON_VERTEX_SHADER = VERTEX_SHADER;

export const VISUALIZER_SCENES: VisualizerScene[] = [
  // ──────────────── ABSTRACT ────────────────
  {
    id: 'tunnel',
    name: 'Hypnotic Tunnel',
    description: 'Infinite fractal tunnel that pulses with your beat frequency',
    icon: '🌀',
    category: 'abstract',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.5) * 0.5 + 0.5;
  
  // Mouse influence — shifts tunnel center
  vec2 center = (u_mouse - 0.5) * 0.3;
  uv -= center;
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Deep tunnel warp with multiple layers
  float tunnel = 0.4 / (radius + 0.01);
  float tx = tunnel + u_time * 0.4;
  float ty = angle / PI;
  
  // Multi-octave fractal rings
  float pattern = sin(tx * 10.0 + beat * TAU) * 0.5 + 0.5;
  pattern *= sin(ty * 16.0 + u_time * 0.7) * 0.5 + 0.5;
  pattern += fbm3(vec2(tx * 2.0, ty * 5.0) + u_time * 0.08) * 0.5;
  
  // Secondary layer
  float p2 = sin(tx * 5.0 - u_time * 1.2) * cos(ty * 8.0 + u_time * 0.3);
  pattern += p2 * 0.2;
  
  // Beat-reactive pulse rings with depth
  float pulse = sin(tunnel * 25.0 - u_time * u_beatHz * 1.5) * 0.5 + 0.5;
  pulse = pow(pulse, 4.0) * beat;
  
  // Kaleidoscopic symmetry
  float kAngle = mod(angle + PI, PI / 3.0) - PI / 6.0;
  float kPattern = sin(kAngle * 20.0 + tunnel * 5.0 - u_time) * 0.5 + 0.5;
  
  vec3 col = palette(pattern + u_time * 0.04,
    vec3(0.5), vec3(0.5), vec3(1.0, 0.7, 0.4),
    vec3(0.44, 0.52, 0.78));
  
  col += pulse * vec3(0.3, 0.9, 0.7) * u_intensity;
  col += kPattern * vec3(0.1, 0.2, 0.4) * 0.2;
  col *= smoothstep(0.005, 0.2, radius);
  col *= 1.0 - smoothstep(0.5, 2.5, radius) * 0.4;
  
  // Volumetric light rays from center
  float rays = pow(max(0.0, 1.0 - radius * 2.0), 3.0) * beat * 0.4;
  col += rays * vec3(0.8, 0.6, 1.0);
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'fractal-trip',
    name: 'Fractal Journey',
    description: 'Deep dive into infinite Mandelbrot-inspired geometry',
    icon: '✨',
    category: 'abstract',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.5) * 0.5 + 0.5;
  
  // Mouse steers the fractal exploration
  vec2 mouseOffset = (u_mouse - 0.5) * 0.5;
  
  // Slow zoom deep into fractal
  float zoom = 2.5 + sin(u_time * 0.04) * 1.8;
  vec2 c = uv * zoom + vec2(sin(u_time * 0.025) * 0.6 - 0.5, cos(u_time * 0.03) * 0.4) + mouseOffset;
  vec2 z = vec2(0.0);
  
  float iter = 0.0;
  float escape = 0.0;
  for (int i = 0; i < 128; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    float d2 = dot(z, z);
    if (d2 > 256.0) { escape = d2; break; }
    iter += 1.0;
  }
  
  // Smooth iteration count
  float t = iter - log2(log2(max(escape, 1.0))) + 4.0;
  t = t / 128.0;
  t = sqrt(t);
  
  // Multi-palette coloring with beat modulation
  vec3 col1 = palette(t + u_time * 0.02 + beat * 0.15,
    vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 1.0),
    vec3(0.0 + beat * 0.1, 0.33, 0.67));
  
  vec3 col2 = palette(t * 2.0 + u_time * 0.03,
    vec3(0.5), vec3(0.5), vec3(1.0, 0.7, 0.4),
    vec3(0.8, 0.2, 0.5));
  
  vec3 col = mix(col1, col2, sin(u_time * 0.1) * 0.5 + 0.5);
  
  // Edge glow — fractal boundary detection
  float edge = 1.0 - smoothstep(0.0, 0.15, abs(t - 0.5));
  col += edge * vec3(0.4, 0.8, 1.0) * beat * u_intensity * 1.5;
  
  // Interior glow for trapped orbits
  if (iter >= 127.0) {
    float interior = fbm(z * 2.0 + u_time * 0.1);
    col = vec3(interior * 0.15, interior * 0.05, interior * 0.2) * (1.0 + beat);
  }
  
  col *= 0.85;
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'sacred-geometry',
    name: 'Sacred Geometry',
    description: 'Rotating mandalas and sacred patterns for deep meditation',
    icon: '🕉️',
    category: 'abstract',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.5) * 0.5 + 0.5;
  
  // Mouse rotates the mandala
  float mouseAngle = (u_mouse.x - 0.5) * PI * 0.5;
  uv *= rot2(mouseAngle * 0.3);
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Multi-layer mandala with variable petals
  float petals1 = 6.0;
  float petals2 = 12.0;
  float petals3 = 8.0 + beat * 4.0;
  
  float m1 = sin(angle * petals1 + u_time * 0.2) * cos(radius * 12.0 - u_time * u_beatHz * 0.2);
  float m2 = sin(angle * petals2 - u_time * 0.15) * cos(radius * 20.0 + u_time * 0.5);
  float m3 = sin(angle * petals3 + u_time * 0.3) * sin(radius * 8.0 - u_time * 0.3);
  
  float mandala = m1 * 0.4 + m2 * 0.3 + m3 * 0.3;
  mandala = mandala * 0.5 + 0.5;
  
  // Flower of life with more circles
  float fol = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * PI / 3.0 + u_time * 0.08;
    vec2 c1 = vec2(cos(a), sin(a)) * 0.25;
    fol += smoothstep(0.012, 0.0, abs(length(uv - c1) - 0.25));
    // Inner ring
    vec2 c2 = vec2(cos(a), sin(a)) * 0.125;
    fol += smoothstep(0.008, 0.0, abs(length(uv - c2) - 0.125)) * 0.6;
  }
  fol += smoothstep(0.012, 0.0, abs(radius - 0.25));
  fol += smoothstep(0.008, 0.0, abs(radius - 0.5)) * 0.5;
  fol += smoothstep(0.008, 0.0, abs(radius - 0.375)) * 0.3;
  
  // Sri Yantra triangles (simplified)
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a = fi * TAU / 3.0 + u_time * 0.05;
    float triAngle = mod(angle - a + PI, TAU) - PI;
    float tri = smoothstep(0.02, 0.0, abs(abs(triAngle) - radius * 2.0));
    tri *= step(radius, 0.5);
    fol += tri * 0.4;
  }
  
  vec3 col = vec3(0.01, 0.01, 0.04);
  
  // Mandala glow
  vec3 mandalaCol = palette(mandala + u_time * 0.015,
    vec3(0.5), vec3(0.5), vec3(1.0, 0.8, 0.5),
    vec3(0.44, 0.2, 0.65));
  col += mandalaCol * mandala * 0.5 * smoothstep(1.2, 0.0, radius);
  
  // Sacred geometry lines — golden glow
  col += fol * vec3(0.9, 0.75, 0.3) * (0.4 + beat * 0.6 * u_intensity);
  
  // Breathing pulse rings
  float breathPhase = u_time * u_beatHz * 0.25;
  float ring1 = sin(radius * 40.0 - breathPhase) * 0.5 + 0.5;
  ring1 = pow(ring1, 10.0);
  col += ring1 * vec3(0.2, 0.5, 0.9) * 0.2 * beat;
  
  // Particle dust
  float dust = pow(hash(floor(uv * 200.0)), 20.0);
  float twinkle = sin(u_time * 2.0 + hash(floor(uv * 200.0)) * 100.0) * 0.5 + 0.5;
  col += dust * twinkle * vec3(1.0, 0.9, 0.7) * 0.5;
  
  col *= 1.0 - radius * 0.4;
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'energy-field',
    name: 'Energy Field',
    description: 'Electromagnetic field visualization responding to your frequency',
    icon: '⚡',
    category: 'abstract',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.5) * 0.5 + 0.5;
  
  // Mouse acts as an energy attractor
  vec2 mouseUV = (u_mouse - 0.5) * 1.5;
  
  vec3 col = vec3(0.008, 0.005, 0.02);
  
  // Energy sources — 5 orbiting + 1 mouse
  float totalField = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 source;
    if (i < 5) {
      source = vec2(
        sin(u_time * 0.2 + fi * 1.3) * 0.45,
        cos(u_time * 0.15 + fi * 1.7) * 0.45
      );
    } else {
      source = mouseUV;
    }
    
    float dist = length(uv - source);
    
    // Concentric field waves
    float field = sin(dist * 30.0 - u_time * u_beatHz * 1.0 + fi * 0.7) * 0.5 + 0.5;
    field = pow(field, 4.0);
    field *= exp(-dist * 2.5);
    
    vec3 fieldCol = palette(fi / 6.0 + u_time * 0.008,
      vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 0.5),
      vec3(0.3, 0.5, 0.7));
    
    col += field * fieldCol * 0.6 * u_intensity;
    col += exp(-dist * 10.0) * fieldCol * 0.25 * (0.5 + beat * 0.5);
    totalField += 1.0 / (dist * dist + 0.01);
  }
  
  // Electric arcs between sources
  float arc = smoothstep(0.98, 1.0, sin(totalField * 0.1 + u_time * 3.0));
  col += arc * vec3(0.6, 0.8, 1.0) * 0.5 * beat;
  
  // Interference pattern
  float interference = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 source = i < 5
      ? vec2(sin(u_time * 0.2 + fi * 1.3) * 0.45, cos(u_time * 0.15 + fi * 1.7) * 0.45)
      : mouseUV;
    interference += sin(length(uv - source) * 30.0 - u_time * 2.5);
  }
  interference /= 6.0;
  col += smoothstep(0.75, 1.0, abs(interference)) * vec3(0.15, 0.3, 0.5) * 0.2 * beat;
  
  // Background plasma
  float plasma = fbm(uv * 3.0 + u_time * 0.05);
  col += plasma * vec3(0.03, 0.01, 0.05);
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },

  // ──────────────── NATURE ────────────────
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Rhythmic ocean surface that breathes with your session',
    icon: '🌊',
    category: 'nature',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.3) * 0.5 + 0.5;
  
  // Mouse shifts horizon/view
  float horizonShift = (u_mouse.y - 0.5) * 0.1;
  
  // Multi-layer ocean waves
  float wave = 0.0;
  wave += sin(p.x * 3.0 + u_time * 0.5 + fbm3(p * 3.0 + u_time * 0.15) * 3.0) * 0.12;
  wave += sin(p.x * 7.0 - u_time * 0.35 + p.y * 2.5) * 0.06;
  wave += sin(p.x * 12.0 + u_time * 0.8 + p.y * 4.0) * 0.02;
  wave += fbm3(p * 6.0 + u_time * vec2(0.08, 0.04)) * 0.08;
  
  float horizon = 0.1 + wave + horizonShift;
  float isSea = smoothstep(horizon - 0.008, horizon + 0.008, p.y * -1.0 + 0.3);
  
  // Rich night sky
  vec3 skyTop = vec3(0.02, 0.02, 0.1);
  vec3 skyMid = vec3(0.06, 0.04, 0.18);
  vec3 skyBottom = vec3(0.15, 0.08, 0.25 + beat * 0.08);
  vec3 sky = uv.y > 0.6 ? mix(skyMid, skyTop, (uv.y - 0.6) * 2.5) : mix(skyBottom, skyMid, uv.y / 0.6);
  
  // Milky way
  float milky = fbm3(vec2(p.x * 1.5 + 2.0, p.y * 3.0 + 5.0)) * 0.15;
  milky *= smoothstep(0.5, 0.9, uv.y);
  sky += milky * vec3(0.3, 0.25, 0.5);
  
  // Stars with depth
  for (int layer = 0; layer < 3; layer++) {
    float scale = 150.0 + float(layer) * 100.0;
    float brightness = 0.6 + float(layer) * 0.2;
    float star = pow(hash(floor(p * scale)), 22.0 + float(layer) * 5.0);
    float twinkle = sin(u_time * (2.0 + float(layer)) + hash(floor(p * scale)) * TAU) * 0.4 + 0.6;
    sky += star * twinkle * brightness * (1.0 - isSea);
  }
  
  // Moon with craters
  vec2 moonPos = vec2(0.3, 0.55);
  float moonDist = length(p - moonPos);
  float moon = smoothstep(0.09, 0.07, moonDist);
  float craters = fbm(p * 80.0) * 0.15;
  sky += moon * (vec3(0.85, 0.88, 0.92) - craters) * (1.0 - isSea);
  float moonGlow = exp(-moonDist * 8.0) * 0.3;
  sky += moonGlow * vec3(0.4, 0.45, 0.6) * (1.0 - isSea);
  
  // Deep water
  vec3 deepWater = vec3(0.01, 0.06, 0.12);
  vec3 surfaceWater = vec3(0.04, 0.18, 0.28);
  float waterDepth = smoothstep(0.0, 0.6, (p.y * -1.0 + 0.3 - horizon));
  vec3 water = mix(surfaceWater, deepWater, waterDepth);
  
  // Moon reflection — shimmering column
  float refX = p.x - 0.3 + (u_mouse.x - 0.5) * 0.05;
  float reflection = exp(-refX * refX * 6.0) * 0.35;
  reflection *= (sin(p.y * 40.0 + u_time * 2.5 + beat * 4.0) * 0.3 + 0.7);
  reflection *= (sin(p.y * 15.0 - u_time * 1.0) * 0.2 + 0.8);
  water += reflection * vec3(0.35, 0.4, 0.5) * isSea;
  
  // Wave foam
  float foam = smoothstep(0.01, -0.005, p.y * -1.0 + 0.3 - horizon);
  foam *= fbm(vec2(p.x * 20.0 + u_time * 0.5, u_time * 0.3)) * 2.0;
  water += foam * vec3(0.3, 0.35, 0.4) * 0.5;
  
  water += beat * 0.04 * vec3(0.2, 0.5, 0.7) * u_intensity;
  
  vec3 col = mix(sky, water, isSea);
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    description: 'Ethereal aurora borealis dancing across the night sky',
    icon: '🌌',
    category: 'nature',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.4) * 0.5 + 0.5;
  
  // Mouse shifts aurora position
  float mouseShift = (u_mouse.x - 0.5) * 0.3;
  
  // Rich dark sky with gradient
  vec3 col = mix(vec3(0.008, 0.008, 0.04), vec3(0.02, 0.04, 0.08), uv.y);
  
  // Deep star field with multiple layers
  for (int layer = 0; layer < 3; layer++) {
    float scale = 200.0 + float(layer) * 150.0;
    float star = pow(hash(floor(p * scale)), 25.0 + float(layer) * 5.0);
    float twinkle = sin(u_time * (2.0 + float(layer) * 1.5) + hash(floor(p * scale)) * TAU) * 0.4 + 0.6;
    col += star * twinkle * (0.5 + float(layer) * 0.15);
  }
  
  // 6 aurora layers with more variance
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float yOffset = 0.25 + fi * 0.07;
    float wave = fbm3(vec2((p.x + mouseShift) * (2.0 + fi * 0.5) + u_time * (0.04 + fi * 0.015), fi * 3.14 + u_time * 0.01)) * 0.35;
    float band = smoothstep(0.18, 0.0, abs(uv.y - yOffset - wave));
    band *= smoothstep(0.0, 0.25, uv.y);
    
    // Vertical curtain effect
    float curtain = sin(p.x * 15.0 + fi * 2.0 + u_time * 0.3) * 0.3 + 0.7;
    band *= curtain;
    
    vec3 auroraCol;
    if (i == 0) auroraCol = vec3(0.1, 0.9, 0.4);
    else if (i == 1) auroraCol = vec3(0.1, 0.7, 0.9);
    else if (i == 2) auroraCol = vec3(0.5, 0.2, 0.9);
    else if (i == 3) auroraCol = vec3(0.2, 0.95, 0.5);
    else if (i == 4) auroraCol = vec3(0.8, 0.2, 0.6);
    else auroraCol = vec3(0.15, 0.8, 0.7);
    
    band *= 0.6 + beat * 0.4 * u_intensity;
    col += band * auroraCol * (0.45 + fi * 0.08);
  }
  
  // Snow-capped mountain silhouettes — multiple ridges
  for (int ridge = 0; ridge < 3; ridge++) {
    float fr = float(ridge);
    float mountain = fbm(vec2(p.x * (3.0 + fr) + fr * 7.0, 0.0)) * (0.15 - fr * 0.03) + 0.05 - fr * 0.01;
    float isMountain = smoothstep(mountain + 0.008, mountain - 0.008, uv.y);
    float depth = 0.02 + fr * 0.01;
    col = mix(col, vec3(depth, depth * 0.9, depth * 1.1), isMountain);
    // Snow caps
    float snow = smoothstep(mountain - 0.005, mountain, uv.y) * smoothstep(mountain + 0.02, mountain + 0.005, uv.y);
    col += snow * vec3(0.15, 0.15, 0.2) * isMountain;
  }
  
  // Ground reflection glow
  float groundGlow = smoothstep(0.08, 0.0, uv.y) * 0.1;
  col += groundGlow * vec3(0.1, 0.3, 0.15) * (1.0 + beat * 0.3);
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Bioluminescent forest with fireflies synced to your beat',
    icon: '🌲',
    category: 'nature',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.4) * 0.5 + 0.5;
  
  // Mouse shifts the viewpoint slightly
  p.x += (u_mouse.x - 0.5) * 0.15;
  
  // Layered dark forest sky with depth fog
  vec3 col = mix(vec3(0.005, 0.02, 0.03), vec3(0.01, 0.04, 0.015), uv.y);
  
  // Canopy layers — foreground + background
  float canopyFar = fbm(vec2(p.x * 3.0, 0.0) + 3.0) * 0.2 + 0.6;
  float canopyNear = fbm(vec2(p.x * 5.0, 0.0)) * 0.3 + 0.5;
  
  float isCanopyFar = smoothstep(canopyFar + 0.015, canopyFar - 0.015, uv.y);
  float isCanopyNear = smoothstep(canopyNear + 0.02, canopyNear - 0.02, uv.y);
  
  col = mix(col, vec3(0.008, 0.02, 0.008), isCanopyFar * 0.7);
  
  // Tree trunks with bark texture
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float tx = -1.0 + fi * 0.33 + sin(fi * 3.1) * 0.08;
    float width = 0.015 + sin(fi * 2.0) * 0.008;
    float trunk = smoothstep(width, 0.0, abs(p.x - tx));
    trunk *= step(uv.y, canopyNear - sin(fi) * 0.08);
    // Bark texture
    float bark = noise(vec2(p.x * 50.0, uv.y * 30.0 + fi)) * 0.3;
    col = mix(col, vec3(0.02 + bark * 0.02, 0.025, 0.01), trunk * 0.85);
  }
  
  col = mix(col, vec3(0.003, 0.012, 0.003), isCanopyNear);
  
  // Bioluminescent glow on trees — multiple colors
  float bioGlow1 = fbm3(vec2(p.x * 10.0, uv.y * 15.0) + u_time * 0.08);
  float bioGlow2 = fbm3(vec2(p.x * 8.0 + 5.0, uv.y * 12.0) + u_time * 0.06 + 10.0);
  bioGlow1 = smoothstep(0.55, 0.72, bioGlow1);
  bioGlow2 = smoothstep(0.58, 0.75, bioGlow2);
  col += bioGlow1 * vec3(0.1, 0.5, 0.25) * isCanopyNear * (0.4 + beat * 0.6 * u_intensity);
  col += bioGlow2 * vec3(0.05, 0.15, 0.5) * isCanopyNear * (0.3 + beat * 0.4);
  
  // Fireflies — more of them, varied sizes
  for (int i = 0; i < 25; i++) {
    float fi = float(i);
    float speed = 0.15 + hash(vec2(fi, 0.0)) * 0.2;
    vec2 fPos = vec2(
      sin(u_time * speed + fi * 1.7) * 0.7 + cos(fi * 2.3 + u_time * 0.05) * 0.2,
      sin(u_time * (speed * 0.7) + fi * 2.1) * 0.3 + 0.15
    );
    float brightness = sin(u_time * u_beatHz * 0.5 + fi * 1.5) * 0.5 + 0.5;
    brightness *= smoothstep(0.0, 0.3, fPos.y + 0.2); // below canopy only
    float size = 30.0 + fi * 2.0;
    float firefly = exp(-length(p - fPos) * size) * brightness;
    
    vec3 ffCol = fi < 12.0 ? vec3(0.5, 0.95, 0.3) : vec3(0.3, 0.7, 0.9);
    col += firefly * ffCol * u_intensity;
  }
  
  // Ground fog with layers
  float fog = smoothstep(0.25, 0.0, uv.y) * 0.18;
  fog *= fbm(vec2(p.x * 3.0 + u_time * 0.08, u_time * 0.03)) * 2.5;
  col += fog * vec3(0.08, 0.12, 0.08) * (1.0 + beat * 0.4);
  
  // Volumetric light shafts through canopy
  float shaft = smoothstep(0.02, 0.0, abs(p.x - 0.1 + sin(u_time * 0.1) * 0.2));
  shaft *= smoothstep(canopyNear, canopyNear - 0.3, uv.y) * (1.0 - step(uv.y, 0.1));
  col += shaft * vec3(0.05, 0.1, 0.04) * 0.3;
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'mountains',
    name: 'Mountain Sunrise',
    description: 'Peaceful mountain vista with a sunrise synced to your breath',
    icon: '🏔️',
    category: 'nature',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.3) * 0.5 + 0.5;
  
  // Mouse controls sun position
  float sunY = 0.35 + sin(u_time * 0.025) * 0.06 + (u_mouse.y - 0.5) * 0.1;
  float sunX = (u_mouse.x - 0.5) * 0.3;
  vec2 sunPos = vec2(sunX, sunY);
  float sunDist = length(p - sunPos);
  
  // Dynamic sky gradient based on sun height
  float sunHeight = sunY;
  vec3 skyHigh = mix(vec3(0.03, 0.03, 0.15), vec3(0.1, 0.2, 0.5), smoothstep(0.2, 0.5, sunHeight));
  vec3 skyLow = mix(vec3(0.3, 0.1, 0.08), vec3(0.6, 0.4, 0.2), smoothstep(0.2, 0.5, sunHeight));
  vec3 col = mix(skyLow, skyHigh, pow(uv.y, 0.6));
  
  // God rays from sun
  float rays = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * PI / 4.0;
    vec2 dir = vec2(cos(a), sin(a));
    float d = dot(normalize(p - sunPos), dir);
    rays += pow(max(0.0, d), 30.0) * exp(-sunDist * 2.0);
  }
  col += rays * vec3(1.0, 0.6, 0.2) * 0.15 * (1.0 + beat * 0.3);
  
  // Sun with corona
  float sunGlow = exp(-sunDist * 2.5);
  col += sunGlow * vec3(1.0, 0.65, 0.25) * (0.9 + beat * 0.3 * u_intensity);
  float corona = exp(-sunDist * 6.0) - exp(-sunDist * 12.0);
  col += corona * vec3(1.0, 0.4, 0.1) * 0.5;
  float sun = smoothstep(0.08, 0.06, sunDist);
  col = mix(col, vec3(1.0, 0.9, 0.6), sun);
  
  // Volumetric clouds
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float cloudY = 0.55 + fi * 0.12;
    float cloud = fbm3(vec2(p.x * (2.0 + fi) + u_time * (0.015 + fi * 0.005) + fi * 3.0, fi * 5.0));
    cloud = smoothstep(0.4, 0.75, cloud);
    cloud *= smoothstep(cloudY - 0.1, cloudY, uv.y) * smoothstep(cloudY + 0.15, cloudY + 0.05, uv.y);
    vec3 cloudCol = mix(vec3(0.5, 0.25, 0.1), vec3(0.8, 0.6, 0.4), sunGlow * 2.0);
    col = mix(col, col + cloudCol, cloud * 0.35);
  }
  
  // Mountain ridges with depth
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float mHeight = fbm(vec2(p.x * (2.0 + fi * 0.8) + fi * 5.0, 0.0)) * (0.28 - fi * 0.04) + 0.08 - fi * 0.025;
    float isMountain = smoothstep(mHeight + 0.004, mHeight - 0.004, uv.y);
    float depth = 0.12 - fi * 0.02;
    vec3 mCol = vec3(depth * 0.9, depth * 0.7, depth * 1.1);
    // Atmospheric scattering — distant mountains are more blue
    mCol = mix(mCol, vec3(0.15, 0.12, 0.2) * (1.0 - fi * 0.15), fi * 0.2);
    col = mix(col, mCol, isMountain);
    
    // Snow on peaks
    float snowLine = mHeight - 0.02 * (1.0 + fi * 0.3);
    float snow = smoothstep(snowLine, snowLine + 0.03, uv.y) * isMountain * step(fi, 2.0);
    col += snow * vec3(0.25, 0.25, 0.3) * 0.5;
  }
  
  // Atmospheric haze near ground
  float haze = smoothstep(0.25, 0.05, uv.y) * 0.2;
  col += haze * vec3(0.5, 0.3, 0.2) * (1.0 + beat * 0.3);
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },

  // ──────────────── COSMIC ────────────────
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    description: 'Float through a vibrant nebula pulsing with cosmic energy',
    icon: '🔮',
    category: 'cosmic',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.4) * 0.5 + 0.5;
  
  // Mouse drifts camera
  uv += (u_mouse - 0.5) * 0.2;
  uv += vec2(sin(u_time * 0.018), cos(u_time * 0.012)) * 0.25;
  
  // Deep nebula with more octaves
  float n1 = fbm3(uv * 2.0 + u_time * 0.025);
  float n2 = fbm3(uv * 3.5 - u_time * 0.018 + 5.0);
  float n3 = fbm3(uv * 5.0 + vec2(u_time * 0.008, -u_time * 0.015) + 10.0);
  float n4 = fbm3(uv * 1.5 + vec2(-u_time * 0.01, u_time * 0.02) + 20.0);
  
  vec3 col = vec3(0.005, 0.0, 0.015); // deep space
  
  // Multi-color gas clouds with volumetric feel
  col += vec3(0.7, 0.1, 0.35) * smoothstep(0.3, 0.72, n1) * 0.55;
  col += vec3(0.1, 0.35, 0.75) * smoothstep(0.35, 0.78, n2) * 0.5;
  col += vec3(0.2, 0.65, 0.35) * smoothstep(0.32, 0.7, n3) * 0.4;
  col += vec3(0.6, 0.3, 0.7) * smoothstep(0.4, 0.75, n4) * 0.35;
  
  // Emission veins — bright filaments
  float vein1 = smoothstep(0.48, 0.5, n1) * smoothstep(0.52, 0.5, n1);
  float vein2 = smoothstep(0.49, 0.5, n2) * smoothstep(0.51, 0.5, n2);
  col += vein1 * vec3(0.9, 0.4, 1.0) * beat * u_intensity * 3.5;
  col += vein2 * vec3(0.4, 0.9, 1.0) * beat * u_intensity * 2.0;
  
  // Star clusters at multiple scales
  for (int layer = 0; layer < 4; layer++) {
    float scale = 300.0 + float(layer) * 150.0;
    float star = pow(hash(floor(uv * scale)), 28.0 + float(layer) * 4.0);
    float flicker = sin(u_time * (3.0 + float(layer) * 2.0) + hash(floor(uv * scale)) * 100.0) * 0.25 + 0.75;
    // Star color variation
    vec3 starCol = mix(vec3(1.0, 0.9, 0.7), vec3(0.7, 0.8, 1.0), hash(floor(uv * scale) + 0.5));
    col += star * flicker * starCol * 1.2;
  }
  
  // Central galactic glow
  float glow = exp(-length(uv) * 1.2) * 0.25;
  col += glow * vec3(0.5, 0.3, 0.85) * (1.0 + beat * 0.6);
  
  // Dust lanes — dark absorption
  float dust = fbm(uv * 4.0 + 30.0);
  col *= 1.0 - smoothstep(0.4, 0.6, dust) * 0.3;
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'wormhole',
    name: 'Wormhole',
    description: 'Hurtle through a reality-bending interdimensional wormhole',
    icon: '🕳️',
    category: 'cosmic',
    fragmentShader: `${GLSL_COMMON}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float beat = sin(u_time * u_beatHz * 0.5) * 0.5 + 0.5;
  
  // Mouse tilts the wormhole
  vec2 tilt = (u_mouse - 0.5) * 0.2;
  uv -= tilt;
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Deep wormhole with gravitational lensing
  float warp = 1.0 / (radius + 0.08);
  float spiral = angle + warp * 3.0 + u_time * 0.6;
  
  // Multi-layer speed lines
  float lines1 = sin(spiral * 10.0) * 0.5 + 0.5;
  float lines2 = sin(spiral * 16.0 + 1.0) * 0.5 + 0.5;
  lines1 *= sin(warp * 12.0 - u_time * 4.0) * 0.5 + 0.5;
  lines2 *= sin(warp * 8.0 - u_time * 3.0 + 2.0) * 0.5 + 0.5;
  
  // Twisted energy streams
  float stream1 = fbm3(vec2(spiral * 2.0, warp * 4.0 - u_time * 0.6));
  float stream2 = fbm(vec2(spiral * 3.0 + 5.0, warp * 2.0 - u_time * 0.4));
  
  vec3 col = vec3(0.0);
  
  // Outer ring spectrum
  vec3 ringCol1 = palette(angle / TAU + u_time * 0.015,
    vec3(0.5), vec3(0.5), vec3(1.0, 0.7, 0.4),
    vec3(0.1, 0.4, 0.7));
  vec3 ringCol2 = palette(angle / TAU + u_time * 0.02 + 0.5,
    vec3(0.5), vec3(0.5), vec3(1.0),
    vec3(0.3, 0.2, 0.8));
  
  col += lines1 * ringCol1 * 0.35 * smoothstep(0.0, 0.25, radius);
  col += lines2 * ringCol2 * 0.2 * smoothstep(0.05, 0.4, radius);
  col += stream1 * vec3(0.3, 0.5, 1.0) * 0.25;
  col += stream2 * vec3(0.6, 0.2, 0.8) * 0.15;
  
  // Brilliant white core with blue halo
  float core = exp(-radius * 5.0);
  float halo = exp(-radius * 2.5) - exp(-radius * 5.0);
  col += core * vec3(1.0, 0.98, 0.95) * (0.9 + beat * 0.5);
  col += halo * vec3(0.3, 0.5, 1.0) * 0.6;
  
  // Beat-reactive gravitational waves
  float gWave = sin(warp * 20.0 - u_time * u_beatHz * 1.5) * 0.5 + 0.5;
  gWave = pow(gWave, 5.0);
  col += gWave * vec3(0.4, 0.7, 1.0) * 0.6 * beat * u_intensity;
  
  // Relativistic particle streaks
  float particles = pow(hash(floor(vec2(spiral * 25.0, warp * 12.0))), 18.0);
  float particleBright = sin(u_time * 5.0 + warp * 10.0) * 0.3 + 0.7;
  col += particles * particleBright * vec3(0.9, 0.95, 1.0) * smoothstep(0.04, 0.3, radius);
  
  // Gravitational distortion at edge
  float distort = sin(angle * 6.0 + u_time * 2.0) * 0.02 / (radius + 0.1);
  col += abs(distort) * vec3(0.5, 0.3, 0.8) * 2.0;
  
  col *= u_transition;
  gl_FragColor = vec4(col, 1.0);
}`
  },
];

export function getScenesByCategory(category: VisualizerScene['category']) {
  return VISUALIZER_SCENES.filter(s => s.category === category);
}
