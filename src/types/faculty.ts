export type FacultyPublicationStatus = 'Draft' | 'Published' | 'Archived';

export interface FacultyCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  created_at?: string;
}

export interface FacultyProfile {
  id: string;
  full_name: string;
  designation: string;
  department: string;
  category_id?: string | null;
  category_name: string;
  employment_type?: string | null;
  photo_url?: string | null;
  short_bio?: string | null;
  full_bio?: string | null;
  qualifications?: string | null;
  specializations?: string | null;
  research_interests?: string | null;
  publications?: string | null;
  email?: string | null;
  office_info?: string | null;
  profile_links?: string | null;
  display_order: number;
  status: FacultyPublicationStatus;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacultyDashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  recent: FacultyProfile[];
}
