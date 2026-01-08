import React from 'react';
import { motion } from 'framer-motion';

export const AwsDiagram: React.FC = () => {
  const nodes = [
    { id: 'client', label: 'Extension', x: 50, y: 150, color: '#A78BFA' },
    { id: 'gateway', label: 'API Gateway', x: 250, y: 150, color: '#34D399' },
    { id: 'lambda', label: 'Lambda (Bedrock Proxy)', x: 450, y: 150, color: '#F472B6' },
    { id: 'dynamo', label: 'DynamoDB (Request Logs)', x: 650, y: 150, color: '#60A5FA' },
    { id: 's3', label: 'S3 (Export Archives)', x: 650, y: 250, color: '#FBBF24' },
  ];

  return (
    <div className="w-full h-[400px] relative flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-neutral-950/50 to-neutral-950" />
      
      <svg className="w-full h-full max-w-[800px] z-10" viewBox="0 0 800 300">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Connections */}
        <path d="M50 150 L250 150" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M250 150 L450 150" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M450 150 L650 150" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M450 150 L450 250 L650 250" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" fill="none" className="opacity-50" />

        {/* Data Packets Animation */}
        <motion.circle r="4" fill="#fff" filter="drop-shadow(0 0 4px #fff)">
          <animateMotion 
            dur="2s" 
            repeatCount="indefinite" 
            path="M50 150 L250 150 L450 150 L650 150"
          />
        </motion.circle>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id}>
             <motion.circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill="#171717"
              stroke={node.color}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, filter: `drop-shadow(0 0 15px ${node.color})` }}
            />
            <motion.text
              x={node.x}
              y={node.y + 50}
              fill="#A3A3A3"
              fontSize="12"
              textAnchor="middle"
              className="font-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              {node.label}
            </motion.text>
            {/* Icon placeholder inside node */}
            <text x={node.x} y={node.y + 5} textAnchor="middle" fill={node.color} fontSize="14" fontWeight="bold">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="absolute bottom-4 right-6 text-xs text-neutral-500 font-mono">
        TLS 1.3 ENCRYPTED TUNNEL
      </div>
    </div>
  );
};