import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageId, EventItem } from '../types';
import { ActivityRecord } from '../types/activity';
import {
  fetchPublicActivities,
  fetchPublicFeaturedActivities,
  fetchActivityCategories
} from '../lib/activitiesService';
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
  ExternalLink,
  Star,
  Users,
  Image as ImageIcon,
  Phone,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface ActivitiesPageProps {
  onNavigate: (page: PageId) => void;
  events?: EventItem[];
  selectedEventId?: string;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  onNavigate,
  events = [],
  selectedEventId,
  onShowToast
}) => {
  const { activityId } = useParams<{ activityId?: string }>();
  const navigate = useNavigate();
  const effectiveEventId = activityId || selectedEventId;

  // Live Data States
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [featuredActivities, setFeaturedActivities] = useState<ActivityRecord[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['All']);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timelineFilter, setTimelineFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeModalActivity, setActiveModalActivity] = useState<ActivityRecord | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Load live data from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const [acts, featured, cats] = await Promise.all([
        fetchPublicActivities(),
        fetchPublicFeaturedActivities(),
        fetchActivityCategories()
      ]);

      setActivities(acts);
      setFeaturedActivities(featured);

      // Extract unique categories from both categories table and live activities
      const catNames = new Set<string>(['All']);
      cats.forEach((c) => catNames.add(c.name));
      acts.forEach((a) => catNames.add(a.category_name));
      setAvailableCategories(Array.from(catNames));

      // Handle effectiveEventId if passed from URL or external navigation
      if (effectiveEventId) {
        const found = acts.find((a) => a.id === effectiveEventId);
        if (found) setActiveModalActivity(found);
      }
    } catch (err) {
      console.warn('[ActivitiesPage] Error loading public activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActivityModal = (act: ActivityRecord) => {
    setActiveModalActivity(act);
    navigate(`/activities/${act.id}`);
  };

  const handleCloseActivityModal = () => {
    setActiveModalActivity(null);
    if (activityId) {
      navigate('/activities');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Category filter
      if (selectedCategory !== 'All' && act.category_name !== selectedCategory) {
        return false;
      }

      // Timeline filter
      if (timelineFilter === 'Upcoming' && act.start_date < today) {
        return false;
      }
      if (timelineFilter === 'Past' && act.start_date >= today) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesDesc = act.short_description.toLowerCase().includes(q);
        const matchesVenue = act.venue.toLowerCase().includes(q);
        const matchesSpeaker = act.speaker_details?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesSpeaker) {
          return false;
        }
      }

      return true;
    });
  }, [activities, selectedCategory, timelineFilter, searchQuery, today]);

  return (
    <div className="space-y-16 py-8">

      {/* 1. HEADER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D4ED8] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border-2 border-gold/40">

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Departmental Activities &amp; Academic Events</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight leading-tight">
              Academic Activities &amp; Events Archive
            </h1>



            <p className="text-sm sm:text-base text-sage-light leading-relaxed">
              Explore our live chronicle of national conferences, specialized Shariah jurisprudence workshops, student research colloquiums, and executive roundtables hosted by the Department of Islamic Economics and Finance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ACTIVITIES SPOTLIGHT (If available) */}
      {featuredActivities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-charcoal">

              <h2 className="text-lg font-editorial font-bold">Featured Academic Highlights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredActivities.map((act) => {
                const isUpcoming = act.start_date >= today;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleOpenActivityModal(act)}
                    className="bg-white rounded-3xl border-2 border-gold/40 shadow-soft hover:shadow-elevated transition-all overflow-hidden flex flex-col justify-between cursor-pointer group relative"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-forest/10">
                      {act.featured_image_url ? (
                        <img
                          src={act.featured_image_url}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-charcoal/40">
                          <Calendar className="w-12 h-12 mb-2" />
                          <span className="text-xs">DIEF Academic Event</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                          {act.category_name}
                        </span>
                        <span className="bg-amber-400 text-charcoal text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-charcoal" />
                          <span>Featured</span>
                        </span>
                      </div>

                      {isUpcoming && (
                        <div className="absolute top-3 right-3 bg-charcoal/50 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                          Upcoming Event
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-gold-dark">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(act.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                            {act.start_time ? ` • ${act.start_time}` : ''}
                          </span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-charcoal group-hover:text-[#1D4ED8] transition-colors leading-snug">
                          {act.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-charcoal-muted line-clamp-2 leading-relaxed">
                          {act.short_description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-forest/15 flex items-center justify-between text-xs font-bold text-charcoal group-hover:text-gold-dark transition">
                        <span className="flex items-center space-x-1 text-muted">
                          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{act.venue}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <span>Explore Details</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. FILTERS & SEARCH CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-forest/15 shadow-soft space-y-4">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities by topic, speaker, or venue..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-forest/5 border border-forest/15 rounded-xl focus:border-forest focus:outline-none font-medium text-charcoal placeholder:text-charcoal-muted"
              />
            </div>

            {/* Timeline Selector */}
            <div className="flex items-center space-x-2 text-xs font-semibold w-full md:w-auto justify-end">
              <span className="text-charcoal-muted mr-1">Timeline:</span>
              {(['All', 'Upcoming', 'Past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimelineFilter(t)}
                  className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${timelineFilter === t
                    ? 'bg-[#1D4ED8] text-white shadow-soft'
                    : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10 border border-forest/15'
                    }`}
                >
                  {t === 'All' ? 'All Activities' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-2 border-t border-forest/10 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs font-semibold ${selectedCategory === cat
                  ? 'bg-[#1D4ED8] text-white shadow-soft'
                  : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10 border border-forest/15'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ACTIVITIES DIRECTORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
            <p className="text-xs text-muted font-medium">Loading academic activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
            <h3 className="font-editorial text-xl font-bold text-charcoal">No matching activities found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              No published events match your selected filters. Try choosing "All Activities" or adjusting your keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setTimelineFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] text-white text-xs font-semibold hover:bg-[#2563EA] transition-colors shadow-soft"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((act) => {
              const isUpcoming = act.start_date >= today;

              return (
                <div
                  key={act.id}
                  onClick={() => handleOpenActivityModal(act)}
                  className="bg-white rounded-2xl border border-forest/15 hover:border-gold/60 shadow-soft hover:shadow-elevated transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Poster */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-forest/10">
                      {act.featured_image_url ? (
                        <img
                          src={act.featured_image_url}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-charcoal/40">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-[10px]">Academic Event</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-[#1D4ED8] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                        {act.category_name}
                      </div>

                      {isUpcoming ? (
                        <div className="absolute top-3 right-3 bg-white/95 text-charcoal text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Upcoming
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-charcoal/50 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow">
                          Archive
                        </div>
                      )}

                      {act.gallery && act.gallery.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>+{act.gallery.length} photos</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gold-dark">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(act.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                          {act.start_time ? ` • ${act.start_time}` : ''}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-bold text-charcoal group-hover:text-[#1D4ED8] transition-colors leading-snug line-clamp-2">
                        {act.title}
                      </h3>

                      <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                        {act.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-3">
                    <div className="text-[11px] text-charcoal-muted space-y-1 border-t border-gray-100 pt-3">
                      <div className="flex items-center space-x-1.5 truncate">
                        <MapPin className="w-3 h-3 text-gold shrink-0" />
                        <span className="truncate">{act.venue}</span>
                      </div>
                      {act.speaker_details && (
                        <div className="flex items-center space-x-1.5 text-charcoal-muted font-medium truncate">
                          <User className="w-3 h-3 text-gold shrink-0" />
                          <span className="truncate">{act.speaker_details}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs font-bold text-charcoal group-hover:text-gold-dark transition">
                      <span>View Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. EVENT DETAIL MODAL */}
      {activeModalActivity && (
        <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl relative overflow-hidden flex flex-col">

            {/* Modal Header / Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal flex-shrink-0">
              {activeModalActivity.featured_image_url ? (
                <img
                  src={activeModalActivity.featured_image_url}
                  alt={activeModalActivity.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                  <Calendar className="w-16 h-16 mb-2" />
                  <span className="text-sm font-editorial">DIEF Academic Event</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8]/95 via-[#1D4ED8]/40 to-transparent"></div>

              <button
                onClick={handleCloseActivityModal}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-gold text-charcoal px-2.5 py-0.5 rounded">
                    {activeModalActivity.category_name}
                  </span>
                  {activeModalActivity.start_date >= today && (
                    <span className="text-[10px] font-bold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded">
                      Upcoming
                    </span>
                  )}
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {activeModalActivity.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-forest/5 p-4 rounded-2xl border border-forest/15">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    <strong>Date:</strong>{' '}
                    {new Date(activeModalActivity.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {activeModalActivity.start_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span>
                      <strong>Time:</strong> {activeModalActivity.start_time}{' '}
                      {activeModalActivity.end_time ? `– ${activeModalActivity.end_time}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Venue:</strong> {activeModalActivity.venue}</span>
                </div>
                {activeModalActivity.speaker_details && (
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <User className="w-4 h-4 text-gold shrink-0" />
                    <span><strong>Distinguished Speakers:</strong> {activeModalActivity.speaker_details}</span>
                  </div>
                )}
                {activeModalActivity.organizing_body && (
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <Users className="w-4 h-4 text-gold shrink-0" />
                    <span><strong>Organizers:</strong> {activeModalActivity.organizing_body}</span>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-3 text-xs sm:text-sm text-charcoal-light leading-relaxed">
                <h4 className="font-editorial text-base font-bold text-charcoal">Session Overview</h4>
                <p className="bg-forest/5 p-4 rounded-xl border border-forest/15 font-medium text-charcoal">
                  {activeModalActivity.short_description}
                </p>
                {activeModalActivity.full_description && (
                  <div className="whitespace-pre-line text-charcoal-light pt-2">
                    {activeModalActivity.full_description}
                  </div>
                )}
              </div>

              {/* Photo Gallery if present */}
              {activeModalActivity.gallery && activeModalActivity.gallery.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <h4 className="font-editorial text-sm font-bold text-charcoal flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-gold" />
                    <span>Event Photo Chronicle ({activeModalActivity.gallery.length} Images)</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeModalActivity.gallery.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        onClick={() => setLightboxImage(img.image_url)}
                        className="aspect-video rounded-xl overflow-hidden border border-forest/15 cursor-pointer group hover:border-gold transition-colors relative"
                      >
                        <img
                          src={img.image_url}
                          alt={img.caption || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-1 truncate">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {activeModalActivity.contact_info && (
                <div className="flex items-center space-x-2 text-xs text-charcoal bg-charcoal/5 p-3 rounded-xl border border-charcoal/15">
                  <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span><strong>Queries &amp; Contact:</strong> {activeModalActivity.contact_info}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onShowToast('Activity Saved', 'Dates bookmarked to your session.', 'info')}
                  className="px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal border border-charcoal/15 rounded-xl text-xs font-semibold transition"
                >
                  Bookmark Event
                </button>

                <div className="flex items-center space-x-3">
                  {activeModalActivity.registration_url ? (
                    <a
                      href={activeModalActivity.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#2563EA] text-white rounded-xl text-xs font-bold transition shadow-soft"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        handleCloseActivityModal();
                        onNavigate('contact');
                      }}
                      className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#2563EA] text-white rounded-xl text-xs font-bold transition shadow-soft"
                    >
                      Inquire Attendance / Registration
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Lightbox for gallery images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged gallery view"
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};
