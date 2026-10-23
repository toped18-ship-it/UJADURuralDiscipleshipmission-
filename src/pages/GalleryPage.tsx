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
            {visibleImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveLightbox(img)}
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
              className="px-6 py-2.5 rounded-lg bg-emerald-900 text-amber-300 hover:bg-emerald-800 text-xs font-semibold transition-colors shadow-sm"
            >
              Load More Photographs ({filteredImages.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
            >
              ✕
            </button>
            <div className="max-h-[65vh] overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={activeLightbox.storage_path}
                alt={activeLightbox.title}
                className="w-full h-full object-contain max-h-[65vh] mx-auto"
              />
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-900">{activeLightbox.category}</span>
                <span>{activeLightbox.event_date} · {activeLightbox.location || 'Rural Mission Base'}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">{activeLightbox.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{activeLightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
