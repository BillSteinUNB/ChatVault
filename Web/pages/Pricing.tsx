import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Check, Mail, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabase';

const tiers = [
  {
    name: 'Hobbyist',
    price: '$0',
    desc: 'Perfect for getting organized locally.',
    features: ['50 Chat Index Limit', 'Local-Only Storage', 'Basic Search', 'Markdown Export'],
    cta: 'Add to Chrome',
    popular: false,
    actionType: 'external'
  },
  {
    name: 'Power User',
    price: '$12',
    period: '/mo',
    desc: 'For heavy AI users and developers.',
    features: ['Unlimited Chats', 'Cloud Sync (Encrypted)', 'Vector Search (Semantic)', 'Notion Integration', 'Priority Support'],
    cta: 'Join Waitlist',
    popular: true,
    actionType: 'waitlist'
  },
  {
    name: 'Team',
    price: '$49',
    period: '/mo',
    desc: 'Shared libraries for startups.',
    features: ['5 Team Members', 'Shared Prompt Library', 'Team Analytics', 'SSO Enforcement', 'Dedicated Account Mgr'],
    cta: 'Join Waitlist',
    popular: false,
    actionType: 'waitlist'
  }
];

export const Pricing: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCTAClick = (tier: typeof tiers[0]) => {
    if (tier.actionType === 'external') {
      window.open('https://chrome.google.com/webstore', '_blank');
    } else {
      setSelectedTier(tier.name);
      setIsWaitlistOpen(true);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, tier: selectedTier, created_at: new Date().toISOString() }]);

      if (error) throw error;

      setSubmitStatus('success');
      setEmail('');
      setTimeout(() => {
        setIsWaitlistOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing.</h1>
        <p className="text-xl text-neutral-400">Invest in your productivity toolkit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card 
            key={tier.name} 
            className={`flex flex-col ${tier.popular ? 'border-primary-500/50 bg-primary-900/10' : ''}`}
            hoverEffect={false}
          >
            {tier.popular && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              <p className="text-neutral-400 text-sm mt-2 h-10">{tier.desc}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-neutral-500 ml-1">{tier.period}</span>}
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {tier.features.map((feat) => (
                <div key={feat} className="flex items-center gap-3 text-sm text-neutral-300">
                  <Check size={16} className="text-emerald-400" />
                  {feat}
                </div>
              ))}
            </div>

            <Button 
              variant={tier.popular ? 'primary' : 'secondary'} 
              className="w-full"
              onClick={() => handleCTAClick(tier)}
            >
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)}
        title={`Join the ${selectedTier} Waitlist`}
      >
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-neutral-400">We'll notify you when {selectedTier} launches.</p>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <p className="text-neutral-300 text-sm">
              Get early access to ChatVault {selectedTier} plan. We'll email you when we launch.
            </p>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm">Failed to join waitlist. Please try again.</p>
            )}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </Button>
            <p className="text-xs text-neutral-500 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
};
