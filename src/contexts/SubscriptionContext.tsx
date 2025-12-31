import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionStatus {
  subscribed: boolean;
  isTrial: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

interface SubscriptionContextType extends SubscriptionStatus {
  checkSubscription: () => Promise<void>;
  isPro: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// AuralForge Pro product ID
const PRO_PRODUCT_ID = "prod_ThgUgtdm3wTY5I";

// Free tier presets (3 basic ones)
export const FREE_INTENTS = ['Focus', 'Sleep', 'Calm'];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    isTrial: false,
    productId: null,
    subscriptionEnd: null,
    loading: true,
  });

  const checkSubscription = async () => {
    if (!session) {
      setStatus({
        subscribed: false,
        isTrial: false,
        productId: null,
        subscriptionEnd: null,
        loading: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setStatus({
        subscribed: data.subscribed,
        isTrial: data.is_trial,
        productId: data.product_id,
        subscriptionEnd: data.subscription_end,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setStatus({
        subscribed: false,
        isTrial: false,
        productId: null,
        subscriptionEnd: null,
        loading: false,
      });
    }
  }, [user, session]);

  // Refresh subscription status periodically (every 60 seconds)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, session]);

  const isPro = status.subscribed && status.productId === PRO_PRODUCT_ID;

  return (
    <SubscriptionContext.Provider value={{ 
      ...status, 
      checkSubscription,
      isPro,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
