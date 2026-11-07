import { supabase } from './supabase';
import { 
  JournalIssue, 
  JournalArticleRecord, 
  JournalSubmission, 
  JournalReviewAssignment, 
  JournalEditorialNote, 
  JournalSubmissionStatusHistory,
  JournalDashboardStats,
  ManuscriptWorkflowStatus,
  IssuePublicationStatus,
  ArticlePublicationStatus
} from '../types/journal';

// ==============================================================================
// 1. AUDIT LOGGING HELPER
// ==============================================================================
export async function logJournalAudit(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      user_email: user?.email || 'System / Public Author',
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {}
    });
  } catch (err) {
    console.warn('[JournalAudit] Could not write audit log:', err);
  }
}

// ==============================================================================
// 2. STORAGE HELPERS
// ==============================================================================
export async function uploadIssueCover(file: File): Promise<string> {
  // Validate type: images only
  if (!file.type.startsWith('image/')) {
    throw new Error('Cover file must be an image (JPEG, PNG, or WebP).');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Cover image exceeds maximum 5MB size limit.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `covers/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('journal-covers')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error(`Cover upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('journal-covers')
    .getPublicUrl(filePath);

  await logJournalAudit('COVER_UPLOADED', 'storage/journal-covers', filePath, { fileName: file.name });
  return publicUrl;
}

export async function uploadPublishedArticlePdf(file: File): Promise<string> {
  // Validate type: PDF only
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Article file must be a PDF document.');
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('Article PDF exceeds maximum 25MB limit.');
  }

  const filePath = `articles/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('journal-published')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error(`PDF upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('journal-published')
    .getPublicUrl(filePath);

  await logJournalAudit('ARTICLE_PDF_UPLOADED', 'storage/journal-published', filePath, { fileName: file.name });
  return publicUrl;
}

export async function uploadManuscriptFile(file: File): Promise<{ filePath: string; fileName: string; fileSize: number }> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Manuscript file must be in PDF format.');
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('Manuscript exceeds maximum 25MB limit.');
  }

  const filePath = `submissions/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('journal-submissions')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error(`Manuscript upload failed: ${uploadError.message}`);
  }

  return {
    filePath,
    fileName: file.name,
    fileSize: file.size
  };
}

export async function getSignedManuscriptUrl(filePath: string): Promise<string> {
  // Generate a secure signed URL valid for 60 minutes
  const cleanPath = filePath.replace(/^(?:.*\/)?submissions\//, 'submissions/');
  const { data, error } = await supabase.storage
    .from('journal-submissions')
    .createSignedUrl(cleanPath, 3600);

  if (error || !data?.signedUrl) {
    // If path was full URL or different format, try raw path
    const fallback = await supabase.storage
      .from('journal-submissions')
      .createSignedUrl(filePath, 3600);
    if (fallback.error || !fallback.data?.signedUrl) {
      throw new Error(`Could not generate secure download link: ${error?.message || fallback.error?.message}`);
    }
    return fallback.data.signedUrl;
  }

  return data.signedUrl;
}

// ==============================================================================
// 3. JOURNAL DASHBOARD STATISTICS
// ==============================================================================
export async function fetchJournalDashboardStats(): Promise<JournalDashboardStats> {
  try {
    // 1. Total Issues
    const { count: totalIssues } = await supabase
      .from('journal_issues')
      .select('*', { count: 'exact', head: true });

    // 2. Total Published Articles
    const { count: totalPublishedArticles } = await supabase
      .from('journal_articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Published');

    // 3. Submissions Status Breakdown
    const { data: submissionsData } = await supabase
      .from('journal_submissions')
      .select('id, status, updated_at');

    const subs = submissionsData || [];
    const awaitingScreening = subs.filter(s => s.status === 'Submitted' || s.status === 'Initial Screening').length;
    const underReview = subs.filter(s => s.status === 'Under Review' || s.status === 'Revision Requested' || s.status === 'Revised Manuscript Received').length;
    const accepted = subs.filter(s => s.status === 'Accepted').length;
    const rejected = subs.filter(s => s.status === 'Rejected').length;

    // 4. Recently Updated Submissions
    const { data: recentSubs } = await supabase
      .from('journal_submissions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5);

    // 5. Recently Published Articles
    const { data: recentArticles } = await supabase
      .from('journal_articles')
      .select('*, issue:journal_issues(*)')
      .eq('status', 'Published')
      .order('publication_date', { ascending: false })
      .limit(5);

    return {
      totalIssues: totalIssues || 0,
      totalPublishedArticles: totalPublishedArticles || 0,
      awaitingScreening,
      underReview,
      accepted,
      rejected,
      recentlyUpdatedSubmissions: (recentSubs as JournalSubmission[]) || [],
      recentlyPublishedArticles: (recentArticles as JournalArticleRecord[]) || []
    };
  } catch (err) {
    console.error('[JournalService] fetchJournalDashboardStats failed:', err);
    return {
      totalIssues: 0,
      totalPublishedArticles: 0,
      awaitingScreening: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0,
      recentlyUpdatedSubmissions: [],
      recentlyPublishedArticles: []
    };
  }
}

// ==============================================================================
// 4. JOURNAL ISSUES CRUD
// ==============================================================================
export async function fetchJournalIssues(
  filterStatus: string = 'All',
  searchQuery: string = ''
): Promise<JournalIssue[]> {
  let query = supabase
    .from('journal_issues')
    .select('*, articles:journal_articles(count)')
    .order('year', { ascending: false })
    .order('volume_number', { ascending: false })
    .order('issue_number', { ascending: false });

  if (filterStatus !== 'All') {
    query = query.eq('status', filterStatus);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load journal issues: ${error.message}`);
  }

  let issues = (data || []).map((row: any) => ({
    ...row,
    articles_count: row.articles?.[0]?.count || 0
  })) as JournalIssue[];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    issues = issues.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        (i.theme && i.theme.toLowerCase().includes(q)) ||
        i.year.toString().includes(q) ||
        `volume ${i.volume_number}`.includes(q) ||
        `issue ${i.issue_number}`.includes(q)
    );
  }

  return issues;
}

export async function createJournalIssue(
  issue: Omit<JournalIssue, 'id' | 'created_at' | 'updated_at' | 'articles_count'>,
  coverFile?: File
): Promise<JournalIssue> {
  let coverUrl = issue.cover_image_url;
  if (coverFile) {
    coverUrl = await uploadIssueCover(coverFile);
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('journal_issues')
    .insert({
      ...issue,
      cover_image_url: coverUrl,
      created_by: user?.id || null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create issue: ${error.message}`);
  }

  await logJournalAudit('ISSUE_CREATED', 'journal_issues', data.id, {
    volume: data.volume_number,
    issue: data.issue_number,
    year: data.year,
    title: data.title,
    status: data.status
  });

  return data as JournalIssue;
}

export async function updateJournalIssue(
  id: string,
  issueUpdates: Partial<JournalIssue>,
  coverFile?: File
): Promise<JournalIssue> {
  let coverUrl = issueUpdates.cover_image_url;
  if (coverFile) {
    coverUrl = await uploadIssueCover(coverFile);
  }

  const { data, error } = await supabase
    .from('journal_issues')
    .update({
      ...issueUpdates,
      cover_image_url: coverUrl
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update issue: ${error.message}`);
  }

  await logJournalAudit('ISSUE_UPDATED', 'journal_issues', id, {
    title: data.title,
    status: data.status
  });

  return data as JournalIssue;
}

export async function deleteJournalIssue(id: string): Promise<void> {
  const { error } = await supabase
    .from('journal_issues')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete issue: ${error.message}`);
  }

  await logJournalAudit('ISSUE_DELETED', 'journal_issues', id);
}

// ==============================================================================
// 5. ARTICLES MANAGEMENT CRUD
// ==============================================================================
export async function fetchJournalArticles(
  filterStatus: string = 'All',
  searchQuery: string = '',
  issueId?: string
): Promise<JournalArticleRecord[]> {
  let query = supabase
    .from('journal_articles')
    .select('*, issue:journal_issues(*)')
    .order('publication_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filterStatus !== 'All') {
    query = query.eq('status', filterStatus);
  }

  if (issueId) {
    query = query.eq('issue_id', issueId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load articles: ${error.message}`);
  }

  let articles = (data || []) as JournalArticleRecord[];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.abstract.toLowerCase().includes(q) ||
        a.authors.some(author => author.toLowerCase().includes(q)) ||
        a.keywords.some(k => k.toLowerCase().includes(q)) ||
        (a.doi && a.doi.toLowerCase().includes(q))
    );
  }

  return articles;
}

export async function fetchPublicPublishedArticles(): Promise<JournalArticleRecord[]> {
  const { data, error } = await supabase
    .from('journal_articles')
    .select('*, issue:journal_issues(*)')
    .eq('status', 'Published')
    .order('publication_date', { ascending: false });

  if (error) {
    console.error('[JournalService] fetchPublicPublishedArticles failed:', error.message);
    throw new Error(`Failed to load published journal articles: ${error.message}`);
  }

  return (data || []) as JournalArticleRecord[];
}

export async function fetchPublicPublishedIssues(): Promise<JournalIssue[]> {
  const { data, error } = await supabase
    .from('journal_issues')
    .select('*, articles:journal_articles(count)')
    .eq('status', 'Published')
    .order('year', { ascending: false })
    .order('volume_number', { ascending: false })
    .order('issue_number', { ascending: false });

  if (error) {
    console.error('[JournalService] fetchPublicPublishedIssues failed:', error.message);
    throw new Error(`Failed to load published journal issues: ${error.message}`);
  }

  return (data || []).map((row: any) => ({
    ...row,
    articles_count: row.articles?.[0]?.count || 0
  })) as JournalIssue[];
}

export async function createJournalArticle(
  article: Omit<JournalArticleRecord, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'download_count'>,
  pdfFile?: File
): Promise<JournalArticleRecord> {
  let pdfUrl = article.pdf_url;
  if (pdfFile) {
    pdfUrl = await uploadPublishedArticlePdf(pdfFile);
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('journal_articles')
    .insert({
      ...article,
      pdf_url: pdfUrl,
      created_by: user?.id || null
    })
    .select('*, issue:journal_issues(*)')
    .single();

  if (error) {
    throw new Error(`Failed to create article: ${error.message}`);
  }

  await logJournalAudit('ARTICLE_CREATED', 'journal_articles', data.id, {
    title: data.title,
    status: data.status,
    issue_id: data.issue_id
  });

  return data as JournalArticleRecord;
}

export async function updateJournalArticle(
  id: string,
  updates: Partial<JournalArticleRecord>,
  pdfFile?: File
): Promise<JournalArticleRecord> {
  let pdfUrl = updates.pdf_url;
  if (pdfFile) {
    pdfUrl = await uploadPublishedArticlePdf(pdfFile);
  }

  const { data, error } = await supabase
    .from('journal_articles')
    .update({
      ...updates,
      pdf_url: pdfUrl
    })
    .eq('id', id)
    .select('*, issue:journal_issues(*)')
    .single();

  if (error) {
    throw new Error(`Failed to update article: ${error.message}`);
  }

  await logJournalAudit('ARTICLE_UPDATED', 'journal_articles', id, {
    title: data.title,
    status: data.status
  });

  return data as JournalArticleRecord;
}

export async function deleteJournalArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from('journal_articles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete article: ${error.message}`);
  }

  await logJournalAudit('ARTICLE_DELETED', 'journal_articles', id);
}

// ==============================================================================
// 6. MANUSCRIPT SUBMISSIONS & EDITORIAL WORKFLOW
// ==============================================================================
export async function submitPublicManuscript(
  formData: {
    title: string;
    abstract: string;
    keywords: string[];
    author_name: string;
    author_email: string;
    author_affiliation?: string;
    author_phone?: string;
    track: string;
  },
  file: File
): Promise<JournalSubmission> {
  const uploadRes = await uploadManuscriptFile(file);

  const { data, error } = await supabase
    .from('journal_submissions')
    .insert({
      title: formData.title,
      abstract: formData.abstract,
      keywords: formData.keywords,
      author_name: formData.author_name,
      author_email: formData.author_email,
      author_affiliation: formData.author_affiliation || null,
      author_phone: formData.author_phone || null,
      track: formData.track,
      file_url: uploadRes.filePath,
      file_name: uploadRes.fileName,
      file_size_bytes: uploadRes.fileSize,
      status: 'Submitted'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Manuscript submission failed: ${error.message}`);
  }

  // Create initial status history entry
  await supabase.from('journal_submission_status_history').insert({
    submission_id: data.id,
    from_status: null,
    to_status: 'Submitted',
    changed_by_name: formData.author_name,
    note: 'Initial public manuscript submission received.'
  });

  await logJournalAudit('MANUSCRIPT_SUBMITTED', 'journal_submissions', data.id, {
    title: data.title,
    author: formData.author_name,
    email: formData.author_email
  });

  return data as JournalSubmission;
}

export async function fetchJournalSubmissions(
  filterStatus: string = 'All',
  searchQuery: string = ''
): Promise<JournalSubmission[]> {
  let query = supabase
    .from('journal_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (filterStatus !== 'All') {
    query = query.eq('status', filterStatus);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load submissions: ${error.message}`);
  }

  let subs = (data || []) as JournalSubmission[];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    subs = subs.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.author_name.toLowerCase().includes(q) ||
        s.author_email.toLowerCase().includes(q) ||
        (s.author_affiliation && s.author_affiliation.toLowerCase().includes(q)) ||
        s.keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  return subs;
}

export async function fetchSubmissionDetails(submissionId: string): Promise<{
  submission: JournalSubmission;
  reviewAssignments: JournalReviewAssignment[];
  editorialNotes: JournalEditorialNote[];
  statusHistory: JournalSubmissionStatusHistory[];
}> {
  // 1. Fetch submission
  const { data: sub, error: subErr } = await supabase
    .from('journal_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (subErr || !sub) {
    throw new Error(`Manuscript not found: ${subErr?.message}`);
  }

  // 2. Fetch reviews
  const { data: reviews } = await supabase
    .from('journal_review_assignments')
    .select('*')
    .eq('submission_id', submissionId)
    .order('assigned_at', { ascending: false });

  // 3. Fetch notes
  const { data: notes } = await supabase
    .from('journal_editorial_notes')
    .select('*')
    .eq('submission_id', submissionId)
    .order('created_at', { ascending: false });

  // 4. Fetch history
  const { data: history } = await supabase
    .from('journal_submission_status_history')
    .select('*')
    .eq('submission_id', submissionId)
    .order('created_at', { ascending: false });

  return {
    submission: sub as JournalSubmission,
    reviewAssignments: (reviews as JournalReviewAssignment[]) || [],
    editorialNotes: (notes as JournalEditorialNote[]) || [],
    statusHistory: (history as JournalSubmissionStatusHistory[]) || []
  };
}

export async function updateSubmissionStatus(
  submissionId: string,
  newStatus: ManuscriptWorkflowStatus,
  currentUserId?: string,
  currentUserName?: string,
  note?: string
): Promise<void> {
  // Get current status first
  const { data: current } = await supabase
    .from('journal_submissions')
    .select('status')
    .eq('id', submissionId)
    .single();

  const fromStatus = current?.status || null;

  // Update submission status
  const { error: updateErr } = await supabase
    .from('journal_submissions')
    .update({ status: newStatus })
    .eq('id', submissionId);

  if (updateErr) {
    throw new Error(`Failed to change manuscript status: ${updateErr.message}`);
  }

  // Record history entry
  await supabase.from('journal_submission_status_history').insert({
    submission_id: submissionId,
    from_status: fromStatus,
    to_status: newStatus,
    changed_by: currentUserId || null,
    changed_by_name: currentUserName || 'Department Editor',
    note: note || `Status changed from "${fromStatus}" to "${newStatus}"`
  });

  await logJournalAudit('MANUSCRIPT_STATUS_CHANGED', 'journal_submissions', submissionId, {
    from: fromStatus,
    to: newStatus,
    note
  });
}

export async function addEditorialNote(
  submissionId: string,
  note: string,
  authorId?: string,
  authorName: string = 'Editorial Board'
): Promise<JournalEditorialNote> {
  const { data, error } = await supabase
    .from('journal_editorial_notes')
    .insert({
      submission_id: submissionId,
      author_id: authorId || null,
      author_name: authorName,
      note,
      is_confidential: true
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add editorial note: ${error.message}`);
  }

  await logJournalAudit('EDITORIAL_NOTE_ADDED', 'journal_editorial_notes', data.id, {
    submission_id: submissionId
  });

  return data as JournalEditorialNote;
}

export async function assignReviewer(
  assignment: Omit<JournalReviewAssignment, 'id' | 'assigned_at' | 'completed_at'>
): Promise<JournalReviewAssignment> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('journal_review_assignments')
    .insert({
      ...assignment,
      assigned_by: user?.id || null,
      status: 'Invited',
      recommendation: 'Pending'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to assign reviewer: ${error.message}`);
  }

  await logJournalAudit('REVIEWER_ASSIGNED', 'journal_review_assignments', data.id, {
    submission_id: assignment.submission_id,
    reviewer_name: assignment.reviewer_name,
    reviewer_email: assignment.reviewer_email
  });

  return data as JournalReviewAssignment;
}

export async function convertSubmissionToPublishedArticle(
  submissionId: string,
  targetIssueId: string,
  pageRange?: string,
  doi?: string
): Promise<JournalArticleRecord> {
  // 1. Fetch submission details
  const { data: sub, error: subErr } = await supabase
    .from('journal_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (subErr || !sub) {
    throw new Error('Manuscript record not found');
  }

  // 2. Fetch issue details
  const { data: issue, error: issueErr } = await supabase
    .from('journal_issues')
    .select('*')
    .eq('id', targetIssueId)
    .single();

  if (issueErr || !issue) {
    throw new Error('Target journal issue not found');
  }

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Create published article record
  const { data: newArticle, error: articleErr } = await supabase
    .from('journal_articles')
    .insert({
      issue_id: targetIssueId,
      submission_id: submissionId,
      title: sub.title,
      authors: [sub.author_name],
      author_affiliations: sub.author_affiliation || 'Darul Huda Islamic University',
      abstract: sub.abstract,
      keywords: sub.keywords || [],
      doi: doi || null,
      page_range: pageRange || '01–20',
      pdf_url: sub.file_url, // Or admin uploads revised final copy
      category: sub.track || 'Theoretical Jurisprudence',
      publication_date: issue.publication_date || new Date().toISOString().split('T')[0],
      status: 'Published',
      created_by: user?.id || null
    })
    .select('*, issue:journal_issues(*)')
    .single();

  if (articleErr) {
    throw new Error(`Failed to create published article: ${articleErr.message}`);
  }

  // 4. Update submission status to 'Published'
  await updateSubmissionStatus(
    submissionId,
    'Published',
    user?.id,
    user?.email,
    `Converted into published article in Volume ${issue.volume_number}, Issue ${issue.issue_number} (${issue.year})`
  );

  await logJournalAudit('MANUSCRIPT_PUBLISHED', 'journal_articles', newArticle.id, {
    submission_id: submissionId,
    issue_id: targetIssueId,
    article_title: newArticle.title
  });

  return newArticle as JournalArticleRecord;
}
