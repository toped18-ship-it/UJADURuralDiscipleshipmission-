import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { SiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    DataService.getSiteSettings().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    await DataService.updateSiteSettings(settings);
    setIsSaving(false);
    setMessage('Site settings successfully updated!');
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading || !settings) {
    return <div className="p-8 font-serif">Loading Site Settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Ministry Site Settings</h1>
        <p className="text-xs text-slate-500">Configure global ministry branding, contact details, hero content, and SEO metadata.</p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* BRAND & HEADER */}
        <div className="space-y-4">
          <h3 className="text-base font-serif font-bold text-emerald-950 border-b pb-1">
            Branding & Header Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Ministry Name</label>
              <input
                type="text"
                required
                value={settings.ministry_name}
                onChange={(e) => setSettings({ ...settings, ministry_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Header Wordmark Text</label>
              <input
                type="text"
                required
                value={settings.logo_text}
                onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>
        </div>

        {/* HOMEPAGE HERO CONTENT */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-base font-serif font-bold text-emerald-950 border-b pb-1">
            Homepage Hero Section
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Main Headline</label>
            <input
              type="text"
              value={settings.hero_headline}
              onChange={(e) => setSettings({ ...settings, hero_headline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs font-serif font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Supporting Subtext</label>
            <textarea
              rows={3}
              value={settings.hero_subtext}
              onChange={(e) => setSettings({ ...settings, hero_subtext: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>
        </div>

        {/* CONTACT & LOCATION */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-base font-serif font-bold text-emerald-950 border-b pb-1">
            Verified Contact & Field Base Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mission Base Address / Location</label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-base font-serif font-bold text-emerald-950 border-b pb-1">
            Mission & Vision Statements
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mission Statement</label>
            <textarea
              rows={3}
              value={settings.mission_statement}
              onChange={(e) => setSettings({ ...settings, mission_statement: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Vision Statement</label>
            <textarea
              rows={3}
              value={settings.vision_statement}
              onChange={(e) => setSettings({ ...settings, vision_statement: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>
        </div>

        {/* FOOTER & SEO */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-base font-serif font-bold text-emerald-950 border-b pb-1">
            Footer Text & SEO Metadata
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Footer Text</label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Default SEO Title</label>
              <input
                type="text"
                value={settings.seo_title}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Default Meta Description</label>
              <input
                type="text"
                value={settings.seo_description}
                onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow"
          >
            {isSaving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
