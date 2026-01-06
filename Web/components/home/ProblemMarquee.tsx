import React from 'react';
import { motion } from 'framer-motion';

const CHAOTIC_CHATS = [
  "Untitled Conversation", "New Chat", "Help with CSS...", "Untitled (1)",
  "React bug fix", "New Chat", "Recipe for...", "Untitled (2)",
  "Explain Quantum...", "New Chat", "Debug python...", "Untitled (3)",
  "Marketing copy...", "New Chat", "SQL Query help", "Untitled (4)"
];

export const ProblemMarquee: React.FC = () => {
  return (
    <div className="w-full py-12 bg-neutral-950 overflow-hidden relative border-y border-white/5">
      {/* Vignettes */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />
      
      <motion.div 
        className="flex whitespace-nowrap gap-8"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...CHAOTIC_CHATS, ...CHAOTIC_CHATS, ...CHAOTIC_CHATS].map((text, i) => (
          <div 
            key={i} 
            className="inline-flex items-center px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-neutral-500 font-mono text-sm whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-neutral-700 mr-2" />
            {text}
          </div>
        ))}
      </motion.div>
    </div>
  );
};