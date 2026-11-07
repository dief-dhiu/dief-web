export type ActivityPublicationStatus = 'Draft' | 'Published' | 'Archived';

export interface ActivityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  created_at?: string;
}

export interface ActivityGalleryItem {
  id: string;
  activity_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
  created_at?: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  short_description: string;
  full_description?: string | null;
  category_id?: string | null;
  category_name: string;
  start_date: string;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  venue: string;
  speaker_details?: string | null;
  organizing_body?: string | null;
  featured_image_url?: string | null;
  registration_url?: string | null;
  contact_info?: string | null;
  status: ActivityPublicationStatus;
  is_featured: boolean;
  view_count: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  gallery?: ActivityGalleryItem[];
}

export interface ActivitiesDashboardStats {
  total: number;
  published: number;
  upcoming: number;
  past: number;
  draft: number;
  recent: ActivityRecord[];
}
