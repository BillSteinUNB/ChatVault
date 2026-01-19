import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle
}) => {
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {Icon && (
          <Icon className="w-5 h-5 text-primary-400" />
        )}
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      {subtitle && (
        <p className="text-sm text-neutral-400">{subtitle}</p>
      )}
    </div>
  );
};
