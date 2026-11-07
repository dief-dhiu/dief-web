export type IssuePublicationStatus = 'Draft' | 'Published' | 'Archived';
export type ArticlePublicationStatus = 'Draft' | 'Published' | 'Archived';

export type ManuscriptWorkflowStatus =
  | 'Submitted'
  | 'Initial Screening'
  | 'Under Review'
  | 'Revision Requested'
  | 'Revised Manuscript Received'
  | 'Accepted'
  | 'Rejected'
  | 'Published';

export interface JournalIssue {
  id: string;
  volume_number: number;
  issue_number: number;
  year: number;
  title: string;
  theme?: string | null;
  editorial_introduction?: string | null;
  cover_image_url?: string | null;
  publication_date: string;
  status: IssuePublicationStatus;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  articles_count?: number;
}

export interface JournalArticleRecord {
  id: string;
  issue_id?: string | null;
  title: string;
  authors: string[];
  author_affiliations?: string | null;
  abstract: string;
  keywords: string[];
  doi?: string | null;
  page_range?: string | null;
  pdf_url?: string | null;
  category?: string | null;
  publication_date: string;
  status: ArticlePublicationStatus;
  view_count: number;
  download_count: number;
  submission_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  issue?: JournalIssue | null;
}

export interface JournalSubmission {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  author_name: string;
  author_email: string;
  author_affiliation?: string | null;
  author_phone?: string | null;
  track: string;
  file_url: string;
  file_name: string;
  file_size_bytes?: number | null;
  status: ManuscriptWorkflowStatus;
  assigned_editor_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalReviewAssignment {
  id: string;
  submission_id: string;
  reviewer_name: string;
  reviewer_email: string;
  reviewer_affiliation?: string | null;
  assigned_by?: string | null;
  status: 'Invited' | 'Accepted' | 'Declined' | 'Completed';
  recommendation: 'Pending' | 'Accept' | 'Minor Revisions' | 'Major Revisions' | 'Reject';
  review_comments_to_author?: string | null;
  confidential_comments_to_editor?: string | null;
  assigned_at: string;
  due_date?: string | null;
  completed_at?: string | null;
}

export interface JournalEditorialNote {
  id: string;
  submission_id: string;
  author_id?: string | null;
  author_name: string;
  note: string;
  is_confidential: boolean;
  created_at: string;
}

export interface JournalSubmissionStatusHistory {
  id: string;
  submission_id: string;
  from_status?: string | null;
  to_status: ManuscriptWorkflowStatus;
  changed_by?: string | null;
  changed_by_name?: string | null;
  note?: string | null;
  created_at: string;
}

export interface JournalDashboardStats {
  totalIssues: number;
  totalPublishedArticles: number;
  awaitingScreening: number;
  underReview: number;
  accepted: number;
  rejected: number;
  recentlyUpdatedSubmissions: JournalSubmission[];
  recentlyPublishedArticles: JournalArticleRecord[];
}
