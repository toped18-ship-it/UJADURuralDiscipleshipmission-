import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check administrator credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <SEOHead title="Admin Login – UJADU Mission Portal" />

      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#1b4332] border border-amber-400/50 p-1 mx-auto flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/assets/aistudio/SAVE_20261012_193937_65466220.jpg"
              alt="UJADU Rural Discipleship Mission"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Administrator Portal</h2>
          <p className="text-xs text-slate-500">Sign in with authorized administrator credentials</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium space-y-1">
            <p className="font-bold">Access Denied</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Administrator Email</label>
            <input
              type="email"
              required
              placeholder="admin@ujadumission.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">Initial Setup & Credentials Guidance:</p>
          <p>Sign in with your configured Supabase Auth account or initial administrator account.</p>
        </div>
      </div>
    </div>
  );
};
