import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    success: "bg-accent-100 text-accent-600",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-gray-100 text-gray-600",
    primary: "bg-primary-100 text-primary-700",
  };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};