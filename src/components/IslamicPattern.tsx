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
  <div className={`relative flex items-center justify-center rounded-xl bg-forest border border-gold/40 shadow-soft p-2 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative diamond */}
      <rect x="15" y="15" width="70" height="70" rx="6" stroke="#B69A5A" strokeWidth="2.5" transform="rotate(45 50 50)" />
      <rect x="20" y="20" width="60" height="60" rx="4" fill="#174C38" />
      {/* Scale of Justice & Book Motif */}
      <path d="M50 26V74" stroke="#B69A5A" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 38H68" stroke="#B69A5A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left scale pan */}
      <path d="M32 38L25 50H39L32 38Z" fill="#B69A5A" fillOpacity="0.7" />
      {/* Right scale pan */}
      <path d="M68 38L61 50H75L68 38Z" fill="#B69A5A" fillOpacity="0.7" />
      {/* Base Open Book */}
      <path d="M34 68C42 64 50 67 50 67C50 67 58 64 66 68V76C58 72 50 75 50 75C50 75 42 72 34 76V68Z" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="50" cy="22" r="3.5" fill="#B69A5A" />
    </svg>
  </div>
);
