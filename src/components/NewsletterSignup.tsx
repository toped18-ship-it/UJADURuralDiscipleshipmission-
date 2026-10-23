import React, { useState } from 'react';
import { DataService } from '../services/dataService';

interface NewsletterSignupProps {
  variant?: 'compact' | 'card';
  title?: string;
  subtitle?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'compact',
  title = 'Join Our Ministry Newsletter',
  subtitle = 'Receive monthly field reports, new sermon audio notifications, and prayer requests directly in your inbox.',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (honeypot) {
      setStatusMessage({ text: 'Thank you for subscribing!', isError: false });
      return;
    }

    if (!email || !email.includes('@')) {
      setStatusMessage({ text: 'Please enter a valid email address.', isError: true });
      return;
    }

    setIsSubmitting(true);
    const result = await DataService.subscribeNewsletter(email);
    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      setEmail('');
    } else {
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-br from-[#1b4332] via-[#0f2a1d] to-[#1b4332] text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Stay Connected</span>
          <h3 className="text-2xl font-serif font-bold text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">{subtitle}</p>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-red-950/80 border border-red-800 text-red-200'
                : 'bg-emerald-900/90 border border-amber-400/50 text-amber-300'
            }`}
          >
            <span>{statusMessage.isError ? '⚠️' : '✓'}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Spam honeypot */}
          <input
            type="text"
            name="check_email_address"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-xs sm:text-sm text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition-colors shrink-0 shadow disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </div>
          <p className="text-[10px] text-emerald-300/70">
            We respect your privacy. Unsubscribe at any time. Zero spam.
          </p>
        </form>
      </div>
    );
  }

  // Compact variant for Footer
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">{title}</h3>
      <p className="text-xs text-emerald-200/80 leading-relaxed">{subtitle}</p>

      {statusMessage && (
        <div
          className={`p-2.5 rounded-lg text-xs font-medium ${
            statusMessage.isError ? 'bg-red-950/80 text-red-200' : 'bg-emerald-900 text-amber-300'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="check_email_address"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-800 text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-colors shrink-0 shadow whitespace-nowrap"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
};
