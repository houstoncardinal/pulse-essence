import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  beatHz: number;
  baseFreq?: number;
  mode?: 'binaural' | 'monaural' | 'isochronic';
}

export function WaveformVisualizer({ 
  isPlaying, 
  beatHz, 
  baseFreq = 200,
  mode = 'binaural' 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Define colors that work with Canvas API (actual color values, not CSS variables)
    const primaryColor = { h: 160, s: 60, l: 45 }; // Soft green
    const accentColor = { h: 220, s: 70, l: 60 }; // Baby blue
    
    const hsla = (color: typeof primaryColor, alpha: number) => 
      `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;

    if (!isPlaying) {
      // Draw idle state - subtle pulsing circle
      const idleRadius = Math.min(width, height) * 0.25;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, idleRadius
      );
      gradient.addColorStop(0, hsla(primaryColor, 0.15));
      gradient.addColorStop(0.7, hsla(primaryColor, 0.05));
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, idleRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, idleRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = hsla(primaryColor, 0.2);
      ctx.lineWidth = 1;
      ctx.stroke();

      return;
    }

    const time = phaseRef.current;
    
    // Base parameters
    const baseRadius = Math.min(width, height) * 0.28;
    const breatheScale = 1 + Math.sin(time * beatHz * 0.1) * 0.08;
    
    // Draw outer glow rings
    for (let i = 3; i >= 0; i--) {
      const ringRadius = baseRadius * (1.2 + i * 0.15) * breatheScale;
      const alpha = 0.08 - i * 0.015;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hsla(primaryColor, alpha);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Main radial gradient
    const mainGradient = ctx.createRadialGradient(
      centerX, centerY, baseRadius * 0.3 * breatheScale,
      centerX, centerY, baseRadius * 1.3 * breatheScale
    );
    mainGradient.addColorStop(0, hsla(primaryColor, 0.25));
    mainGradient.addColorStop(0.4, hsla(primaryColor, 0.12));
    mainGradient.addColorStop(0.7, hsla(accentColor, 0.06));
    mainGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 1.3 * breatheScale, 0, Math.PI * 2);
    ctx.fillStyle = mainGradient;
    ctx.fill();

    // Draw frequency wave rings
    const numWaves = mode === 'isochronic' ? 6 : 8;
    for (let i = 0; i < numWaves; i++) {
      const wavePhase = time * (0.5 + i * 0.1) + (i * Math.PI) / numWaves;
      const waveRadius = baseRadius * (0.4 + i * 0.12) * breatheScale;
      const waveAmplitude = 3 + Math.sin(wavePhase * beatHz * 0.05) * 2;
      
      ctx.beginPath();
      
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.02) {
        const wobble = Math.sin(angle * 4 + wavePhase) * waveAmplitude;
        const r = waveRadius + wobble;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      const alpha = 0.15 - i * 0.012;
      ctx.strokeStyle = i % 2 === 0 
        ? hsla(primaryColor, alpha) 
        : hsla(accentColor, alpha);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw central pulsing core
    const coreRadius = baseRadius * 0.25 * breatheScale;
    const coreGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, coreRadius
    );
    coreGradient.addColorStop(0, hsla(primaryColor, 0.6));
    coreGradient.addColorStop(0.5, hsla(primaryColor, 0.3));
    coreGradient.addColorStop(1, hsla(primaryColor, 0));

    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();

    // Draw beat frequency indicator dots
    const dotCount = Math.min(Math.round(beatHz), 12);
    for (let i = 0; i < dotCount; i++) {
      const dotAngle = (i / dotCount) * Math.PI * 2 + time * 0.3;
      const dotRadius = baseRadius * 0.85 * breatheScale;
      const dotX = centerX + Math.cos(dotAngle) * dotRadius;
      const dotY = centerY + Math.sin(dotAngle) * dotRadius;
      const dotSize = 2 + Math.sin(time * beatHz * 0.2 + i) * 1;
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = hsla(accentColor, 0.5 + Math.sin(time + i) * 0.3);
      ctx.fill();
    }

    // Draw mode-specific effects
    if (mode === 'isochronic') {
      // Pulsing bars for isochronic
      const barCount = 8;
      const barWidth = 3;
      for (let i = 0; i < barCount; i++) {
        const barAngle = (i / barCount) * Math.PI * 2;
        const barIntensity = Math.abs(Math.sin(time * beatHz * 0.3));
        const barLength = baseRadius * 0.3 * barIntensity * breatheScale;
        const startR = baseRadius * 0.95 * breatheScale;
        
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(barAngle) * startR,
          centerY + Math.sin(barAngle) * startR
        );
        ctx.lineTo(
          centerX + Math.cos(barAngle) * (startR + barLength),
          centerY + Math.sin(barAngle) * (startR + barLength)
        );
        ctx.strokeStyle = hsla(primaryColor, 0.4 * barIntensity);
        ctx.lineWidth = barWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    phaseRef.current += 0.016;
    animationRef.current = requestAnimationFrame(draw);
  }, [isPlaying, beatHz, mode]);

  useEffect(() => {
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  useEffect(() => {
    if (isPlaying) {
      draw();
    }
  }, [isPlaying, draw]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full aspect-square max-w-sm mx-auto"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full"
      />
      
      {/* Frequency Display Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <motion.div
            key={beatHz}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          >
            {beatHz.toFixed(1)} Hz
          </motion.div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 capitalize">
            {mode} • {isPlaying ? 'Active' : 'Ready'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
