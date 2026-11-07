import React, { useState } from 'react';
import { JournalArticleRecord, JournalIssue, ArticlePublicationStatus } from '../../../types/journal';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Archive, 
  Upload, 
  Eye, 
  AlertCircle,
  Loader2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface JournalArticlesViewProps {
  articles: JournalArticleRecord[];
  issues: JournalIssue[];
  loading: boolean;
  onRefresh: () => void;
  onCreateArticle: (articleData: Omit<JournalArticleRecord, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'download_count'>, pdfFile?: File) => Promise<void>;
  onUpdateArticle: (id: string, updates: Partial<JournalArticleRecord>, pdfFile?: File) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const JournalArticlesView: React.FC<JournalArticlesViewProps> = ({
  articles,
  issues,
  loading,
  onRefresh,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  onShowToast
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<JournalArticleRecord | null>(null);
  const [previewArticle, setPreviewArticle] = useState<JournalArticleRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [authorsInput, setAuthorsInput] = useState('');
  const [authorAffiliations, setAuthorAffiliations] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [category, setCategory] = useState('Theoretical Jurisprudence');
  const [issueId, setIssueId] = useState<string>('');
  const [pageRange, setPageRange] = useState('');
  const [doi, setDoi] = useState('');
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ArticlePublicationStatus>('Draft');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  // Delete State
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  const categories = [
    'Theoretical Jurisprudence',
    'Capital Markets & Sukuk',
    'Social Islamic Finance',
    'Fintech & Digital Economy',
    'Islamic Banking Operations',
    'Maqasid al-Shariah in Economics'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesStatus = filterStatus === 'All' || art.status === filterStatus;
    const matchesIssue = selectedIssueId === 'All' || art.issue_id === selectedIssueId;
    const matchesSearch =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesIssue && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setAuthorsInput('');
    setAuthorAffiliations('Department of Islamic Economics and Finance, Darul Huda Islamic University');
    setAbstractText('');
    setKeywordsInput('');
    setCategory('Theoretical Jurisprudence');
    setIssueId(issues.length > 0 ? issues[0].id : '');
    setPageRange('');
    setDoi('');
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setStatus('Draft');
    setPdfFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (art: JournalArticleRecord) => {
    setEditingArticle(art);
    setTitle(art.title);
    setAuthorsInput(art.authors.join(', '));
    setAuthorAffiliations(art.author_affiliations || '');
    setAbstractText(art.abstract);
    setKeywordsInput(art.keywords.join(', '));
    setCategory(art.category || 'Theoretical Jurisprudence');
    setIssueId(art.issue_id || '');
    setPageRange(art.page_range || '');
    setDoi(art.doi || '');
    setPublicationDate(art.publication_date || new Date().toISOString().split('T')[0]);
    setStatus(art.status);
    setPdfFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setFormErrors({ ...formErrors, pdf: 'Please select a valid PDF file' });
        return;
      }
      setPdfFile(file);
      setFormErrors({ ...formErrors, pdf: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!title.trim()) errors.title = 'Article title is required';
    if (!authorsInput.trim()) errors.authors = 'At least one author name is required';
    if (!abstractText.trim() || abstractText.length < 30) errors.abstract = 'Abstract must be at least 30 characters';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const parsedAuthors = authorsInput.split(',').map(a => a.trim()).filter(Boolean);
    const parsedKeywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);

    try {
      if (editingArticle) {
        await onUpdateArticle(
          editingArticle.id,
          {
            title,
            authors: parsedAuthors,
            author_affiliations: authorAffiliations,
            abstract: abstractText,
            keywords: parsedKeywords,
            category,
            issue_id: issueId || null,
            page_range: pageRange,
            doi,
            publication_date: publicationDate,
            status
          },
          pdfFile || undefined
        );
        onShowToast('Article Updated', `"${title}" updated successfully.`, 'success');
      } else {
        await onCreateArticle(
          {
            title,
            authors: parsedAuthors,
            author_affiliations: authorAffiliations,
            abstract: abstractText,
            keywords: parsedKeywords,
            category,
            issue_id: issueId || null,
            page_range: pageRange,
            doi,
            publication_date: publicationDate,
            status,
            pdf_url: null,
            submission_id: null
          },
          pdfFile || undefined
        );
        onShowToast('Article Created', `"${title}" added to journal registry.`, 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      onShowToast('Error Saving Article', err.message, 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (art: JournalArticleRecord) => {
    const nextStatus: ArticlePublicationStatus = art.status === 'Published' ? 'Draft' : 'Published';
    try {
      await onUpdateArticle(art.id, { status: nextStatus });
      onShowToast(
        nextStatus === 'Published' ? 'Article Published' : 'Article Moved to Drafts',
        `Article is now ${nextStatus.toLowerCase()} on the public portal.`,
        'success'
      );
      onRefresh();
    } catch (err: any) {
      onShowToast('Status Update Failed', err.message, 'warning');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingArticleId) return;
    try {
      await onDeleteArticle(deletingArticleId);
      onShowToast('Article Deleted', 'Article permanently removed from journal database.', 'info');
      setDeletingArticleId(null);
      onRefresh();
    } catch (err: any) {
      onShowToast('Error Deleting Article', err.message, 'warning');
    }
  };

  const getStatusBadge = (st: ArticlePublicationStatus) => {
    switch (st) {
      case 'Published':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Published</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Draft</span>
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <Archive className="w-3 h-3 text-gray-500" />
            <span>Archived</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
              Peer-Reviewed Repository
            </div>
            <h2 className="font-editorial text-xl font-bold text-forest mt-0.5">
              Articles Management ({articles.length})
            </h2>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create Article</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-gray-100">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, keyword..."
              className="w-full pl-10 pr-4 py-2 bg-ivory/60 border border-gray-200 rounded-xl text-xs focus:border-forest focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl text-xs focus:border-forest focus:outline-none"
            >
              <option value="All">All Issues</option>
              {issues.map(iss => (
                <option key={iss.id} value={iss.id}>
                  Vol. {iss.volume_number}, Issue {iss.issue_number} ({iss.year})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-end space-x-1.5 overflow-x-auto">
            {['All', 'Published', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === st
                    ? 'bg-forest text-gold shadow-sm'
                    : 'bg-surface-lightGreen/50 text-charcoal hover:bg-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-forest/10 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal-muted flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-forest" />
            <span>Loading articles from Supabase...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-muted space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p>No journal articles found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-charcoal-muted uppercase text-[10px] tracking-wider bg-ivory/40">
                  <th className="py-3 px-4">Article Title &amp; Authors</th>
                  <th className="py-3 px-4">Assigned Issue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pages &amp; PDF</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-surface-lightGreen/20 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-forest leading-snug line-clamp-1">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-1">
                        {art.authors.join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted font-mono">
                      {art.issue ? (
                        <span className="font-bold text-forest text-[11px]">
                          Vol. {art.issue.volume_number}, Issue {art.issue.issue_number} ({art.issue.year})
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                        {art.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(art.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-charcoal-muted">pp. {art.page_range || '—'}</div>
                        {art.pdf_url ? (
                          <a
                            href={art.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-forest hover:text-gold flex items-center space-x-1"
                          >
                            <span>Open PDF</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-amber-600">No PDF attached</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setPreviewArticle(art)}
                          className="p-1.5 text-charcoal-muted hover:text-forest hover:bg-forest/5 rounded-lg transition"
                          title="Preview Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleTogglePublish(art)}
                          className={`p-1.5 rounded-lg transition ${
                            art.status === 'Published'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={art.status === 'Published' ? 'Unpublish to Draft' : 'Publish to Live Site'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(art)}
                          className="p-1.5 text-charcoal-muted hover:text-forest hover:bg-forest/5 rounded-lg transition"
                          title="Edit Article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingArticleId(art.id)}
                          className="p-1.5 text-charcoal-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Journal Indexing
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest">
                  {editingArticle ? 'Edit Article Details' : 'Publish Article to Tamweel'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-charcoal p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-forest uppercase tracking-wider block">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classical Contractual Foundations of Islamic Finance..."
                  className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  required
                />
                {formErrors.title && <p className="text-red-500 text-[10px]">{formErrors.title}</p>}
              </div>

              {/* Authors & Affiliation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Authors * (comma separated)</label>
                  <input
                    type="text"
                    value={authorsInput}
                    onChange={(e) => setAuthorsInput(e.target.value)}
                    placeholder="e.g. Anas Hudawi, Dr. Rasheed"
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                    required
                  />
                  {formErrors.authors && <p className="text-red-500 text-[10px]">{formErrors.authors}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Institutional Affiliation</label>
                  <input
                    type="text"
                    value={authorAffiliations}
                    onChange={(e) => setAuthorAffiliations(e.target.value)}
                    placeholder="e.g. Darul Huda Islamic University"
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1">
                <label className="font-bold text-forest uppercase tracking-wider block">Abstract *</label>
                <textarea
                  rows={4}
                  value={abstractText}
                  onChange={(e) => setAbstractText(e.target.value)}
                  placeholder="Abstract outlining research questions, Fiqh methodology, findings, and contributions..."
                  className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  required
                />
                {formErrors.abstract && <p className="text-red-500 text-[10px]">{formErrors.abstract}</p>}
              </div>

              {/* Keywords & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="e.g. Riba, Sukuk, Fiqh al-Mu'amalat"
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Category Track</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Issue Assignment, Page Range, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Assign to Issue</label>
                  <select
                    value={issueId}
                    onChange={(e) => setIssueId(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  >
                    <option value="">No Issue Assigned</option>
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id}>
                        Vol. {iss.volume_number}, Issue {iss.issue_number} ({iss.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Page Range</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 14–38"
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticlePublicationStatus)}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published (Public)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* DOI & Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">DOI Identifier (Optional)</label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="e.g. 10.5892/tamweel.2026.0302.01"
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Publication Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF File Upload */}
              <div className="space-y-1.5 p-3 rounded-xl bg-ivory/80 border border-gray-200">
                <label className="font-bold text-forest uppercase tracking-wider block">Upload Article PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="text-xs text-charcoal-muted"
                />
                <p className="text-[10px] text-charcoal-muted">Supported format: PDF (Max 25MB). Uploads to public journal-published bucket.</p>
                {editingArticle?.pdf_url && !pdfFile && (
                  <div className="text-[11px] text-forest font-mono truncate mt-1">
                    Current PDF attached: {editingArticle.pdf_url}
                  </div>
                )}
                {formErrors.pdf && <p className="text-red-500 text-[10px]">{formErrors.pdf}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest hover:bg-emerald-deep text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                      <span>Saving Article...</span>
                    </>
                  ) : (
                    <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Tamweel Article Metadata Preview
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest leading-snug">
                  {previewArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-gray-400 hover:text-charcoal p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-charcoal-muted">
                <strong>Authors:</strong> {previewArticle.authors.join(', ')}
              </div>
              {previewArticle.author_affiliations && (
                <div className="text-charcoal-muted">
                  <strong>Affiliation:</strong> {previewArticle.author_affiliations}
                </div>
              )}
              {previewArticle.issue && (
                <div className="text-charcoal-muted">
                  <strong>Issue:</strong> Volume {previewArticle.issue.volume_number}, Issue {previewArticle.issue.issue_number} ({previewArticle.issue.year})
                </div>
              )}
              <div className="text-charcoal-muted">
                <strong>Page Range:</strong> pp. {previewArticle.page_range || '—'}
              </div>
              {previewArticle.doi && (
                <div className="text-charcoal-muted font-mono">
                  <strong>DOI:</strong> {previewArticle.doi}
                </div>
              )}
            </div>

            <div className="p-4 bg-ivory rounded-xl border border-gray-200 space-y-1.5">
              <div className="font-bold text-forest">Abstract</div>
              <p className="leading-relaxed text-charcoal-light">{previewArticle.abstract}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {previewArticle.keywords.map(k => (
                <span key={k} className="px-2 py-0.5 rounded bg-surface-lightGreen text-forest text-[11px] font-medium">
                  #{k}
                </span>
              ))}
            </div>

            {previewArticle.pdf_url && (
              <div className="pt-2">
                <a
                  href={previewArticle.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-forest text-gold text-xs font-bold rounded-xl shadow hover:bg-emerald-deep transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full PDF Document</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingArticleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-red-200 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-base font-bold text-forest">Delete Article?</h3>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Are you sure you want to permanently delete this article record? This action will remove it from public viewing and audit logs.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingArticleId(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
