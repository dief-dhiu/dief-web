import React, { useState, useEffect, useRef } from 'react';
import { PageId, EventItem, JournalArticle } from '../types';
import { Search, X, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  events: EventItem[];
  articles: JournalArticle[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  events,
  articles,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();

  // Static Pages and Initiatives indexing (excluding removed resources)
  const pagesIndex = normalized ? [
    { id: 'about', title: 'About the Department', desc: 'Vision, Mission, Faculty, Academic Approach & Programmes', page: 'about' as PageId },
    { id: 'dhib', title: 'DHIB — Darul Huda Islamic Bank', desc: 'Ethical banking sandbox, financial literacy & Shariah principles', page: 'dhib' as PageId },
    { id: 'sbc', title: 'SBC — Shariah Business Consultancy', desc: 'Commercial advisory, contract structuring & consultation request', page: 'sbc' as PageId },
    { id: 'tamweel', title: 'Tamweel — Journal of Islamic Economics and Finance', desc: 'Scholarly publications, peer-reviewed articles & research archive', page: 'tamweel' as PageId },
    { id: 'activities', title: 'Department Activities & Seminars', desc: 'National conferences, symposia, student field visits & workshops', page: 'activities' as PageId },
    { id: 'contact', title: 'Contact Department Directory', desc: 'Official directory, campus location and enquiry desk', page: 'contact' as PageId },
  ].filter(p => p.title.toLowerCase().includes(normalized) || p.desc.toLowerCase().includes(normalized)) : [];

  const filteredEvents = normalized ? events.filter(e => 
    e.title.toLowerCase().includes(normalized) || e.description.toLowerCase().includes(normalized) || e.category.toLowerCase().includes(normalized)
  ) : [];

  const filteredArticles = normalized ? articles.filter(a => 
    a.title.toLowerCase().includes(normalized) || a.abstract.toLowerCase().includes(normalized) || a.keywords.some(k => k.toLowerCase().includes(normalized))
  ) : [];

  const hasResults = pagesIndex.length > 0 || filteredEvents.length > 0 || filteredArticles.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-dark/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gold/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-forest/5">
          <Search className="w-5 h-5 text-forest shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search department, initiatives, articles, or activities..."
            className="w-full bg-transparent border-none text-charcoal placeholder-charcoal-muted focus:outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-charcoal p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs text-charcoal-muted hover:text-charcoal bg-gray-100 rounded border border-gray-200"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-6">
          {!normalized ? (
            <div className="py-12 text-center text-charcoal-muted">
              <Search className="w-8 h-8 text-forest/30 mx-auto mb-2" />
              <p className="text-sm font-medium text-forest">Search DIEF Portal</p>
              <p className="text-xs text-charcoal-muted mt-1">Type keywords to search across department pages, articles, and activities.</p>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-charcoal-muted">
              <IslamicStarIcon size={32} className="mx-auto text-gold/50 mb-3" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {/* Pages & Pillars */}
              {pagesIndex.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-forest uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <IslamicStarIcon size={12} className="text-gold" />
                    <span>Department &amp; Initiatives</span>
                  </div>
                  <div className="space-y-1.5">
                    {pagesIndex.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.page);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-forest/5 transition flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-forest group-hover:text-emerald-deep flex items-center space-x-1.5">
                            <span>{item.title}</span>
                          </div>
                          <div className="text-[11px] text-charcoal-muted line-clamp-1">{item.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Articles (Tamweel) */}
              {filteredArticles.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-forest uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    <span>Tamweel Journal Articles ({filteredArticles.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredArticles.map(art => (
                      <button
                        key={art.id}
                        onClick={() => {
                          onNavigate('tamweel', art.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-forest/5 transition border border-gray-100 flex items-start justify-between group"
                      >
                        <div className="pr-2">
                          <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-wider bg-gold/10 px-1.5 py-0.5 rounded">
                            {art.category} • Vol {art.volume} Issue {art.issue}
                          </span>
                          <h5 className="text-xs font-bold text-forest mt-1 group-hover:text-emerald-deep leading-snug">
                            {art.title}
                          </h5>
                          <p className="text-[11px] text-charcoal-muted line-clamp-1 mt-0.5">
                            {art.abstract}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events & Bulletin */}
              {filteredEvents.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-forest uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>Department Activities &amp; Events ({filteredEvents.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredEvents.map(ev => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onNavigate('activities', ev.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-forest/5 transition border border-gray-100 flex items-start justify-between group"
                      >
                        <div className="pr-2">
                          <div className="text-[10px] text-gold-dark font-semibold">
                            {ev.category} • {ev.date}
                          </div>
                          <h5 className="text-xs font-bold text-forest mt-0.5 group-hover:text-emerald-deep leading-snug">
                            {ev.title}
                          </h5>
                          <div className="text-[11px] text-charcoal-muted line-clamp-1">
                            {ev.venue}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-charcoal-muted flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-forest">Department of Islamic Economics and Finance</span>
            <span>• DHIU Kerala</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <span>Navigate: Click or Tab</span>
            <span>•</span>
            <span>Close: Esc</span>
          </div>
        </div>
      </div>
    </div>
  );
};
