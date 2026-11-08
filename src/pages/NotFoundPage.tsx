import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Home, Mail, Search, ArrowRight, ShieldAlert } from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface NotFoundPageProps {
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border border-forest/15 shadow-soft p-8 sm:p-14 text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-surface-lightGreen/50 rounded-bl-full pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-tr-full pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-forest/15 text-forest text-xs font-semibold">
            <IslamicStarIcon size={12} className="text-gold-dark" />
            <span>Kulliyya of Sharia • Darul Huda Islamic University</span>
          </div>

          {/* Large Error Indicator */}
          <div className="space-y-2">
            <span className="text-6xl sm:text-7xl font-editorial font-bold text-forest/20 tracking-widest block font-sans">
              404
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-forest tracking-tight">
              Page or Document Not Found
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed max-w-lg mx-auto">
              The departmental resource, page, or publication you requested could not be located at this URL. It may have been relocated, updated, or retired.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-forest hover:bg-emerald-deep text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft transition flex items-center space-x-2"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Return to Homepage</span>
            </button>

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-6 py-3 bg-forest/5 hover:bg-forest/10 text-forest border border-forest/15 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-gold-dark" />
                <span>Search Portal Database</span>
              </button>
            )}
          </div>

          {/* Helpful Academic Navigation Links */}
          <div className="pt-8 border-t border-gray-100">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block mb-4">
              Explore Central Department Sections
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <button
                onClick={() => navigate('/tamweel')}
                className="p-4 rounded-xl border border-forest/10 hover:border-gold/60 hover:bg-forest/5 transition group"
              >
                <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Tamweel Journal</span>
                </div>
                <p className="text-[11px] text-charcoal-muted mt-1">Peer-reviewed academic research publications.</p>
              </button>

              <button
                onClick={() => navigate('/activities')}
                className="p-4 rounded-xl border border-forest/10 hover:border-gold/60 hover:bg-forest/5 transition group"
              >
                <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>Activities &amp; Events</span>
                </div>
                <p className="text-[11px] text-charcoal-muted mt-1">Conferences, seminars, and student bulletins.</p>
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="p-4 rounded-xl border border-forest/10 hover:border-gold/60 hover:bg-forest/5 transition group"
              >
                <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                  <Mail className="w-4 h-4 text-gold" />
                  <span>Contact Department</span>
                </div>
                <p className="text-[11px] text-charcoal-muted mt-1">Inquiries, office hours, and academic liaison.</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
