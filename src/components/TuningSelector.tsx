import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TuningSelectorProps {
  selected: number;
  onChange: (tuning: number) => void;
}

const tunings = [
  { value: 440, label: '440 Hz', description: 'Standard Concert Pitch' },
  { value: 432, label: '432 Hz', description: 'Universal Harmony' },
  { value: 528, label: '528 Hz', description: 'Solfeggio Healing' },
];

export function TuningSelector({ selected, onChange }: TuningSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Music className="w-4 h-4" />
        <span className="text-sm font-medium">Frequency Tuning</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {tunings.map((tuning) => (
          <button
            key={tuning.value}
            onClick={() => onChange(tuning.value)}
            className={`
              relative overflow-hidden group p-4 rounded-xl border-2 transition-all duration-300
              ${
                selected === tuning.value
                  ? 'border-primary bg-gradient-primary text-white shadow-glow scale-105'
                  : 'border-glass-border bg-glass-bg/50 hover:border-primary/50 hover:shadow-card'
              }
            `}
          >
            {selected === tuning.value && (
              <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-30" />
            )}
            
            <div className="relative z-10">
              <div className={`text-xl font-bold mb-1 ${selected === tuning.value ? 'text-white' : 'text-foreground'}`}>
                {tuning.label}
              </div>
              <div className={`text-xs ${selected === tuning.value ? 'text-white/90' : 'text-muted-foreground'}`}>
                {tuning.description}
              </div>
            </div>

            {selected === tuning.value && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-tl-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
