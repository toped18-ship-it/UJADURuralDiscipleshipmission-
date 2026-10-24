import React, { useEffect, useState } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const categories = ['All', 'Evangelism', 'Rural Outreach', 'Bible Study', 'Discipleship', 'Prayer Meetings', 'Mission Events'];

  useEffect(() => {
    setIsLoading(true);
    DataService.getGalleryImages(selectedCategory).then((data) => {
      setImages(data);
      setIsLoading(false);
    });
  }, [selectedCategory]);

  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleImages = filteredImages.slice(0, visibleCount);

  const handleOpenSlide = (img: GalleryItem, idx: number) => {
    setActiveLightbox(img);
    setActiveSlideIndex(idx);
  };

  const handlePrevSlide = () => {
    if (filteredImages.length === 0) return;
    const newIdx = (activeSlideIndex - 1 + filteredImages.length) % filteredImages.length;
    setActiveSlideIndex(newIdx);
    setActiveLightbox(filteredImages[newIdx]);
  };

  const handleNextSlide = () => {
    if (filteredImages.length === 0) return;
    const newIdx = (activeSlideIndex + 1) % filteredImages.length;
    setActiveSlideIndex(newIdx);
    setActiveLightbox(filteredImages[newIdx]);
  };

  return (
    <div className="space-y-12 pb-16">
      <SEOHead
        title="Outreach Gallery – UJADU Rural Discipleship Mission"
        description="Browse photographs documenting rural village evangelism, open-air preaching, Bible study fellowships, and community discipleship."
      />

      {/* HEADER */}
      <section className="bg-[#0f2a1d] text-white py-12 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Visual Testimonies</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Outreach & Mission Gallery</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-xs sm:text-sm">
            Snapshots of God’s moving power across rural villages, Bible fellowships, and open-air meetings.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* CONTROLS: Category segmented buttons & Search input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(6);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* GALLERY GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-200 rounded-xl aspect-[4/3]" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-serif font-bold text-slate-800">No Gallery Images Found</h3>
            <p className="text-xs text-slate-500">Try selecting a different category or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => handleOpenSlide(img, idx)}
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <ImageWithFallback
                    src={img.storage_path}
                    alt={img.title}
                    category={img.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[10px] font-semibold uppercase">
                    {img.category}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-serif font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                    {img.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{img.location || 'Mission Field'}</span>
                    <span>{img.event_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {!isLoading && visibleCount < filteredImages.length && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2.5 rounded-lg bg-emerald-900 text-amber-300 hover:bg-emerald-800 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Load More Photographs ({filteredImages.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* ENLARGED PHOTO SLIDE MODAL WITH NAV CONTROLS */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md"
          onClick={() => setActiveLightbox(null)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white border-b border-slate-800 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-sm font-bold font-serif uppercase tracking-wider">
                Outreach Photo Slide View
              </span>
            </div>
            <button
              onClick={() => setActiveLightbox(null)}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main Photo Container */}
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

            {/* Left and Right Slide Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              aria-label="Previous photo slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
            >
              ‹
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              aria-label="Next photo slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-400/30 flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 shadow-2xl cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Footer Details */}
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
    </div>
  );
};
