import { User, Session } from '@supabase/supabase-js';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'JOURNAL_EDITOR'
  | 'CONTENT_EDITOR'
  | 'EVENTS_MANAGER'
  | 'RESOURCE_MANAGER';

export interface AdminRoleRecord {
  id: string; // UUID primary key
  user_id: string; // UUID references auth.users
  role: AdminRole;
  full_name?: string | null;
  assigned_by?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  email: string;
  role: AdminRole;
  fullName: string;
  isActive: boolean;
  assignedBy?: string | null;
  createdAt: string;
}

export type AdminRouteId =
  | 'dashboard'
  | 'journal'
  | 'activities'
  | 'faculty'
  | 'enquiries'
  | 'settings';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  role: AdminRole | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  hasPermission: (requiredRoles: AdminRole[]) => boolean;
  canAccessRoute: (route: AdminRouteId) => boolean;
}

/**
 * Route Permission Mapping:
 * Which roles are permitted to access each administrative module.
 */
export const ROUTE_PERMISSIONS: Record<AdminRouteId, AdminRole[]> = {
  dashboard: ['SUPER_ADMIN', 'JOURNAL_EDITOR', 'CONTENT_EDITOR', 'EVENTS_MANAGER', 'RESOURCE_MANAGER'],
  journal: ['SUPER_ADMIN', 'JOURNAL_EDITOR', 'CONTENT_EDITOR'],
  activities: ['SUPER_ADMIN', 'EVENTS_MANAGER', 'CONTENT_EDITOR'],
  faculty: ['SUPER_ADMIN', 'CONTENT_EDITOR'],
  enquiries: ['SUPER_ADMIN', 'CONTENT_EDITOR'],
  settings: ['SUPER_ADMIN']
};
