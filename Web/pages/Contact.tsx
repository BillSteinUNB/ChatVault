import React, { useMemo, useState } from 'react';
import { Mail, MessageSquare, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type SubmitStatus = 'idle' | 'success' | 'error';

const SUPPORT_EMAIL = 'contact@chatvault.live';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;
  }, [name, email, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitStatus('idle');

    if (!canSubmit) {
      setError('Please fill out name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      setSubmitStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setSubmitStatus('error');
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact</h1>
        <p className="text-xl text-neutral-400 leading-relaxed">
          Questions, feedback, or security concerns? Send a note—we read every message.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href="#privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="text-primary-400 hover:text-primary-300 transition-colors">
            Terms of Service
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <Card className="p-8" hoverEffect={false}>
            <h2 className="text-2xl font-bold text-white mb-2">Send a message</h2>
            <p className="text-neutral-400 mb-8">
              For support, please include your account email and any relevant screenshots.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                Message queued (stub). We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && !error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                Failed to send. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-neutral-500" size={18} />
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full min-h-[140px] bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors resize-y"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? 'Sending...' : 'Send message'}
              </Button>

              <p className="text-xs text-neutral-500 text-center">
                By submitting, you agree to our{' '}
                <a href="#privacy" className="underline hover:text-neutral-300">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#terms" className="underline hover:text-neutral-300">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </Card>
        </section>

        <section>
          <Card className="p-8" hoverEffect={false}>
            <h2 className="text-2xl font-bold text-white mb-2">Founder contact</h2>
            <p className="text-neutral-400">
              For partnerships, press, or urgent issues, reach out directly.
            </p>

            <div className="mt-6 space-y-2 text-sm text-neutral-300">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">Email</span>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">Response time</span>
                <span>Typically within 1–2 business days</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-400">Security reports</span>
                <span>Include steps to reproduce and impact</span>
              </div>
            </div>
          </Card>
        </section>

        <section id="privacy" className="scroll-mt-28">
          <h2 className="text-3xl font-bold text-white mb-4">Privacy Policy</h2>
          <div className="space-y-6 text-neutral-300 leading-relaxed">
            <p className="text-sm text-neutral-500">Last updated: January 9, 2026</p>

            <p>
              ChatVault ("we", "us") provides tools to help you organize and search your AI conversations.
              This Privacy Policy explains what information we collect, how we use it, and the choices you have.
            </p>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">1. Information we collect</h3>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                <li>
                  <strong className="text-neutral-200">Account information:</strong> If you create an account, we collect your email address and authentication metadata.
                </li>
                <li>
                  <strong className="text-neutral-200">Support communications:</strong> When you contact us, we collect the information you provide (name, email, message content), plus basic metadata needed to respond.
                </li>
                <li>
                  <strong className="text-neutral-200">Usage and diagnostics:</strong> We may collect limited, aggregated analytics to understand performance and improve reliability.
                  We avoid collecting the content of your private chats unless you explicitly share it with support.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">2. How we use information</h3>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                <li>Provide and maintain the service, including authentication and security.</li>
                <li>Respond to support requests, troubleshooting, and product feedback.</li>
                <li>Improve features, fix bugs, and monitor abuse or fraud.</li>
                <li>Comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">3. Sharing and disclosure</h3>
              <p className="text-neutral-400">
                We do not sell your personal information. We may share information with service providers that help us run ChatVault
                (for example, hosting, analytics, and email delivery). These providers are permitted to process information only
                on our instructions and for the purposes described in this policy.
              </p>
              <p className="text-neutral-400 mt-3">
                We may disclose information if required by law, to protect our rights, or to prevent fraud and abuse.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">4. Data retention</h3>
              <p className="text-neutral-400">
                We keep personal information for as long as necessary to provide the service and for legitimate business purposes
                (such as security, dispute resolution, and compliance). You can request deletion of your account by emailing{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">5. Your choices</h3>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                <li>Access and update your account information in-app where available.</li>
                <li>Request deletion of your account and associated personal data.</li>
                <li>Opt out of non-essential emails (for example, marketing) when provided.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">6. Contact</h3>
              <p className="text-neutral-400">
                Questions about privacy? Email us at{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section id="terms" className="scroll-mt-28">
          <h2 className="text-3xl font-bold text-white mb-4">Terms of Service</h2>
          <div className="space-y-6 text-neutral-300 leading-relaxed">
            <p className="text-sm text-neutral-500">Last updated: January 9, 2026</p>

            <p>
              These Terms of Service ("Terms") govern your use of ChatVault. By accessing or using the service, you agree to
              these Terms.
            </p>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">1. Service overview</h3>
              <p className="text-neutral-400">
                ChatVault provides tools to store, organize, and search AI conversation data. Features may change over time,
                and we may add or remove capabilities to improve the product.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">2. Your responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree not to misuse the service, including attempting to disrupt, reverse engineer, or access systems without authorization.</li>
                <li>You agree to comply with applicable laws when using ChatVault, including privacy and intellectual property laws.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">3. Acceptable use</h3>
              <p className="text-neutral-400">
                You may not use ChatVault to store or transmit unlawful content, malware, or content that violates the rights of others.
                We may suspend or terminate access if we reasonably believe you are violating these Terms or creating risk for the service.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">4. Disclaimers</h3>
              <p className="text-neutral-400">
                ChatVault is provided on an "as is" and "as available" basis. While we work hard to keep the service reliable,
                we do not guarantee uninterrupted operation or that all functionality will be error-free.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">5. Limitation of liability</h3>
              <p className="text-neutral-400">
                To the maximum extent permitted by law, ChatVault and its affiliates will not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of data, profits, or revenues.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">6. Contact</h3>
              <p className="text-neutral-400">
                For questions about these Terms, contact{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
