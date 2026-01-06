import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Hobbyist',
    price: '$0',
    desc: 'Perfect for getting organized locally.',
    features: ['50 Chat Index Limit', 'Local-Only Storage', 'Basic Search', 'Markdown Export'],
    cta: 'Add to Chrome',
    popular: false
  },
  {
    name: 'Power User',
    price: '$12',
    period: '/mo',
    desc: 'For heavy AI users and developers.',
    features: ['Unlimited Chats', 'Cloud Sync (Encrypted)', 'Vector Search (Semantic)', 'Notion Integration', 'Priority Support'],
    cta: 'Start 14-Day Trial',
    popular: true
  },
  {
    name: 'Team',
    price: '$49',
    period: '/mo',
    desc: 'Shared libraries for startups.',
    features: ['5 Team Members', 'Shared Prompt Library', 'Team Analytics', 'SSO Enforcement', 'Dedicated Account Mgr'],
    cta: 'Contact Sales',
    popular: false
  }
];

export const Pricing: React.FC = () => {
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

            <Button variant={tier.popular ? 'primary' : 'secondary'} className="w-full">
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};