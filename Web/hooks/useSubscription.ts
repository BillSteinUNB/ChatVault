import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export type SubscriptionTier = 'hobbyist' | 'power_user' | 'team';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'unpaid';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: Error | null;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    subscription: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState({
          subscription: null,
          loading: false,
          error: null,
        });
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setState({
        subscription: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setState({
        subscription: null,
        loading: false,
        error: err as Error,
      });
    }
  };

  return {
    subscription: state.subscription,
    tier: state.subscription?.tier || 'hobbyist',
    status: state.subscription?.status || 'active',
    currentPeriodEnd: state.subscription?.current_period_end || null,
    loading: state.loading,
    error: state.error,
    refetch: fetchSubscription,
  };
}
