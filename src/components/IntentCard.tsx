import { Brain, Moon, Heart, Lightbulb, Zap, Volume2, Lock, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSubscription, FREE_INTENTS } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';

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
  432: 'text-accent',
  528: 'text-emerald-500',
};

export function IntentCard({ intent, description, presetCount, presets }: IntentCardProps) {
  const navigate = useNavigate();
  const { isPro, loading } = useSubscription();
  const Icon = intentIcons[intent as keyof typeof intentIcons] || Brain;
  
  // Check if this intent is available for free users
  const isFreeIntent = FREE_INTENTS.includes(intent);
  const isLocked = !isPro && !isFreeIntent;

  const handleClick = () => {
    if (isLocked) {
      navigate('/pricing');
    } else {
      navigate(`/presets/${intent.toLowerCase()}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`group relative cursor-pointer border transition-all duration-300 h-full ${
        isLocked 
          ? 'border-border/50 bg-card/50 hover:border-primary/20' 
          : 'border-border bg-card hover:border-primary/30 hover:shadow-float'
      }`}
    >
      {/* Pro badge */}
      {!isFreeIntent && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant={isPro ? "default" : "secondary"} className="text-[10px] gap-1">
            <Crown className="w-3 h-3" />
            PRO
          </Badge>
        </div>
      )}
      
      {/* Lock overlay for non-pro users */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg z-[5] flex items-center justify-center">
          <div className="text-center p-4">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Upgrade to Pro</p>
          </div>
        </div>
      )}

      <div className={`p-4 sm:p-6 h-full flex flex-col ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className={`p-2.5 sm:p-3 rounded-xl transition-colors ${
            isLocked ? 'bg-muted' : 'bg-primary/5 group-hover:bg-primary/10'
          }`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`} />
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
