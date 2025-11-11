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
}

export function IntentCard({ intent, description, presetCount }: IntentCardProps) {
  const navigate = useNavigate();
  const Icon = intentIcons[intent as keyof typeof intentIcons] || Brain;
  const gradient = intentGradients[intent as keyof typeof intentGradients] || intentGradients.Focus;

  return (
    <Card
      onClick={() => navigate(`/presets/${intent.toLowerCase()}`)}
      className="group relative overflow-hidden cursor-pointer border-2 border-glass-border bg-glass-bg backdrop-blur-xl shadow-card hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] hover:border-primary/50"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-20 group-hover:animate-shimmer" />
      
      <div className="relative p-8">
        <div className="mb-6 inline-flex p-5 rounded-2xl bg-gradient-primary shadow-glow group-hover:shadow-luxury group-hover:scale-110 transition-all duration-500 animate-float">
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {intent}
        </h3>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-2 border-glass-border">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {presetCount} sessions
          </span>
          <span className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
            Explore →
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity duration-500" />
    </Card>
  );
}
