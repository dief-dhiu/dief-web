import React from 'react';
import { ActivitiesDashboardStats, ActivityRecord } from '../../../types/activity';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Archive,
  PlusCircle,
  ArrowRight,
  MapPin,
  Star,
  Tag,
  ExternalLink,
  Layers,
  RefreshCw
} from 'lucide-react';
import { IslamicStarIcon } from '../../../components/IslamicPattern';

interface ActivitiesDashboardViewProps {
  stats: ActivitiesDashboardStats;
  loading: boolean;
  onSelectTab: (tab: 'overview' | 'list') => void;
  onOpenNewActivityModal: () => void;
  onOpenCategoriesModal: () => void;
  onViewActivity: (activity: ActivityRecord) => void;
  onRefresh: () => void;
}

export const ActivitiesDashboardView: React.FC<ActivitiesDashboardViewProps> = ({
  stats,
  loading,
  onSelectTab,
  onOpenNewActivityModal,
  onOpenCategoriesModal,
  onViewActivity,
  onRefresh
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-forest/5 text-charcoal-muted border-forest/15';
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
        <div className="absolute inset-0 pattern-dark-islamic opacity-25 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>DIEF Activities CMS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
              Academic Activities & Events Console
            </h1>

            <p className="text-xs sm:text-sm text-sage-light max-w-2xl leading-relaxed">
              Manage national seminars, conferences, student colloquiums, workshops, and guest lectures hosted by the Department of Islamic Economics and Finance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewActivityModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gold text-forest font-semibold text-xs sm:text-sm hover:bg-gold-light transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Activity</span>
            </button>

            <button
              onClick={onOpenCategoriesModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all"
            >
              <Tag className="w-4 h-4 text-gold" />
              <span>Categories</span>
            </button>

            <button
              onClick={onRefresh}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Total Activities */}
        <div
          onClick={() => onSelectTab('list')}
          className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <div className="p-2 rounded-xl bg-forest/5 text-forest group-hover:bg-gold/20 group-hover:text-gold transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">
            {stats.total}
          </div>
          <p className="text-[11px] text-charcoal-muted mt-1">Recorded activities</p>
        </div>

        {/* Published */}
        <div
          onClick={() => onSelectTab('list')}
          className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Published</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">
            {stats.published}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Live on public portal</p>
        </div>

        {/* Upcoming */}
        <div
          onClick={() => onSelectTab('list')}
          className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Upcoming</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">
            {stats.upcoming}
          </div>
          <p className="text-[11px] text-blue-700 mt-1">Scheduled future dates</p>
        </div>

        {/* Past */}
        <div
          onClick={() => onSelectTab('list')}
          className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Past</span>
            <div className="p-2 rounded-xl bg-forest/5 text-forest">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">
            {stats.past}
          </div>
          <p className="text-[11px] text-charcoal-muted mt-1">Completed events</p>
        </div>

        {/* Drafts */}
        <div
          onClick={() => onSelectTab('list')}
          className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Drafts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">
            {stats.draft}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Unpublished revisions</p>
        </div>

      </div>

      {/* 3. Recently Added Activities Section */}
      <div className="bg-white rounded-3xl border border-forest/15 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-forest/10 pb-4">
          <div className="flex items-center space-x-2">
            <IslamicStarIcon className="w-4 h-4 text-gold" />
            <h2 className="text-base font-editorial font-bold text-forest">Recently Added Activities</h2>
          </div>
          <button
            onClick={() => onSelectTab('list')}
            className="text-xs font-semibold text-gold-dark hover:text-forest inline-flex items-center space-x-1"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recent.length === 0 ? (
          <div className="text-center py-12 text-charcoal-muted text-sm border-2 border-dashed border-forest/15 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto text-forest/30 mb-2" />
            <p className="font-semibold text-forest">No activities added yet</p>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto mt-1">
              Create your first academic event, national conference, or guest lecture to populate the department portal.
            </p>
            <button
              onClick={onOpenNewActivityModal}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-emerald-deep transition-all shadow-soft"
            >
              <PlusCircle className="w-4 h-4 text-gold" />
              <span>Create First Activity</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-forest/10">
            {stats.recent.map((activity) => {
              const isUpcoming = new Date(activity.start_date) >= new Date(new Date().toISOString().split('T')[0]);
              return (
                <div
                  key={activity.id}
                  onClick={() => onViewActivity(activity)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-forest/5 px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-start space-x-4">
                    {activity.featured_image_url ? (
                      <img
                        src={activity.featured_image_url}
                        alt={activity.title}
                        className="w-16 h-16 rounded-xl object-cover border border-forest/15 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-forest/5 flex items-center justify-center text-forest/40 flex-shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gold/15 text-gold-dark border border-gold/30">
                          {activity.category_name}
                        </span>
                        {activity.is_featured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 flex items-center space-x-0.5 font-medium">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>Featured</span>
                          </span>
                        )}
                        {isUpcoming ? (
                          <span className="text-[10px] text-blue-600 font-medium">Upcoming</span>
                        ) : (
                          <span className="text-[10px] text-charcoal-muted font-medium">Past</span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-forest group-hover:text-gold-dark transition-colors leading-snug line-clamp-1">
                        {activity.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-muted">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gold" />
                          <span>{new Date(activity.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span className="line-clamp-1">{activity.venue}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className="text-xs text-charcoal-muted group-hover:text-forest font-semibold transition-colors flex items-center space-x-1">
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
