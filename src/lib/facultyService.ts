import { supabase } from './supabase';
import {
  FacultyProfile,
  FacultyCategory,
  FacultyDashboardStats,
  FacultyPublicationStatus
} from '../types/faculty';

// ==============================================================================
// 1. AUDIT LOGGING
// ==============================================================================
export async function logFacultyAudit(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      user_email: user?.email || 'System / Administrator',
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {}
    });
  } catch (err) {
    console.warn('[FacultyAudit] Could not write audit log:', err);
  }
}

// ==============================================================================
// 2. STORAGE — PROFILE PHOTOGRAPHS
// ==============================================================================
export async function uploadFacultyPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Profile photo must be an image file (JPEG, PNG, WebP).');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Profile photo must not exceed 5 MB.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `photos/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('faculty')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('faculty')
    .getPublicUrl(filePath);

  await logFacultyAudit('PHOTO_UPLOADED', 'storage/faculty', filePath, {
    fileName: file.name,
    fileSize: file.size
  });

  return publicUrl;
}

export async function deleteFacultyStoragePhoto(photoUrl: string): Promise<void> {
  try {
    const marker = '/faculty/';
    const index = photoUrl.indexOf(marker);
    if (index === -1) return;
    const relativePath = decodeURIComponent(photoUrl.substring(index + marker.length));
    await supabase.storage.from('faculty').remove([relativePath]);
    await logFacultyAudit('PHOTO_DELETED', 'storage/faculty', relativePath);
  } catch (err) {
    console.warn('[FacultyStorage] Could not remove photo from storage:', err);
  }
}

// ==============================================================================
// 3. CATEGORIES
// ==============================================================================
export async function fetchFacultyCategories(): Promise<FacultyCategory[]> {
  try {
    const { data, error } = await supabase
      .from('faculty_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as FacultyCategory[];
  } catch (err) {
    console.warn('[FacultyService] fetchFacultyCategories fallback:', err);
  }

  // Fallback matching migration seed
  return [
    { id: 'fcat-1', name: 'Head of Department',   slug: 'head-of-department',  display_order: 1 },
    { id: 'fcat-2', name: 'Faculty Members',       slug: 'faculty-members',     display_order: 2 },
    { id: 'fcat-3', name: 'Visiting Faculty',      slug: 'visiting-faculty',    display_order: 3 },
    { id: 'fcat-4', name: 'Research Associates',   slug: 'research-associates', display_order: 4 },
    { id: 'fcat-5', name: 'Administrative Staff',  slug: 'administrative-staff',display_order: 5 }
  ];
}

export async function createFacultyCategory(
  name: string,
  description?: string
): Promise<FacultyCategory> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Category name is required.');
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('faculty_categories')
    .insert({ name: trimmed, slug, description: description?.trim() || null })
    .select()
    .single();

  if (error) throw new Error(`Failed to create category: ${error.message}`);
  await logFacultyAudit('CATEGORY_CREATED', 'faculty_categories', data.id, { name: trimmed });
  return data as FacultyCategory;
}

export async function deleteFacultyCategory(id: string): Promise<void> {
  const { error } = await supabase.from('faculty_categories').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete category: ${error.message}`);
  await logFacultyAudit('CATEGORY_DELETED', 'faculty_categories', id);
}

// ==============================================================================
// 4. DASHBOARD STATS
// ==============================================================================
export async function fetchFacultyDashboardStats(): Promise<FacultyDashboardStats> {
  try {
    const { count: total }     = await supabase.from('faculty_profiles').select('*', { count: 'exact', head: true });
    const { count: published } = await supabase.from('faculty_profiles').select('*', { count: 'exact', head: true }).eq('status', 'Published');
    const { count: draft }     = await supabase.from('faculty_profiles').select('*', { count: 'exact', head: true }).eq('status', 'Draft');
    const { count: archived }  = await supabase.from('faculty_profiles').select('*', { count: 'exact', head: true }).eq('status', 'Archived');

    const { data: recentData } = await supabase
      .from('faculty_profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5);

    return {
      total:     total     || 0,
      published: published || 0,
      draft:     draft     || 0,
      archived:  archived  || 0,
      recent:    (recentData as FacultyProfile[]) || []
    };
  } catch (err) {
    console.warn('[FacultyService] fetchFacultyDashboardStats failed:', err);
    return { total: 0, published: 0, draft: 0, archived: 0, recent: [] };
  }
}

// ==============================================================================
// 5. ADMIN CRUD
// ==============================================================================
export interface FacultyProfileFilter {
  searchQuery?: string;
  categoryName?: string;
  status?: string;
  sortBy?: 'display_order' | 'full_name' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export async function fetchAdminFacultyProfiles(
  filter: FacultyProfileFilter = {}
): Promise<FacultyProfile[]> {
  try {
    let query = supabase.from('faculty_profiles').select('*');

    if (filter.status && filter.status !== 'All') {
      query = query.eq('status', filter.status);
    }
    if (filter.categoryName && filter.categoryName !== 'All') {
      query = query.eq('category_name', filter.categoryName);
    }
    if (filter.searchQuery?.trim()) {
      const q = filter.searchQuery.trim();
      query = query.or(`full_name.ilike.%${q}%,designation.ilike.%${q}%,specializations.ilike.%${q}%,research_interests.ilike.%${q}%`);
    }

    const sortCol   = filter.sortBy    || 'display_order';
    const ascending = (filter.sortOrder || 'asc') === 'asc';
    query = query.order(sortCol, { ascending });

    const { data, error } = await query;
    if (error) throw error;
    return (data as FacultyProfile[]) || [];
  } catch (err) {
    console.error('[FacultyService] fetchAdminFacultyProfiles failed:', err);
    return [];
  }
}

export async function fetchFacultyProfileById(id: string): Promise<FacultyProfile | null> {
  const { data, error } = await supabase
    .from('faculty_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as FacultyProfile;
}

export interface FacultyProfileInput {
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
}

export async function createFacultyProfile(
  input: FacultyProfileInput,
  photoFile?: File | null
): Promise<FacultyProfile> {
  const { data: { user } } = await supabase.auth.getUser();

  let photoUrl = input.photo_url || null;
  if (photoFile) {
    photoUrl = await uploadFacultyPhoto(photoFile);
  }

  const payload = {
    full_name:          input.full_name.trim(),
    designation:        input.designation.trim(),
    department:         input.department.trim(),
    category_id:        input.category_id  || null,
    category_name:      input.category_name.trim(),
    employment_type:    input.employment_type?.trim()  || null,
    photo_url:          photoUrl,
    short_bio:          input.short_bio?.trim()        || null,
    full_bio:           input.full_bio?.trim()         || null,
    qualifications:     input.qualifications?.trim()   || null,
    specializations:    input.specializations?.trim()  || null,
    research_interests: input.research_interests?.trim() || null,
    publications:       input.publications?.trim()     || null,
    email:              input.email?.trim()            || null,
    office_info:        input.office_info?.trim()      || null,
    profile_links:      input.profile_links?.trim()    || null,
    display_order:      input.display_order,
    status:             input.status,
    created_by:         user?.id || null
  };

  const { data, error } = await supabase
    .from('faculty_profiles')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);

  await logFacultyAudit('PROFILE_CREATED', 'faculty_profiles', data.id, {
    name: data.full_name,
    status: data.status
  });

  return data as FacultyProfile;
}

export async function updateFacultyProfile(
  id: string,
  updates: Partial<FacultyProfileInput>,
  photoFile?: File | null
): Promise<FacultyProfile> {
  let photoUrl = updates.photo_url;

  if (photoFile) {
    photoUrl = await uploadFacultyPhoto(photoFile);
  }

  const payload: Record<string, any> = {
    ...updates,
    photo_url:   photoUrl,
    updated_at:  new Date().toISOString()
  };

  // Trim text fields
  const textFields: (keyof FacultyProfileInput)[] = [
    'full_name', 'designation', 'department', 'category_name', 'employment_type',
    'short_bio', 'full_bio', 'qualifications', 'specializations',
    'research_interests', 'publications', 'email', 'office_info', 'profile_links'
  ];
  textFields.forEach(f => {
    if (payload[f] !== undefined && payload[f] !== null) {
      payload[f] = String(payload[f]).trim() || null;
    }
  });

  const { data, error } = await supabase
    .from('faculty_profiles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update profile: ${error.message}`);

  await logFacultyAudit('PROFILE_UPDATED', 'faculty_profiles', id, {
    changes: Object.keys(updates),
    status: data.status
  });

  return data as FacultyProfile;
}

export async function setFacultyProfileStatus(
  id: string,
  status: FacultyPublicationStatus
): Promise<void> {
  const { error } = await supabase
    .from('faculty_profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Could not update status: ${error.message}`);
  await logFacultyAudit('PROFILE_STATUS_CHANGED', 'faculty_profiles', id, { new_status: status });
}

export async function deleteFacultyProfile(id: string): Promise<void> {
  const profile = await fetchFacultyProfileById(id);

  const { error } = await supabase.from('faculty_profiles').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete profile: ${error.message}`);

  await logFacultyAudit('PROFILE_DELETED', 'faculty_profiles', id, {
    name: profile?.full_name || id
  });
}

// ==============================================================================
// 6. PUBLIC PORTAL — with verified fallback
// ==============================================================================
export async function fetchPublicFacultyProfiles(filter?: {
  categoryName?: string;
  searchQuery?: string;
}): Promise<FacultyProfile[]> {
  try {
    let query = supabase
      .from('faculty_profiles')
      .select('*')
      .eq('status', 'Published');

    if (filter?.categoryName && filter.categoryName !== 'All') {
      query = query.eq('category_name', filter.categoryName);
    }
    if (filter?.searchQuery?.trim()) {
      const q = filter.searchQuery.trim();
      query = query.or(`full_name.ilike.%${q}%,designation.ilike.%${q}%,specializations.ilike.%${q}%`);
    }

    query = query.order('display_order', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return data as FacultyProfile[];
  } catch (err) {
    console.warn('[FacultyService] fetchPublicFacultyProfiles fallback to seed data:', err);
  }

  // Verified fallback matching the migration seed data
  return getVerifiedSeedFaculty();
}

function getVerifiedSeedFaculty(): FacultyProfile[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'seed-fac-1',
      full_name: 'Anas Hudawi Nellikkuth',
      designation: 'Head of Department',
      department: 'Department of Islamic Economics and Finance',
      category_name: 'Head of Department',
      employment_type: 'Full-time',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      short_bio: 'Head of the Department of Islamic Economics and Finance at Darul Huda Islamic University, leading academic and administrative functions of the department.',
      qualifications: 'P.G. in Economics, Calicut University',
      specializations: 'Islamic Economics & Finance, Applied Banking Operations, Public Training Leadership',
      research_interests: 'Islamic Banking, Ethical Finance, Cooperative Credit Institutions',
      email: 'islamiceco@darulhudaiu.ac.in',
      office_info: '+91 81295 95547',
      display_order: 1,
      status: 'Published',
      created_at: now,
      updated_at: now
    },
    {
      id: 'seed-fac-2',
      full_name: 'Dr. K.P. Jafar Hudawi Kolathur',
      designation: 'Dean of Kulliyya of Sharia',
      department: 'Kulliyya of Sharia, Darul Huda Islamic University',
      category_name: 'Faculty Members',
      employment_type: 'Full-time',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      short_bio: 'Dean of the Kulliyya of Sharia and former Head of the Department of Islamic Economics and Finance.',
      qualifications: 'Ph.D. in Arabic',
      specializations: 'Classical Jurisprudence, Sharia Frameworks, Curricular Systematization',
      research_interests: 'Fiqh al-Muamalat, Sharia Governance, Classical Islamic Legal Scholarship',
      email: 'islamiceco@darulhudaiu.ac.in',
      office_info: '+91 99462 92164',
      display_order: 2,
      status: 'Published',
      created_at: now,
      updated_at: now
    },
    {
      id: 'seed-fac-3',
      full_name: 'Dr. Rasheed',
      designation: 'Faculty Member',
      department: 'Department of Islamic Economics and Finance',
      category_name: 'Faculty Members',
      employment_type: 'Full-time',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
      short_bio: 'Faculty member specialising in comparative economic systems and monetary economics.',
      qualifications: 'Ph.D. in Economics, Calicut University',
      specializations: 'Comparative Economic Systems, Quantitative Analysis, Monetary Economics',
      research_interests: 'Islamic Monetary Economics, Comparative Finance, Macroeconomic Policy',
      email: 'islamiceco@darulhudaiu.ac.in',
      office_info: 'Contact Secretariat',
      display_order: 3,
      status: 'Published',
      created_at: now,
      updated_at: now
    },
    {
      id: 'seed-fac-4',
      full_name: 'K.C. Muhammed Baqawi',
      designation: 'Founding Department Leader',
      department: 'Department of Islamic Economics and Finance',
      category_name: 'Faculty Members',
      employment_type: 'Full-time',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      short_bio: 'Founding leader of the department, scholar of Islamic sciences and classical jurisprudence.',
      qualifications: 'Scholar of Islamic Sciences & Classical Jurisprudence',
      specializations: 'Fiqh al-Muamalat Foundations, Economic Behavior in Islam',
      research_interests: 'Islamic Economic Thought, Classical Contract Law, Ethical Finance Foundations',
      email: 'islamiceco@darulhudaiu.ac.in',
      display_order: 4,
      status: 'Published',
      created_at: now,
      updated_at: now
    }
  ];
}
