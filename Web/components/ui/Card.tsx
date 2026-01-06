import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-2xl border border-white/10
        bg-glass backdrop-blur-xl p-6
        ${hoverEffect ? 'hover:bg-glass-hover hover:border-primary-500/30 transition-colors duration-300' : ''}
        ${className}
      `}
    >
      {/* Subtle noise texture overlay could go here */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};