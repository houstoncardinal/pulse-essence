import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  beatHz: number;
}

export function WaveformVisualizer({ isPlaying, beatHz }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;

      // Create radial gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, baseRadius * 1.5);
      gradient.addColorStop(0, 'hsl(188, 85%, 45%, 0.3)');
      gradient.addColorStop(0.5, 'hsl(188, 85%, 45%, 0.15)');
      gradient.addColorStop(1, 'hsl(188, 85%, 45%, 0)');

      // Draw breathing circle
      const breatheScale = 1 + Math.sin(phase) * 0.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * breatheScale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw pulsing ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * breatheScale, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(188, 85%, 45%, ${0.3 + Math.sin(phase) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      phase += (beatHz / 60) * 0.1;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, beatHz]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full h-full max-w-md mx-auto"
    />
  );
}
