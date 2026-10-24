import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { useAudio } from '../context/AudioContext';
import { DataService } from '../services/dataService';
import { AudioTeaching, BlogPost, GalleryItem, SiteSettings } from '../types';

export const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredAudio, setFeaturedAudio] = useState<AudioTeaching[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [recentGallery, setRecentGallery] = useState<GalleryItem[]>([]);
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  const [activeGallerySlideIndex, setActiveGallerySlideIndex] = useState<number>(0);

  const { currentTrack, isPlaying, playTrack, downloadAudio } = useAudio();

  useEffect(() => {
    DataService.getSiteSettings().then(setSettings);
    DataService.getAudioTeachings().then((list) => setFeaturedAudio(list.slice(0, 3)));
    DataService.getBlogPosts().then((list) => setLatestBlogs(list.slice(0, 3)));
    DataService.getGalleryImages().then((list) => setRecentGallery(list.slice(0, 8)));
  }, []);

  // Homepage photo slide auto-advance
  useEffect(() => {
    if (!recentGallery || recentGallery.length <= 1) return;
    const interval = setInterval(() => {
      setActiveGallerySlideIndex((prev) => (prev + 1) % recentGallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recentGallery]);

  const handlePrevGallerySlide = () => {
    if (!recentGallery || recentGallery.length === 0) return;
    setActiveGallerySlideIndex((prev) => (prev - 1 + recentGallery.length) % recentGallery.length);
  };

  const handleNextGallerySlide = () => {
    if (!recentGallery || recentGallery.length === 0) return;
    setActiveGallerySlideIndex((prev) => (prev + 1) % recentGallery.length);
  };

  return (
    <div className="space-y-16 pb-12">
      <SEOHead
        title="Home – Making Disciples, Transforming Lives Through Christ"
        description={settings?.seo_description || 'Official portal for UJADU Rural Discipleship Mission.'}
      />

      {/* HERO SECTION */}
      <section className="relative bg-[#0f2a1d] text-white pt-20 pb-24 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2a1d] via-[#1b4332]/90 to-[#0f2a1d]/80 z-10" />
        <div className="absolute inset-0 opacity-25">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80"
            alt="African rural mission gathering background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>UJADU Rural Evangelism & Discipleship</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              {settings?.hero_headline || 'Making Disciples, Transforming Lives Through Christ'}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl">
              {settings?.hero_subtext ||
                'Proclaiming the Gospel of Jesus Christ in unreached rural communities through active evangelism, grounded biblical teaching, discipleship training, and compassionate community outreach.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Explore Our Mission
              </Link>
              <Link
                to="/audio"
                className="px-6 py-3.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span>Listen to Teachings</span>
              </Link>
              <Link
                to="/blog"
                className="px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/20"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SCRIPTURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-100 to-amber-500/10 border border-amber-300/60 rounded-2xl p-8 text-center space-y-3">
          <p className="font-serif text-2xl sm:text-3xl text-emerald-950 italic font-semibold leading-relaxed max-w-4xl mx-auto">
            "And He said to them, 'Go into all the world and preach the gospel to every creature.'"
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">— Mark 16:15</p>
        </div>
      </section>

      {/* ABOUT THE MISSION SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">About UJADU Mission</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
              Dedicated to Rural Gospel Frontiers & Systematic Discipleship
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              UJADU Rural Discipleship Mission exists to take the light of Jesus Christ into distant villages and farming settlements where access to sound biblical teaching is scarce. We do not merely conduct one-day evangelistic rallies; we establish ongoing discipleship centers, train indigenous leaders, and nurture vibrant rural believers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1">
                <h3 className="text-base font-serif font-bold text-emerald-900">Rural Evangelism</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Outreach into unreached rural villages with personal witnessing and outdoor village preaching.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1">
                <h3 className="text-base font-serif font-bold text-emerald-900">Discipleship Mentorship</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Weekly systematic Bible studies equipping local believers to walk in holiness and maturity.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-amber-600 transition-colors"
              >
                <span>Read Full Ministry Vision & Leadership</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80"
              alt="Community Bible study and discipleship in rural village"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <p className="text-white text-xs font-serif italic">
                Rural believers gathering for outdoor Bible study and prayer fellowship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED AUDIO TEACHINGS */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Audio Resource Center</span>
              <h2 className="text-3xl font-serif font-bold text-white mt-1">Downloadable Audio Teachings</h2>
            </div>
            <Link
              to="/audio"
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 shrink-0"
            >
              <span>View All Audio Library</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAudio.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  className="bg-emerald-900/60 rounded-xl border border-emerald-800 p-5 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-700">
                        {track.category}
                      </span>
                      {track.scripture_reference && (
                        <span className="text-xs text-emerald-300 font-mono">{track.scripture_reference}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white line-clamp-2">{track.title}</h3>
                    <p className="text-xs text-amber-200/80">Speaker: {track.speaker}</p>
                    <p className="text-xs text-slate-300 line-clamp-2">{track.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-800/80">
                    <button
                      onClick={() => playTrack(track)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                    >
                      {isThisPlaying ? (
                        <>
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>Play Teaching</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadAudio(track)}
                      className="text-xs text-emerald-300 hover:text-amber-300 transition-colors flex items-center gap-1"
                      title="Download MP3"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>MP3</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Discipleship & Outreach News</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">Latest Articles & Reports</h2>
          </div>
          <Link
            to="/blog"
            className="text-xs font-semibold text-emerald-900 hover:text-amber-600 flex items-center gap-1 shrink-0"
          >
            <span>Browse All Blog Articles</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  <ImageWithFallback
                    src={blog.featured_image_path}
                    alt={blog.title}
                    category={blog.category}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-900">{blog.category}</span>
                    <span>·</span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 hover:text-emerald-900 transition-colors line-clamp-2">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/blog/${blog.slug}`}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* RECENT GALLERY PHOTOGRAPHS / ENLARGED PHOTO SLIDE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Visual Mission Testimonies</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">Featured Mission Photo Slides</h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/gallery"
              className="text-xs font-semibold text-emerald-900 hover:text-amber-600 flex items-center gap-1 shrink-0"
            >
              <span>View Full Gallery</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* PHOTO SLIDE SHOWCASE */}
        {recentGallery.length > 0 && (
          <div className="space-y-4">
            {/* ENLARGED SLIDE SHOWCASE CANVAS - CLICKING OPENS LIGHTBOX */}
            <div
              onClick={() => setActiveLightbox(recentGallery[activeGallerySlideIndex])}
              className="relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] group cursor-pointer"
            >
              {recentGallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeGallerySlideIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <ImageWithFallback
                    src={item.storage_path}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />

                  {/* Caption & Metadata Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 space-y-2 text-white max-w-4xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-xs text-amber-200/90 font-mono">
                        {item.event_date} {item.location ? `· ${item.location}` : ''}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white drop-shadow-md">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-200 max-w-3xl drop-shadow leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* OVERLAY NAVIGATION ARROWS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevGallerySlide();
                }}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white hover:text-amber-300 border border-white/20 flex items-center justify-center text-2xl font-bold transition-all shadow-xl backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 hover:scale-110"
              >
                ‹
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextGallerySlide();
                }}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white hover:text-amber-300 border border-white/20 flex items-center justify-center text-2xl font-bold transition-all shadow-xl backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 hover:scale-110"
              >
                ›
              </button>

              {/* SLIDE INDICATOR DOTS */}
              <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
                {recentGallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGallerySlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeGallerySlideIndex ? 'w-8 bg-amber-400 shadow-md' : 'w-2.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ENLARGED LIGHTBOX MODAL WITH NEXT/PREV CONTROLS */}
        {activeLightbox && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md"
            onClick={() => setActiveLightbox(null)}
          >
            {/* Header */}
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white border-b border-slate-800 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-sm font-bold font-serif uppercase tracking-wider">
                  Outreach Photo Slide
                </span>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xl cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Main Photo Box */}
            <div
              className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={activeLightbox.storage_path}
                alt={activeLightbox.title}
                category={activeLightbox.category}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800 mx-auto"
              />

              {/* Prev/Next buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIdx = (activeGallerySlideIndex - 1 + recentGallery.length) % recentGallery.length;
                  setActiveGallerySlideIndex(prevIdx);
                  setActiveLightbox(recentGallery[prevIdx]);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
              >
                ‹
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = (activeGallerySlideIndex + 1) % recentGallery.length;
                  setActiveGallerySlideIndex(nextIdx);
                  setActiveLightbox(recentGallery[nextIdx]);
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
              >
                ›
              </button>
            </div>

            {/* Details */}
            <div
              className="w-full max-w-4xl text-center space-y-2 text-white bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-3 text-xs text-amber-300">
                <span className="font-bold uppercase tracking-wider">{activeLightbox.category}</span>
                <span>·</span>
                <span>{activeLightbox.event_date} {activeLightbox.location ? `· ${activeLightbox.location}` : ''}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{activeLightbox.title}</h3>
              {activeLightbox.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  {activeLightbox.description}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* PARTNERSHIP CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1b4332] text-white rounded-2xl p-8 sm:p-12 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Join the Mission</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Partner With Us in Reaching Rural Frontiers
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Whether through faithful intercessory prayer, volunteering on field outreaches, hosting local discipleship groups, or supporting mission logistics, your partnership expands the Kingdom of God.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-8 py-4 rounded-xl bg-amber-400 text-emerald-950 font-bold text-sm shadow-md hover:bg-amber-300 transition-colors shrink-0 whitespace-nowrap"
          >
            Become a Ministry Partner
          </Link>
        </div>
      </section>
    </div>
  );
};
