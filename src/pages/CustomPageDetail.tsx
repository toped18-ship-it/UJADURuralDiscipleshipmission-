import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { useAudio } from '../context/AudioContext';
import { DataService } from '../services/dataService';
import { AudioTeaching, CustomPage, CustomPageGalleryItem } from '../types';

export const CustomPageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeLightbox, setActiveLightbox] = useState<CustomPageGalleryItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeSlideFullscreen, setActiveSlideFullscreen] = useState<boolean>(false);

  const { currentTrack, isPlaying, playTrack, downloadAudio } = useAudio();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    DataService.getCustomPageBySlug(slug, true).then((data) => {
      setPage(data);
      setIsLoading(false);
      setActiveSlideIndex(0);
    });
  }, [slug]);

  // Slideshow auto-advance based on admin configuration
  useEffect(() => {
    if (!page?.slides || page.slides.length <= 1) return;
    const isAutoPlay = page.auto_play_slides !== false;
    if (!isAutoPlay) return;

    const intervalMs = (page.slide_interval_seconds || 5) * 1000;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % page.slides!.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [page?.slides, page?.auto_play_slides, page?.slide_interval_seconds]);

  const handlePrevSlide = () => {
    if (!page?.slides || page.slides.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + page.slides!.length) % page.slides!.length);
  };

  const handleNextSlide = () => {
    if (!page?.slides || page.slides.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % page.slides!.length);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins} mins`;
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-2/3 mx-auto" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The requested ministry page may be in draft mode or the link may be outdated.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800"
        >
          ← Return to Home
        </Link>
      </div>
    );
  }

  // Synthesize an AudioTeaching record for compatibility with AudioContext
  const pageAudioTrack: AudioTeaching | null = page.audio_storage_path
    ? {
        id: `page-audio-${page.id}`,
        title: page.audio_title || page.title,
        speaker: page.audio_speaker || 'UJADU Mission Preacher',
        description: page.subtitle || page.title,
        category: 'Sermon',
        scripture_reference: '',
        audio_storage_path: page.audio_storage_path,
        duration_seconds: page.audio_duration || 1800,
        published: true,
        published_at: page.created_at,
        created_at: page.created_at,
        updated_at: page.updated_at,
      }
    : null;

  const isAudioActive = pageAudioTrack && currentTrack?.id === pageAudioTrack.id;
  const isAudioPlaying = isAudioActive && isPlaying;

  return (
    <div className="space-y-12 pb-24">
      <SEOHead
        title={`${page.title} – UJADU Rural Discipleship Mission`}
        description={page.subtitle || page.content.slice(0, 160)}
      />

      {/* HERO SECTION */}
      <section className="relative bg-[#0f2a1d] text-white py-16 sm:py-20 overflow-hidden border-b border-amber-500/20">
        {page.hero_image && (
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src={page.hero_image}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>UJADU Special Mission Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              {page.subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{copiedLink ? 'Link Copied!' : 'Share Page'}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SLIDESHOW / ENLARGED PHOTO SLIDE SECTION */}
        {page.slides && page.slides.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <span>Photo Slideshow</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous slide"
                  className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:bg-emerald-900 hover:text-amber-300 hover:border-emerald-800 flex items-center justify-center text-slate-800 font-bold text-lg transition-colors shadow-sm cursor-pointer"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Next slide"
                  className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:bg-emerald-900 hover:text-amber-300 hover:border-emerald-800 flex items-center justify-center text-slate-800 font-bold text-lg transition-colors shadow-sm cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>

            {/* ENLARGED SLIDE VIEWPORT - CLICKING SLIDE OPENS FULLSCREEN */}
            <div
              onClick={() => setActiveSlideFullscreen(true)}
              className="relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 min-h-[440px] sm:min-h-[540px] lg:min-h-[620px] aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] group cursor-pointer"
            >
              {page.slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeSlideIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <ImageWithFallback
                    src={slide.image_url}
                    alt={slide.title || `Slide ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Subtle darkening overlays for crisp text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />

                  {/* Slide text details */}
                  {(slide.title || slide.caption) && (
                    <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 space-y-2 text-white max-w-4xl">
                      {slide.title && (
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-300 drop-shadow-md">
                          {slide.title}
                        </h3>
                      )}
                      {slide.caption && (
                        <p className="text-sm sm:text-base text-slate-100 drop-shadow leading-relaxed max-w-3xl">
                          {slide.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* OVERLAY NAVIGATION ARROWS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white hover:text-amber-300 border border-white/20 flex items-center justify-center text-2xl font-bold transition-all shadow-xl backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 hover:scale-110"
              >
                ‹
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white hover:text-amber-300 border border-white/20 flex items-center justify-center text-2xl font-bold transition-all shadow-xl backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 hover:scale-110"
              >
                ›
              </button>

              {/* SLIDE INDICATOR DOTS */}
              <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
                {page.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeSlideIndex ? 'w-8 bg-amber-400 shadow-md' : 'w-2.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ATTACHED AUDIO MESSAGE CARD */}
        {page.audio_storage_path && pageAudioTrack && (
          <section className="bg-gradient-to-br from-[#0f2a1d] to-[#1b4332] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold shadow">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                    Audio Teaching & Sermon
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white truncate">
                    {page.audio_title || page.title}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Speaker: {page.audio_speaker || 'Evangelist S. O. Okon'}
                    {page.audio_duration ? ` · ${formatDuration(page.audio_duration)}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => playTrack(pageAudioTrack)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                      : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800 border border-amber-400/40'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Play Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => downloadAudio(pageAudioTrack)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Download MP3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Native HTML5 audio player fallback & direct scrubber */}
            <div className="pt-2 border-t border-emerald-800/60">
              <audio
                src={page.audio_storage_path}
                controls
                className="w-full h-8 rounded"
              />
            </div>
          </section>
        )}

        {/* MAIN NARRATIVE CONTENT */}
        {page.content && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Mission Program
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {page.content}
            </div>
          </section>
        )}

        {/* ADDITIONAL SUBSECTIONS WITH HEADINGS */}
        {page.sections && page.sections.length > 0 && (
          <div className="space-y-6">
            {page.sections.map((section, idx) => (
              <section
                key={section.id || idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    {section.heading}
                  </h3>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-5 border-l-2 border-amber-200">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* PHOTO GALLERY SECTION */}
        {page.gallery && page.gallery.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                <span>Photo Gallery</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  ({page.gallery.length} photos)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.gallery.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setActiveLightbox(photo)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <ImageWithFallback
                    src={photo.image_url}
                    alt={photo.caption || `Gallery photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                    <p className="text-xs text-white drop-shadow truncate">
                      {photo.caption || 'Click to enlarge'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM NAV & PARTNERSHIP CALL TO ACTION */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 text-center space-y-4">
          <h3 className="text-lg font-serif font-bold text-slate-900">
            Partner With UJADU Rural Discipleship Mission
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Support our village evangelism, prayer networks, and frontline discipleship initiatives across remote settlements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow"
            >
              Contact / Partner With Us
            </Link>
            <Link
              to="/audio"
              className="px-5 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Explore Audio Teachings
            </Link>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={activeLightbox.image_url}
                alt={activeLightbox.caption || 'Gallery photo'}
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg font-bold hover:bg-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            {activeLightbox.caption && (
              <p className="text-sm text-slate-200 text-center font-medium">
                {activeLightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
      {/* FULLSCREEN SLIDE MODAL */}
      {activeSlideFullscreen && page.slides && page.slides.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md"
          onClick={() => setActiveSlideFullscreen(false)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white border-b border-slate-800 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-sm font-bold font-serif uppercase tracking-wider">
                Full Screen Slide View
              </span>
            </div>
            <button
              onClick={() => setActiveSlideFullscreen(false)}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main Enlarged Image Box */}
          <div
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={page.slides[activeSlideIndex].image_url}
              alt={page.slides[activeSlideIndex].title || 'Slide photo'}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
            />

            {/* Modal Left/Right Arrow Overlays */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
            >
              ‹
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Caption & Navigation Controls */}
          <div
            className="w-full max-w-4xl text-center space-y-2 text-white bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {page.slides[activeSlideIndex].title && (
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                {page.slides[activeSlideIndex].title}
              </h3>
            )}
            {page.slides[activeSlideIndex].caption && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
                {page.slides[activeSlideIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
