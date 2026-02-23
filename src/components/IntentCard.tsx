import { Brain, Moon, Heart, Lightbulb, Zap, Volume2, Sparkles, Leaf, Sun, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSubscription, FREE_INTENTS } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const intentIcons: Record<string, any> = {
  Focus: Brain,
  Study: Lightbulb,
  Sleep: Moon,
  Calm: Heart,
  Creative: Zap,
  Meditation: Volume2,
  Energy: Sun,
  Healing: Leaf,
  Manifestation: Sparkles,
  Relaxation: Heart,
  Spiritual: Eye,
};

const intentGradients: Record<string, string> = {
  Focus: 'from-blue-500/10 to-cyan-500/5',
  Study: 'from-amber-500/10 to-yellow-500/5',
  Sleep: 'from-indigo-500/10 to-purple-500/5',
  Calm: 'from-teal-500/10 to-emerald-500/5',
  Creative: 'from-orange-500/10 to-rose-500/5',
  Meditation: 'from-violet-500/10 to-purple-500/5',
  Energy: 'from-red-500/10 to-orange-500/5',
  Healing: 'from-emerald-500/10 to-green-500/5',
  Manifestation: 'from-primary/10 to-accent/5',
  Relaxation: 'from-sky-500/10 to-blue-500/5',
  Spiritual: 'from-fuchsia-500/10 to-violet-500/5',
};

interface IntentCardProps {
  intent: string;
  description: string;
  presetCount: number;
  presets: Array<{ name: string; tuning_ref: number }>;
}

export function IntentCard({ intent, description, presetCount, presets }: IntentCardProps) {
  const navigate = useNavigate();
  const { isPro } = useSubscription();
  const Icon = intentIcons[intent] || Brain;
  const gradient = intentGradients[intent] || 'from-primary/10 to-accent/5';

  const handleClick = () => {
    navigate(`/presets/${intent}`);
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        onClick={handleClick}
        className="group relative cursor-pointer border border-border bg-card hover:border-primary/30 hover:shadow-float transition-all duration-300 h-full overflow-hidden"
      >
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative p-4 sm:p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4 sm:mb-5">
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">
                {presetCount} sessions
              </span>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {intent}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 leading-relaxed flex-1">
            {description}
          </p>

          {/* Preset Previews */}
          <div className="space-y-1.5 pt-3 sm:pt-4 border-t border-border">
            {presets.slice(0, 3).map((preset, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs group/preset"
              >
                <span className="text-muted-foreground truncate flex-1 pr-2 group-hover/preset:text-foreground transition-colors">{preset.name}</span>
                <span className="text-primary/60 flex-shrink-0 font-mono text-[11px]">
                  {preset.tuning_ref}Hz
                </span>
              </div>
            ))}
          </div>

          {/* Hover CTA */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs font-medium text-primary flex items-center gap-1">
              Explore sessions →
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
