import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import { type AmbientSoundType, getAmbientEngine } from '@/lib/ambientEngine';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export interface AmbientSound {
  id: AmbientSoundType;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Gentle Rain', description: 'Calming rainfall with soft droplets', icon: '🌧️', gradient: 'from-blue-500/20 to-slate-500/20' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Rolling waves on a peaceful shore', icon: '🌊', gradient: 'from-cyan-500/20 to-blue-600/20' },
  { id: 'wind', name: 'Mountain Wind', description: 'Gentle breeze through valleys', icon: '🍃', gradient: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'birds', name: 'Bird Song', description: 'Natural birdsong in a sunlit forest', icon: '🐦', gradient: 'from-amber-500/20 to-yellow-500/20' },
  { id: 'campfire', name: 'Campfire', description: 'Warm crackling fire under the stars', icon: '🔥', gradient: 'from-orange-500/20 to-red-500/20' },
  { id: 'waterfall', name: 'Waterfall', description: 'Majestic cascading water', icon: '💧', gradient: 'from-sky-500/20 to-indigo-500/20' },
  { id: 'crickets', name: 'Night Crickets', description: 'Peaceful evening chorus', icon: '🦗', gradient: 'from-violet-500/20 to-purple-500/20' },
  { id: 'farmhouse', name: 'Farm House', description: 'Rustic countryside ambiance', icon: '🏡', gradient: 'from-lime-500/20 to-green-600/20' },
  { id: 'camping', name: 'Night Camping', description: 'Campfire, crickets & gentle wind', icon: '⛺', gradient: 'from-stone-500/20 to-amber-600/20' },
  { id: 'thunderstorm', name: 'Thunderstorm', description: 'Dramatic rain with distant thunder', icon: '⛈️', gradient: 'from-gray-500/20 to-zinc-600/20' },
  { id: 'stream', name: 'Forest Stream', description: 'Bubbling brook through the woods', icon: '🏞️', gradient: 'from-teal-500/20 to-emerald-600/20' },
  { id: 'whitenoise', name: 'White Noise', description: 'Clean ambient masking sound', icon: '📻', gradient: 'from-neutral-500/20 to-gray-500/20' },
];

interface AmbientSoundCardProps {
  sound: AmbientSound;
  activeSound: AmbientSoundType | null;
  onPlay: (type: AmbientSoundType) => void;
  onStop: () => void;
}

export function AmbientSoundCard({ sound, activeSound, onPlay, onStop }: AmbientSoundCardProps) {
  const isActive = activeSound === sound.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`group relative cursor-pointer border transition-all duration-300 overflow-hidden ${
          isActive
            ? 'border-primary shadow-float bg-primary/5'
            : 'border-border bg-card hover:border-primary/30 hover:shadow-float'
        }`}
        onClick={() => (isActive ? onStop() : onPlay(sound.id))}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${sound.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isActive ? '!opacity-100' : ''}`} />

        <div className="relative p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{sound.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                {sound.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {sound.description}
              </p>
            </div>
            <Button
              size="icon"
              variant={isActive ? 'default' : 'secondary'}
              className={`h-8 w-8 flex-shrink-0 transition-all ${
                isActive ? 'bg-primary shadow-glow' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                isActive ? onStop() : onPlay(sound.id);
              }}
            >
              {isActive ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          {/* Active indicator */}
          {isActive && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full mt-2"
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
