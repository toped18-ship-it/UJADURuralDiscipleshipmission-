import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Audio Library', path: '/audio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1b4332] text-white shadow-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Single text element wordmark with official ministry logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-lg bg-emerald-950 border border-amber-400/40 overflow-hidden flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shadow-md">
              <img
                src="/assets/aistudio/SAVE_20261012_193937_65466220.jpg"
                alt="UJADU Rural Discipleship Mission Logo"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white uppercase leading-tight">
                UJADU MISSION
              </span>
              <span className="text-[10px] text-amber-300 font-medium tracking-widest uppercase">
                Rural Discipleship
              </span>
            </div>
          </Link>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                    : 'text-emerald-100 hover:text-amber-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-emerald-950 hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap"
            >
              Partner With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0f2a1d] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-emerald-900 text-amber-400 font-semibold'
                  : 'text-emerald-100 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-emerald-900 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-amber-400 text-emerald-950 hover:bg-amber-300"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
