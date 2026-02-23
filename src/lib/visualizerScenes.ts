// Visualizer scene definitions for immersive full-screen experiences

export interface VisualizerScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'abstract' | 'nature' | 'cosmic';
  fragmentShader: string;
}

// Common GLSL utilities shared across shaders
const GLSL_COMMON = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_beatHz;
uniform float u_intensity;
uniform float u_baseFreq;
#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}
`;

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const COMMON_VERTEX_SHADER = VERTEX_SHADER;

export const VISUALIZER_SCENES: VisualizerScene[] = [
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
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Tunnel warp
  float tunnel = 0.5 / radius;
  float tx = tunnel + u_time * 0.3;
  float ty = angle / PI;
  
  // Fractal rings
  float pattern = sin(tx * 8.0 + beat * TAU) * 0.5 + 0.5;
  pattern *= sin(ty * 12.0 + u_time * 0.5) * 0.5 + 0.5;
  pattern += fbm(vec2(tx * 2.0, ty * 4.0) + u_time * 0.1) * 0.4;
  
  // Beat-reactive pulse rings
  float pulse = sin(tunnel * 20.0 - u_time * u_beatHz) * 0.5 + 0.5;
  pulse = pow(pulse, 3.0) * beat;
  
  vec3 col = palette(pattern + u_time * 0.05,
    vec3(0.5), vec3(0.5), vec3(1.0),
    vec3(0.44, 0.52, 0.78));
  
  col += pulse * vec3(0.2, 0.8, 0.6) * u_intensity;
  col *= smoothstep(0.01, 0.15, radius); // center fade
  col *= 1.0 - smoothstep(0.5, 2.0, radius) * 0.5;
  
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
  
  // Zoom into fractal
  float zoom = 2.0 + sin(u_time * 0.05) * 1.5;
  vec2 c = uv * zoom + vec2(sin(u_time * 0.03) * 0.5 - 0.5, cos(u_time * 0.04) * 0.3);
  vec2 z = vec2(0.0);
  
  float iter = 0.0;
  for (int i = 0; i < 64; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 4.0) break;
    iter += 1.0;
  }
  
  float t = iter / 64.0;
  t = sqrt(t); // smoother coloring
  
  // Beat-reactive color shifting  
  vec3 col = palette(t + u_time * 0.03 + beat * 0.2,
    vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0),
    vec3(0.0 + beat * 0.1, 0.33, 0.67));
  
  // Glow at boundary
  float edge = 1.0 - smoothstep(0.0, 0.1, abs(t - 0.5));
  col += edge * vec3(0.3, 0.7, 0.9) * beat * u_intensity;
  
  col *= 0.8;
  gl_FragColor = vec4(col, 1.0);
}`
  },
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
  
  // Ocean waves using layered noise
  float wave = 0.0;
  wave += sin(p.x * 3.0 + u_time * 0.5 + fbm(p * 3.0 + u_time * 0.2) * 2.0) * 0.15;
  wave += sin(p.x * 7.0 - u_time * 0.3 + p.y * 2.0) * 0.05;
  wave += fbm(p * 5.0 + u_time * vec2(0.1, 0.05)) * 0.1;
  
  float horizon = 0.1 + wave;
  float isSea = smoothstep(horizon - 0.01, horizon + 0.01, p.y * -1.0 + 0.3);
  
  // Sky gradient
  vec3 skyTop = vec3(0.05, 0.05, 0.15);
  vec3 skyBottom = vec3(0.15, 0.1, 0.3 + beat * 0.1);
  vec3 sky = mix(skyBottom, skyTop, uv.y);
  
  // Stars
  float star = pow(hash(floor(p * 200.0)), 20.0);
  sky += star * (1.0 - isSea) * 0.8;
  
  // Moon glow
  float moon = smoothstep(0.08, 0.02, length(p - vec2(0.3, 0.5)));
  sky += moon * vec3(0.8, 0.85, 0.9) * (1.0 - isSea);
  
  // Water
  vec3 deepWater = vec3(0.02, 0.08, 0.15);
  vec3 surfaceWater = vec3(0.05, 0.2, 0.3);
  float waterDepth = smoothstep(0.0, 0.5, (p.y * -1.0 + 0.3 - horizon));
  vec3 water = mix(surfaceWater, deepWater, waterDepth);
  
  // Moon reflection on water
  float refX = p.x - 0.3;
  float reflection = exp(-refX * refX * 5.0) * 0.3;
  reflection *= sin(p.y * 30.0 + u_time * 2.0 + beat * 3.0) * 0.5 + 0.5;
  water += reflection * vec3(0.3, 0.35, 0.4) * isSea;
  
  // Beat-reactive shimmer
  water += beat * 0.05 * vec3(0.2, 0.5, 0.7) * u_intensity;
  
  vec3 col = mix(sky, water, isSea);
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
  
  // Dark sky
  vec3 col = mix(vec3(0.01, 0.01, 0.05), vec3(0.02, 0.05, 0.1), uv.y);
  
  // Stars
  float star = pow(hash(floor(p * 300.0)), 25.0);
  float twinkle = sin(u_time * 3.0 + hash(floor(p * 300.0)) * TAU) * 0.5 + 0.5;
  col += star * twinkle * 0.6;
  
  // Aurora layers
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float yOffset = 0.3 + fi * 0.08;
    float wave = fbm(vec2(p.x * (2.0 + fi) + u_time * (0.05 + fi * 0.02), fi * 3.14)) * 0.3;
    float band = smoothstep(0.15, 0.0, abs(uv.y - yOffset - wave));
    band *= smoothstep(0.0, 0.3, uv.y);
    
    vec3 auroraCol;
    if (i == 0) auroraCol = vec3(0.1, 0.8, 0.4);
    else if (i == 1) auroraCol = vec3(0.1, 0.6, 0.8);
    else if (i == 2) auroraCol = vec3(0.4, 0.2, 0.8);
    else auroraCol = vec3(0.2, 0.9, 0.5);
    
    // Beat reactivity
    band *= 0.7 + beat * 0.3 * u_intensity;
    col += band * auroraCol * (0.5 + fi * 0.1);
  }
  
  // Mountain silhouette
  float mountain = fbm(vec2(p.x * 3.0, 0.0)) * 0.15 + 0.05;
  float isMountain = smoothstep(mountain + 0.01, mountain - 0.01, uv.y);
  col = mix(col, vec3(0.01, 0.01, 0.03), isMountain);
  
  gl_FragColor = vec4(col, 1.0);
}`
  },
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
  
  // Slow camera drift
  uv += vec2(sin(u_time * 0.02), cos(u_time * 0.015)) * 0.3;
  
  // Nebula clouds via layered fbm
  float n1 = fbm(uv * 2.0 + u_time * 0.03);
  float n2 = fbm(uv * 3.0 - u_time * 0.02 + 5.0);
  float n3 = fbm(uv * 4.0 + vec2(u_time * 0.01, -u_time * 0.02) + 10.0);
  
  vec3 col = vec3(0.01, 0.0, 0.02); // deep space
  
  // Gas clouds
  col += vec3(0.6, 0.1, 0.3) * smoothstep(0.3, 0.7, n1) * 0.6;
  col += vec3(0.1, 0.3, 0.7) * smoothstep(0.4, 0.8, n2) * 0.5;
  col += vec3(0.2, 0.6, 0.4) * smoothstep(0.35, 0.75, n3) * 0.4;
  
  // Beat-reactive energy veins
  float vein = smoothstep(0.48, 0.5, n1) * smoothstep(0.52, 0.5, n1);
  col += vein * vec3(0.8, 0.4, 1.0) * beat * u_intensity * 3.0;
  
  // Stars
  float star = pow(hash(floor(uv * 400.0)), 30.0);
  float flicker = sin(u_time * 5.0 + hash(floor(uv * 400.0)) * 100.0) * 0.3 + 0.7;
  col += star * flicker * 1.5;
  
  // Central glow
  float glow = exp(-length(uv) * 1.5) * 0.2;
  col += glow * vec3(0.5, 0.3, 0.8) * (1.0 + beat * 0.5);
  
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
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Rotating mandala petals
  float petals = 6.0 + beat * 2.0;
  float mandala = sin(angle * petals + u_time * 0.3) * 0.5 + 0.5;
  mandala *= sin(radius * 15.0 - u_time * u_beatHz * 0.3) * 0.5 + 0.5;
  
  // Flower of life circles
  float fol = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * PI / 3.0 + u_time * 0.1;
    vec2 center = vec2(cos(a), sin(a)) * 0.25;
    float circle = abs(length(uv - center) - 0.25);
    fol += smoothstep(0.015, 0.0, circle);
  }
  fol += smoothstep(0.015, 0.0, abs(radius - 0.25));
  
  // Color
  vec3 col = vec3(0.02, 0.02, 0.05);
  
  // Mandala color
  vec3 mandalaCol = palette(mandala + u_time * 0.02,
    vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 0.5),
    vec3(0.44, 0.2, 0.6));
  col += mandalaCol * mandala * 0.4 * smoothstep(1.0, 0.0, radius);
  
  // Geometry lines
  col += fol * vec3(0.3, 0.8, 0.6) * (0.5 + beat * 0.5 * u_intensity);
  
  // Pulse rings
  float ring = sin(radius * 30.0 - u_time * 1.5) * 0.5 + 0.5;
  ring = pow(ring, 8.0);
  col += ring * vec3(0.2, 0.5, 0.8) * 0.2 * beat;
  
  // Vignette
  col *= 1.0 - radius * 0.5;
  
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
  
  // Dark forest sky
  vec3 col = mix(vec3(0.01, 0.03, 0.05), vec3(0.02, 0.05, 0.02), uv.y);
  
  // Canopy silhouette
  float canopy = fbm(vec2(p.x * 4.0, 0.0)) * 0.3 + 0.5;
  float isCanopy = smoothstep(canopy + 0.02, canopy - 0.02, uv.y);
  
  // Tree trunks
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float tx = -0.8 + fi * 0.4 + sin(fi * 2.5) * 0.1;
    float trunk = smoothstep(0.025, 0.0, abs(p.x - tx)) * step(uv.y, canopy - sin(fi) * 0.1);
    col = mix(col, vec3(0.02, 0.03, 0.01), trunk * 0.8);
  }
  
  col = mix(col, vec3(0.005, 0.015, 0.005), isCanopy);
  
  // Bioluminescent glow on trees
  float bioGlow = fbm(vec2(p.x * 8.0, uv.y * 12.0) + u_time * 0.1);
  bioGlow = smoothstep(0.55, 0.7, bioGlow);
  col += bioGlow * vec3(0.1, 0.4, 0.2) * isCanopy * (0.5 + beat * 0.5 * u_intensity);
  
  // Fireflies
  for (int i = 0; i < 15; i++) {
    float fi = float(i);
    vec2 fPos = vec2(
      sin(u_time * 0.3 + fi * 1.7) * 0.6 + cos(fi * 2.3) * 0.3,
      sin(u_time * 0.2 + fi * 2.1) * 0.25 + 0.1
    );
    float brightness = sin(u_time * u_beatHz * 0.5 + fi * 1.5) * 0.5 + 0.5;
    float firefly = exp(-length(p - fPos) * 40.0) * brightness;
    col += firefly * vec3(0.5, 0.9, 0.3) * u_intensity;
  }
  
  // Ground fog
  float fog = smoothstep(0.3, 0.0, uv.y) * 0.15;
  fog *= fbm(vec2(p.x * 3.0 + u_time * 0.1, 0.0)) * 2.0;
  col += fog * vec3(0.1, 0.15, 0.1) * (1.0 + beat * 0.3);
  
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
  
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  
  // Wormhole distortion
  float warp = 1.0 / (radius + 0.1);
  float spiral = angle + warp * 2.0 + u_time * 0.5;
  
  // Speed lines
  float lines = sin(spiral * 8.0) * 0.5 + 0.5;
  lines *= sin(warp * 10.0 - u_time * 3.0) * 0.5 + 0.5;
  
  // Energy streams
  float stream = fbm(vec2(spiral * 2.0, warp * 3.0 - u_time * 0.5));
  
  vec3 col = vec3(0.0);
  
  // Outer ring colors
  vec3 ringCol = palette(angle / TAU + u_time * 0.02,
    vec3(0.5), vec3(0.5), vec3(1.0),
    vec3(0.1, 0.4, 0.7));
  
  col += lines * ringCol * 0.4 * smoothstep(0.0, 0.3, radius);
  col += stream * vec3(0.3, 0.5, 0.9) * 0.3;
  
  // Central bright core
  float core = exp(-radius * 4.0);
  col += core * vec3(0.9, 0.95, 1.0) * (0.8 + beat * 0.4);
  
  // Beat-reactive energy rings
  float ring = sin(warp * 15.0 - u_time * u_beatHz) * 0.5 + 0.5;
  ring = pow(ring, 4.0);
  col += ring * vec3(0.4, 0.7, 1.0) * 0.5 * beat * u_intensity;
  
  // Particle streaks
  float particles = pow(hash(floor(vec2(spiral * 20.0, warp * 10.0))), 15.0);
  col += particles * vec3(0.8, 0.9, 1.0) * smoothstep(0.05, 0.3, radius);
  
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
  
  // Sunrise position (slowly rises)
  float sunY = 0.35 + sin(u_time * 0.03) * 0.05;
  vec2 sunPos = vec2(0.0, sunY);
  float sunDist = length(p - sunPos);
  
  // Sky gradient  
  vec3 skyHigh = vec3(0.05, 0.05, 0.2);
  vec3 skyLow = vec3(0.4, 0.15, 0.1);
  vec3 col = mix(skyLow, skyHigh, pow(uv.y, 0.7));
  
  // Sun glow
  float sunGlow = exp(-sunDist * 3.0);
  col += sunGlow * vec3(1.0, 0.6, 0.2) * (0.8 + beat * 0.3 * u_intensity);
  
  // Sun disc
  float sun = smoothstep(0.08, 0.06, sunDist);
  col = mix(col, vec3(1.0, 0.85, 0.5), sun);
  
  // Cloud layers
  float cloud = fbm(vec2(p.x * 3.0 + u_time * 0.02, p.y * 2.0 + 5.0));
  cloud = smoothstep(0.45, 0.7, cloud) * smoothstep(0.2, 0.5, uv.y) * (1.0 - smoothstep(0.7, 0.9, uv.y));
  col = mix(col, col + vec3(0.4, 0.2, 0.1), cloud * 0.4);
  
  // Mountain layers
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float mHeight = fbm(vec2(p.x * (2.0 + fi) + fi * 5.0, 0.0)) * (0.25 - fi * 0.04) + 0.1 - fi * 0.03;
    float isMountain = smoothstep(mHeight + 0.005, mHeight - 0.005, uv.y);
    float depth = 0.15 - fi * 0.03;
    vec3 mCol = vec3(depth, depth * 0.8, depth * 1.2);
    col = mix(col, mCol, isMountain);
  }
  
  // Atmospheric haze
  float haze = smoothstep(0.3, 0.1, uv.y) * 0.15;
  col += haze * vec3(0.5, 0.3, 0.2) * (1.0 + beat * 0.2);
  
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
  
  vec3 col = vec3(0.01, 0.01, 0.03);
  
  // Multiple energy sources
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 source = vec2(
      sin(u_time * 0.2 + fi * 1.3) * 0.4,
      cos(u_time * 0.15 + fi * 1.7) * 0.4
    );
    
    float dist = length(uv - source);
    
    // Field lines
    float field = sin(dist * 20.0 - u_time * u_beatHz * 0.8 + fi) * 0.5 + 0.5;
    field = pow(field, 3.0);
    field *= exp(-dist * 3.0);
    
    vec3 fieldCol = palette(fi / 5.0 + u_time * 0.01,
      vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 0.5),
      vec3(0.3, 0.5, 0.7));
    
    col += field * fieldCol * 0.5 * u_intensity;
    
    // Core glow
    col += exp(-dist * 8.0) * fieldCol * 0.3 * (0.5 + beat * 0.5);
  }
  
  // Interference patterns between sources
  float interference = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 source = vec2(sin(u_time * 0.2 + fi * 1.3) * 0.4, cos(u_time * 0.15 + fi * 1.7) * 0.4);
    interference += sin(length(uv - source) * 25.0 - u_time * 2.0);
  }
  interference = interference / 5.0;
  col += smoothstep(0.7, 1.0, abs(interference)) * vec3(0.2, 0.4, 0.6) * 0.15 * beat;
  
  gl_FragColor = vec4(col, 1.0);
}`
  },
];

export function getScenesByCategory(category: VisualizerScene['category']) {
  return VISUALIZER_SCENES.filter(s => s.category === category);
}
