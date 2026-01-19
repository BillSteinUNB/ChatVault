import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top' }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default: // top
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`absolute z-50 px-2 py-1 ${getPositionClasses()} pointer-events-none`}
      >
        <div className="relative bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
          {text}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2'
                : position === 'top'
                ? '-bottom-1 left-1/2 -translate-x-1/2'
                : position === 'left'
                ? '-right-1 top-1/2 -translate-y-1/2'
                : '-left-1 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
