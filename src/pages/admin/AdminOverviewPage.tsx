import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { AdminStats, ContactMessage, NewsletterSubscriber } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const data = await DataService.getAdminStats();
    const msgs = await DataService.getMessages();
    const subs = await DataService.getSubscribers();
    setStats(data);
    setMessages(msgs);
    setSubscribers(subs);
    setIsLoading(false);
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm('Remove subscriber from list?')) {
      await DataService.deleteSubscriber(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500">Real-time statistics derived from your database and content records.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/about"
            className="px-3.5 py-2 rounded-lg bg-amber-400 text-emerald-950 font-bold text-xs shadow-sm hover:bg-amber-300 transition-colors flex items-center gap-1.5"
          >
            <span>📖</span> Edit About Us Page
          </Link>
          <Link
            to="/admin/pages"
            className="px-3.5 py-2 rounded-lg bg-[#0f2a1d] text-white font-bold text-xs shadow-sm hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
          >
            <span>📄</span> Manage Pages
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Link to="/admin/pages" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:border-amber-400 transition-colors">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Pages</span>
            <span className="text-2xl font-bold font-mono text-[#1b4332] block">{stats?.customPages || 0}</span>
            <p className="text-[10px] text-amber-700 font-semibold">Custom builder ↗</p>
          </Link>

          <Link to="/admin/blog" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:border-amber-400 transition-colors">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Articles</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-[#1b4332]">{stats?.publishedBlogs || 0}</span>
              <span className="text-[10px] text-amber-600 font-semibold">{stats?.draftBlogs || 0} Drafts</span>
            </div>
            <p className="text-[10px] text-slate-400">Live blog articles</p>
          </Link>

          <Link to="/admin/gallery" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:border-amber-400 transition-colors">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Gallery</span>
            <span className="text-2xl font-bold font-mono text-[#1b4332] block">{stats?.publishedGallery || 0}</span>
            <p className="text-[10px] text-slate-400">Published photos</p>
          </Link>

          <Link to="/admin/audio" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:border-amber-400 transition-colors">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Audio</span>
            <span className="text-2xl font-bold font-mono text-[#1b4332] block">{stats?.publishedAudio || 0}</span>
            <p className="text-[10px] text-slate-400">Preaching MP3s</p>
          </Link>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Inquiries</span>
            <span className="text-2xl font-bold font-mono text-[#1b4332] block">{stats?.totalMessages || 0}</span>
            <p className="text-[10px] text-slate-400">Received messages</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Subscribers</span>
            <span className="text-2xl font-bold font-mono text-[#1b4332] block">{stats?.totalSubscribers || 0}</span>
            <p className="text-[10px] text-slate-400">Newsletter emails</p>
          </div>
        </div>
      )}

      {/* RECENT MESSAGES & SUBSCRIBERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contact Submissions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2">
            Recent Contact & Partnership Messages
          </h3>

          {messages.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No contact messages received yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((m) => (
                <div key={m.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950">{m.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold uppercase">
                    Interest: {m.partnership_type} · {m.email}
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Subscribers List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-serif font-bold text-slate-900">
              Newsletter Subscribers ({subscribers.length})
            </h3>
            <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
              Supabase 'subscribers' table
            </span>
          </div>

          {subscribers.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No newsletter subscribers yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{sub.email}</p>
                    <p className="text-[10px] text-slate-400">
                      Subscribed: {new Date(sub.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubscriber(sub.id)}
                    className="text-[11px] font-semibold text-red-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
