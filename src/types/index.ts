export type PageId =
  | 'home'
  | 'about'
  | 'dhib'
  | 'sbc'
  | 'tamweel'
  | 'activities'
  | 'contact';

export interface EventItem {
  id: string;
  title: string;
  category: 'Seminars' | 'Conferences' | 'Workshops' | 'Guest Lectures' | 'Student Activities' | 'Internships' | 'Academic Visits' | 'Research Events';
  date: string;
  year: number;
  time?: string;
  venue: string;
  description: string;
  fullDetails?: string;
  speakerPlaceholder?: string;
  image: string;
  isUpcoming?: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  publicationDate: string;
  volume: number;
  issue: number;
  year: number;
  pages: string;
  doi?: string;
  category: string;
  pdfUrl?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Research Papers' | 'Books and Reading Materials' | 'Islamic Economics Resources' | 'Islamic Finance Resources' | 'Academic Reports' | 'Lecture Materials' | 'Journal Publications';
  author: string;
  year: number;
  fileType: string;
  fileSize: string;
  language: string;
  description: string;
  downloadUrl?: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  organization: string;
  areaOfEnquiry: string;
  projectScope: string;
  message: string;
  submittedAt: string;
  status: 'Pending Review' | 'In Discussion' | 'Resolved';
}

export interface PaperSubmission {
  id: string;
  title: string;
  authors: string;
  correspondingEmail: string;
  affiliation: string;
  track: string;
  abstractText: string;
  keywords: string;
  fileName: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Revision Requested' | 'Accepted';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialization: string;
  status: string;
  image: string;
  emailPlaceholder: string;
  phone?: string;
}

export * from './auth';
export * from './journal';
export * from './activity';
export * from './faculty';
