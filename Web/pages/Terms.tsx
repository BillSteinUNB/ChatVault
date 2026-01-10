import React from 'react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-neutral-400 mb-8">Last Updated: January 10, 2026</p>

          <div className="space-y-8 text-neutral-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using ChatVault (the "Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                ChatVault provides a browser extension and web interface for organizing, searching, and managing 
                AI chat conversations. The Service operates primarily on a "local-first" basis, meaning your data 
                is stored locally on your device unless you explicitly opt-in to sync features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p>
                You are responsible for:
                <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
                  <li>Maintaining the security of your device and data.</li>
                  <li>Ensuring you have the right to save and organize the content you import into ChatVault.</li>
                  <li>Using the Service in compliance with all applicable laws and regulations.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p>
                The Service, including its original content (excluding user-generated content), features, and functionality, 
                is and will remain the exclusive property of ChatVault and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                In no event shall ChatVault be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from 
                your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant 
                changes. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                <a href="mailto:contact@chatvault.live" className="text-primary-400 hover:text-primary-300">contact@chatvault.live</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
