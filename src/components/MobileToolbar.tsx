import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cardinalLogo from '@/assets/cardinal-logo.png';
import { 
  Home, 
  Sliders, 
  Sparkles, 
  Timer, 
  Heart,
  Settings,
  ChevronUp,
  Brain,
  Moon,
  Sun,
  Zap,
  Music,
  Headphones,
  X,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

interface MegaSection {
  title: string;
  icon: React.ElementType;
  items: QuickAction[];
}

export const MobileToolbar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const megaSections: MegaSection[] = [
    {
      title: 'Quick Sessions',
      icon: Zap,
      items: [
        {
          icon: Brain,
          label: 'Focus Mode',
          description: '14 Hz Beta waves',
          action: () => navigate('/presets/Focus'),
          color: 'text-primary'
        },
        {
          icon: Moon,
          label: 'Sleep Aid',
          description: '2 Hz Delta waves',
          action: () => navigate('/presets/Sleep'),
          color: 'text-accent'
        },
        {
          icon: Sparkles,
          label: 'Creative Flow',
          description: '7 Hz Theta waves',
          action: () => navigate('/presets/Creative'),
          color: 'text-dream'
        },
        {
          icon: Sun,
          label: 'Energy Boost',
          description: '20 Hz Beta waves',
          action: () => navigate('/presets/Energy'),
          color: 'text-primary'
        }
      ]
    },
    {
      title: 'Tools',
      icon: Sliders,
      items: [
        {
          icon: Sliders,
          label: 'Custom Tuner',
          description: 'Create your own',
          action: () => navigate('/custom-tuner'),
          color: 'text-primary'
        },
        {
          icon: Timer,
          label: 'Quick Timer',
          description: 'Set duration',
          action: () => {},
          color: 'text-accent'
        },
        {
          icon: Headphones,
          label: 'Audio Test',
          description: 'Check setup',
          action: () => {},
          color: 'text-dream'
        },
        {
          icon: Music,
          label: 'Frequency Ref',
          description: '432/528 Hz',
          action: () => {},
          color: 'text-primary'
        }
      ]
    },
    {
      title: 'Learn',
      icon: BookOpen,
      items: [
        {
          icon: Brain,
          label: 'Brainwaves 101',
          description: 'Understanding waves',
          action: () => {},
          color: 'text-primary'
        },
        {
          icon: Target,
          label: 'Best Practices',
          description: 'Optimize results',
          action: () => {},
          color: 'text-accent'
        },
        {
          icon: Clock,
          label: 'Session Guide',
          description: 'Timing tips',
          action: () => {},
          color: 'text-dream'
        },
        {
          icon: Headphones,
          label: 'Equipment',
          description: 'Gear guide',
          action: () => {},
          color: 'text-primary'
        }
      ]
    }
  ];

  const mainActions = [
    { icon: Home, label: 'Home', action: () => navigate('/') },
    { icon: Sliders, label: 'Tuner', action: () => navigate('/custom-tuner') },
    { icon: Sparkles, label: 'Menu', action: () => setIsExpanded(!isExpanded), isCenter: true },
    { icon: Heart, label: 'Saved', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
  ];

  return (
    <>
      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-3xl max-h-[85vh] overflow-hidden"
            >
              {/* Mega Menu Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={cardinalLogo} 
                      alt="Cardinal Binaural" 
                      className="w-10 h-10 rounded-xl shadow-soft"
                    />
                    <div>
                      <h2 className="font-semibold text-foreground">Quick Actions</h2>
                      <p className="text-xs text-muted-foreground">Access everything instantly</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                  {megaSections.map((section) => (
                    <button
                      key={section.title}
                      onClick={() => setActiveSection(activeSection === section.title ? null : section.title)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        activeSection === section.title
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mega Menu Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <AnimatePresence mode="wait">
                  {activeSection ? (
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {megaSections
                        .find((s) => s.title === activeSection)
                        ?.items.map((item, index) => (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              item.action();
                              setIsExpanded(false);
                            }}
                            className="flex flex-col items-start p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-float transition-all text-left group"
                          >
                            <div className={cn("p-2.5 rounded-xl bg-secondary mb-3 group-hover:scale-110 transition-transform", item.color)}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-foreground text-sm">{item.label}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{item.description}</span>
                          </motion.button>
                        ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {megaSections.map((section, sectionIndex) => (
                        <motion.div
                          key={section.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: sectionIndex * 0.1 }}
                        >
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <section.icon className="w-3.5 h-3.5" />
                            {section.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {section.items.slice(0, 2).map((item) => (
                              <button
                                key={item.label}
                                onClick={() => {
                                  item.action();
                                  setIsExpanded(false);
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all text-left group"
                              >
                                <div className={cn("p-2 rounded-lg bg-secondary group-hover:scale-110 transition-transform", item.color)}>
                                  <item.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-medium text-foreground text-sm block">{item.label}</span>
                                  <span className="text-xs text-muted-foreground">{item.description}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-border p-4 bg-secondary/30">
                <div className="flex items-center justify-around text-center">
                  <div>
                    <div className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">48kHz</div>
                    <div className="text-xs text-muted-foreground">Sample Rate</div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <div className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">±0.001</div>
                    <div className="text-xs text-muted-foreground">Hz Precision</div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <div className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">0ms</div>
                    <div className="text-xs text-muted-foreground">Phase Drift</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-background/95 backdrop-blur-xl border-t border-border px-2 pb-safe">
          <div className="flex items-center justify-around py-2">
            {mainActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.action}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
                  action.isCenter 
                    ? "relative -mt-6" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {action.isCenter ? (
                  <div className={cn(
                    "p-4 rounded-2xl shadow-elevated transition-all",
                    isExpanded 
                      ? "bg-foreground rotate-45" 
                      : "bg-gradient-primary"
                  )}>
                    {isExpanded ? (
                      <X className="w-6 h-6 text-background -rotate-45" />
                    ) : (
                      <action.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                ) : (
                  <>
                    <action.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{action.label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
