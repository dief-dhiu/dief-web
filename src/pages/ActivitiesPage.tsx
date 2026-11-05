import React, { useState } from 'react';
import { PageId, EventItem } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  Search, 
  ArrowRight, 
  User, 
  CheckCircle2, 
  Share2,
  X,
  ExternalLink
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface ActivitiesPageProps {
  onNavigate: (page: PageId) => void;
  events: EventItem[];
  selectedEventId?: string;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  onNavigate,
  events,
  selectedEventId,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(
    selectedEventId ? events.find(e => e.id === selectedEventId) || null : null
  );

  const categories = [
    'All',
    'Seminars',
    'Conferences',
    'Workshops',
    'Guest Lectures',
    'Student Activities',
    'Internships',
    'Academic Visits',
    'Research Events'
  ];

  const years = ['All', '2026', '2025'];

  const filteredEvents = events.filter((ev) => {
    const matchCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchYear = selectedYear === 'All' || ev.year.toString() === selectedYear;
    const matchSearch = !searchQuery || 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchYear && matchSearch;
  });

  return (
    <div className="space-y-16 py-8">
      
      {/* HEADER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="absolute inset-0 pattern-dark-islamic opacity-30 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Departmental Chronicle &amp; Events</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
              Academic Activities &amp; Events Archive
            </h1>

            <div className="font-arabic text-lg sm:text-xl text-sage-light" dir="rtl">
              سجل المؤتمرات والندوات والأنشطة الأكاديمية
            </div>

            <p className="text-sm sm:text-base text-sage-subtle leading-relaxed">
              Explore our comprehensive archive of national conferences, specialized jurisprudence workshops, student field immersions, and executive roundtables hosted by the Department of Islamic Economics and Finance.
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS & SEARCH CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by topic, speaker, venue..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none font-medium"
              />
            </div>

            {/* Year Selector */}
            <div className="flex items-center space-x-2 text-xs font-semibold w-full md:w-auto justify-end">
              <span className="text-charcoal-muted">Filter Year:</span>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedYear === y
                      ? 'bg-forest text-white'
                      : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-2 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-ivory text-charcoal hover:bg-surface-lightGreen'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <IslamicStarIcon size={36} className="mx-auto text-gold mb-3" />
            <h3 className="font-editorial text-xl font-bold text-forest">No matching activities found</h3>
            <p className="text-xs text-charcoal-muted mt-1">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActiveModalEvent(ev)}
                className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 shadow-soft hover:shadow-elevated transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-forest text-gold text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                      {ev.category}
                    </div>
                    {ev.isUpcoming && (
                      <div className="absolute top-3 right-3 bg-white/95 text-forest text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Upcoming
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gold-dark">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.date}</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-forest group-hover:text-emerald-deep leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="text-[11px] text-charcoal-muted space-y-1 border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3 h-3 text-gold shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    {ev.speakerPlaceholder && (
                      <div className="flex items-center space-x-1.5 text-forest font-medium truncate">
                        <User className="w-3 h-3 text-gold shrink-0" />
                        <span className="truncate">{ev.speakerPlaceholder}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-forest group-hover:text-gold-dark transition">
                    <span>View Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* EVENT DETAIL MODAL */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 bg-forest-dark/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold/40 shadow-2xl relative overflow-hidden">
            
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img src={activeModalEvent.image} alt={activeModalEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent"></div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-charcoal p-1.5 rounded-full shadow transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-gold text-forest px-2.5 py-0.5 rounded">
                  {activeModalEvent.category}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white leading-snug">
                  {activeModalEvent.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-lightGreen/40 p-4 rounded-xl border border-forest/10">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Date:</strong> {activeModalEvent.date}</span>
                </div>
                {activeModalEvent.time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span><strong>Time:</strong> {activeModalEvent.time}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Venue:</strong> {activeModalEvent.venue}</span>
                </div>
                {activeModalEvent.speakerPlaceholder && (
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <User className="w-4 h-4 text-gold shrink-0" />
                    <span><strong>Facilitator:</strong> {activeModalEvent.speakerPlaceholder}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-charcoal-light leading-relaxed">
                <h4 className="font-editorial text-base font-bold text-forest">Session Overview</h4>
                <p>{activeModalEvent.description}</p>
                {activeModalEvent.fullDetails && (
                  <p>{activeModalEvent.fullDetails}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onShowToast('Event Saved', 'Event dates bookmarked to your calendar notification list.', 'info')}
                  className="px-4 py-2 bg-ivory hover:bg-white text-forest border border-forest/20 rounded-xl text-xs font-semibold transition"
                >
                  Bookmark Event
                </button>
                <button
                  onClick={() => {
                    setActiveModalEvent(null);
                    onNavigate('contact');
                  }}
                  className="px-5 py-2 bg-forest hover:bg-emerald-deep text-white rounded-xl text-xs font-bold transition shadow"
                >
                  Inquire Attendance / Registration
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
