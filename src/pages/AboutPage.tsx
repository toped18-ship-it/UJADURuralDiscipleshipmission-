import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { SiteSettings } from '../types';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    DataService.getSiteSettings().then(setSettings);
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
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Who We Are</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            About UJADU Rural Discipleship Mission
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {settings?.tagline || 'Making Disciples, Transforming Lives Through Christ in rural communities.'}
          </p>
        </div>
      </section>

      {/* OVERVIEW & FOUNDATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Ministry Overview</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 leading-tight">
              A Calling to Unreached Rural Frontiers
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                UJADU Rural Discipleship Mission was established out of a deep burden for rural populations in underserved villages and agricultural settlements. While urban centers often enjoy vibrant church networks, rural communities frequently lack trained ministers, study Bibles, and systematic discipleship programs.
              </p>
              <p>
                Our conviction is grounded in the conviction that every human soul in the most distant hamlet is precious to God. We combine direct, compassionate Gospel proclamation with long-term, grounding discipleship that equips local believers to become pillar leaders in their families and communities.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80"
              alt="Rural African village gathering listening to gospel"
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
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center font-serif font-bold text-xl">
                M
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-950">Our Mission</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {settings?.mission_statement ||
                  'To preach the uncompromised Gospel of Jesus Christ to rural populations, raise rooted disciples through systematic biblical instruction, and plant vibrant, self-sustaining local fellowship communities.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-amber-300/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-serif font-bold text-xl">
                V
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-950">Our Vision</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {settings?.vision_statement ||
                  'To see vibrant, Christ-centered rural communities transformed by the power of the Holy Spirit, where every believer is equipped as a faithful disciple-maker.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BIBLICAL VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Guiding Pillars</span>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Core Biblical Values</h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            The principles that anchor our field decisions, teaching curricula, and community engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(settings?.core_values || [
            'Biblical Supreme Authority',
            'Unwavering Christ-Centered Discipleship',
            'Sacrificial Rural Servant Leadership',
            'Holistic Community Transformation',
            'Faithful Stewardship & Integrity',
          ]).map((val, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono font-bold text-amber-600">0{idx + 1}. Pillar</span>
              <h3 className="text-lg font-serif font-bold text-emerald-950">{val}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anchored on Holy Scripture as our sole authority for life, salvation, and ministry practice.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH TO RURAL EVANGELISM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1b4332] text-white rounded-2xl p-8 sm:p-12 space-y-8 border border-amber-500/30">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Strategy</span>
            <h2 className="text-3xl font-serif font-bold text-white">Our 4-Phase Rural Discipleship Cycle</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <h3 className="font-serif font-bold text-white text-base">Frontier Outreach</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Conducting village door-to-door evangelism, film shows, and open-air gospel meetings in unreached areas.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <h3 className="font-serif font-bold text-white text-base">Grounding Believers</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Establishing weekly Bible study circles covering foundational doctrines, salvation, assurance, and prayer.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <h3 className="font-serif font-bold text-white text-base">Leadership Mentorship</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Training local elders, women leaders, and youth directors to lead prayer watches and study classes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                4
              </span>
              <h3 className="font-serif font-bold text-white text-base">Community Blessing</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Integrating clean water initiatives, health education, and agricultural support to reflect God's love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP & FIELD TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Servant Leadership</span>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Ministry Leadership & Field Team</h2>
          <p className="text-xs text-slate-500">Dedicated servants laboring across rural field bases.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-400">
              EO
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Evangelist S. O. Okon</h3>
              <p className="text-xs text-amber-600 font-semibold">Mission Director & Pioneer Evangelist</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Over 20 years of dedicated rural field evangelism, church planting, and missionary training across underserved communities.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-400">
              ED
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Pastor Emmanuel David</h3>
              <p className="text-xs text-amber-600 font-semibold">Head of Discipleship & Curriculum</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Passionate teacher of scripture focused on localized discipleship materials and training indigenous lay leaders.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-400">
              GA
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Minister Grace Adebayo</h3>
              <p className="text-xs text-amber-600 font-semibold">Intercession & Women Discipleship</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Directing rural women’s prayer fellowships, community welfare initiatives, and youth mentoring.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Ready to Walk with Us?</h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-amber-400 text-emerald-950 font-bold text-sm shadow hover:bg-amber-300 transition-colors"
          >
            Get Involved & Partner
          </Link>
          <Link
            to="/audio"
            className="px-6 py-3 rounded-xl bg-emerald-900 text-white font-medium text-sm hover:bg-emerald-800 transition-colors"
          >
            Listen to Teachings
          </Link>
        </div>
      </section>
    </div>
  );
};
