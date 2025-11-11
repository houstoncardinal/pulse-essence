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
      className="group relative overflow-hidden cursor-pointer border-glass-border bg-glass-bg backdrop-blur-xl shadow-card hover:shadow-glow transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative p-8">
        <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {intent}
        </h3>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <span className="text-sm text-muted-foreground">
            {presetCount} sessions
          </span>
          <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Explore →
          </span>
        </div>
      </div>
    </Card>
  );
}
