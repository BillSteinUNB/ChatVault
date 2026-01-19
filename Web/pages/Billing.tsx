import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../services/supabase';
import {
  Check,
  X,
  CreditCard,
  Calendar,
  AlertCircle,
  Crown,
  Sparkles,
  ExternalLink,
  Loader2
} from 'lucide-react';

const TIER_DISPLAY_NAMES: Record<string, string> = {
  hobbyist: 'Hobbyist',
  power_user: 'Power User',
  team: 'Team'
};

const TIER_FEATURES: Record<string, string[]> = {
  hobbyist: [
    '50 Chat Index Limit',
    'Local-Only Storage',
    'Basic Search',
    'Markdown Export'
  ],
  power_user: [
    'Unlimited Chats',
    'Cloud Sync (Encrypted)',
    'Vector Search (Semantic)',
    'Notion Integration',
    'Priority Support'
  ],
  team: [
    '5 Team Members',
    'Shared Prompt Library',
    'Team Analytics',
    'SSO Enforcement',
    'Dedicated Account Manager'
  ]
};

export const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subscription, tier, status, currentPeriodEnd, loading, error, refetch } = useSubscription();

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      // Refetch subscription after successful checkout
      refetch();
    } else if (canceled === 'true') {
      console.log('Checkout canceled');
    }
  }, [searchParams, refetch]);

  const formatPeriodEnd = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpgrade = async (selectedTier: string) => {
    if (selectedTier === 'hobbyist') {
      navigate('/pricing');
      return;
    }

    setIsUpgrading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const priceIdEnv = selectedTier === 'power_user'
        ? import.meta.env.VITE_STRIPE_PRICE_POWER_USER
        : import.meta.env.VITE_STRIPE_PRICE_TEAM;

      if (!priceIdEnv) {
        throw new Error('Price ID not configured');
      }

      const { data, error: functionError } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: priceIdEnv,
          tier: selectedTier,
          userId: user.id,
          email: user.email
        },
        headers: {
          Authorization: `Bearer ${user.session?.access_token || ''}`
        }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      setIsUpgrading(false);
    }
  };

  const openStripePortal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { userId: user.id },
        headers: {
          Authorization: `Bearer ${user.session?.access_token || ''}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error opening portal:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-neutral-400">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Current Plan</h2>
            <p className="text-neutral-400 text-sm">
              {status === 'active' ? 'Your subscription is active' : 'Subscription issue detected'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            status === 'active'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {status === 'active' ? 'Active' : status}
          </div>
        </div>

        <div className="bg-neutral-900/50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              tier === 'hobbyist'
                ? 'bg-neutral-700'
                : 'bg-primary-500/20'
            }`}>
              {tier === 'hobbyist' ? (
                <CreditCard className="text-neutral-400" size={24} />
              ) : (
                <Crown className="text-primary-400" size={24} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {TIER_DISPLAY_NAMES[tier]}
              </h3>
              <p className="text-neutral-400 text-sm">
                {tier === 'hobbyist' ? 'Free Plan' : 'Paid Plan'}
              </p>
            </div>
          </div>

          {tier !== 'hobbyist' && currentPeriodEnd && (
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Calendar size={16} />
              <span>Renews on {formatPeriodEnd(currentPeriodEnd)}</span>
            </div>
          )}

          {tier === 'hobbyist' && (
            <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="text-primary-400 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">
                    Upgrade to unlock more features
                  </p>
                  <p className="text-neutral-400 text-xs">
                    Get unlimited chats, cloud sync, and advanced search with Power User or Team plans.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Features */}
        <div>
          <h4 className="text-sm font-medium text-neutral-300 mb-3">Included Features</h4>
          <div className="space-y-2">
            {TIER_FEATURES[tier].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-neutral-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Upgrade Options */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tier !== 'power_user' && (
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                tier === 'power_user'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
              }`}
              onClick={() => !isUpgrading && handleUpgrade('power_user')}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Power User</h3>
                {tier === 'power_user' && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">$12<span className="text-sm font-normal text-neutral-400">/mo</span></p>
              <p className="text-neutral-400 text-sm mb-3">For heavy AI users and developers</p>
              <Button
                variant={tier === 'power_user' ? 'secondary' : 'primary'}
                className="w-full"
                onClick={() => handleUpgrade('power_user')}
                disabled={isUpgrading || tier === 'power_user'}
              >
                {isUpgrading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : tier === 'power_user' ? (
                  'Current Plan'
                ) : (
                  'Upgrade'
                )}
              </Button>
            </div>
          )}

          {tier !== 'team' && (
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                tier === 'team'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
              }`}
              onClick={() => !isUpgrading && handleUpgrade('team')}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Team</h3>
                {tier === 'team' && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">$49<span className="text-sm font-normal text-neutral-400">/mo</span></p>
              <p className="text-neutral-400 text-sm mb-3">Shared libraries for startups</p>
              <Button
                variant={tier === 'team' ? 'secondary' : 'primary'}
                className="w-full"
                onClick={() => handleUpgrade('team')}
                disabled={isUpgrading || tier === 'team'}
              >
                {isUpgrading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : tier === 'team' ? (
                  'Current Plan'
                ) : (
                  'Upgrade'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Manage Subscription */}
      {tier !== 'hobbyist' && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Manage Subscription</h2>
          <p className="text-neutral-400 text-sm mb-4">
            Update payment method, view invoices, or cancel your subscription through the Stripe Customer Portal.
          </p>
          <Button
            variant="secondary"
            onClick={openStripePortal}
            className="w-full md:w-auto"
          >
            <ExternalLink size={16} className="mr-2" />
            Open Stripe Portal
          </Button>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mt-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-white font-medium mb-1">Failed to load subscription</h3>
              <p className="text-neutral-400 text-sm">{error.message}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => refetch()}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
