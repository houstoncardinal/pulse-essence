import { Brain, Moon, Heart, Lightbulb, Zap, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const intentIcons = {
  Focus: Brain,
  Study: Lightbulb,
  Sleep: Moon,
  Calm: Heart,
  Creative: Zap,
  Meditation: Volume2,
  Energy: Zap,
};


interface IntentCardProps {
  intent: string;
  description: string;
  presetCount: number;
  presets: Array<{ name: string; tuning_ref: number }>;
}

const tuningColors: Record<number, string> = {
  440: 'text-primary',
  432: 'text-accent',
  528: 'text-emerald-500',
};

export function IntentCard({ intent, description, presetCount, presets }: IntentCardProps) {
  const navigate = useNavigate();
  const Icon = intentIcons[intent as keyof typeof intentIcons] || Brain;

  return (
    <Card
      onClick={() => navigate(`/presets/${intent.toLowerCase()}`)}
      className="group relative cursor-pointer border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-float h-full"
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {presetCount} sessions
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
          {intent}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
          {description}
        </p>

        {/* Preset Previews */}
        <div className="mt-auto space-y-2 pt-3 sm:pt-4 border-t border-border">
          {presets.slice(0, 3).map((preset, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground truncate flex-1 pr-2">{preset.name}</span>
              <span className="text-primary/70 flex-shrink-0 font-medium">
                {preset.tuning_ref}Hz
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
