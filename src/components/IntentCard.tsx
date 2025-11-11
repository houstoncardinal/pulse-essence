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

const intentGradients = {
  Focus: 'from-primary/20 to-primary/5',
  Study: 'from-accent/20 to-accent/5',
  Sleep: 'from-indigo-500/20 to-indigo-500/5',
  Calm: 'from-emerald-500/20 to-emerald-500/5',
  Creative: 'from-violet-500/20 to-violet-500/5',
  Meditation: 'from-amber-500/20 to-amber-500/5',
  Energy: 'from-rose-500/20 to-rose-500/5',
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
  const gradient = intentGradients[intent as keyof typeof intentGradients] || intentGradients.Focus;

  return (
    <Card
      onClick={() => navigate(`/presets/${intent.toLowerCase()}`)}
      className="group relative overflow-hidden cursor-pointer border-2 border-glass-border bg-glass-bg backdrop-blur-xl shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] hover:border-primary/50 h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-20 group-hover:animate-shimmer" />
      
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="inline-flex p-5 rounded-2xl bg-gradient-primary shadow-glow group-hover:shadow-luxury group-hover:scale-110 transition-all duration-500 animate-float">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs font-bold text-primary">{presetCount}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {intent}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
          {description}
        </p>

        {/* Preset Previews */}
        <div className="mt-auto space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Featured Sessions
          </div>
          {presets.slice(0, 3).map((preset, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-xs text-foreground/90 truncate flex-1">{preset.name}</span>
              <span className={`text-xs font-bold ${tuningColors[preset.tuning_ref] || 'text-primary'} ml-2 flex-shrink-0`}>
                {preset.tuning_ref}Hz
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-glass-border flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            View All
          </span>
          <span className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
            Explore →
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity duration-500" />
    </Card>
  );
}
