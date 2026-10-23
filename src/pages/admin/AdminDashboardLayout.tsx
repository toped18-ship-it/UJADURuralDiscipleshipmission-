import React from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] text-emerald-950 font-serif font-bold text-lg">
        Verifying Administrator Session...
      </div>
    );
  }

  if (!isAdmin || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: '📊' },
    { label: 'Custom Pages', path: '/admin/pages', icon: '📄' },
    { label: 'Gallery Media', path: '/admin/gallery', icon: '🖼️' },
    { label: 'Audio Teachings', path: '/admin/audio', icon: '🎙️' },
    { label: 'Blog & Articles', path: '/admin/blog', icon: '📝' },
    { label: 'Site Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      <SEOHead title="Admin Dashboard – UJADU Mission Portal" />

      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0f2a1d] text-white shrink-0 border-r border-amber-500/20 flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-2 border-b border-emerald-900 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-amber-400/40 overflow-hidden shrink-0 p-0.5 shadow">
              <img
                src="/assets/aistudio/SAVE_20261012_193937_65466220.jpg"
                alt="UJADU Mission Logo"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <h2 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                UJADU Admin
              </h2>
              <p className="text-[10px] text-amber-300 truncate">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-900/80 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-emerald-900 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="block text-center py-2 text-xs text-emerald-200 hover:text-white border border-emerald-800 rounded-lg transition-colors"
          >
            ↗ View Public Website
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-center py-2 text-xs font-bold text-red-300 hover:text-red-200 bg-red-950/40 border border-red-900/50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
