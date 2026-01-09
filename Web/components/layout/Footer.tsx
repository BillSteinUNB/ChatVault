import React from 'react';
import { Layers, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-white">
                <Layers size={14} />
              </div>
              <span className="font-bold text-white">ChatVault</span>
            </div>
            <p className="text-neutral-400 text-sm mb-6">
              The persistent context layer for your LLM interactions.
              Built for precision, privacy, and speed.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/#features" className="hover:text-primary-400">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary-400">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-primary-400">Security</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400">Contact</Link></li>
              </ul>
          </div>

          <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/contact#privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
                <li><Link to="/contact#terms" className="hover:text-primary-400">Terms of Service</Link></li>
                <li><Link to="/security" className="hover:text-primary-400">Security</Link></li>
              </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Infrastructure</h4>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-neutral-400 mb-2">Powered by</p>
              <div className="flex items-center gap-2 text-white font-bold">
                 {/* Simulate AWS Logo */}
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M16.4 12.8C15.9 12.6 15.6 12.3 15.6 11.8C15.6 11.2 16.1 10.8 16.9 10.8C17.6 10.8 18.2 11.2 18.2 11.8C18.2 12.1 18.4 12.3 18.6 12.3C18.8 12.3 19 12.1 19 11.9C19 10.7 18.1 9.9 16.9 9.9C15.6 9.9 14.8 10.7 14.8 11.9C14.8 13 15.6 13.5 16.2 13.7C16.8 13.9 17.1 14.1 17.1 14.6C17.1 15 16.6 15.4 15.8 15.4C15 15.4 14.4 15 14.4 14.4C14.4 14.2 14.2 14 14 14C13.8 14 13.6 14.2 13.6 14.4C13.6 15.6 14.5 16.3 15.8 16.3C17.1 16.3 18 15.5 18 14.5C18 13.4 17.1 13 16.4 12.8ZM11.1 16.1L10.3 12.9L10.3 12.9L9.5 16.1H8.6L7.5 12.1H8.4L9 15.1L9 15.1L9.8 12.1H10.8L11.6 15.1L11.6 15.1L12.2 12.1H13.1L12 16.1H11.1ZM6.3 16.1L4.8 9.9H5.7L6.7 14.7L6.8 14.7L8.4 9.9H9.4L7.2 16.1H6.3Z" />
                 </svg>
                 <span>AWS Activate</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2">Serverless Architecture</p>
            </div>
          </div>

        </div>
        <div className="border-t border-white/5 pt-8 text-center text-neutral-600 text-xs">
          &copy; 2026 ChatVault. All rights reserved. Contact: 
          <a href="mailto:contact@chatvault.live" className="hover:text-neutral-300">contact@chatvault.live</a>
          .
        </div>
      </div>
    </footer>
  );
};