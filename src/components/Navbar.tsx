import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { CustomPage } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const location = useLocation();

  useEffect(() => {
    DataService.getCustomPages().then((data) => setCustomPages(data));
  }, [location.pathname]);

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
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Zone 1: Ministry wordmark & official logo */}
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
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
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

            {/* Custom Pages Dropdown or Links if any exist */}
            {customPages.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setPagesDropdownOpen(true)}
                onMouseLeave={() => setPagesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
                  className={`flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                    location.pathname.startsWith('/page/')
                      ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                      : 'text-emerald-100 hover:text-amber-300'
                  }`}
                >
                  <span>Special Programs</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {pagesDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-[#0f2a1d] border border-amber-500/30 rounded-xl shadow-2xl py-2 z-50">
                    {customPages.map((page) => (
                      <Link
                        key={page.id}
                        to={`/page/${page.slug}`}
                        onClick={() => setPagesDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-emerald-100 hover:bg-emerald-900/90 hover:text-amber-300 transition-colors"
                      >
                        <p className="font-semibold text-white truncate">{page.title}</p>
                        {page.subtitle && (
                          <p className="text-[10px] text-emerald-300/70 truncate">{page.subtitle}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-emerald-950 hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap"
            >
              Partner With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none cursor-pointer"
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
        <div className="lg:hidden bg-[#0f2a1d] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-emerald-900 text-amber-400 font-semibold'
                  : 'text-emerald-100 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Custom Pages in Mobile Menu */}
          {customPages.length > 0 && (
            <div className="pt-2 border-t border-emerald-900 space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Special Programs & Pages
              </span>
              {customPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/page/${page.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-1.5 text-xs text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-md"
                >
                  • {page.title}
                </Link>
              ))}
            </div>
          )}

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
