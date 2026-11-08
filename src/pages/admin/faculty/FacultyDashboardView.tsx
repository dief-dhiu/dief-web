import React from 'react';
import { FacultyDashboardStats, FacultyProfile } from '../../../types/faculty';
import {
  Users, CheckCircle2, FileText, Archive, PlusCircle,
  ArrowRight, GraduationCap, RefreshCw, Tag, Layers
} from 'lucide-react';
import { IslamicStarIcon } from '../../../components/IslamicPattern';

interface FacultyDashboardViewProps {
  stats: FacultyDashboardStats;
  loading: boolean;
  onSelectTab: (tab: 'overview' | 'list') => void;
  onOpenNewModal: () => void;
  onOpenCategories: () => void;
  onViewProfile: (p: FacultyProfile) => void;
  onRefresh: () => void;
}

const StatCard: React.FC<{
  label: string; value: number; sub: string;
  icon: React.ReactNode; accent?: string;
  onClick: () => void;
}> = ({ label, value, sub, icon, accent = 'text-forest', onClick }) => (
  <div onClick={onClick}
    className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm hover:shadow-md hover:border-gold/50 transition-all cursor-pointer group">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <div className={`p-2 rounded-xl bg-forest/5 group-hover:bg-gold/20 transition-colors ${accent}`}>{icon}</div>
    </div>
    <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest">{value}</div>
    <p className={`text-[11px] mt-0.5 ${accent}`}>{sub}</p>
  </div>
);

export const FacultyDashboardView: React.FC<FacultyDashboardViewProps> = ({
  stats, loading, onSelectTab, onOpenNewModal, onOpenCategories, onViewProfile, onRefresh
}) => {
  const getStatusBadge = (status: string) => {
    if (status === 'Published') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'Draft') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
        <div className="absolute inset-0 pattern-dark-islamic opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Faculty Directory CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
              Faculty &amp; Academic Staff Management
            </h1>
            <p className="text-xs sm:text-sm text-sage-light max-w-2xl leading-relaxed">
              Manage the academic staff directory for the Department of Islamic Economics and Finance. Control profile visibility, qualifications, and display ordering on the public portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onOpenNewModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gold text-forest font-semibold text-xs sm:text-sm hover:bg-gold-light transition-all shadow-md active:scale-95">
              <PlusCircle className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
            <button onClick={onOpenCategories}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all">
              <Tag className="w-4 h-4 text-gold" />
              <span>Categories</span>
            </button>
            <button onClick={onRefresh} title="Refresh"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Profiles" value={stats.total} sub="All records"
          icon={<Layers className="w-4 h-4" />} onClick={() => onSelectTab('list')} />
        <StatCard label="Published" value={stats.published} sub="Live on public website"
          icon={<CheckCircle2 className="w-4 h-4" />} accent="text-emerald-600" onClick={() => onSelectTab('list')} />
        <StatCard label="Drafts" value={stats.draft} sub="Unpublished"
          icon={<FileText className="w-4 h-4" />} accent="text-amber-600" onClick={() => onSelectTab('list')} />
        <StatCard label="Archived" value={stats.archived} sub="Hidden from public"
          icon={<Archive className="w-4 h-4" />} onClick={() => onSelectTab('list')} />
      </div>

      {/* Recent profiles */}
      <div className="bg-white rounded-3xl border border-forest/15 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-forest/15 pb-4">
          <div className="flex items-center space-x-2">
            <IslamicStarIcon className="w-4 h-4 text-gold" />
            <h2 className="text-base font-editorial font-bold text-forest">Recently Updated Profiles</h2>
          </div>
          <button onClick={() => onSelectTab('list')}
            className="text-xs font-semibold text-gold hover:text-gold-dark inline-flex items-center space-x-1">
            <span>All Profiles</span><ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recent.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-forest/20 rounded-2xl space-y-3">
            <Users className="w-10 h-10 text-muted mx-auto" />
            <p className="font-semibold text-forest text-sm">No faculty profiles yet</p>
            <p className="text-xs text-muted max-w-xs mx-auto">
              Add the first faculty member to populate the department directory.
            </p>
            <button onClick={onOpenNewModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-emerald-deep transition-all shadow-soft">
              <PlusCircle className="w-4 h-4 text-gold" /><span>Add First Member</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-forest/10">
            {stats.recent.map(profile => (
              <div key={profile.id}
                onClick={() => onViewProfile(profile)}
                className="py-4 flex items-center space-x-4 hover:bg-forest/5 px-3 rounded-xl transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-forest/15 flex-shrink-0 bg-forest/5">
                  {profile.photo_url
                    ? <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Users className="w-5 h-5 text-forest/40" /></div>}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(profile.status)}`}>
                      {profile.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gold/15 text-gold border border-gold/30">
                      {profile.category_name}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-forest group-hover:text-gold transition-colors truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-muted truncate">{profile.designation}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-gold shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
