import React, { useState } from 'react';
import { JournalIssue, IssuePublicationStatus } from '../../../types/journal';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Archive, 
  Upload, 
  AlertCircle,
  Eye,
  Loader2
} from 'lucide-react';

interface JournalIssuesViewProps {
  issues: JournalIssue[];
  loading: boolean;
  onRefresh: () => void;
  onCreateIssue: (issueData: Omit<JournalIssue, 'id' | 'created_at' | 'updated_at' | 'articles_count'>, coverFile?: File) => Promise<void>;
  onUpdateIssue: (id: string, issueUpdates: Partial<JournalIssue>, coverFile?: File) => Promise<void>;
  onDeleteIssue: (id: string) => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const JournalIssuesView: React.FC<JournalIssuesViewProps> = ({
  issues,
  loading,
  onRefresh,
  onCreateIssue,
  onUpdateIssue,
  onDeleteIssue,
  onShowToast
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<JournalIssue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [volumeNumber, setVolumeNumber] = useState<number>(3);
  const [issueNumber, setIssueNumber] = useState<number>(2);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [title, setTitle] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [editorialIntroduction, setEditorialIntroduction] = useState<string>('');
  const [publicationDate, setPublicationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<IssuePublicationStatus>('Draft');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  // Delete Dialog State
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null);

  const filteredIssues = issues.filter((iss) => {
    const matchesStatus = filterStatus === 'All' || iss.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (iss.theme && iss.theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      iss.year.toString().includes(searchQuery) ||
      `vol ${iss.volume_number}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `issue ${iss.issue_number}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingIssue(null);
    setVolumeNumber(3);
    setIssueNumber(issues.length > 0 ? issues[0].issue_number + 1 : 1);
    setYear(new Date().getFullYear());
    setTitle('');
    setTheme('');
    setEditorialIntroduction('');
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setStatus('Draft');
    setCoverFile(null);
    setCoverPreview(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (iss: JournalIssue) => {
    setEditingIssue(iss);
    setVolumeNumber(iss.volume_number);
    setIssueNumber(iss.issue_number);
    setYear(iss.year);
    setTitle(iss.title);
    setTheme(iss.theme || '');
    setEditorialIntroduction(iss.editorial_introduction || '');
    setPublicationDate(iss.publication_date || new Date().toISOString().split('T')[0]);
    setStatus(iss.status);
    setCoverFile(null);
    setCoverPreview(iss.cover_image_url || null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setFormErrors({ ...formErrors, cover: 'Please select a valid image file (PNG, JPG, or WebP)' });
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setFormErrors({ ...formErrors, cover: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!title.trim()) errors.title = 'Issue title is required';
    if (!volumeNumber || volumeNumber < 1) errors.volume = 'Valid volume number required';
    if (!issueNumber || issueNumber < 1) errors.issue = 'Valid issue number required';
    if (!year || year < 2000) errors.year = 'Valid 4-digit year required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (editingIssue) {
        await onUpdateIssue(
          editingIssue.id,
          {
            volume_number: volumeNumber,
            issue_number: issueNumber,
            year,
            title,
            theme,
            editorial_introduction: editorialIntroduction,
            publication_date: publicationDate,
            status
          },
          coverFile || undefined
        );
        onShowToast('Issue Updated', `Volume ${volumeNumber}, Issue ${issueNumber} updated successfully.`, 'success');
      } else {
        await onCreateIssue(
          {
            volume_number: volumeNumber,
            issue_number: issueNumber,
            year,
            title,
            theme,
            editorial_introduction: editorialIntroduction,
            publication_date: publicationDate,
            status,
            cover_image_url: coverPreview || null
          },
          coverFile || undefined
        );
        onShowToast('Issue Created', `Volume ${volumeNumber}, Issue ${issueNumber} created successfully.`, 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      onShowToast('Error', err.message || 'Failed to save issue.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingIssueId) return;
    try {
      await onDeleteIssue(deletingIssueId);
      onShowToast('Issue Deleted', 'Journal issue removed successfully.', 'info');
      setDeletingIssueId(null);
      onRefresh();
    } catch (err: any) {
      onShowToast('Error Deleting Issue', err.message, 'warning');
    }
  };

  const getStatusBadge = (st: IssuePublicationStatus) => {
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
      
      {/* Top Header & Search Controls */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
              Issue Volumes Archive
            </div>
            <h2 className="font-editorial text-xl font-bold text-forest mt-0.5">
              Journal Issues Management ({issues.length})
            </h2>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create New Issue</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, volume, year..."
              className="w-full pl-10 pr-4 py-2 bg-ivory/60 border border-gray-200 rounded-xl text-xs focus:border-forest focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
            {['All', 'Published', 'Draft', 'Archived'].map((st) => (
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

      {/* Issues Table */}
      <div className="bg-white rounded-3xl border border-forest/10 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal-muted flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-forest" />
            <span>Loading journal issues from Supabase...</span>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-muted space-y-2">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto" />
            <p>No journal issues found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-charcoal-muted uppercase text-[10px] tracking-wider bg-ivory/40">
                  <th className="py-3 px-4">Volume &amp; Issue</th>
                  <th className="py-3 px-4">Title &amp; Theme</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Articles</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-surface-lightGreen/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-forest text-sm">
                        Vol. {iss.volume_number}, Issue {iss.issue_number}
                      </div>
                      <div className="text-[11px] text-gold-dark">{iss.year}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-forest leading-snug line-clamp-1">
                        {iss.title}
                      </div>
                      {iss.theme && (
                        <div className="text-[11px] text-charcoal-muted line-clamp-1 mt-0.5">
                          Theme: {iss.theme}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(iss.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-forest bg-forest/5 px-2 py-0.5 rounded border border-forest/10">
                        {iss.articles_count || 0} papers
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {iss.publication_date || iss.year}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(iss)}
                          className="p-1.5 text-charcoal-muted hover:text-forest hover:bg-forest/5 rounded-lg transition"
                          title="Edit Issue"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingIssueId(iss.id)}
                          className="p-1.5 text-charcoal-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Issue"
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

      {/* CREATE / EDIT ISSUE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Journal Architecture
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest">
                  {editingIssue ? 'Edit Journal Issue' : 'Create New Journal Issue'}
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
              
              {/* Vol, Issue, Year, Date Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Volume *</label>
                  <input
                    type="number"
                    min="1"
                    value={volumeNumber}
                    onChange={(e) => setVolumeNumber(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                    required
                  />
                  {formErrors.volume && <p className="text-red-500 text-[10px]">{formErrors.volume}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Issue *</label>
                  <input
                    type="number"
                    min="1"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                    required
                  />
                  {formErrors.issue && <p className="text-red-500 text-[10px]">{formErrors.issue}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Year *</label>
                  <input
                    type="number"
                    min="2000"
                    max="2099"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                    required
                  />
                  {formErrors.year && <p className="text-red-500 text-[10px]">{formErrors.year}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IssuePublicationStatus)}
                    className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-forest uppercase tracking-wider block">Issue Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Issue: Theoretical Jurisprudence & Sukuk Structuring"
                  className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                  required
                />
                {formErrors.title && <p className="text-red-500 text-[10px]">{formErrors.title}</p>}
              </div>

              {/* Theme & Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase tracking-wider block">Thematic Focus</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Islamic Capital Markets & Social Finance"
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

              {/* Editorial Introduction */}
              <div className="space-y-1">
                <label className="font-bold text-forest uppercase tracking-wider block">Editorial Introduction</label>
                <textarea
                  rows={4}
                  value={editorialIntroduction}
                  onChange={(e) => setEditorialIntroduction(e.target.value)}
                  placeholder="Provide the opening editorial commentary highlighting key contributions in this issue..."
                  className="w-full px-3 py-2 bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1.5 p-3 rounded-xl bg-ivory/80 border border-gray-200">
                <label className="font-bold text-forest uppercase tracking-wider block">Cover Image Upload (Optional)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleCoverChange}
                  className="text-xs text-charcoal-muted"
                />
                <p className="text-[10px] text-charcoal-muted">Supported formats: PNG, JPEG, WebP (Max 5MB)</p>
                {coverPreview && (
                  <div className="mt-2 w-24 h-32 rounded-lg overflow-hidden border border-gray-300">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {formErrors.cover && <p className="text-red-500 text-[10px]">{formErrors.cover}</p>}
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
                      <span>Saving Issue...</span>
                    </>
                  ) : (
                    <span>{editingIssue ? 'Save Changes' : 'Create Issue'}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingIssueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-red-200 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-base font-bold text-forest">Delete Journal Issue?</h3>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Are you sure you want to delete this issue? Associated articles will remain in the database but will be unlinked.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingIssueId(null)}
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
