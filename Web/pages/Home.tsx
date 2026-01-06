import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProblemMarquee } from '../components/home/ProblemMarquee';
import { AwsDiagram } from '../components/home/AwsDiagram';
import { Zap, Shield, Globe, Database, Cpu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 overflow-x-hidden">
      
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative px-6 max-w-7xl mx-auto mb-24 md:mb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
              v2.0 NOW LIVE
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Bring Order to Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">AI Chaos.</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-lg">
              The comprehensive workspace for ChatGPT, Claude, and Gemini. Search, tag, and organize 10,000+ prompts in milliseconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="work@company.com" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-64 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <Button>Add to Chrome - Free</Button>
            </div>
            <p className="mt-4 text-xs text-neutral-500">
              No credit card required. Rated 4.9/5 by 10k+ devs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateY: 30, rotateX: 10, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: -12, rotateX: 6, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative perspective-1000 hidden lg:block"
          >
            {/* Simulated 3D Interface */}
            <div className="relative w-full aspect-[4/3] bg-neutral-900 rounded-xl border border-white/10 shadow-2xl shadow-primary-500/20 overflow-hidden transform-style-3d group hover:rotate-0 transition-transform duration-700">
               {/* Header of fake app */}
               <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
               </div>
               {/* Body of fake app */}
               <div className="flex h-full">
                 <div className="w-1/3 border-r border-white/10 p-4 space-y-3 bg-neutral-900/50">
                   <div className="h-2 w-20 bg-white/10 rounded" />
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-8 w-full bg-white/5 rounded flex items-center px-2">
                       <div className="w-4 h-4 bg-white/10 rounded-full mr-2" />
                       <div className="h-2 w-16 bg-white/10 rounded" />
                     </div>
                   ))}
                 </div>
                 <div className="flex-1 p-6 space-y-4">
                   <div className="flex items-center gap-2 mb-8">
                     <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded border border-primary-500/30">Vector Search</span>
                     <div className="h-8 flex-1 bg-white/5 rounded border border-white/10" />
                   </div>
                   <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-white/20 rounded" />
                      <div className="h-2 w-1/2 bg-white/20 rounded" />
                      <div className="h-2 w-5/6 bg-white/20 rounded" />
                   </div>
                 </div>
               </div>
               
               {/* Floating Overlay Element */}
               <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-8 right-8 bg-neutral-900 border border-emerald-500/30 p-4 rounded-lg shadow-xl z-20"
               >
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                     <Zap size={18} />
                   </div>
                   <div>
                     <div className="text-xs text-neutral-400">Indexing Speed</div>
                     <div className="text-sm font-bold text-white">12ms / 1k chats</div>
                   </div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------- PROBLEM MARQUEE ----------------- */}
      <section className="mb-32">
        <div className="text-center mb-8">
          <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">The Problem</p>
          <h2 className="text-2xl font-bold text-white mt-2">Stop losing your best ideas to the void</h2>
        </div>
        <ProblemMarquee />
      </section>

      {/* ----------------- FEATURE GRID ----------------- */}
      <section id="features" className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 min-h-[300px] flex flex-col justify-between group">
             <div>
               <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4">
                 <Search />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Instant Search</h3>
               <p className="text-neutral-400">Type "React Hooks" and find that snippet from 3 months ago instantly. Powered by Fuse.js and local indexing.</p>
             </div>
             <div className="mt-8 bg-neutral-950 rounded-lg border border-white/10 p-4 font-mono text-sm text-neutral-500 relative overflow-hidden">
               <span className="text-primary-400">{">"}</span> searching index...
               <br/>
               <span className="text-emerald-400">found 3 results in 4ms</span>
             </div>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
               <Shield />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Local-First</h3>
            <p className="text-neutral-400 text-sm">Your data lives in Chrome Storage. Cloud sync is strictly opt-in and end-to-end encrypted.</p>
          </Card>

          <Card className="">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
               <Cpu />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multi-Model</h3>
            <p className="text-neutral-400 text-sm">Unified timeline for ChatGPT, Claude, and Gemini.</p>
          </Card>

          <Card className="md:col-span-2">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                  <Database />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Data Liberation</h3>
                <p className="text-neutral-400">Export to Markdown, JSON, or Notion. You own your intellectual property.</p>
                <button className="mt-4 text-sm text-white underline decoration-white/30 hover:decoration-white transition-all">
                  View Developer API &rarr;
                </button>
              </div>
              <div className="w-full md:w-1/2 bg-neutral-950 rounded-lg border border-white/10 p-4 font-mono text-xs text-neutral-400 shadow-inner">
                <p>$ chatvault export --format=json</p>
                <p className="text-yellow-500 mt-2">Exporting 1,204 conversations...</p>
                <p className="text-emerald-500">Done. Saved to ./vault-backup.json</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ----------------- AWS ARCHITECTURE ----------------- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise-Grade Infrastructure</h2>
          <p className="text-neutral-400">Built on AWS Serverless. Scalable, secure, and resilient.</p>
        </div>
        <AwsDiagram />
      </section>

      {/* ----------------- CTA ----------------- */}
      <section className="max-w-4xl mx-auto px-6 mb-32 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Your second brain deserves an upgrade.</h2>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => window.open('https://chrome.google.com', '_blank')}>Install Extension</Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/pricing')}>View Pricing</Button>
        </div>
      </section>
    </div>
  );
};