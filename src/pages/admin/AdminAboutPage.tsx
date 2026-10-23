import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService, DEFAULT_ABOUT_CONTENT } from '../../services/dataService';
import { AboutContent, AboutMilestoneStat, CorePillar, DiscipleshipCyclePhase, LeadershipMember } from '../../types';

export const AdminAboutPage: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'mission' | 'pillars' | 'strategy' | 'team' | 'cta'>('hero');

  // Image upload states
  const [isUploadingOverviewImg, setIsUploadingOverviewImg] = useState(false);
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null);

  const overviewFileRef = useRef<HTMLInputElement | null>(null);
  const memberPhotoFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadAboutContent();
  }, []);

  async function loadAboutContent() {
    setIsLoading(true);
    try {
      const data = await DataService.getAboutContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load about content:', err);
      setMessage({ type: 'error', text: 'Failed to load About Us content.' });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content) return;

    setIsSaving(true);
    setMessage(null);
    try {
      await DataService.updateAboutContent(content);
      setMessage({ type: 'success', text: 'About Us page successfully updated and published to cloud!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save About Us content. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all About Us content to default ministry text and pillars? Any unsaved edits will be lost.')) {
      setContent({ ...DEFAULT_ABOUT_CONTENT });
      setMessage({ type: 'success', text: 'Reset to defaults. Click "Save & Publish" to commit changes.' });
    }
  };

  // Upload overview section image
  const handleOverviewFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;
    setIsUploadingOverviewImg(true);
    try {
      const url = await DataService.uploadImageFile(file, 'about-assets');
      setContent({ ...content, overview_image: url });
      setMessage({ type: 'success', text: 'Overview photo uploaded and optimized.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setIsUploadingOverviewImg(false);
    }
  };

  // Upload leadership member photo
  const handleMemberPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;
    setUploadingMemberId(memberId);
    try {
      const url = await DataService.uploadImageFile(file, 'about-leaders');
      setContent({
        ...content,
        leadership_team: content.leadership_team.map((m) =>
          m.id === memberId ? { ...m, photo_url: url } : m
        ),
      });
      setMessage({ type: 'success', text: 'Leader photo uploaded and compressed.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to upload photo.');
    } finally {
      setUploadingMemberId(null);
    }
  };

  // --- PILLAR HANDLERS ---
  const handleAddPillar = () => {
    if (!content) return;
    const newPillar: CorePillar = {
      id: `pil-${Date.now()}`,
      title: 'New Guiding Pillar',
      scripture_reference: 'Scripture Ref',
      description: 'Describe the biblical conviction and practical application.',
    };
    setContent({
      ...content,
      pillars: [...content.pillars, newPillar],
    });
  };

  const handleUpdatePillar = (id: string, updates: Partial<CorePillar>) => {
    if (!content) return;
    setContent({
      ...content,
      pillars: content.pillars.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const handleDeletePillar = (id: string) => {
    if (!content) return;
    if (confirm('Delete this biblical pillar?')) {
      setContent({
        ...content,
        pillars: content.pillars.filter((p) => p.id !== id),
      });
    }
  };

  const handleMovePillar = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= content.pillars.length) return;
    const copy = [...content.pillars];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setContent({ ...content, pillars: copy });
  };

  // --- STRATEGY PHASE HANDLERS ---
  const handleAddPhase = () => {
    if (!content) return;
    const newPhase: DiscipleshipCyclePhase = {
      id: `ph-${Date.now()}`,
      step_number: content.strategy_phases.length + 1,
      title: 'New Strategy Step',
      description: 'Explain this phase of the rural outreach and discipleship work.',
    };
    setContent({
      ...content,
      strategy_phases: [...content.strategy_phases, newPhase],
    });
  };

  const handleUpdatePhase = (id: string, updates: Partial<DiscipleshipCyclePhase>) => {
    if (!content) return;
    setContent({
      ...content,
      strategy_phases: content.strategy_phases.map((ph) =>
        ph.id === id ? { ...ph, ...updates } : ph
      ),
    });
  };

  const handleDeletePhase = (id: string) => {
    if (!content) return;
    if (confirm('Delete this strategy phase?')) {
      setContent({
        ...content,
        strategy_phases: content.strategy_phases
          .filter((ph) => ph.id !== id)
          .map((ph, idx) => ({ ...ph, step_number: idx + 1 })),
      });
    }
  };

  // --- LEADERSHIP TEAM HANDLERS ---
  const handleAddMember = () => {
    if (!content) return;
    const newMember: LeadershipMember = {
      id: `lead-${Date.now()}`,
      name: 'New Ministry Leader',
      role: 'Role / Ministry Office',
      bio: 'Brief background, calling, and contribution to rural missions.',
      photo_url: '',
      initials: 'ML',
    };
    setContent({
      ...content,
      leadership_team: [...content.leadership_team, newMember],
    });
  };

  const handleUpdateMember = (id: string, updates: Partial<LeadershipMember>) => {
    if (!content) return;
    setContent({
      ...content,
      leadership_team: content.leadership_team.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  const handleDeleteMember = (id: string) => {
    if (!content) return;
    if (confirm('Delete this team leader from About Us?')) {
      setContent({
        ...content,
        leadership_team: content.leadership_team.filter((m) => m.id !== id),
      });
    }
  };

  // --- MILESTONES HANDLERS ---
  const handleAddMilestone = () => {
    if (!content) return;
    const newMilestone: AboutMilestoneStat = {
      id: `ms-${Date.now()}`,
      value: '100+',
      label: 'New Milestone Metric',
    };
    setContent({
      ...content,
      milestones: [...(content.milestones || []), newMilestone],
    });
  };

  const handleUpdateMilestone = (id: string, updates: Partial<AboutMilestoneStat>) => {
    if (!content) return;
    setContent({
      ...content,
      milestones: (content.milestones || []).map((ms) =>
        ms.id === id ? { ...ms, ...updates } : ms
      ),
    });
  };

  const handleDeleteMilestone = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      milestones: (content.milestones || []).filter((ms) => ms.id !== id),
    });
  };

  if (isLoading || !content) {
    return (
      <div className="p-8 font-serif text-slate-700 flex items-center gap-3">
        <span className="animate-spin text-amber-500">⏳</span> Loading About Us Content Manager...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <span>📖</span> About Us Content Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize every section of the public About Us page — history, mission, vision, biblical pillars, discipleship strategy, and team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/about"
            target="_blank"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            ↗ Preview Live Page
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-emerald-950 bg-amber-400 rounded-lg shadow hover:bg-amber-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span> Saving to Cloud...
              </>
            ) : (
              <>
                <span>💾</span> Save & Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-500 hover:text-slate-800">
            ✕
          </button>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-1 scrollbar-none">
        {[
          { key: 'hero', label: '1. Hero & Overview', icon: '🏛️' },
          { key: 'mission', label: '2. Mission, Vision & Stats', icon: '🎯' },
          { key: 'pillars', label: `3. Biblical Pillars (${content.pillars.length})`, icon: '📜' },
          { key: 'strategy', label: `4. Discipleship Strategy (${content.strategy_phases.length})`, icon: '🔄' },
          { key: 'team', label: `5. Leadership Team (${content.leadership_team.length})`, icon: '👥' },
          { key: 'cta', label: '6. Call to Action', icon: '📣' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors ${
              activeTab === tab.key
                ? 'bg-[#0f2a1d] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB FORMS */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO & OVERVIEW */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-base font-serif font-bold text-emerald-950">
                Top Hero Banner & Calling Overview
              </h2>
              <p className="text-xs text-slate-500">
                Control the opening headline, badge, and the mission foundation story.
              </p>
            </div>

            {/* HERO SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Hero Banner Fields
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hero Badge</label>
                  <input
                    type="text"
                    value={content.hero_badge}
                    onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="Who We Are"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hero Main Title</label>
                  <input
                    type="text"
                    value={content.hero_title}
                    onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="About UJADU Rural Discipleship Mission"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Hero Tagline / Subtitle</label>
                <textarea
                  rows={2}
                  value={content.hero_tagline}
                  onChange={(e) => setContent({ ...content, hero_tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Making Disciples, Transforming Lives Through Christ in rural communities."
                />
              </div>
            </div>

            {/* OVERVIEW / STORY SECTION */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Ministry Calling & Narrative
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Badge</label>
                  <input
                    type="text"
                    value={content.overview_badge}
                    onChange={(e) => setContent({ ...content, overview_badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="Ministry Overview"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Heading</label>
                  <input
                    type="text"
                    value={content.overview_title}
                    onChange={(e) => setContent({ ...content, overview_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="A Calling to Unreached Rural Frontiers"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Overview Paragraph 1</label>
                <textarea
                  rows={3}
                  value={content.overview_paragraph_1}
                  onChange={(e) => setContent({ ...content, overview_paragraph_1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed"
                  placeholder="First narrative paragraph explaining the background..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Overview Paragraph 2</label>
                <textarea
                  rows={3}
                  value={content.overview_paragraph_2}
                  onChange={(e) => setContent({ ...content, overview_paragraph_2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed"
                  placeholder="Second narrative paragraph explaining our conviction..."
                />
              </div>

              {/* OVERVIEW IMAGE WITH UPLOAD */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700">Overview Featured Photo</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {content.overview_image && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                      <img
                        src={content.overview_image}
                        alt={content.overview_image_alt || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={content.overview_image}
                      onChange={(e) => setContent({ ...content, overview_image: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                      placeholder="Image URL or upload a file below"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        ref={overviewFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleOverviewFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => overviewFileRef.current?.click()}
                        disabled={isUploadingOverviewImg}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        {isUploadingOverviewImg ? (
                          <>
                            <span className="animate-spin">⏳</span> Compressing & Uploading...
                          </>
                        ) : (
                          <>
                            <span>📷</span> Upload New Photo
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-slate-400">
                        Auto-compressed to lightweight retina JPEG
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-700">Image Description (Alt Text)</label>
                  <input
                    type="text"
                    value={content.overview_image_alt}
                    onChange={(e) => setContent({ ...content, overview_image_alt: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="Rural African village gathering listening to gospel"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MISSION, VISION & STATS */}
        {activeTab === 'mission' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-base font-serif font-bold text-emerald-950">
                Mission, Vision & Field Milestones
              </h2>
              <p className="text-xs text-slate-500">
                Define the high-level calling and quantifiable metrics of ministry progress.
              </p>
            </div>

            {/* MISSION & VISION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-950 text-amber-400 font-bold flex items-center justify-center text-xs">
                    M
                  </span>
                  <input
                    type="text"
                    value={content.mission_title}
                    onChange={(e) => setContent({ ...content, mission_title: e.target.value })}
                    className="px-2 py-1 rounded border text-xs font-bold text-emerald-950 w-full"
                    placeholder="Our Mission"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Mission Statement</label>
                  <textarea
                    rows={4}
                    value={content.mission_statement}
                    onChange={(e) => setContent({ ...content, mission_statement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                    V
                  </span>
                  <input
                    type="text"
                    value={content.vision_title}
                    onChange={(e) => setContent({ ...content, vision_title: e.target.value })}
                    className="px-2 py-1 rounded border text-xs font-bold text-emerald-950 w-full"
                    placeholder="Our Vision"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Vision Statement</label>
                  <textarea
                    rows={4}
                    value={content.vision_statement}
                    onChange={(e) => setContent({ ...content, vision_statement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed bg-white"
                  />
                </div>
              </div>
            </div>

            {/* FIELD MILESTONES STATS */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Field Milestones & Impact Metrics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showcase key achievements across villages, disciples, Bibles, and fellowships.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  + Add Metric
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Milestone Section Title</label>
                <input
                  type="text"
                  value={content.milestones_title || ''}
                  onChange={(e) => setContent({ ...content, milestones_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Field Milestones & Kingdom Impact"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(content.milestones || []).map((ms) => (
                  <div key={ms.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Stat Counter</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(ms.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold"
                        title="Delete milestone"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Metric Value</label>
                      <input
                        type="text"
                        value={ms.value}
                        onChange={(e) => handleUpdateMilestone(ms.id, { value: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border text-sm font-bold font-mono text-emerald-950 bg-white"
                        placeholder="85+"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Metric Label</label>
                      <input
                        type="text"
                        value={ms.label}
                        onChange={(e) => handleUpdateMilestone(ms.id, { label: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border text-xs text-slate-800 bg-white"
                        placeholder="Rural Villages Reached"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIBLICAL PILLARS */}
        {activeTab === 'pillars' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-serif font-bold text-emerald-950">
                  Guiding Pillars & Core Biblical Values
                </h2>
                <p className="text-xs text-slate-500">
                  Scripturally anchored foundations guiding all ministry activities.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPillar}
                className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
              >
                <span>+</span> Add Pillar
              </button>
            </div>

            {/* SECTION HEADINGS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Section Badge</label>
                <input
                  type="text"
                  value={content.pillars_badge}
                  onChange={(e) => setContent({ ...content, pillars_badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Guiding Pillars"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Section Title</label>
                <input
                  type="text"
                  value={content.pillars_title}
                  onChange={(e) => setContent({ ...content, pillars_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Core Biblical Values"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Subtext</label>
                <input
                  type="text"
                  value={content.pillars_subtext}
                  onChange={(e) => setContent({ ...content, pillars_subtext: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="The principles that anchor our field decisions..."
                />
              </div>
            </div>

            {/* PILLARS LIST */}
            <div className="space-y-4">
              {content.pillars.map((pillar, idx) => (
                <div
                  key={pillar.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700">
                      Pillar #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMovePillar(idx, 'up')}
                        disabled={idx === 0}
                        className="px-2 py-0.5 text-xs font-bold border rounded bg-white disabled:opacity-30 hover:bg-slate-100"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePillar(idx, 'down')}
                        disabled={idx === content.pillars.length - 1}
                        className="px-2 py-0.5 text-xs font-bold border rounded bg-white disabled:opacity-30 hover:bg-slate-100"
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePillar(pillar.id)}
                        className="px-2.5 py-0.5 text-xs font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handleUpdatePillar(pillar.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-xs font-bold text-emerald-950 bg-white"
                        placeholder="Biblical Supreme Authority"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Scripture Reference</label>
                      <input
                        type="text"
                        value={pillar.scripture_reference || ''}
                        onChange={(e) =>
                          handleUpdatePillar(pillar.id, { scripture_reference: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                        placeholder="2 Timothy 3:16-17"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Description</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) =>
                        handleUpdatePillar(pillar.id, { description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed bg-white"
                      placeholder="Anchored on Holy Scripture as our sole authority for life, salvation, and ministry practice."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DISCIPLESHIP STRATEGY */}
        {activeTab === 'strategy' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-serif font-bold text-emerald-950">
                  Rural Discipleship Cycle / Strategy
                </h2>
                <p className="text-xs text-slate-500">
                  The sequential phases of rural outreach, training, leadership mentorship, and community blessing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPhase}
                className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
              >
                <span>+</span> Add Phase
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Strategy Badge</label>
                <input
                  type="text"
                  value={content.strategy_badge}
                  onChange={(e) => setContent({ ...content, strategy_badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Our Strategy"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Strategy Title</label>
                <input
                  type="text"
                  value={content.strategy_title}
                  onChange={(e) => setContent({ ...content, strategy_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Our 4-Phase Rural Discipleship Cycle"
                />
              </div>
            </div>

            <div className="space-y-4">
              {content.strategy_phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                        {phase.step_number || idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-700">Phase #{idx + 1}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePhase(phase.id)}
                      className="px-2.5 py-0.5 text-xs font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 rounded"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phase Title</label>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => handleUpdatePhase(phase.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-bold text-emerald-950 bg-white"
                      placeholder="Frontier Outreach"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phase Description</label>
                    <textarea
                      rows={2}
                      value={phase.description}
                      onChange={(e) => handleUpdatePhase(phase.id, { description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed bg-white"
                      placeholder="Conducting village door-to-door evangelism..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEADERSHIP TEAM */}
        {activeTab === 'team' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-serif font-bold text-emerald-950">
                  Ministry Leadership & Field Team
                </h2>
                <p className="text-xs text-slate-500">
                  Introduce your evangelists, pastors, intercessors, and ministry coordinators.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMember}
                className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
              >
                <span>+</span> Add Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Section Badge</label>
                <input
                  type="text"
                  value={content.leadership_badge}
                  onChange={(e) => setContent({ ...content, leadership_badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Servant Leadership"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Section Title</label>
                <input
                  type="text"
                  value={content.leadership_title}
                  onChange={(e) => setContent({ ...content, leadership_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Ministry Leadership & Field Team"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Subtext</label>
                <input
                  type="text"
                  value={content.leadership_subtext}
                  onChange={(e) => setContent({ ...content, leadership_subtext: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="Dedicated servants laboring across rural field bases."
                />
              </div>
            </div>

            <div className="space-y-6">
              {content.leadership_team.map((member, idx) => (
                <div
                  key={member.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700">
                      Leader #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id)}
                      className="px-2.5 py-0.5 text-xs font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 rounded"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* PHOTO COLUMN */}
                    <div className="space-y-2 text-center flex flex-col items-center">
                      {member.photo_url ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow">
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-serif text-xl font-bold border-2 border-amber-400 shadow">
                          {member.initials || 'SR'}
                        </div>
                      )}

                      <div className="w-full space-y-1">
                        <input
                          type="text"
                          value={member.photo_url || ''}
                          onChange={(e) =>
                            handleUpdateMember(member.id, { photo_url: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border text-[11px] font-mono bg-white text-center"
                          placeholder="Photo URL or upload below"
                        />
                        <div>
                          <input
                            ref={memberPhotoFileRef}
                            type="file"
                            accept="image/*"
                            id={`file-member-${member.id}`}
                            onChange={(e) => handleMemberPhotoChange(e, member.id)}
                            className="hidden"
                          />
                          <label
                            htmlFor={`file-member-${member.id}`}
                            className="cursor-pointer inline-block px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {uploadingMemberId === member.id ? '⏳ Compressing...' : '📷 Upload Photo'}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS COLUMN */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Full Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              handleUpdateMember(member.id, { name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs font-bold text-slate-900 bg-white"
                            placeholder="Evangelist S. O. Okon"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Initials (Badge)</label>
                          <input
                            type="text"
                            value={member.initials || ''}
                            onChange={(e) =>
                              handleUpdateMember(member.id, { initials: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-white uppercase font-mono"
                            placeholder="EO"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Ministry Role / Title</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) =>
                            handleUpdateMember(member.id, { role: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border text-xs font-semibold text-amber-700 bg-white"
                          placeholder="Mission Director & Pioneer Evangelist"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Bio Narrative</label>
                        <textarea
                          rows={2}
                          value={member.bio}
                          onChange={(e) =>
                            handleUpdateMember(member.id, { bio: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed bg-white"
                          placeholder="Over 20 years of dedicated rural field evangelism..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CALL TO ACTION */}
        {activeTab === 'cta' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-base font-serif font-bold text-emerald-950">
                Call to Action Section
              </h2>
              <p className="text-xs text-slate-500">
                Configure the bottom action prompt encouraging partnerships and audio listeners.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">CTA Heading</label>
              <input
                type="text"
                value={content.cta_heading}
                onChange={(e) => setContent({ ...content, cta_heading: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs font-bold"
                placeholder="Ready to Walk with Us?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <span className="text-xs font-bold text-emerald-950">Primary Button</span>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Button Label</label>
                  <input
                    type="text"
                    value={content.cta_primary_label}
                    onChange={(e) =>
                      setContent({ ...content, cta_primary_label: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white font-semibold"
                    placeholder="Get Involved & Partner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Button Link</label>
                  <input
                    type="text"
                    value={content.cta_primary_link}
                    onChange={(e) =>
                      setContent({ ...content, cta_primary_link: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white font-mono"
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <span className="text-xs font-bold text-emerald-950">Secondary Button</span>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Button Label</label>
                  <input
                    type="text"
                    value={content.cta_secondary_label}
                    onChange={(e) =>
                      setContent({ ...content, cta_secondary_label: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white font-semibold"
                    placeholder="Listen to Teachings"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Button Link</label>
                  <input
                    type="text"
                    value={content.cta_secondary_link}
                    onChange={(e) =>
                      setContent({ ...content, cta_secondary_link: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white font-mono"
                    placeholder="/audio"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE BAR */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs text-slate-500 hover:text-red-600 underline font-semibold transition-colors"
            >
              Reset to Ministry Defaults
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/about"
              target="_blank"
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ↗ Preview About Us
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold text-emerald-950 bg-amber-400 rounded-lg shadow hover:bg-amber-300 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span> Saving Changes...
                </>
              ) : (
                <>
                  <span>💾</span> Save & Publish Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
