import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Type Definitions ---
interface ShaderParams {
  hue: number;
  speed: number;
  intensity: number;
  complexity: number;
}

interface ShaderCanvasProps extends ShaderParams {}

interface SDFDreamscapeProps {
  className?: string;
  showControls?: boolean;
  hue?: number;
  speed?: number;
  intensity?: number;
  complexity?: number;
}

// --- Custom Hooks ---

/**
 * A custom hook to throttle a callback function.
 */
const useThrottledCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (!timeoutRef.current) {
      callbackRef.current(...args);
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay]);
};

/**
 * A custom hook to encapsulate all WebGL shader logic.
 */
const useShaderAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  params: ShaderParams
) => {
  const { hue, speed, intensity, complexity } = params;
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  const throttledMouseMove = useThrottledCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      mousePos.current.x = (e.clientX - rect.left) / rect.width;
      mousePos.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    }
  }, 16);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Force canvas size from parent on mount
    const parent = canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || 700;
    }

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported.');
      return;
    }

    // --- Shaders (GLSL) - Customized for Cardinal Binaural ---
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader with neural/frequency-inspired aesthetics
    const fragmentShaderSource = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_hue;
      uniform float u_speed;
      uniform float u_intensity;
      uniform float u_complexity;

      #define PI 3.14159265359
      
      // Color palette inspired by Cardinal Binaural (teal/cyan/purple)
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        // Primary: teal (158°), Accent: cyan (189°), Dream: purple (280°)
        vec3 d = vec3(0.44, 0.52, 0.78); // teal-cyan-purple base
        float hueShift = u_hue / 360.0 * PI;
        d = mix(d, vec3(0.263, 0.716, 0.557), sin(hueShift) * 0.5 + 0.5);
        return a + b * cos(6.28318 * (c * t + d));
      }

      mat2 rotate2d(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }

      // Neural wave function for frequency visualization
      float neuralWave(vec2 p, float time) {
        float wave = 0.0;
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          wave += sin(p.x * (2.0 + fi) + time * (0.5 + fi * 0.3)) * 0.1;
          wave += cos(p.y * (3.0 + fi) + time * (0.4 + fi * 0.2)) * 0.1;
        }
        return wave;
      }

      float map(vec2 p) {
        vec2 p_orig = p;
        float final_dist = 1000.0;
        
        // Add neural wave distortion
        p += vec2(neuralWave(p, u_time * u_speed * 0.5));
        
        // Animate rotation and scale - frequency-like oscillation
        p *= rotate2d(u_time * 0.08 * u_speed);
        p *= (1.0 + sin(u_time * 0.15 * u_speed) * 0.15);

        // Fractal construction with smooth variations
        for (int i = 0; i < 8; i++) {
          if (float(i) >= u_intensity) break;
          p = abs(p) / clamp(dot(p, p), 0.15, 1.0) - vec2(0.5, 0.25);
          p *= rotate2d(u_mouse.x * 1.5 + u_time * 0.02);
        }
        
        final_dist = sdCircle(p, 0.4);
        return final_dist;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        uv *= (2.5 / u_complexity);
        
        // Subtle mouse parallax
        uv.x += (u_mouse.x - 0.5) * 0.3;
        uv.y += (u_mouse.y - 0.5) * 0.3;

        float dist = map(uv);
        
        // Multi-layer color blending for depth
        vec3 col = palette(u_time * 0.08 - dist * 0.15);
        
        // Soft glow effect
        float glow = pow(0.008 / abs(dist), 1.1);
        col += glow * 0.4;
        
        // Neural pulse rings
        float pulse = sin(dist * 20.0 - u_time * u_speed * 2.0) * 0.5 + 0.5;
        col += pulse * 0.05 * palette(u_time * 0.1);
        
        // Elegant vignette
        vec2 vignetteUV = gl_FragCoord.xy / u_resolution.xy;
        float vignette = 1.0 - length(vignetteUV - 0.5) * 0.7;
        col *= smoothstep(0.0, 1.0, vignette);
        
        // Reduce overall brightness for background use
        col *= 0.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // --- WebGL Setup ---
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program link error: ${gl.getProgramInfoLog(program)}`);
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const hueLocation = gl.getUniformLocation(program, 'u_hue');
    const speedLocation = gl.getUniformLocation(program, 'u_speed');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const complexityLocation = gl.getUniformLocation(program, 'u_complexity');

    // --- Render Loop ---
    let animationFrameId: number;
    const startTime = performance.now();
    const render = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - startTime) * 0.001);
      gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(hueLocation, hue);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(intensityLocation, intensity);
      gl.uniform1f(complexityLocation, complexity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // --- Event Listeners & Cleanup ---
    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', throttledMouseMove);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [hue, speed, intensity, complexity, canvasRef, throttledMouseMove]);
};

// --- Components ---

const ShaderCanvas = React.memo(({ hue, speed, intensity, complexity }: ShaderCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useShaderAnimation(canvasRef, { hue, speed, intensity, complexity });
  return (
    <canvas
      ref={canvasRef}
      style={{ 
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
});

ShaderCanvas.displayName = 'ShaderCanvas';

// Main SDFDreamscape Component - Background Mode
const SDFDreamscape: React.FC<SDFDreamscapeProps> = ({
  className = '',
  showControls = false,
  hue: initialHue = 158, // Cardinal Binaural primary hue
  speed: initialSpeed = 0.3,
  intensity: initialIntensity = 5.0,
  complexity: initialComplexity = 2.8,
}) => {
  const [hue, setHue] = useState(initialHue);
  const [speed, setSpeed] = useState(initialSpeed);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [complexity, setComplexity] = useState(initialComplexity);

  const handleHueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setHue(parseFloat(e.target.value)),
    []
  );
  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSpeed(parseFloat(e.target.value)),
    []
  );
  const handleIntensityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setIntensity(parseFloat(e.target.value)),
    []
  );
  const handleComplexityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setComplexity(parseFloat(e.target.value)),
    []
  );

  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        minHeight: '100%',
        // Fallback gradient when WebGL canvas hasn't rendered yet
        background: 'radial-gradient(ellipse at center, hsl(189 94% 43% / 0.15), hsl(158 64% 52% / 0.1), transparent 70%)'
      }}
    >
      <ShaderCanvas hue={hue} speed={speed} intensity={intensity} complexity={complexity} />
      
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hue: {hue.toFixed(0)}°</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={hue}
                onChange={handleHueChange}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Speed: {speed.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={speed}
                onChange={handleSpeedChange}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Intensity: {intensity.toFixed(1)}</label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={intensity}
                onChange={handleIntensityChange}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Complexity: {complexity.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={complexity}
                onChange={handleComplexityChange}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDFDreamscape;
