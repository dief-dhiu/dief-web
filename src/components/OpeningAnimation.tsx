import React, { useState, useEffect, useCallback } from 'react';
import { IslamicStarIcon } from './IslamicPattern';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  // Step progression:
  // 0: 0.0s – 1.0s (Ivory background fades in)
  // 1: 1.0s – 2.0s (Official logo smoothly fades in & scales into position)
  // 2: 2.0s – 3.0s (Department name appears with subtle reveal)
  // 3: 3.0s – 4.0s (Institutional affiliation subtitle appears)
  // 4: 4.0s – 4.7s (Hold complete branding on screen)
  // 5: 4.7s – 5.2s (Smooth fadeout transition into homepage)
  const [step, setStep] = useState<number>(0);
  const [bgReady, setBgReady] = useState<boolean>(false);

  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem('dief_intro_seen', 'true');
    } catch {
      // Ignore storage errors in private or sandboxed modes
    }
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setStep(5);
    setTimeout(handleFinish, 350);
  }, [handleFinish]);

  useEffect(() => {
    // Respect prefers-reduced-motion: finish immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleFinish();
      return;
    }

    // Keyboard listener: Escape triggers instant graceful skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 0.0s: Ivory canvas fades in
    const tBg = setTimeout(() => {
      setBgReady(true);
    }, 40);

    // 1.0s: Official DIEF logo smoothly fades in and scales into position (0.96 -> 1.0)
    const tLogo = setTimeout(() => {
      setStep(1);
    }, 1000);

    // 2.0s: Department name appears with subtle upward reveal
    const tTitle = setTimeout(() => {
      setStep(2);
    }, 2000);

    // 3.0s: Institutional affiliation subtitle appears
    const tSubtitle = setTimeout(() => {
      setStep(3);
    }, 3000);

    // 4.0s: Hold complete branding on screen for clear reading
    const tHold = setTimeout(() => {
      setStep(4);
    }, 4000);

    // 4.7s: Gentle fadeout transition begins
    const tFade = setTimeout(() => {
      setStep(5);
    }, 4700);

    // 5.25s: Complete and unmount
    const tDone = setTimeout(() => {
      handleFinish();
    }, 5250);

    // Failsafe timeout at 6.0s to ensure website is never blocked under any condition
    const tFailsafe = setTimeout(() => {
      handleFinish();
    }, 6000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(tBg);
      clearTimeout(tLogo);
      clearTimeout(tTitle);
      clearTimeout(tSubtitle);
      clearTimeout(tHold);
      clearTimeout(tFade);
      clearTimeout(tDone);
      clearTimeout(tFailsafe);
    };
  }, [handleFinish, handleSkip]);

  const isFadingOut = step >= 5;
  const isLogoVisible = step >= 1;
  const isTitleVisible = step >= 2;
  const isSubtitleVisible = step >= 3;

  return (
    <aside
      aria-label="Department of Islamic Economics and Finance Institutional Introduction"
      role="region"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7F6F0] select-none transition-opacity duration-600 ease-out ${
        !bgReady ? 'opacity-0' : isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle ambient Islamic geometric lattice background */}
      <div 
        className="absolute inset-0 pattern-islamic-subtle opacity-35 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: bgReady ? 0.35 : 0 }}
      ></div>

      {/* Skip Intro Button (Top Right) */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30">
        <button
          onClick={handleSkip}
          className="px-4 py-1.5 rounded-full bg-forest/5 hover:bg-forest/10 border border-forest/15 text-forest/70 hover:text-forest text-xs font-semibold tracking-wide transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          title="Skip Introduction (or press Esc)"
        >
          Skip Intro
        </button>
      </div>

      {/* Main Centered Institutional Identity Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-xl text-center space-y-6">
        
        {/* 1. Official Approved DIEF Logo Asset */}
        <div 
          className="relative transition-all duration-1000"
          style={{
            opacity: isLogoVisible ? 1 : 0,
            transform: isLogoVisible ? 'scale(1.0)' : 'scale(0.96)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src="/dief-logo.png"
            alt="Department of Islamic Economics and Finance Official Logo"
            className="h-20 sm:h-24 md:h-28 w-auto object-contain mx-auto drop-shadow-sm"
          />
        </div>

        {/* 2. Department Name Reveal (2–3 seconds) */}
        <div 
          className="space-y-2 transition-all duration-1000"
          style={{
            opacity: isTitleVisible ? 1 : 0,
            transform: isTitleVisible ? 'translateY(0)' : 'translateY(8px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Subtle gold divider with star icon */}
          <div className="flex items-center justify-center space-x-3 pb-1">
            <span className="w-10 sm:w-14 h-px bg-gold/50"></span>
            <IslamicStarIcon size={14} className="text-gold" />
            <span className="w-10 sm:w-14 h-px bg-gold/50"></span>
          </div>

          <h1 className="font-editorial text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight leading-snug">
            Department of Islamic Economics and Finance
          </h1>
        </div>

        {/* 3. Institutional Subtitle Reveal (3–4 seconds) */}
        <div 
          className="space-y-1 transition-all duration-1000"
          style={{
            opacity: isSubtitleVisible ? 1 : 0,
            transform: isSubtitleVisible ? 'translateY(0)' : 'translateY(6px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="text-xs sm:text-sm font-semibold tracking-widest text-gold-dark uppercase font-sans">
            Darul Huda Islamic University
          </div>

          <div className="text-[11px] text-charcoal-muted tracking-wider uppercase font-medium">
            Kerala, India
          </div>
        </div>

      </div>
    </aside>
  );
};
