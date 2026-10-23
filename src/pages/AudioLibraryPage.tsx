import React, { useEffect, useState } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { useAudio } from '../context/AudioContext';
import { DataService } from '../services/dataService';
import { AudioTeaching } from '../types';

export const AudioLibraryPage: React.FC = () => {
  const [audioList, setAudioList] = useState<AudioTeaching[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { currentTrack, isPlaying, playTrack, downloadAudio } = useAudio();

  const categories = ['All', 'Sermon', 'Discipleship Series', 'Evangelism', 'Devotionals', 'Prayer', 'Leadership'];

  useEffect(() => {
    setIsLoading(true);
    DataService.getAudioTeachings(selectedCategory).then((data) => {
      setAudioList(data);
      setIsLoading(false);
    });
  }, [selectedCategory]);

  const filteredTeachings = audioList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scripture_reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (secs: number) => {
    if (!secs) return '30 min';
    const m = Math.floor(secs / 60);
    return `${m} mins`;
  };

  return (
    <div className="space-y-12 pb-24">
      <SEOHead
        title="Audio Library – UJADU Rural Discipleship Mission"
        description="Listen to and download Christian audio teachings, sermons, and discipleship messages by UJADU Mission evangelists."
      />

      {/* HEADER BANNER */}
      <section className="bg-[#0f2a1d] text-white py-14 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Christian Audio Resource Center</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Audio Teachings & Sermons</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-xs sm:text-sm">
            Stream or download biblically grounded preachings, discipleship series, and intercessory prayer messages.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title, speaker, or scripture..."
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

        {/* AUDIO LIST */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-200 rounded-xl h-28" />
            ))}
          </div>
        ) : filteredTeachings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <h3 className="text-base font-serif font-bold text-slate-800">No Audio Teachings Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or selecting another category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeachings.map((track) => {
              const isThisTrackActive = currentTrack?.id === track.id;
              const isThisTrackPlaying = isThisTrackActive && isPlaying;

              return (
                <div
                  key={track.id}
                  className={`bg-white rounded-xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm ${
                    isThisTrackActive ? 'border-amber-400 ring-1 ring-amber-400/50 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-emerald-950 shrink-0 overflow-hidden border border-slate-200">
                      {track.cover_storage_path ? (
                        <ImageWithFallback
                          src={track.cover_storage_path}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-amber-300 font-bold text-xs">
                          UJADU
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-semibold">
                          {track.category}
                        </span>
                        {track.scripture_reference && (
                          <span className="text-xs text-amber-700 font-semibold font-mono">
                            {track.scripture_reference}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">· {formatDuration(track.duration_seconds)}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-slate-900">{track.title}</h3>
                      <p className="text-xs text-slate-600 font-medium">Speaker: {track.speaker}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl">{track.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => playTrack(track)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors ${
                        isThisTrackPlaying
                          ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                          : 'bg-[#1b4332] text-amber-300 hover:bg-emerald-800'
                      }`}
                    >
                      {isThisTrackPlaying ? (
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
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadAudio(track)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Download MP3"
                    >
                      <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download MP3</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
