import React from 'react';

export const IslamicStarIcon: React.FC<{ className?: string; size?: number }> = ({ className = "text-gold", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 8-pointed Islamic geometric star (Rub el Hizb inspired) */}
    <rect x="20" y="20" width="60" height="60" rx="3" fill="currentColor" fillOpacity="0.2" />
    <rect x="20" y="20" width="60" height="60" rx="3" transform="rotate(45 50 50)" fill="currentColor" fillOpacity="0.2" />
    <polygon
      points="50,4 62,35 96,35 69,56 79,89 50,69 21,89 31,56 4,35 38,35"
      fill="currentColor"
    />
    <circle cx="50" cy="50" r="14" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
  </svg>
);

export const IslamicPatternBand: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-full overflow-hidden flex items-center justify-center opacity-30 select-none ${className}`}>
    <div className="flex space-x-6 py-2">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 text-gold">
          <IslamicStarIcon size={16} />
          <div className="w-8 h-[1px] bg-gold opacity-50"></div>
        </div>
      ))}
    </div>
  </div>
);

export const CrestLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-xl bg-white border border-gold/50 shadow-soft p-1.5 overflow-hidden shrink-0 group ${className}`}
  >
    {/* Subtle geometric square pattern accents */}
    <div className="absolute inset-0 pattern-light opacity-30 pointer-events-none"></div>
    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-gold/70"></div>
    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-gold/70"></div>
    <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-gold/70"></div>
    <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-gold/70"></div>
    <img
      src="/dief-logo-blue.png"
      alt="Department of Islamic Economics and Finance Official Logo"
      className="w-full h-full object-contain relative z-10 transition-transform duration-200 group-hover:scale-105"
    />
  </div>
);
