import React from 'react';
import { useAudio } from '../context/AudioContext';
import { ImageWithFallback } from './ImageWithFallback';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    downloadAudio,
    closePlayer,
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f2a1d] text-white border-t border-amber-500/30 shadow-2xl backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track Metadata */}
        <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
          <div className="w-12 h-12 rounded bg-emerald-950 overflow-hidden shrink-0 border border-amber-500/20">
            {currentTrack.cover_storage_path ? (
              <ImageWithFallback
                src={currentTrack.cover_storage_path}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-amber-400 font-bold text-xs">
                UJADU
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
            <p className="text-xs text-amber-200/80 truncate">{currentTrack.speaker}</p>
            {currentTrack.scripture_reference && (
              <p className="text-[10px] text-emerald-300 truncate">{currentTrack.scripture_reference}</p>
            )}
          </div>
        </div>

        {/* Playback Controls & Progress Slider */}
        <div className="flex flex-col items-center w-full md:w-2/4 gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-colors shadow"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause sermon' : 'Play sermon'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full text-xs font-mono text-emerald-200">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume, Download & Close */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/4 shrink-0">
          <button
            onClick={toggleMute}
            className="text-emerald-200 hover:text-amber-300 transition-colors p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolumeLevel(Number(e.target.value))}
            className="w-16 h-1 bg-emerald-900 rounded appearance-none cursor-pointer accent-amber-400 hidden sm:block"
          />

          <button
            onClick={() => downloadAudio(currentTrack)}
            className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition-colors flex items-center gap-1"
            title="Download MP3"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden lg:inline">MP3</span>
          </button>

          <button
            onClick={closePlayer}
            className="text-slate-400 hover:text-white p-1"
            title="Close Player"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
