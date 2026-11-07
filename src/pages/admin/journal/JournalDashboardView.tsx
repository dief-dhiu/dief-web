import React from 'react';
import { JournalDashboardStats, JournalSubmission, JournalArticleRecord } from '../../../types/journal';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  ExternalLink,
  PlusCircle,
  UploadCloud
} from 'lucide-react';
import { IslamicStarIcon } from '../../../components/IslamicPattern';

interface JournalDashboardViewProps {
  stats: JournalDashboardStats;
  loading: boolean;
  onSelectTab: (tab: 'overview' | 'issues' | 'articles' | 'submissions') => void;
  onOpenSubmission: (sub: JournalSubmission) => void;
  onOpenNewIssueModal: () => void;
  onOpenNewArticleModal: () => void;
}

export const JournalDashboardView: React.FC<JournalDashboardViewProps> = ({
  stats,
  loading,
  onSelectTab,
  onOpenSubmission,
  onOpenNewIssueModal,
  onOpenNewArticleModal
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Initial Screening':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Revision Requested':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Revised Manuscript Received':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Published':
        return 'bg-forest/10 text-forest border-forest/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Quick Action Buttons */}
      <div className="bg-forest rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
        <div className="absolute inset-0 pattern-dark-islamic opacity-25 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tamweel Journal Administration</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
              Tamweel Editorial Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-sage-light max-w-2xl leading-relaxed">
              Official academic publishing management platform for the Journal of Islamic Economics and Finance. Oversee volume issues, double-blind peer reviews, and published article archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewIssueModal}
              className="px-4 py-2.5 bg-gold hover:bg-gold-light text-forest text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Journal Issue</span>
            </button>

            <button
              onClick={onOpenNewArticleModal}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-gold/40 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Issues */}
        <div 
          onClick={() => onSelectTab('issues')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-gold transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Total Issues
            </span>
            <BookOpen className="w-4 h-4 text-forest group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest mt-1">
            {loading ? '—' : stats.totalIssues}
          </div>
          <div className="text-[10px] text-gold-dark font-medium mt-0.5">
            Published &amp; Drafts
          </div>
        </div>

        {/* Total Published Articles */}
        <div 
          onClick={() => onSelectTab('articles')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-gold transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Published Articles
            </span>
            <FileText className="w-4 h-4 text-forest group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-forest mt-1">
            {loading ? '—' : stats.totalPublishedArticles}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            Active on Portal
          </div>
        </div>

        {/* Awaiting Screening */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-blue-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Awaiting Screening
            </span>
            <Clock className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-blue-700 mt-1">
            {loading ? '—' : stats.awaitingScreening}
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">
            New Submissions
          </div>
        </div>

        {/* Under Review */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Under Review
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-amber-700 mt-1">
            {loading ? '—' : stats.underReview}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">
            Peer Review In-Progress
          </div>
        </div>

        {/* Accepted */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Accepted
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-emerald-700 mt-1">
            {loading ? '—' : stats.accepted}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            Ready for Issue Assign
          </div>
        </div>

        {/* Rejected */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft hover:shadow-elevated hover:border-rose-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-rose-700 mt-1">
            {loading ? '—' : stats.rejected}
          </div>
          <div className="text-[10px] text-rose-600 font-medium mt-0.5">
            Archived Decisions
          </div>
        </div>

      </div>

      {/* 3. Two-Column Live Tables: Recent Submissions & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recently Updated Manuscript Submissions */}
        <div className="bg-white rounded-3xl border border-forest/10 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gold-dark" />
              <h2 className="font-editorial text-base font-bold text-forest">
                Recent Manuscript Activity
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('submissions')}
              className="text-xs text-forest hover:text-gold-dark font-semibold transition flex items-center space-x-1"
            >
              <span>View All ({stats.awaitingScreening + stats.underReview + stats.accepted + stats.rejected})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentlyUpdatedSubmissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted bg-ivory/50 rounded-2xl border border-dashed border-gray-200">
              No manuscript submissions recorded yet. Authors can submit papers via the public Tamweel page.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentlyUpdatedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onOpenSubmission(sub)}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-surface-lightGreen/30 transition cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                      <span className="text-[10px] text-charcoal-muted truncate font-mono">
                        {sub.track}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-forest group-hover:text-emerald-deep leading-snug line-clamp-1">
                      {sub.title}
                    </h3>

                    <div className="text-[11px] text-charcoal-muted flex items-center space-x-2">
                      <span className="font-medium text-charcoal">{sub.author_name}</span>
                      <span>•</span>
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recently Published Articles */}
        <div className="bg-white rounded-3xl border border-forest/10 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="font-editorial text-base font-bold text-forest">
                Recently Published Articles
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('articles')}
              className="text-xs text-forest hover:text-gold-dark font-semibold transition flex items-center space-x-1"
            >
              <span>View All ({stats.totalPublishedArticles})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentlyPublishedArticles.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted bg-ivory/50 rounded-2xl border border-dashed border-gray-200">
              No published articles in the database yet. Click "Publish Article" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentlyPublishedArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-surface-lightGreen/30 transition flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Published
                      </span>
                      {art.issue && (
                        <span className="text-charcoal-muted font-medium">
                          Vol. {art.issue.volume_number}, Issue {art.issue.issue_number} ({art.issue.year})
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-forest group-hover:text-emerald-deep leading-snug line-clamp-1">
                      {art.title}
                    </h3>

                    <div className="text-[11px] text-charcoal-muted flex items-center space-x-2">
                      <span className="font-medium text-charcoal">{art.authors.join(', ')}</span>
                      {art.page_range && (
                        <>
                          <span>•</span>
                          <span>pp. {art.page_range}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {art.pdf_url && (
                    <a
                      href={art.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-forest hover:text-gold rounded-lg hover:bg-forest/5 transition shrink-0"
                      title="Open Published PDF"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
