import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageId, JournalArticle } from '../types';
import { JournalIssue, JournalArticleRecord } from '../types/journal';
import {
  fetchPublicPublishedIssues,
  fetchPublicPublishedArticles
} from '../lib/journalService';
import {
  BookOpen,
  FileText,
  Download,
  Share2,
  Copy,
  Search,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface TamweelPageProps {
  onNavigate: (page: PageId) => void;
  articles?: JournalArticle[];
  selectedArticleId?: string;
  onSubmitPaper?: (paper: any) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const TamweelPage: React.FC<TamweelPageProps> = ({
  onNavigate,
  selectedArticleId,
  onShowToast
}) => {
  const { articleId } = useParams<{ articleId?: string }>();
  const navigate = useNavigate();
  const effectiveArticleId = articleId || selectedArticleId;

  const [activeTab, setActiveTab] = useState<'articles' | 'info'>('articles');
  const [infoSubTab, setInfoSubTab] = useState<'aims' | 'board' | 'policy' | 'review' | 'ethics' | 'guidelines'>('aims');

  // Live Supabase Published Data
  const [publishedIssues, setPublishedIssues] = useState<JournalIssue[]>([]);
  const [liveArticles, setLiveArticles] = useState<JournalArticleRecord[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedIssueFilter, setSelectedIssueFilter] = useState<string>('All');

  // Article filter & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticleModal, setActiveArticleModal] = useState<any | null>(null);

  // Selected Issue Detail Modal
  const [activeIssueModal, setActiveIssueModal] = useState<JournalIssue | null>(null);

  // Load live published data from Supabase
  const loadLiveData = async () => {
    setLoadingLive(true);
    setLoadError(null);
    try {
      const [issuesData, articlesData] = await Promise.all([
        fetchPublicPublishedIssues(),
        fetchPublicPublishedArticles()
      ]);
      setPublishedIssues(issuesData || []);
      setLiveArticles(articlesData || []);
    } catch (err: any) {
      console.error('Failed to load published journal data:', err);
      setLoadError(err?.message || 'Unable to connect to the journal database. Please verify your connection.');
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    loadLiveData();
  }, []);

  // Display articles: strictly map live published articles from Supabase. Zero mock fallback.
  const displayArticles = liveArticles.map(a => ({
    id: a.id,
    title: a.title,
    authors: a.authors || [],
    abstract: a.abstract || '',
    keywords: a.keywords || [],
    publicationDate: a.publication_date || '',
    volume: a.issue?.volume_number,
    issue: a.issue?.issue_number,
    year: a.issue?.year,
    pages: a.page_range || '',
    doi: a.doi || '',
    category: a.category || 'General',
    pdfUrl: a.pdf_url || '',
    issueId: a.issue_id,
    issueTitle: a.issue?.title || ''
  }));

  // Auto-open modal if navigated with effectiveArticleId (URL param or prop)
  useEffect(() => {
    if (effectiveArticleId && displayArticles.length > 0) {
      const target = displayArticles.find(a => a.id === effectiveArticleId);
      if (target) {
        setActiveArticleModal(target);
      }
    }
  }, [effectiveArticleId, displayArticles]);

  const handleOpenArticleModal = (article: any) => {
    setActiveArticleModal(article);
    navigate(`/tamweel/${article.id}`);
  };

  const handleCloseArticleModal = () => {
    setActiveArticleModal(null);
    if (articleId) {
      navigate('/tamweel');
    }
  };

  const categories = ['All', ...Array.from(new Set(displayArticles.map(a => a.category).filter(Boolean)))];

  const filteredArticles = displayArticles.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesIssue = selectedIssueFilter === 'All' || a.issueId === selectedIssueFilter;
    const matchesSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authors.some(auth => auth.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesIssue && matchesSearch;
  });

  const latestIssue = publishedIssues.length > 0 ? publishedIssues[0] : null;

  const handleCopyCitation = (article: any) => {
    const authorsStr = article.authors && article.authors.length > 0 ? article.authors.join(', ') : 'Department Scholar';
    const yearStr = article.year ? ` (${article.year}).` : '.';
    const volStr = article.volume && article.issue ? `, ${article.volume}(${article.issue})` : '';
    const pagesStr = article.pages ? `, pp. ${article.pages}` : '';
    const citation = `${authorsStr}${yearStr} "${article.title}." Tamweel: Journal of Islamic Economics and Finance${volStr}${pagesStr}.`;
    navigator.clipboard?.writeText?.(citation);
    onShowToast('Citation Copied', 'APA / Chicago format citation copied to clipboard.', 'success');
  };

  const handleDownloadPdf = (article: any) => {
    if (article.pdfUrl && article.pdfUrl !== '#' && article.pdfUrl !== '') {
      window.open(article.pdfUrl, '_blank');
      onShowToast('Download Initiated', `Opening PDF for "${article.title}"`, 'success');
    } else {
      onShowToast('PDF Unavailable', `No PDF file has been uploaded for "${article.title}" yet.`, 'info');
    }
  };

  return (
    <div className="space-y-16 lg:space-y-20 py-8">

      {/* 1. JOURNAL HEADER & INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-forest/15 p-8 sm:p-12 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-surface-lightGreen/50 rounded-bl-full pointer-events-none -z-0"></div>

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest text-gold text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Flagship Journal Platform</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest block font-sans">
                Scholarly Academic Periodical
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-forest tracking-tight">
                Tamweel
              </h1>
              <h2 className="text-xl sm:text-2xl font-editorial text-charcoal font-semibold">
                Journal of Islamic Economics and Finance
              </h2>

            </div>

            <p className="text-sm sm:text-base text-charcoal-light leading-relaxed max-w-3xl">
              An open-access, peer-reviewed publication produced by the Department of Islamic Economics and Finance under the Kulliyya of Sharia, Darul Huda Islamic University. Tamweel promotes rigorous theoretical and empirical contributions exploring the interface of classical Shariah jurisprudence and modern financial systems.
            </p>

            {/* Publication & Indexing Notice */}
            <div className="p-4 rounded-xl bg-ivory border border-forest/15 text-xs text-charcoal-muted flex items-start space-x-3">
              <Info className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
              <div>
                <strong className="text-forest">Publication &amp; Indexing Notice:</strong>
                Tamweel adheres to international Committee on Publication Ethics (COPE) principles.
                <span className="ml-1 text-gold-dark font-medium">[ISSN: Pending official assignment | Open Access Diamond Model].</span>
              </div>
            </div>

            {/* Main Tab Controls */}
            <div className="pt-4 flex flex-wrap gap-3 border-t border-gray-100">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'articles' ? 'bg-forest text-white shadow' : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                  }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-gold" />
                <span>Browse Research Articles ({displayArticles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'info' ? 'bg-forest text-white shadow' : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                  }`}
              >
                <Info className="w-3.5 h-3.5 text-gold" />
                <span>Journal Information &amp; Policies</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LATEST PUBLISHED ISSUE DISPLAY - Strictly from Supabase. Only render if a published issue exists */}
      {activeTab === 'articles' && !loadingLive && !loadError && latestIssue && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest rounded-3xl p-8 sm:p-10 text-white border-2 border-gold/40 shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Cover preview */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-48 sm:w-56 bg-forest-dark border-2 border-gold/50 rounded-2xl shadow-2xl relative aspect-[3/4] flex flex-col justify-between group overflow-hidden">
                  {latestIssue.cover_image_url ? (
                    <img
                      src={latestIssue.cover_image_url}
                      alt={latestIssue.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-5 flex flex-col justify-between h-full relative">
                      <div className="absolute inset-0 pattern-dark-islamic opacity-40 pointer-events-none"></div>

                      <div className="relative z-10 space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-gold uppercase block">TAMWEEL</span>
                        <h3 className="font-editorial text-2xl font-bold text-white tracking-wide">TAMWEEL</h3>
                        <div className="font-arabic text-xs text-sage-light" dir="rtl">مجلة تمويل</div>
                      </div>

                      <div className="relative z-10 text-center py-4 border-y border-gold/30">
                        <IslamicStarIcon size={32} className="mx-auto text-gold mb-1" />
                        <span className="text-[10px] text-sage-subtle block">
                          Volume {latestIssue.volume_number} • Issue {latestIssue.issue_number}
                        </span>
                        <span className="text-[10px] text-gold font-bold">
                          {latestIssue.year}
                        </span>
                      </div>

                      <div className="relative z-10 text-[9px] text-sage-light flex justify-between">
                        <span>DIEF</span>
                        <span>DHIU Kerala</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Issue Metadata & Editorial Introduction */}
              <div className="lg:col-span-9 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Current Issue • Volume {latestIssue.volume_number}, Issue {latestIssue.issue_number} ({latestIssue.year})
                  </span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-snug">
                  {latestIssue.title}
                </h3>

                {latestIssue.theme && (
                  <div className="text-xs text-gold font-semibold">
                    Theme: {latestIssue.theme}
                  </div>
                )}

                {latestIssue.editorial_introduction && (
                  <p className="text-xs sm:text-sm text-sage-subtle leading-relaxed">
                    {latestIssue.editorial_introduction}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveIssueModal(latestIssue)}
                    className="px-5 py-2.5 bg-gold hover:bg-gold-light text-forest text-xs font-bold rounded-xl shadow transition flex items-center space-x-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Issue Overview</span>
                  </button>
                  <span className="text-xs text-sage-light font-mono">
                    Published • {latestIssue.articles_count || displayArticles.length} Research Articles Included
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. RESEARCH ARTICLES ARCHIVE */}
      {activeTab === 'articles' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Loading State */}
          {loadingLive && (
            <div className="p-12 text-center bg-white rounded-2xl border border-forest/10 flex items-center justify-center space-x-2 text-forest text-xs font-medium shadow-soft">
              <Loader2 className="w-5 h-5 animate-spin text-gold" />
              <span>Loading published journal records from database...</span>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="p-8 sm:p-12 bg-white rounded-2xl border border-red-200 text-center space-y-3 shadow-soft">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-editorial text-xl font-bold text-red-900">Database Connection Error</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">{loadError}</p>
              <button
                onClick={loadLiveData}
                className="px-5 py-2.5 bg-forest text-gold text-xs font-bold rounded-xl hover:bg-emerald-deep transition shadow"
              >
                Retry Database Request
              </button>
            </div>
          )}

          {/* Empty State: Zero Published Articles in Supabase */}
          {!loadingLive && !loadError && displayArticles.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-xs text-charcoal-muted border border-forest/10 space-y-3 shadow-soft">
              <BookOpen className="w-10 h-10 text-forest/30 mx-auto" />
              <h3 className="font-editorial text-xl font-bold text-forest">No Journal Issues Published Yet</h3>
              <p className="max-w-md mx-auto text-charcoal-light leading-relaxed">
                The Department of Islamic Economics and Finance has not published any journal issues or research articles yet. Peer-reviewed papers will appear here once released by the editorial board.
              </p>
            </div>
          )}

          {/* Published Articles Available */}
          {!loadingLive && !loadError && displayArticles.length > 0 && (
            <>
              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title, author, keyword..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-ivory/50 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Issue Selector Filter if issues available */}
                {publishedIssues.length > 1 && (
                  <div className="w-full md:w-64">
                    <select
                      value={selectedIssueFilter}
                      onChange={(e) => setSelectedIssueFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-ivory/50 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                    >
                      <option value="All">All Journal Issues</option>
                      {publishedIssues.map(iss => (
                        <option key={iss.id} value={iss.id}>
                          Vol. {iss.volume_number}, Issue {iss.issue_number} ({iss.year})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category Pills */}
                {categories.length > 1 && (
                  <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${selectedCategory === cat
                            ? 'bg-forest text-white'
                            : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Articles Listing */}
              <div className="space-y-4">
                {filteredArticles.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-xs text-charcoal-muted border border-forest/10 space-y-2">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                    <p>No published articles found matching your criteria.</p>
                  </div>
                ) : (
                  filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 p-6 sm:p-7 shadow-soft transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2.5 py-0.5 rounded">
                            {art.category}
                          </span>
                          {(art.volume || art.issue || art.publicationDate) && (
                            <span className="text-xs text-charcoal-muted">
                              {[
                                art.volume && `Vol. ${art.volume}`,
                                art.issue && `No. ${art.issue}`,
                                art.publicationDate && `(${art.publicationDate})`
                              ].filter(Boolean).join(' ')}
                            </span>
                          )}
                        </div>
                        {art.doi && (
                          <span className="text-[11px] font-mono text-gray-400">
                            {art.doi}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3
                          className="font-editorial text-xl font-bold text-forest leading-snug hover:text-emerald-deep transition-colors cursor-pointer"
                          onClick={() => handleOpenArticleModal(art)}
                        >
                          {art.title}
                        </h3>

                        {art.authors && art.authors.length > 0 && (
                          <div className="text-xs text-charcoal font-medium">
                            {art.authors.join('; ')}
                          </div>
                        )}

                        {art.abstract && (
                          <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                            <strong>Abstract:</strong> {art.abstract}
                          </p>
                        )}

                        {art.keywords && art.keywords.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-charcoal-muted font-bold mr-1">Keywords:</span>
                            {art.keywords.map((kw, i) => (
                              <span key={i} className="text-[10px] bg-surface-lightGreen text-forest px-2 py-0.5 rounded font-medium">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownloadPdf(art)}
                            className="px-4 py-2 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-gold" />
                            <span>Download Full PDF</span>
                          </button>

                          <button
                            onClick={() => handleCopyCitation(art)}
                            className="px-3.5 py-2 bg-ivory hover:bg-gray-100 text-charcoal border border-gray-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Copy className="w-3.5 h-3.5 text-gold-dark" />
                            <span>Cite Article</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleOpenArticleModal(art)}
                          className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 transition"
                        >
                          <span>Read Full Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </section>
      )}

      {/* 4. JOURNAL POLICIES TAB */}
      {activeTab === 'info' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white rounded-3xl border border-forest/15 shadow-soft overflow-hidden">
            <div className="p-6 bg-forest text-white flex flex-wrap gap-2 border-b border-gold/30">
              <button
                onClick={() => setInfoSubTab('aims')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'aims' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Aims &amp; Scope
              </button>
              <button
                onClick={() => setInfoSubTab('board')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'board' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Editorial Leadership
              </button>
              <button
                onClick={() => setInfoSubTab('policy')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'policy' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Editorial Policy
              </button>
              <button
                onClick={() => setInfoSubTab('review')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'review' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Peer Review Process
              </button>
              <button
                onClick={() => setInfoSubTab('ethics')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'ethics' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Publication Ethics (COPE)
              </button>
              <button
                onClick={() => setInfoSubTab('guidelines')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'guidelines' ? 'bg-gold text-forest font-bold' : 'text-sage-light hover:text-white'}`}
              >
                Author Guidelines
              </button>
            </div>

            <div className="p-8 sm:p-12 space-y-6 text-sm text-charcoal-light leading-relaxed">
              {infoSubTab === 'aims' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Aims &amp; Scope</h3>
                  <p>
                    <strong>Tamweel: Journal of Islamic Economics and Finance</strong> is the official peer-reviewed research journal published by the Department of Islamic Economics and Finance under the Kulliyya of Sharia at Darul Huda Islamic University.
                  </p>
                  <p>
                    As outlined in the Departmental Prospectus, the journal is primarily dedicated to rigorous research, scholarly discussions, and academic contributions in key areas including:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-charcoal-muted pl-2">
                    <li><strong>Islamic banking systems</strong> and non-interest financial intermediation</li>
                    <li><strong>Halal investment frameworks</strong> and ethical screening models</li>
                    <li><strong>Economic justice through Islamic social finance</strong> (Waqf, Zakat, and Sadaqah)</li>
                    <li><strong>Comparative policy analysis</strong> between conventional and Islamic finance</li>
                  </ul>
                  <div className="p-4 bg-surface-lightGreen/50 rounded-xl border border-forest/10 text-xs">
                    <strong className="text-forest">Frequency:</strong> Bi-annual (May and October Issues) • Open Access Model (No author APC fees).
                  </div>
                </div>
              )}

              {infoSubTab === 'board' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Editorial Leadership</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Editor-in-Chief</div>
                      <div className="text-xs text-charcoal-light">Anas Hudawi Nellikkuth (Head of Department)</div>
                      <div className="text-[11px] text-gold-dark mt-1">P.G. in Economics, Calicut University • DHIU</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Academic Advisor &amp; Dean</div>
                      <div className="text-xs text-charcoal-light">Dr. K.P. Jafar Hudawi Kolathur (Dean, Kulliyya of Sharia)</div>
                      <div className="text-[11px] text-gold-dark mt-1">Ph.D. in Arabic • DHIU</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Senior Academic Faculty Member</div>
                      <div className="text-xs text-charcoal-light">Dr. Rasheed</div>
                      <div className="text-[11px] text-gold-dark mt-1">Ph.D. in Economics, Calicut University</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Managing Editor &amp; Secretariat</div>
                      <div className="text-xs text-charcoal-light">Department Research Working Group</div>
                      <div className="text-[11px] text-gold-dark mt-1">
                        <a href="mailto:dief@dhiu.in" className="hover:underline text-forest font-semibold">dief@dhiu.in</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {infoSubTab === 'policy' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Editorial Policy</h3>
                  <p>
                    All submissions undergo initial editorial desk triage within 10 days to assess thematic fit, methodological rigor, and adherence to author guidelines. Articles meeting the preliminary threshold are forwarded for double-blind peer review.
                  </p>
                  <p>
                    Tamweel operates on the principle of Open Access, providing unrestricted electronic full-text access immediately upon publication without author-facing Article Processing Charges (APCs).
                  </p>
                </div>
              )}

              {infoSubTab === 'review' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Double-Blind Peer Review Process</h3>
                  <p>
                    To maintain strict objectivity, Tamweel implements a rigorous double-blind peer review protocol:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm pl-2">
                    <li>The identity of the author(s) is concealed from the appointed reviewers.</li>
                    <li>The identity of the reviewers remains completely confidential.</li>
                    <li>Each manuscript is examined by at least two independent expert reviewers.</li>
                    <li>Reviewers provide structured feedback across originality, theoretical soundness, and empirical validity.</li>
                  </ol>
                </div>
              )}

              {infoSubTab === 'ethics' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Publication Ethics</h3>
                  <p>
                    Tamweel strictly observes the ethical guidelines established by the Committee on Publication Ethics (COPE). Plagiarism, data fabrication, gift authorship, duplicate submissions, and undisclosed financial conflicts of interest result in immediate desk rejection and formal institutional notification.
                  </p>
                </div>
              )}

              {infoSubTab === 'guidelines' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Author &amp; Submission Guidelines</h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li>• <strong>Word Count:</strong> 6,000 to 9,000 words (including abstract, references, and appendices).</li>
                    <li>• <strong>Abstract:</strong> 200–250 words summarizing research questions, methodology, and core findings.</li>
                    <li>• <strong>Citation Style:</strong> Chicago Manual of Style (17th Edition, Author-Date).</li>
                    <li>• <strong>Format:</strong> Complete manuscript in PDF document format.</li>
                  </ul>
                  <div className="pt-2 p-4 bg-ivory rounded-xl border border-forest/10 text-xs text-charcoal-light">
                    <p>
                      Manuscript submissions and editorial inquiries should be directed to the editorial office at{' '}
                      <a href="mailto:dief@dhiu.in" className="text-forest font-bold hover:underline">
                        dief@dhiu.in
                      </a>. Please include your complete manuscript along with author affiliations and abstract.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ARTICLE DETAILS MODAL */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Tamweel Article View
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest leading-snug">
                  {activeArticleModal.title}
                </h3>
              </div>
              <button
                onClick={handleCloseArticleModal}
                className="text-gray-400 hover:text-charcoal p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              {activeArticleModal.authors && activeArticleModal.authors.length > 0 && (
                <div className="text-charcoal font-semibold">
                  Authors: {activeArticleModal.authors.join(', ')}
                </div>
              )}
              {(activeArticleModal.volume || activeArticleModal.issue || activeArticleModal.year || activeArticleModal.pages) && (
                <div className="text-charcoal-muted">
                  {[
                    activeArticleModal.volume && `Vol. ${activeArticleModal.volume}`,
                    activeArticleModal.issue && `Issue ${activeArticleModal.issue}`,
                    activeArticleModal.year && `(${activeArticleModal.year})`,
                    activeArticleModal.pages && `pp. ${activeArticleModal.pages}`
                  ].filter(Boolean).join(' ')}
                </div>
              )}
              {activeArticleModal.doi && (
                <div className="text-charcoal-muted font-mono">
                  DOI: {activeArticleModal.doi}
                </div>
              )}
            </div>

            <div className="p-4 bg-ivory rounded-xl border border-gray-200 space-y-1.5">
              <div className="font-bold text-forest">Abstract</div>
              <p className="leading-relaxed text-charcoal-light">{activeArticleModal.abstract}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeArticleModal.keywords.map((k: string) => (
                <span key={k} className="px-2 py-0.5 rounded bg-surface-lightGreen text-forest text-[11px] font-medium">
                  #{k}
                </span>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => handleDownloadPdf(activeArticleModal)}
                className="px-4 py-2 bg-forest text-gold text-xs font-bold rounded-xl shadow hover:bg-emerald-deep transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Published PDF</span>
              </button>
              <button
                onClick={() => handleCopyCitation(activeArticleModal)}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-gold-dark" />
                <span>Copy Citation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE DETAILS MODAL */}
      {activeIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Journal Issue Overview
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest">
                  Volume {activeIssueModal.volume_number}, Issue {activeIssueModal.issue_number} ({activeIssueModal.year})
                </h3>
              </div>
              <button onClick={() => setActiveIssueModal(null)} className="text-gray-400 font-bold p-1">✕</button>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-forest text-sm">{activeIssueModal.title}</div>
              {activeIssueModal.theme && (
                <div className="text-gold-dark font-medium">Theme: {activeIssueModal.theme}</div>
              )}
            </div>

            {activeIssueModal.editorial_introduction && (
              <div className="p-4 bg-surface-lightGreen/50 rounded-xl border border-forest/10 space-y-1">
                <div className="font-bold text-forest">Editorial Introduction</div>
                <p className="text-charcoal-light leading-relaxed">{activeIssueModal.editorial_introduction}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedIssueFilter(activeIssueModal.id);
                  setActiveIssueModal(null);
                  setActiveTab('articles');
                }}
                className="px-4 py-2 bg-forest text-gold text-xs font-bold rounded-xl"
              >
                Filter Articles for this Issue →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
