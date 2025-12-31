import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, FREE_INTENTS } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Waves, 
  ArrowLeft, 
  Check, 
  X, 
  Crown, 
  Zap, 
  Sparkles,
  Clock,
  Settings,
  History,
  Download,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { subscribed, isTrial, isPro, subscriptionEnd } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open subscription management',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const freeFeatures = [
    { text: `${FREE_INTENTS.length} basic preset categories`, included: true },
    { text: 'Standard audio quality', included: true },
    { text: 'Basic frequency tuner', included: true },
    { text: 'All premium presets', included: false },
    { text: 'Custom frequency creation', included: false },
    { text: 'Session history & stats', included: false },
    { text: 'Audio downloads', included: false },
  ];

  const proFeatures = [
    { text: 'All 40+ premium presets', included: true },
    { text: 'Studio-quality audio', included: true },
    { text: 'Custom frequency creation', included: true },
    { text: 'Session history & analytics', included: true },
    { text: 'Priority support', included: true },
    { text: 'Audio downloads (coming soon)', included: true },
    { text: 'Nature soundscapes (coming soon)', included: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary">
              <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold">Pricing</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Choose your plan</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">7-day free trial</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the complete Cardinal Binaural experience with all premium presets,
            custom frequency creation, and advanced analytics.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`p-6 sm:p-8 h-full border-2 ${!isPro ? 'border-border' : 'border-border/50'}`}>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Free</h2>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get started with essential binaural beats
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {!isPro && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  Current Plan
                </Button>
              )}
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`p-6 sm:p-8 h-full border-2 relative overflow-hidden ${isPro ? 'border-primary shadow-lg' : 'border-primary/50'}`}>
              {/* Popular badge */}
              <div className="absolute top-0 right-0 bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Pro</h2>
                  {isTrial && (
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                      Trial Active
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to all features and presets
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {isPro ? (
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-primary"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isTrial ? 'Trial Active' : 'Current Plan'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleManageSubscription}
                    disabled={loading}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                  {subscriptionEnd && (
                    <p className="text-xs text-center text-muted-foreground">
                      {isTrial ? 'Trial ends' : 'Renews'}: {new Date(subscriptionEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Start 7-Day Free Trial'}
                </Button>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-8">Everything You Get With Pro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { icon: Headphones, label: '40+ Presets', desc: 'Lucid dreams, astral, healing' },
              { icon: Sparkles, label: 'Custom Frequencies', desc: 'Create your own sessions' },
              { icon: History, label: 'Session History', desc: 'Track your progress' },
              { icon: Download, label: 'Downloads', desc: 'Coming soon' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 sm:p-6 rounded-xl bg-card border border-border"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ / Trust */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Cancel anytime • No questions asked • Secure payment via Stripe</p>
        </div>
      </main>
    </div>
  );
}
