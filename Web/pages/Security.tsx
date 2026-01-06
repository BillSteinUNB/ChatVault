import React from 'react';
import { Shield, Lock, Server, FileCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Security: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono mb-4">
          <Shield size={14} />
          SECURITY & COMPLIANCE
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Your data is your asset. <br/>We treat it that way.</h1>
        <p className="text-xl text-neutral-400 leading-relaxed">
          ChatVault is architected with a "Local-First" philosophy. We minimize data collection and maximize encryption.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="text-primary-500" /> Data Encryption
          </h2>
          <Card className="p-8">
            <p className="text-neutral-300 mb-4">
              All data synced to the cloud is encrypted using <strong>AES-256</strong> at rest. 
              Data in transit is protected via <strong>TLS 1.3</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-400">
              <li>Local storage relies on Chrome's sandboxed storage API.</li>
              <li>Sync keys are never logged or stored in plain text.</li>
              <li>We perform regular third-party penetration testing.</li>
            </ul>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Server className="text-primary-500" /> Infrastructure
          </h2>
          <Card className="p-8">
            <p className="text-neutral-300 mb-4">
              Our cloud infrastructure is hosted entirely on <strong>AWS (Amazon Web Services)</strong> in the us-east-1 region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-neutral-950 rounded border border-white/10">
                <div className="text-xs text-neutral-500 uppercase font-mono mb-1">Compute</div>
                <div className="text-white font-medium">AWS Lambda (Serverless)</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded border border-white/10">
                <div className="text-xs text-neutral-500 uppercase font-mono mb-1">Database</div>
                <div className="text-white font-medium">Amazon DynamoDB</div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FileCheck className="text-primary-500" /> AI Training Policy
          </h2>
          <Card className="p-8 bg-emerald-900/10 border-emerald-500/20">
            <p className="text-white font-medium text-lg">
              We do NOT train AI models on your data.
            </p>
            <p className="text-neutral-400 mt-2">
              Your chats, prompts, and tags are strictly your own. ChatVault acts purely as a storage and retrieval layer. We have no interest in your intellectual property.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};