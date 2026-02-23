import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Waves } from "lucide-react";
import { SEOHead } from '@/components/seo';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found - Cardinal Binaural"
        description="The page you're looking for doesn't exist. Return to Cardinal Binaural to explore binaural beats and frequency alignment tools."
        noindex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Waves className="w-16 h-16 text-primary/40 mx-auto mb-6" />
          </motion.div>
          <h1 className="mb-3 text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
          <p className="mb-2 text-xl font-medium text-foreground">Frequency not found</p>
          <p className="mb-8 text-sm text-muted-foreground max-w-sm mx-auto">
            This page doesn't exist in our frequency spectrum. Let's get you back on track.
          </p>
          <Button onClick={() => window.location.href = '/'} className="bg-gradient-primary gap-2 px-6">
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
