import React, { useEffect, useState } from 'react';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { SiteSettings } from '../types';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partnership_type: 'general' as 'general' | 'prayer' | 'volunteer' | 'discipleship' | 'outreach_support',
    message: '',
    honeypot: '', // Spam protection
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    DataService.getSiteSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Spam honeypot check
    if (formData.honeypot) {
      setSuccessMessage('Thank you for contacting UJADU Rural Discipleship Mission!');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      await DataService.sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        partnership_type: formData.partnership_type,
        message: formData.message.trim(),
      });

      setSuccessMessage('Thank you! Your message and partnership inquiry have been received. Our mission team will reach out to you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        partnership_type: 'general',
        message: '',
        honeypot: '',
      });
    } catch {
      setErrorMessage('Failed to send message. Please try again or reach out via WhatsApp/email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <SEOHead
        title="Contact & Partnership – UJADU Rural Discipleship Mission"
        description="Get in touch with UJADU Rural Discipleship Mission base team, send prayer requests, volunteer for rural outreaches, or partner in discipleship."
      />

      {/* HEADER BANNER */}
      <section className="bg-[#0f2a1d] text-white py-14 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Reach Our Base</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Contact & Ministry Partnership</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-xs sm:text-sm">
            We welcome prayer requests, field volunteer inquiries, intercessory partnerships, and discipleship questions.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* COL 1: CONTACT DETAILS & PARTNERSHIP AREAS */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-emerald-950 border-b border-slate-100 pb-3">
                Mission Contact Info
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold">
                    📍
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Mission Base Location</span>
                    <p className="font-semibold text-slate-900">{settings?.location || 'Ujadu Mission Field Base, Rural Discipleship Center'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold">
                    📞
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Phone & WhatsApp</span>
                    <p className="font-semibold text-slate-900">{settings?.phone || '+234 806 645 6672'}</p>
                    <a
                      href={`https://wa.me/${(settings?.whatsapp || '+2348066456672').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-800 hover:text-amber-600 inline-block mt-0.5"
                    >
                      Chat on WhatsApp →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold">
                    ✉️
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Official Email</span>
                    <p className="font-semibold text-slate-900">{settings?.email || 'info@ujadumission.org'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Areas Box */}
            <div className="bg-[#1b4332] text-white rounded-2xl p-6 space-y-4 border border-amber-500/30">
              <h3 className="text-lg font-serif font-bold text-amber-300">Ways to Partner</h3>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Intercessory Prayer Watch
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Rural Outreach Volunteer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Discipleship Resource Sponsorship
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span> Village Field Logistics Support
                </li>
              </ul>
            </div>
          </div>

          {/* COL 2: CONTACT & PARTNERSHIP FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Send a Message</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Get in Touch with Our Mission Team</h2>
            </div>

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium flex items-start gap-2">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm font-medium flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam Honeypot */}
              <input
                type="text"
                name="website_url_check"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brother John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Partnership Interest</label>
                  <select
                    value={formData.partnership_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnership_type: e.target.value as typeof formData.partnership_type,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Intercessory Prayer Support</option>
                    <option value="volunteer">Field Outreach Volunteer</option>
                    <option value="discipleship">Discipleship Mentorship</option>
                    <option value="outreach_support">Rural Outreach Partnership</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Message / Prayer Request *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share your message, inquiry, or prayer request..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Message...' : 'Submit Contact Inquiry'}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100">
              <NewsletterSignup
                variant="card"
                title="Join Our Ministry Outreach Newsletter"
                subtitle="Stay spiritually encouraged and informed with direct updates, testimonies, and downloadable sermon recordings from UJADU Mission."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
