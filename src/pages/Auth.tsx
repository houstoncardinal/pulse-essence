import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SEOHead, PageSchemas } from '@/components/seo';
import cardinalLogo from '@/assets/cardinal-logo.png';
import { motion } from 'framer-motion';
import { Waves, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: isSignUp ? 'Account created successfully!' : 'Welcome back!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Sign In - Cardinal Binaural | Access Your Frequency Sessions"
        description="Sign in or create an account to access Cardinal Binaural's premium features, save your sessions, and track your manifestation journey."
        canonical="/auth"
        noindex={true}
      />
      <PageSchemas pageType="auth" />
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-xl border-border shadow-elevated">
            <div className="flex flex-col items-center mb-8">
              <motion.img 
                src={cardinalLogo} 
                alt="Cardinal Binaural" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-float mb-4"
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cardinal Binaural</h1>
              <p className="text-muted-foreground mt-2 text-center text-sm">
                Align your frequency. Manifest your reality.
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isSignUp ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isSignUp ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="h-11"
                />
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 h-11 text-sm font-semibold gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 p-3 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 justify-center">
                <Waves className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground text-center">
                  Not medical advice. Use responsibly. Avoid while driving or operating machinery.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
