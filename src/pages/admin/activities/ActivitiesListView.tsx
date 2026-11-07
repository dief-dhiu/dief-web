import React, { useState, useMemo } from 'react';
import { 
  ActivityRecord, 
  ActivityCategory, 
  ActivityPublicationStatus 
} from '../../../types/activity';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Star, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronDown,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface ActivitiesListViewProps {
  activities: ActivityRecord[];
  categories: ActivityCategory[];
  loading: boolean;
  onOpenNewActivityModal: () => void;
  onViewActivity: (activity: ActivityRecord) => void;
  onEditActivity: (activity: ActivityRecord) => void;
  onDeleteActivity: (activity: ActivityRecord) => Promise<void>;
  onToggleStatus: (activity: ActivityRecord, newStatus: ActivityPublicationStatus) => Promise<void>;
  onToggleFeatured: (activity: ActivityRecord, isFeatured: boolean) => Promise<void>;
}

export const ActivitiesListView: React.FC<ActivitiesListViewProps> = ({
  activities,
  categories,
  loading,
  onOpenNewActivityModal,
  onViewActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onToggleFeatured
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [timeFilter, setTimeFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Delete confirmation state
  const [activityToDelete, setActivityToDelete] = useState<ActivityRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return activities
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.short_description.toLowerCase().includes(q);
          const matchesVenue = item.venue.toLowerCase().includes(q);
          const matchesSpeaker = item.speaker_details?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesSpeaker) return false;
        }

        // Category
        if (selectedCategory !== 'All' && item.category_name !== selectedCategory) {
          return false;
        }

        // Status
        if (selectedStatus !== 'All' && item.status !== selectedStatus) {
          return false;
        }

        // Time filter
        if (timeFilter === 'Upcoming') {
          if (item.start_date < today) return false;
        } else if (timeFilter === 'Past') {
          if (item.start_date >= today) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [activities, searchQuery, selectedCategory, selectedStatus, timeFilter, sortOrder]);

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    setDeleting(true);
    try {
      await onDeleteActivity(activityToDelete);
      setActivityToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: ActivityPublicationStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-forest/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, speaker, topic, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-dark bg-sand/20 text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          {/* New Activity Action */}
          <button
            onClick={onOpenNewActivityModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>New Activity</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-sand text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-muted font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-sand-dark bg-white text-forest font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-muted font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-sand-dark bg-white text-forest font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-muted font-medium">Timeline:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-sand-dark bg-white text-forest font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">All Dates</option>
              <option value="Upcoming">Upcoming Only</option>
              <option value="Past">Past Only</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-sand-dark bg-white text-forest font-medium hover:bg-sand transition-colors ml-auto"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gold" />
            <span>Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || timeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setTimeFilter('All');
              }}
              className="text-xs text-rose-600 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* 2. Activities Directory Grid / List */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-muted">
            Showing <strong className="text-forest font-semibold">{filteredActivities.length}</strong> of{' '}
            <strong className="text-forest font-semibold">{activities.length}</strong> activities
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-forest/10 space-y-3">
            <Calendar className="w-12 h-12 text-sand-dark mx-auto" />
            <h3 className="text-base font-editorial font-bold text-forest">No matching activities found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Try adjusting your search criteria, timeline or category filters, or add a new activity.
            </p>
            <button
              onClick={onOpenNewActivityModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-colors mt-2"
            >
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>Create New Activity</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredActivities.map((activity) => {
              const isUpcoming = activity.start_date >= today;

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl border border-forest/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                >
                  {/* Left: Thumbnail + Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Thumbnail */}
                    <div 
                      onClick={() => onViewActivity(activity)}
                      className="w-20 sm:w-24 h-20 sm:h-24 rounded-xl overflow-hidden border border-sand-dark flex-shrink-0 cursor-pointer relative bg-sand"
                    >
                      {activity.featured_image_url ? (
                        <img
                          src={activity.featured_image_url}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-forest/40">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[9px]">No Poster</span>
                        </div>
                      )}
                      {activity.gallery && activity.gallery.length > 0 && (
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded font-mono">
                          +{activity.gallery.length}
                        </span>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gold/15 text-gold border border-gold/30">
                          {activity.category_name}
                        </span>
                        {isUpcoming ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            Upcoming
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-sand text-muted font-medium">
                            Past
                          </span>
                        )}
                        <button
                          onClick={() => onToggleFeatured(activity, !activity.is_featured)}
                          title={activity.is_featured ? 'Remove from featured banner' : 'Highlight as featured'}
                          className={`p-1 rounded-lg transition-colors ${
                            activity.is_featured
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-muted hover:text-amber-500 hover:bg-amber-50/50'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${activity.is_featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <h3 
                        onClick={() => onViewActivity(activity)}
                        className="text-base font-editorial font-bold text-forest group-hover:text-gold transition-colors cursor-pointer leading-tight line-clamp-1"
                      >
                        {activity.title}
                      </h3>

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {activity.short_description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>
                            {new Date(activity.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                            {activity.start_time ? ` (${activity.start_time})` : ''}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span className="line-clamp-1">{activity.venue}</span>
                        </span>
                        {activity.speaker_details && (
                          <span className="text-[11px] text-forest/70 line-clamp-1 font-medium">
                            Speaker: {activity.speaker_details}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-3 md:pt-0 border-t md:border-t-0 border-sand flex-shrink-0">
                    
                    {/* Quick Publish / Unpublish Toggle */}
                    {activity.status === 'Published' ? (
                      <button
                        onClick={() => onToggleStatus(activity, 'Draft')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                        title="Revert to Draft"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(activity, 'Published')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Publish Live"
                      >
                        Publish
                      </button>
                    )}

                    {/* View Details */}
                    <button
                      onClick={() => onViewActivity(activity)}
                      className="p-2 rounded-lg text-forest hover:bg-sand transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditActivity(activity)}
                      className="p-2 rounded-lg text-forest hover:bg-sand transition-colors"
                      title="Edit Activity"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setActivityToDelete(activity)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {activityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-editorial font-bold text-forest">Delete Activity?</h3>
              <p className="text-xs text-muted">
                Are you sure you want to permanently remove <strong className="text-forest">"{activityToDelete.title}"</strong>?
                This action also removes its associated gallery images and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setActivityToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-sand-dark text-xs font-semibold text-forest hover:bg-sand"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Activity'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
