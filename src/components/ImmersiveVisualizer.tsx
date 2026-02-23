import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { VISUALIZER_SCENES, COMMON_VERTEX_SHADER, type VisualizerScene } from '@/lib/visualizerScenes';

interface ImmersiveVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  beatHz: number;
  baseFreq: number;
  intensity: number;
  isPlaying: boolean;
}

export function ImmersiveVisualizer({
  isOpen,
  onClose,
  beatHz,
  baseFreq,
  intensity,
  isPlaying,
}: ImmersiveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(performance.now());

  const [activeScene, setActiveScene] = useState<VisualizerScene>(VISUALIZER_SCENES[0]);
  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimerRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide UI
  const resetHideTimer = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowUI(false), 3000);
  }, []);

  // Compile shader program for active scene
  const compileProgram = useCallback((gl: WebGLRenderingContext, scene: VisualizerScene) => {
    const compile = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(COMMON_VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compile(scene.fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    // Set up quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    return program;
  }, []);

  // Initialize and render
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;
    glRef.current = gl;

    const program = compileProgram(gl, activeScene);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    startTimeRef.current = performance.now();

    const render = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const time = (performance.now() - startTimeRef.current) * 0.001;

      const loc = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform1f(loc('u_time'), time);
      gl.uniform2f(loc('u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(loc('u_beatHz'), isPlaying ? beatHz : 1.0);
      gl.uniform1f(loc('u_intensity'), isPlaying ? intensity * 2.0 : 0.5);
      gl.uniform1f(loc('u_baseFreq'), baseFreq);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
      }
    };
  }, [isOpen, activeScene, compileProgram, beatHz, intensity, baseFreq, isPlaying]);

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Scene navigation
  const currentIndex = VISUALIZER_SCENES.findIndex(s => s.id === activeScene.id);
  const prevScene = () => setActiveScene(VISUALIZER_SCENES[(currentIndex - 1 + VISUALIZER_SCENES.length) % VISUALIZER_SCENES.length]);
  const nextScene = () => setActiveScene(VISUALIZER_SCENES[(currentIndex + 1) % VISUALIZER_SCENES.length]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevScene();
      if (e.key === 'ArrowRight') nextScene();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      resetHideTimer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, toggleFullscreen, resetHideTimer, currentIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onMouseMove={resetHideTimer}
        onClick={resetHideTimer}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        />

        {/* UI Overlay */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                    <span className="text-white/80 text-sm font-medium">
                      {activeScene.icon} {activeScene.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPlaying && (
                    <div className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                      <span className="text-primary text-xs font-mono">{beatHz.toFixed(1)} Hz</span>
                    </div>
                  )}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Scene navigation arrows */}
              <button
                onClick={prevScene}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/50 transition-colors pointer-events-auto"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextScene}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/50 transition-colors pointer-events-auto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bottom scene picker */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-auto">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                  {VISUALIZER_SCENES.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => setActiveScene(scene)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-sm ${
                        activeScene.id === scene.id
                          ? 'bg-primary/30 border border-primary/50 text-white'
                          : 'bg-black/30 border border-white/10 text-white/60 hover:text-white hover:bg-black/50'
                      }`}
                    >
                      <span className="mr-1.5">{scene.icon}</span>
                      {scene.name}
                    </button>
                  ))}
                </div>
                <p className="text-center text-white/30 text-[10px] mt-2">
                  ← → arrows to switch • F for fullscreen • ESC to exit
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
