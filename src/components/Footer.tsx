import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { CustomPage, SiteSettings } from '../types';
import { NewsletterSignup } from './NewsletterSignup';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    DataService.getSiteSettings().then(setSettings);
    DataService.getCustomPages().then(setCustomPages);
  }, []);

  return (
    <footer className="bg-[#0f2a1d] text-slate-300 pt-16 pb-12 border-t border-amber-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900">
          {/* Col 1: Brand & Ministry Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-amber-400/40 overflow-hidden shrink-0 p-0.5 shadow">
                <img
                  src="/assets/aistudio/SAVE_20261012_193937_65466220.jpg"
                  alt="UJADU Rural Discipleship Mission"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight uppercase">
                {settings?.ministry_name || 'UJADU RURAL DISCIPLESHIP MISSION'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              {settings?.tagline || 'Making Disciples, Transforming Lives Through Christ in rural communities.'}
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-amber-200/90 font-serif italic">
              "Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
              <span className="block mt-1 font-sans not-italic text-[10px] text-amber-400">— Matthew 28:19</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">About Our Mission</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-300 transition-colors">Outreach Gallery</Link>
              </li>
              <li>
                <Link to="/audio" className="hover:text-amber-300 transition-colors">Downloadable Audio Teachings</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-amber-300 transition-colors">Mission Blog & Articles</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">Contact & Partnership</Link>
              </li>
              {customPages.map((page) => (
                <li key={page.id}>
                  <Link to={`/page/${page.slug}`} className="text-amber-200/90 hover:text-amber-300 transition-colors">
                    ★ {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Mission Base Contact</h3>
            <div className="space-y-2 text-xs text-emerald-200/90">
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{settings?.location || 'Ujadu Mission Field Base, Rural Discipleship Center'}</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h32a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
                <span>{settings?.phone || '+234 806 645 6672'}</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{settings?.email || 'info@ujadumission.org'}</span>
              </p>
            </div>
          </div>

          {/* Col 4: Newsletter Signup Component */}
          <div>
            <NewsletterSignup
              variant="compact"
              title="Ministry Newsletter"
              subtitle="Get monthly discipleship articles, audio sermon releases, and outreach updates."
            />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{settings?.footer_text || '© UJADU Rural Discipleship Mission. All rights reserved.'}</p>
          <div className="flex items-center gap-4 text-emerald-300">
            <span className="hover:underline cursor-pointer">Privacy & Data Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Ministry Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
