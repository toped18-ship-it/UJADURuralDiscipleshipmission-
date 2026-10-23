import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  category,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-900 via-[#1b4332] to-slate-900 text-amber-100 overflow-hidden select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle cross accent SVG pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <svg
          className="w-12 h-12 mb-3 text-amber-400 stroke-current opacity-90"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21v-8.25M12 12.75V3m0 9.75H4.5m7.5 0h7.5"
          />
        </svg>

        <span className="text-xs uppercase tracking-widest font-semibold text-amber-300 mb-1">
          UJADU MISSION
        </span>
        <span className="text-sm font-serif italic text-center line-clamp-2 px-2 text-emerald-100">
          {alt || category || 'Rural Discipleship Outreach'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
