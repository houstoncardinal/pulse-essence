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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-card/80 backdrop-blur-xl border-border shadow-elevated">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img 
            src={cardinalLogo} 
            alt="Cardinal Binaural" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-float mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cardinal Binaural</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm sm:text-base">
            Align your frequency. Manifest your reality.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-glass-border">
          <p className="text-xs text-muted-foreground text-center">
            Not medical advice. Use responsibly. Avoid while driving or operating machinery.
          </p>
        </div>
      </Card>
    </div>
    </>
  );
}
