import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Sparkles, Wind } from 'lucide-react';
import { VISUALIZER_SCENES, COMMON_VERTEX_SHADER, type VisualizerScene } from '@/lib/visualizerScenes';

interface ImmersiveVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  beatHz: number;
  baseFreq: number;
  intensity: number;
  isPlaying: boolean;
}

type CategoryFilter = 'all' | 'abstract' | 'nature' | 'cosmic';

const CATEGORY_LABELS: Record<CategoryFilter, { label: string; icon: string }> = {
  all: { label: 'All', icon: '✦' },
  abstract: { label: 'Abstract', icon: '🌀' },
  nature: { label: 'Nature', icon: '🌿' },
  cosmic: { label: 'Cosmic', icon: '🌌' },
};

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
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const transitionRef = useRef(0);

  const [activeScene, setActiveScene] = useState<VisualizerScene>(VISUALIZER_SCENES[0]);
  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const hideTimerRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredScenes = useMemo(() => {
    if (categoryFilter === 'all') return VISUALIZER_SCENES;
    return VISUALIZER_SCENES.filter(s => s.category === categoryFilter);
  }, [categoryFilter]);

  // Breathing guide cycle
  useEffect(() => {
    if (!showBreathingGuide || !isOpen) return;
    const cycleDuration = 4000; // 4s inhale, 2s hold, 4s exhale
    let phase = 0;
    const interval = setInterval(() => {
      phase = (phase + 1) % 3;
      setBreathPhase(phase === 0 ? 'inhale' : phase === 1 ? 'hold' : 'exhale');
    }, phase === 1 ? 2000 : cycleDuration);
    return () => clearInterval(interval);
  }, [showBreathingGuide, isOpen]);

  // Auto-hide UI
  const resetHideTimer = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowUI(false), 3500);
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height, // flip Y for GL
      };
    }
    resetHideTimer();
  }, [resetHideTimer]);

  // Touch tracking
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      mouseRef.current = {
        x: (e.touches[0].clientX - rect.left) / rect.width,
        y: 1.0 - (e.touches[0].clientY - rect.top) / rect.height,
      };
    }
  }, []);

  // Compile shader
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

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    return program;
  }, []);

  // Main render loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false }) || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;
    glRef.current = gl;

    const program = compileProgram(gl, activeScene);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    // Reset transition on scene change
    transitionRef.current = 0;

    const render = () => {
      if (canvas.width !== canvas.clientWidth * (window.devicePixelRatio > 1 ? 1.5 : 1) || 
          canvas.height !== canvas.clientHeight * (window.devicePixelRatio > 1 ? 1.5 : 1)) {
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const time = (performance.now() - startTimeRef.current) * 0.001;

      // Smooth mouse interpolation
      const lerp = 0.05;
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * lerp;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * lerp;

      // Smooth transition fade-in
      transitionRef.current = Math.min(1.0, transitionRef.current + 0.02);

      const loc = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform1f(loc('u_time'), time);
      gl.uniform2f(loc('u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(loc('u_beatHz'), isPlaying ? beatHz : 1.0);
      gl.uniform1f(loc('u_intensity'), isPlaying ? intensity * 2.0 : 0.5);
      gl.uniform1f(loc('u_baseFreq'), baseFreq);
      gl.uniform2f(loc('u_mouse'), smoothMouseRef.current.x, smoothMouseRef.current.y);
      gl.uniform1f(loc('u_transition'), transitionRef.current);

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
  const currentIndex = filteredScenes.findIndex(s => s.id === activeScene.id);
  const prevScene = useCallback(() => {
    const scenes = filteredScenes;
    const idx = scenes.findIndex(s => s.id === activeScene.id);
    setActiveScene(scenes[(idx - 1 + scenes.length) % scenes.length]);
  }, [filteredScenes, activeScene]);
  const nextScene = useCallback(() => {
    const scenes = filteredScenes;
    const idx = scenes.findIndex(s => s.id === activeScene.id);
    setActiveScene(scenes[(idx + 1) % scenes.length]);
  }, [filteredScenes, activeScene]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevScene();
      if (e.key === 'ArrowRight') nextScene();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'b' || e.key === 'B') setShowBreathingGuide(v => !v);
      resetHideTimer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, toggleFullscreen, resetHideTimer, prevScene, nextScene]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 bg-black cursor-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={resetHideTimer}
        style={{ cursor: showUI ? 'default' : 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        />

        {/* Breathing Guide Overlay */}
        <AnimatePresence>
          {showBreathingGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{
                  scale: breathPhase === 'inhale' ? [1, 1.8] : breathPhase === 'hold' ? 1.8 : [1.8, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  scale: { duration: breathPhase === 'hold' ? 2 : 4, ease: 'easeInOut' },
                  opacity: { duration: 4, repeat: Infinity },
                }}
                className="w-32 h-32 rounded-full border-2 border-white/20"
                style={{
                  boxShadow: '0 0 60px rgba(255,255,255,0.1), inset 0 0 40px rgba(255,255,255,0.05)',
                }}
              />
              <motion.p
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute text-white/50 text-sm font-light tracking-[0.3em] uppercase mt-48"
              >
                {breathPhase}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UI Overlay */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-all border border-white/5"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                    <span className="text-white/90 text-xs sm:text-sm font-medium">
                      {activeScene.icon} {activeScene.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30"
                    >
                      <span className="text-primary text-xs font-mono">{beatHz.toFixed(1)} Hz</span>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowBreathingGuide(v => !v)}
                    className={`p-2.5 rounded-full backdrop-blur-md transition-all border ${
                      showBreathingGuide
                        ? 'bg-primary/20 border-primary/30 text-primary'
                        : 'bg-black/50 border-white/5 text-white/60 hover:text-white hover:bg-black/70'
                    }`}
                    title="Breathing Guide (B)"
                  >
                    <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white/60 hover:text-white hover:bg-black/70 transition-all border border-white/5"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Scene navigation arrows */}
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevScene}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md text-white/50 hover:text-white hover:bg-black/60 transition-all pointer-events-auto border border-white/5"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextScene}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md text-white/50 hover:text-white hover:bg-black/60 transition-all pointer-events-auto border border-white/5"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              {/* Bottom panel */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 pointer-events-auto">
                {/* Category filter */}
                <div className="flex gap-1.5 justify-center mb-3">
                  {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCategoryFilter(cat);
                        // If current scene not in new filter, switch to first
                        const newScenes = cat === 'all' ? VISUALIZER_SCENES : VISUALIZER_SCENES.filter(s => s.category === cat);
                        if (!newScenes.find(s => s.id === activeScene.id)) {
                          setActiveScene(newScenes[0]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium transition-all backdrop-blur-md border ${
                        categoryFilter === cat
                          ? 'bg-white/15 border-white/25 text-white'
                          : 'bg-black/30 border-white/5 text-white/40 hover:text-white/70'
                      }`}
                    >
                      {CATEGORY_LABELS[cat].icon} {CATEGORY_LABELS[cat].label}
                    </motion.button>
                  ))}
                </div>

                {/* Scene picker */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
                  {filteredScenes.map((scene, i) => (
                    <motion.button
                      key={scene.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveScene(scene)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-[10px] sm:text-xs font-medium transition-all backdrop-blur-md border ${
                        activeScene.id === scene.id
                          ? 'bg-white/15 border-white/30 text-white shadow-lg shadow-white/5'
                          : 'bg-black/40 border-white/5 text-white/50 hover:text-white/80 hover:bg-black/50'
                      }`}
                    >
                      <span className="mr-1">{scene.icon}</span>
                      <span className="hidden sm:inline">{scene.name}</span>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-white/20 text-[9px] sm:text-[10px] mt-2 tracking-wider">
                  ← → switch scenes • F fullscreen • B breathing guide • ESC exit • move mouse to interact
                </p>
              </div>

              {/* Scene description toast */}
              <motion.div
                key={activeScene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 top-16 sm:top-20 px-5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10"
              >
                <p className="text-white/60 text-xs sm:text-sm text-center max-w-sm">{activeScene.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
