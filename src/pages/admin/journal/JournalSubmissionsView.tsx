import React, { useState, useEffect } from 'react';
import {
  JournalSubmission,
  JournalIssue,
  ManuscriptWorkflowStatus,
  JournalReviewAssignment,
  JournalEditorialNote,
  JournalSubmissionStatusHistory
} from '../../../types/journal';
import {
  fetchSubmissionDetails,
  updateSubmissionStatus,
  addEditorialNote,
  assignReviewer,
  getSignedManuscriptUrl,
  convertSubmissionToPublishedArticle
} from '../../../lib/journalService';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  UserCheck,
  MessageSquare,
  History,
  Send,
  BookOpen,
  ShieldAlert,
  Loader2,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface JournalSubmissionsViewProps {
  submissions: JournalSubmission[];
  issues: JournalIssue[];
  loading: boolean;
  onRefresh: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  selectedSubmissionFromDashboard?: JournalSubmission | null;
  onClearSelectedSubmission?: () => void;
}

export const JournalSubmissionsView: React.FC<JournalSubmissionsViewProps> = ({
  submissions,
  issues,
  loading,
  onRefresh,
  onShowToast,
  selectedSubmissionFromDashboard,
  onClearSelectedSubmission
}) => {
  const { user, profile, role } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Submission Detail State
  const [selectedSub, setSelectedSub] = useState<JournalSubmission | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [reviews, setReviews] = useState<JournalReviewAssignment[]>([]);
  const [notes, setNotes] = useState<JournalEditorialNote[]>([]);
  const [history, setHistory] = useState<JournalSubmissionStatusHistory[]>([]);

  // Workflow Action States
  const [activeActionTab, setActiveActionTab] = useState<'status' | 'reviews' | 'notes' | 'history'>('status');
  const [newStatus, setNewStatus] = useState<ManuscriptWorkflowStatus>('Initial Screening');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New Note
  const [newEditorialNote, setNewEditorialNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // New Reviewer
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewerAffiliation, setReviewerAffiliation] = useState('');
  const [reviewerDueDate, setReviewerDueDate] = useState('');
  const [addingReviewer, setAddingReviewer] = useState(false);

  // Publish Accepted Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [targetIssueId, setTargetIssueId] = useState('');
  const [publishPageRange, setPublishPageRange] = useState('01–25');
  const [publishDoi, setPublishDoi] = useState('');
  const [publishingArticle, setPublishingArticle] = useState(false);

  // Download handling
  const [downloadingFile, setDownloadingFile] = useState(false);

  const workflowStatuses: ManuscriptWorkflowStatus[] = [
    'Submitted',
    'Initial Screening',
    'Under Review',
    'Revision Requested',
    'Revised Manuscript Received',
    'Accepted',
    'Rejected',
    'Published'
  ];

  // Auto-open if passed from dashboard
  useEffect(() => {
    if (selectedSubmissionFromDashboard) {
      loadDetails(selectedSubmissionFromDashboard);
      if (onClearSelectedSubmission) onClearSelectedSubmission();
    }
  }, [selectedSubmissionFromDashboard]);

  const loadDetails = async (sub: JournalSubmission) => {
    setSelectedSub(sub);
    setNewStatus(sub.status);
    setLoadingDetails(true);

    try {
      const details = await fetchSubmissionDetails(sub.id);
      setReviews(details.reviewAssignments);
      setNotes(details.editorialNotes);
      setHistory(details.statusHistory);
    } catch (err: any) {
      onShowToast('Error loading details', err.message, 'warning');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDownloadManuscript = async (sub: JournalSubmission) => {
    setDownloadingFile(true);
    try {
      const signedUrl = await getSignedManuscriptUrl(sub.file_url);
      window.open(signedUrl, '_blank');
      onShowToast('Secure Download Link Generated', 'Opening private manuscript in new tab.', 'success');
    } catch (err: any) {
      onShowToast('Download Failed', err.message, 'warning');
    } finally {
      setDownloadingFile(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setUpdatingStatus(true);

    try {
      await updateSubmissionStatus(
        selectedSub.id,
        newStatus,
        user?.id,
        profile?.fullName || user?.email,
        statusNote || undefined
      );

      onShowToast('Status Updated', `Manuscript marked as "${newStatus}".`, 'success');
      setStatusNote('');

      // Reload details and table
      await loadDetails({ ...selectedSub, status: newStatus });
      onRefresh();
    } catch (err: any) {
      onShowToast('Update Failed', err.message, 'warning');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddEditorialNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !newEditorialNote.trim()) return;
    setAddingNote(true);

    try {
      await addEditorialNote(
        selectedSub.id,
        newEditorialNote.trim(),
        user?.id,
        profile?.fullName || 'Editorial Board'
      );

      onShowToast('Note Added', 'Confidential editorial note recorded.', 'success');
      setNewEditorialNote('');
      const details = await fetchSubmissionDetails(selectedSub.id);
      setNotes(details.editorialNotes);
    } catch (err: any) {
      onShowToast('Failed to add note', err.message, 'warning');
    } finally {
      setAddingNote(false);
    }
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !reviewerName.trim() || !reviewerEmail.trim()) return;
    setAddingReviewer(true);

    try {
      await assignReviewer({
        submission_id: selectedSub.id,
        reviewer_name: reviewerName.trim(),
        reviewer_email: reviewerEmail.trim(),
        reviewer_affiliation: reviewerAffiliation.trim() || null,
        status: 'Invited',
        recommendation: 'Pending',
        due_date: reviewerDueDate || null
      });

      onShowToast('Reviewer Assigned', `Invitation sent for ${reviewerName}.`, 'success');
      setReviewerName('');
      setReviewerEmail('');
      setReviewerAffiliation('');
      setReviewerDueDate('');

      const details = await fetchSubmissionDetails(selectedSub.id);
      setReviews(details.reviewAssignments);
    } catch (err: any) {
      onShowToast('Failed to assign reviewer', err.message, 'warning');
    } finally {
      setAddingReviewer(false);
    }
  };

  const handlePublishAcceptedManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !targetIssueId) return;
    setPublishingArticle(true);

    try {
      await convertSubmissionToPublishedArticle(
        selectedSub.id,
        targetIssueId,
        publishPageRange,
        publishDoi || undefined
      );

      onShowToast(
        'Manuscript Published',
        'Article successfully generated and published into target journal issue!',
        'success'
      );
      setShowPublishModal(false);
      setSelectedSub(null);
      onRefresh();
    } catch (err: any) {
      onShowToast('Publish Failed', err.message, 'warning');
    } finally {
      setPublishingArticle(false);
    }
  };

  const filteredSubs = submissions.filter((s) => {
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.track.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ManuscriptWorkflowStatus) => {
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

      {/* Top Header & Search Controls */}
      <div className="bg-white rounded-3xl border border-forest/15 p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-gold-dark uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-3 h-3" />
              <span>Strictly Confidential Editorial Workspace</span>
            </div>
            <h2 className="font-editorial text-xl font-bold text-forest mt-0.5">
              Manuscript Submissions &amp; Peer Review Workflow ({submissions.length})
            </h2>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-center">
            Signed URL Storage Active
          </span>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by manuscript title, author, track..."
              className="w-full pl-10 pr-4 py-2 bg-forest/5 border border-forest/15 rounded-xl text-xs text-forest focus:border-forest focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
            {['All', ...workflowStatuses].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${filterStatus === st
                    ? 'bg-forest text-gold shadow-sm font-bold'
                    : 'bg-forest/5 text-charcoal hover:bg-forest/10'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-3xl border border-forest/15 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal-muted flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-forest" />
            <span>Loading manuscript submissions from Supabase...</span>
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-muted space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p>No manuscript submissions found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-charcoal-muted uppercase text-[10px] tracking-wider bg-forest/5">
                  <th className="py-3 px-4">Title &amp; Track</th>
                  <th className="py-3 px-4">Author Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => loadDetails(sub)}
                    className="hover:bg-forest/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-forest leading-snug line-clamp-1">
                        {sub.title}
                      </div>
                      <div className="text-[10px] text-charcoal-muted mt-0.5">
                        Track: <span className="font-medium text-charcoal">{sub.track}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-forest">{sub.author_name}</div>
                      <div className="text-[10px] text-charcoal-muted font-mono">{sub.author_email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadDetails(sub);
                        }}
                        className="px-3 py-1 bg-forest/5 hover:bg-forest text-forest hover:text-gold font-bold rounded-lg text-xs transition border border-forest/15"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANUSCRIPT DETAILS & EDITORIAL WORKFLOW DRAWER / MODAL */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs">

            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedSub.status)}`}>
                    {selectedSub.status}
                  </span>
                  <span className="text-[10px] text-charcoal-muted font-mono">
                    ID: {selectedSub.id.slice(0, 8)}...
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-forest leading-snug">
                  {selectedSub.title}
                </h3>
                <div className="text-charcoal-muted flex items-center space-x-2 text-[11px]">
                  <span>Author: <strong>{selectedSub.author_name}</strong></span>
                  <span>•</span>
                  <span>Email: <strong>{selectedSub.author_email}</strong></span>
                  <span>•</span>
                  <span>Submitted: {new Date(selectedSub.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                className="text-gray-400 hover:text-charcoal p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Bar (Download & Publish) */}
            <div className="p-4 bg-forest/5 rounded-2xl border border-forest/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadManuscript(selectedSub)}
                  disabled={downloadingFile}
                  className="px-4 py-2 bg-forest hover:bg-emerald-deep text-gold text-xs font-bold rounded-xl shadow-soft transition flex items-center space-x-1.5"
                >
                  {downloadingFile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Download Private Manuscript PDF</span>
                </button>
                <span className="text-[10px] text-charcoal-muted font-mono">
                  {selectedSub.file_name} ({Math.round((selectedSub.file_size_bytes || 0) / 1024)} KB)
                </span>
              </div>

              {selectedSub.status === 'Accepted' && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  <span>Convert to Published Article</span>
                </button>
              )}
            </div>

            {/* Abstract & Meta */}
            <div className="space-y-2 p-4 bg-forest/5 rounded-2xl border border-forest/15">
              <div className="font-bold text-forest text-xs">Abstract</div>
              <p className="text-charcoal-light leading-relaxed">{selectedSub.abstract}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedSub.keywords.map(k => (
                  <span key={k} className="px-2 py-0.5 rounded bg-white text-forest text-[10px] font-medium border border-gray-200">
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-Tabs: Status Workflow / Reviewers / Editorial Notes / History */}
            <div className="space-y-4">
              <div className="flex border-b border-gray-200 space-x-2 overflow-x-auto">
                <button
                  onClick={() => setActiveActionTab('status')}
                  className={`pb-2.5 px-3 font-bold transition flex items-center space-x-1.5 border-b-2 ${activeActionTab === 'status'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-charcoal-muted hover:text-forest'
                    }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Workflow Status</span>
                </button>

                <button
                  onClick={() => setActiveActionTab('reviews')}
                  className={`pb-2.5 px-3 font-bold transition flex items-center space-x-1.5 border-b-2 ${activeActionTab === 'reviews'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-charcoal-muted hover:text-forest'
                    }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Reviewers ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveActionTab('notes')}
                  className={`pb-2.5 px-3 font-bold transition flex items-center space-x-1.5 border-b-2 ${activeActionTab === 'notes'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-charcoal-muted hover:text-forest'
                    }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Editorial Notes ({notes.length})</span>
                </button>

                <button
                  onClick={() => setActiveActionTab('history')}
                  className={`pb-2.5 px-3 font-bold transition flex items-center space-x-1.5 border-b-2 ${activeActionTab === 'history'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-charcoal-muted hover:text-forest'
                    }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Audit History ({history.length})</span>
                </button>
              </div>

              {/* TAB 1: WORKFLOW STATUS */}
              {activeActionTab === 'status' && (
                <form onSubmit={handleUpdateStatus} className="p-4 bg-forest/5 rounded-2xl border border-forest/15 space-y-3">
                  <div className="font-bold text-forest">Change Workflow Status</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Target Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ManuscriptWorkflowStatus)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      >
                        {workflowStatuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Status Note / Feedback</label>
                      <input
                        type="text"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="e.g. Cleared initial screening; assigned to external reviewers."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={updatingStatus || newStatus === selectedSub.status}
                      className="px-4 py-2 bg-forest hover:bg-emerald-deep text-white font-bold rounded-xl shadow-soft transition disabled:opacity-50"
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: REVIEWERS */}
              {activeActionTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Assign Form */}
                  <form onSubmit={handleAssignReviewer} className="p-4 bg-forest/5 rounded-2xl border border-forest/15 space-y-3">
                    <div className="font-bold text-forest">Assign Double-Blind Peer Reviewer</div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Reviewer Name *"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Reviewer Email *"
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        required
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Affiliation"
                        value={reviewerAffiliation}
                        onChange={(e) => setReviewerAffiliation(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      />
                      <input
                        type="date"
                        value={reviewerDueDate}
                        onChange={(e) => setReviewerDueDate(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={addingReviewer}
                        className="px-4 py-2 bg-forest hover:bg-emerald-deep text-white font-bold rounded-xl shadow-soft transition"
                      >
                        {addingReviewer ? 'Assigning...' : 'Assign Reviewer'}
                      </button>
                    </div>
                  </form>

                  {/* Existing Reviewers */}
                  <div className="space-y-2">
                    {reviews.length === 0 ? (
                      <p className="text-charcoal-muted text-center py-4">No reviewers assigned to this manuscript yet.</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-forest/5 rounded-xl border border-forest/15 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-forest">{rev.reviewer_name}</div>
                            <div className="text-[11px] text-charcoal-muted">{rev.reviewer_email} • {rev.reviewer_affiliation || 'External Scholar'}</div>
                            {rev.due_date && <div className="text-[10px] text-amber-700">Due: {rev.due_date}</div>}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200">
                              {rev.status}
                            </span>
                            <div className="text-[10px] text-forest font-semibold mt-0.5">Rec: {rev.recommendation}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: EDITORIAL NOTES */}
              {activeActionTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddEditorialNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add confidential editorial note..."
                      value={newEditorialNote}
                      onChange={(e) => setNewEditorialNote(e.target.value)}
                      required
                      className="flex-1 px-3 py-2 bg-forest/5 border border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest"
                    />
                    <button
                      type="submit"
                      disabled={addingNote}
                      className="px-4 py-2 bg-forest hover:bg-emerald-deep text-white font-bold rounded-xl shadow-soft transition"
                    >
                      {addingNote ? 'Saving...' : 'Add Note'}
                    </button>
                  </form>

                  <div className="space-y-2">
                    {notes.length === 0 ? (
                      <p className="text-charcoal-muted text-center py-4">No editorial notes recorded yet.</p>
                    ) : (
                      notes.map((n) => (
                        <div key={n.id} className="p-3 bg-forest/5 rounded-xl border border-forest/15 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-charcoal-muted">
                            <span className="font-bold text-forest">{n.author_name}</span>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-charcoal-light leading-relaxed">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT TIMELINE */}
              {activeActionTab === 'history' && (
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-charcoal-muted text-center py-4">No status transition history recorded yet.</p>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-forest/20 space-y-4 py-2">
                      {history.map((h) => (
                        <div key={h.id} className="relative">
                          <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-forest border-2 border-white"></div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-forest">{h.to_status}</span>
                            <span className="text-[10px] text-charcoal-muted font-mono">{new Date(h.created_at).toLocaleString()}</span>
                          </div>
                          <div className="text-[11px] text-charcoal-muted">By {h.changed_by_name || 'System'}</div>
                          {h.note && <p className="text-[11px] text-charcoal-light mt-0.5 italic">{h.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* CONVERT ACCEPTED MANUSCRIPT TO PUBLISHED ARTICLE MODAL */}
      {showPublishModal && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">Publication Pipeline</span>
                <h3 className="font-editorial text-lg font-bold text-forest">Publish into Journal Issue</h3>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handlePublishAcceptedManuscript} className="space-y-3">
              <p className="text-charcoal-muted">
                Publishing <strong>"{selectedSub.title}"</strong> by <strong>{selectedSub.author_name}</strong> into the public journal repository.
              </p>

              <div>
                <label className="font-bold text-forest uppercase block mb-1">Target Journal Issue *</label>
                <select
                  value={targetIssueId}
                  onChange={(e) => setTargetIssueId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-forest/5 border border-forest/15 rounded-xl text-forest focus:border-forest focus:outline-none"
                >
                  <option value="">Select Target Issue...</option>
                  {issues.map(iss => (
                    <option key={iss.id} value={iss.id}>
                      Vol. {iss.volume_number}, Issue {iss.issue_number} ({iss.year}) — {iss.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-forest uppercase block mb-1">Page Range</label>
                <input
                  type="text"
                  value={publishPageRange}
                  onChange={(e) => setPublishPageRange(e.target.value)}
                  placeholder="e.g. 14–38"
                  className="w-full px-3 py-2 bg-forest/5 border border-forest/15 rounded-xl text-forest focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-forest uppercase block mb-1">DOI (Optional)</label>
                <input
                  type="text"
                  value={publishDoi}
                  onChange={(e) => setPublishDoi(e.target.value)}
                  placeholder="e.g. 10.5892/tamweel.2026.0302.05"
                  className="w-full px-3 py-2 bg-forest/5 border border-forest/15 rounded-xl text-forest focus:border-forest focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishingArticle || !targetIssueId}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition"
                >
                  {publishingArticle ? 'Publishing...' : 'Confirm Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
