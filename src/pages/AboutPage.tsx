import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { AboutContent, SiteSettings } from '../types';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    DataService.getSiteSettings().then(setSettings);
    DataService.getAboutContent().then(setAbout);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <SEOHead
        title="About Our Mission – UJADU Rural Discipleship Mission"
        description="Learn about UJADU Rural Discipleship Mission, our vision, mission, core biblical values, and approach to rural evangelism."
      />

      {/* HEADER BANNER */}
      <section className="bg-[#0f2a1d] text-white py-16 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {about?.hero_badge || 'Who We Are'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {about?.hero_title || 'About UJADU Rural Discipleship Mission'}
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {about?.hero_tagline || settings?.tagline || 'Making Disciples, Transforming Lives Through Christ in rural communities.'}
          </p>
        </div>
      </section>

      {/* OVERVIEW & FOUNDATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              {about?.overview_badge || 'Ministry Overview'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 leading-tight">
              {about?.overview_title || 'A Calling to Unreached Rural Frontiers'}
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                {about?.overview_paragraph_1 ||
                  'UJADU Rural Discipleship Mission was established out of a deep burden for rural populations in underserved villages and agricultural settlements. While urban centers often enjoy vibrant church networks, rural communities frequently lack trained ministers, study Bibles, and systematic discipleship programs.'}
              </p>
              <p>
                {about?.overview_paragraph_2 ||
                  'Our conviction is grounded in the conviction that every human soul in the most distant hamlet is precious to God. We combine direct, compassionate Gospel proclamation with long-term, grounding discipleship that equips local believers to become pillar leaders in their families and communities.'}
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-100">
            <ImageWithFallback
              src={
                about?.overview_image ||
                'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80'
              }
              alt={about?.overview_image_alt || 'Rural African village gathering listening to gospel'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* MISSION & VISION STATEMENTS */}
      <section className="bg-amber-500/10 border-y border-amber-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-amber-300/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center font-serif font-bold text-xl shadow-inner">
                M
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-950">
                {about?.mission_title || 'Our Mission'}
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {about?.mission_statement ||
                  settings?.mission_statement ||
                  'To preach the uncompromised Gospel of Jesus Christ to rural populations, raise rooted disciples through systematic biblical instruction, and plant vibrant, self-sustaining local fellowship communities.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-amber-300/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-serif font-bold text-xl shadow-inner">
                V
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-950">
                {about?.vision_title || 'Our Vision'}
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {about?.vision_statement ||
                  settings?.vision_statement ||
                  'To see vibrant, Christ-centered rural communities transformed by the power of the Holy Spirit, where every believer is equipped as a faithful disciple-maker.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FIELD MILESTONES STATS */}
      {about?.milestones && about.milestones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0f2a1d] text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-amber-500/30">
            {about.milestones_title && (
              <div className="text-center pb-8 border-b border-emerald-900/80 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Kingdom Impact</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {about.milestones_title}
                </h3>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {about.milestones.map((m) => (
                <div key={m.id} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 font-mono">
                    {m.value}
                  </div>
                  <div className="text-xs sm:text-sm text-emerald-100 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CORE BIBLICAL VALUES / PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            {about?.pillars_badge || 'Guiding Pillars'}
          </span>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {about?.pillars_title || 'Core Biblical Values'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            {about?.pillars_subtext ||
              'The principles that anchor our field decisions, teaching curricula, and community engagement.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(about?.pillars && about.pillars.length > 0
            ? about.pillars
            : [
                {
                  id: 'pil-1',
                  title: 'Biblical Supreme Authority',
                  scripture_reference: '2 Timothy 3:16-17',
                  description: 'Anchored on Holy Scripture as our sole authority for life, salvation, and ministry practice.',
                },
                {
                  id: 'pil-2',
                  title: 'Unwavering Christ-Centered Discipleship',
                  scripture_reference: 'Matthew 28:19-20',
                  description: 'Nurturing believers to spiritual maturity through systematic personal study and life-on-life mentoring.',
                },
                {
                  id: 'pil-3',
                  title: 'Sacrificial Rural Servant Leadership',
                  scripture_reference: 'Mark 10:45',
                  description: 'Living alongside village communities with humble hearts, serving their spiritual and holistic needs.',
                },
                {
                  id: 'pil-4',
                  title: 'Holistic Community Transformation',
                  scripture_reference: 'James 2:15-17',
                  description: 'Reflecting the compassion of Christ through practical community blessing, relief, and empowerment.',
                },
                {
                  id: 'pil-5',
                  title: 'Faithful Stewardship & Integrity',
                  scripture_reference: '1 Corinthians 4:2',
                  description: 'Honoring God with unwavering accountability in all resources, missionary time, and relationships.',
                },
              ]
          ).map((pillar, idx) => (
            <div
              key={pillar.id || idx}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600">
                  0{idx + 1}. Pillar
                </span>
                {pillar.scripture_reference && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {pillar.scripture_reference}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-serif font-bold text-emerald-950">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH TO RURAL EVANGELISM / STRATEGY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1b4332] text-white rounded-2xl p-8 sm:p-12 space-y-8 border border-amber-500/30">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              {about?.strategy_badge || 'Our Strategy'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">
              {about?.strategy_title || 'Our 4-Phase Rural Discipleship Cycle'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about?.strategy_phases && about.strategy_phases.length > 0
              ? about.strategy_phases
              : [
                  {
                    id: 'ph-1',
                    step_number: 1,
                    title: 'Frontier Outreach',
                    description:
                      'Conducting village door-to-door evangelism, film shows, and open-air gospel meetings in unreached areas.',
                  },
                  {
                    id: 'ph-2',
                    step_number: 2,
                    title: 'Grounding Believers',
                    description:
                      'Establishing weekly Bible study circles covering foundational doctrines, salvation, assurance, and prayer.',
                  },
                  {
                    id: 'ph-3',
                    step_number: 3,
                    title: 'Leadership Mentorship',
                    description:
                      'Training local elders, women leaders, and youth directors to lead prayer watches and study classes.',
                  },
                  {
                    id: 'ph-4',
                    step_number: 4,
                    title: 'Community Blessing',
                    description:
                      'Integrating clean water initiatives, health education, and agricultural support to reflect God\'s love.',
                  },
                ]
            ).map((phase, idx) => (
              <div
                key={phase.id || idx}
                className="p-5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 space-y-2"
              >
                <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                  {phase.step_number || idx + 1}
                </span>
                <h3 className="font-serif font-bold text-white text-base">
                  {phase.title}
                </h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP & FIELD TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            {about?.leadership_badge || 'Servant Leadership'}
          </span>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {about?.leadership_title || 'Ministry Leadership & Field Team'}
          </h2>
          <p className="text-xs text-slate-500">
            {about?.leadership_subtext || 'Dedicated servants laboring across rural field bases.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(about?.leadership_team && about.leadership_team.length > 0
            ? about.leadership_team
            : [
                {
                  id: 'lead-1',
                  name: 'Evangelist S. O. Okon',
                  role: 'Mission Director & Pioneer Evangelist',
                  bio: 'Over 20 years of dedicated rural field evangelism, church planting, and missionary training across underserved communities.',
                  initials: 'EO',
                  photo_url: '',
                },
                {
                  id: 'lead-2',
                  name: 'Pastor Emmanuel David',
                  role: 'Head of Discipleship & Curriculum',
                  bio: 'Passionate teacher of scripture focused on localized discipleship materials and training indigenous lay leaders.',
                  initials: 'ED',
                  photo_url: '',
                },
                {
                  id: 'lead-3',
                  name: 'Minister Grace Adebayo',
                  role: 'Intercession & Women Discipleship',
                  bio: 'Directing rural women’s prayer fellowships, community welfare initiatives, and youth mentoring.',
                  initials: 'GA',
                  photo_url: '',
                },
              ]
          ).map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm text-center flex flex-col justify-between"
            >
              <div className="space-y-4">
                {member.photo_url ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-400 shadow">
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-400">
                    {member.initials ||
                      member.name
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">{member.name}</h3>
                  <p className="text-xs text-amber-600 font-semibold">{member.role}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold text-slate-900">
          {about?.cta_heading || 'Ready to Walk with Us?'}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={about?.cta_primary_link || '/contact'}
            className="px-6 py-3 rounded-xl bg-amber-400 text-emerald-950 font-bold text-sm shadow hover:bg-amber-300 transition-colors"
          >
            {about?.cta_primary_label || 'Get Involved & Partner'}
          </Link>
          <Link
            to={about?.cta_secondary_link || '/audio'}
            className="px-6 py-3 rounded-xl bg-emerald-900 text-white font-medium text-sm hover:bg-emerald-800 transition-colors"
          >
            {about?.cta_secondary_label || 'Listen to Teachings'}
          </Link>
        </div>
      </section>
    </div>
  );
};
