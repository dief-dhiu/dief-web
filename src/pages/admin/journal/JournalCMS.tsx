import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  JournalIssue, 
  JournalArticleRecord, 
  JournalSubmission, 
  JournalDashboardStats 
} from '../../../types/journal';
import { 
  fetchJournalDashboardStats, 
  fetchJournalIssues, 
  fetchJournalArticles, 
  fetchJournalSubmissions,
  createJournalIssue,
  updateJournalIssue,
  deleteJournalIssue,
  createJournalArticle,
  updateJournalArticle,
  deleteJournalArticle
} from '../../../lib/journalService';
import { JournalDashboardView } from './JournalDashboardView';
import { JournalIssuesView } from './JournalIssuesView';
import { JournalArticlesView } from './JournalArticlesView';
import { JournalSubmissionsView } from './JournalSubmissionsView';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Inbox, 
  Lock, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface JournalCMSProps {
  onNavigate: (path: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const JournalCMS: React.FC<JournalCMSProps> = ({ onNavigate, onShowToast }) => {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'articles' | 'submissions'>('overview');
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<JournalDashboardStats>({
    totalIssues: 0,
    totalPublishedArticles: 0,
    awaitingScreening: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
    recentlyUpdatedSubmissions: [],
    recentlyPublishedArticles: []
  });
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [articles, setArticles] = useState<JournalArticleRecord[]>([]);
  const [submissions, setSubmissions] = useState<JournalSubmission[]>([]);

  // Selected submission passed from dashboard
  const [selectedSubFromDash, setSelectedSubFromDash] = useState<JournalSubmission | null>(null);

  // Check if role has access to private submissions (SUPER_ADMIN, JOURNAL_EDITOR)
  const canAccessSubmissions = role === 'SUPER_ADMIN' || role === 'JOURNAL_EDITOR';

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load Stats
      const statsData = await fetchJournalDashboardStats();
      setStats(statsData);

      // 2. Load Issues
      const issuesData = await fetchJournalIssues('All');
      setIssues(issuesData);

      // 3. Load Articles
      const articlesData = await fetchJournalArticles('All');
      setArticles(articlesData);

      // 4. Load Submissions (if permitted)
      if (canAccessSubmissions) {
        const subsData = await fetchJournalSubmissions('All');
        setSubmissions(subsData);
      }
    } catch (err: any) {
      console.error('[JournalCMS] Error loading data:', err);
      onShowToast('Data Load Notice', err.message, 'warning');
    } finally {
      setLoading(false);
    }
  }, [canAccessSubmissions, onShowToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handlers for Issues
  const handleCreateIssue = async (issueData: any, coverFile?: File) => {
    await createJournalIssue(issueData, coverFile);
  };

  const handleUpdateIssue = async (id: string, issueUpdates: any, coverFile?: File) => {
    await updateJournalIssue(id, issueUpdates, coverFile);
  };

  const handleDeleteIssue = async (id: string) => {
    await deleteJournalIssue(id);
  };

  // Handlers for Articles
  const handleCreateArticle = async (articleData: any, pdfFile?: File) => {
    await createJournalArticle(articleData, pdfFile);
  };

  const handleUpdateArticle = async (id: string, updates: any, pdfFile?: File) => {
    await updateJournalArticle(id, updates, pdfFile);
  };

  const handleDeleteArticle = async (id: string) => {
    await deleteJournalArticle(id);
  };

  // Transition from Dashboard to Submissions
  const handleOpenSubmissionFromDash = (sub: JournalSubmission) => {
    if (!canAccessSubmissions) {
      onShowToast('Access Restricted', 'Your role cannot view confidential manuscripts.', 'warning');
      return;
    }
    setSelectedSubFromDash(sub);
    setActiveTab('submissions');
  };

  return (
    <div className="space-y-6">
      
      {/* CMS Module Sub-Navigation Bar */}
      <div className="bg-white rounded-2xl border border-forest/10 p-2 shadow-soft flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-forest text-gold shadow-sm'
                : 'text-charcoal hover:bg-surface-lightGreen/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'issues'
                ? 'bg-forest text-gold shadow-sm'
                : 'text-charcoal hover:bg-surface-lightGreen/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Journal Issues</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'issues' ? 'bg-gold text-forest' : 'bg-gray-100 text-charcoal'
            }`}>
              {issues.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'articles'
                ? 'bg-forest text-gold shadow-sm'
                : 'text-charcoal hover:bg-surface-lightGreen/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Articles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'articles' ? 'bg-gold text-forest' : 'bg-gray-100 text-charcoal'
            }`}>
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => {
              if (canAccessSubmissions) {
                setActiveTab('submissions');
              } else {
                onShowToast('Permission Restricted', 'Only Super Admin and Journal Editor can access confidential submissions.', 'warning');
              }
            }}
            disabled={!canAccessSubmissions}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'submissions'
                ? 'bg-forest text-gold shadow-sm'
                : canAccessSubmissions
                ? 'text-charcoal hover:bg-surface-lightGreen/60'
                : 'text-gray-300 opacity-60 cursor-not-allowed'
            }`}
            title={!canAccessSubmissions ? 'Restricted to Super Admin & Journal Editor' : 'Manuscript Workflow'}
          >
            <Inbox className="w-4 h-4" />
            <span>Manuscript Workflow</span>
            {canAccessSubmissions ? (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                stats.awaitingScreening > 0 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-charcoal'
              }`}>
                {submissions.length}
              </span>
            ) : (
              <Lock className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>

        <button
          onClick={loadAllData}
          disabled={loading}
          className="p-2 border border-forest/20 hover:border-forest text-forest rounded-xl transition self-end sm:self-center"
          title="Refresh All Journal Datasets"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <JournalDashboardView
          stats={stats}
          loading={loading}
          onSelectTab={setActiveTab}
          onOpenSubmission={handleOpenSubmissionFromDash}
          onOpenNewIssueModal={() => setActiveTab('issues')}
          onOpenNewArticleModal={() => setActiveTab('articles')}
        />
      )}

      {activeTab === 'issues' && (
        <JournalIssuesView
          issues={issues}
          loading={loading}
          onRefresh={loadAllData}
          onCreateIssue={handleCreateIssue}
          onUpdateIssue={handleUpdateIssue}
          onDeleteIssue={handleDeleteIssue}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'articles' && (
        <JournalArticlesView
          articles={articles}
          issues={issues}
          loading={loading}
          onRefresh={loadAllData}
          onCreateArticle={handleCreateArticle}
          onUpdateArticle={handleUpdateArticle}
          onDeleteArticle={handleDeleteArticle}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'submissions' && canAccessSubmissions && (
        <JournalSubmissionsView
          submissions={submissions}
          issues={issues}
          loading={loading}
          onRefresh={loadAllData}
          onShowToast={onShowToast}
          selectedSubmissionFromDashboard={selectedSubFromDash}
          onClearSelectedSubmission={() => setSelectedSubFromDash(null)}
        />
      )}

    </div>
  );
};
