import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, getSupabaseConfigStatus } from '../lib/supabase';
import { 
  AuthContextType, 
  AdminProfile, 
  AdminRole, 
  AdminRoleRecord, 
  AdminRouteId, 
  ROUTE_PERMISSIONS 
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch verified role record from the database
  const fetchAdminRole = useCallback(async (currentUserId: string, currentUserEmail?: string): Promise<{ profile: AdminProfile | null; role: AdminRole | null }> => {
    try {
      const { data, error: roleError } = await supabase
        .from('admin_roles')
        .select('id, user_id, role, full_name, assigned_by, is_active, created_at, updated_at')
        .eq('user_id', currentUserId)
        .eq('is_active', true)
        .maybeSingle();

      if (roleError) {
        console.error('[AuthContext] Role verification error:', roleError.message);
        return { profile: null, role: null };
      }

      if (!data) {
        console.warn(`[AuthContext] User ${currentUserId} (${currentUserEmail}) has no active entry in admin_roles.`);
        return { profile: null, role: null };
      }

      const roleRecord = data as AdminRoleRecord;
      const adminProfile: AdminProfile = {
        id: roleRecord.id,
        userId: roleRecord.user_id,
        email: currentUserEmail || '',
        role: roleRecord.role,
        fullName: roleRecord.full_name || 'Department Administrator',
        isActive: roleRecord.is_active,
        assignedBy: roleRecord.assigned_by,
        createdAt: roleRecord.created_at
      };

      return { profile: adminProfile, role: roleRecord.role };
    } catch (err) {
      console.error('[AuthContext] Unexpected error querying admin_roles:', err);
      return { profile: null, role: null };
    }
  }, []);

  // Initialize and restore session on mount
  useEffect(() => {
    let isMounted = true;
    const configStatus = getSupabaseConfigStatus();

    if (!configStatus.isConfigured) {
      console.warn('[AuthContext] Supabase is not fully configured:', configStatus.error);
      setIsLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          setUser(initialSession.user);
          const { profile: userProfile, role: userRole } = await fetchAdminRole(
            initialSession.user.id,
            initialSession.user.email
          );
          if (isMounted) {
            setProfile(userProfile);
            setRole(userRole);
          }
        }
      } catch (err) {
        if (isMounted) {
          const authErr = err as AuthError;
          console.error('[AuthContext] Session restoration failed:', authErr.message);
          setError(authErr.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen to real-time auth state events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
        setIsLoading(false);
        return;
      }

      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        const { profile: userProfile, role: userRole } = await fetchAdminRole(
          newSession.user.id,
          newSession.user.email
        );
        if (isMounted) {
          setProfile(userProfile);
          setRole(userRole);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAdminRole]);

  // Login with email and password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsLoading(true);

    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.isConfigured) {
      const msg = configStatus.error || 'Supabase backend connection is not configured.';
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (signInError) {
        let userMessage = signInError.message;
        if (signInError.message.includes('Invalid login credentials')) {
          userMessage = 'Invalid email or password. Please verify your credentials.';
        } else if (signInError.message.includes('Email not confirmed')) {
          userMessage = 'Account email address has not been confirmed.';
        }
        setError(userMessage);
        setIsLoading(false);
        return { success: false, error: userMessage };
      }

      if (!data.user) {
        setError('Authentication returned no active user profile.');
        setIsLoading(false);
        return { success: false, error: 'Authentication returned no active user.' };
      }

      // Verify administrative role
      const { profile: userProfile, role: userRole } = await fetchAdminRole(data.user.id, data.user.email);

      if (!userRole) {
        // Authenticated in Auth, but not authorized in admin_roles table
        console.warn(`[AuthContext] User ${data.user.email} successfully logged in but lacks an active admin role.`);
        setSession(data.session);
        setUser(data.user);
        setProfile(null);
        setRole(null);
        setIsLoading(false);
        return {
          success: true, // Login succeeded, but role is null (ProtectedRoute will present Unauthorized screen)
        };
      }

      setSession(data.session);
      setUser(data.user);
      setProfile(userProfile);
      setRole(userRole);
      setIsLoading(false);

      // Record audit log entry
      try {
        await supabase.from('audit_logs').insert({
          user_id: data.user.id,
          user_email: data.user.email,
          action: 'ADMIN_LOGIN_SUCCESS',
          entity_type: 'auth',
          details: { role: userRole, timestamp: new Date().toISOString() }
        });
      } catch (auditErr) {
        console.warn('[AuthContext] Audit log write warning:', auditErr);
      }

      return { success: true };
    } catch (err) {
      const generalErr = err as Error;
      const errorMsg = generalErr.message || 'An unexpected authentication error occurred.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Logout and invalidate session
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (user) {
        try {
          await supabase.from('audit_logs').insert({
            user_id: user.id,
            user_email: user.email,
            action: 'ADMIN_LOGOUT',
            entity_type: 'auth',
            details: { timestamp: new Date().toISOString() }
          });
        } catch {
          // Continue with sign out even if audit fails
        }
      }
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AuthContext] Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setError(null);
      setIsLoading(false);
    }
  };

  // Request password reset email
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.isConfigured) {
      return { success: false, error: configStatus.error || 'Supabase is not configured.' };
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const redirectUrl = `${window.location.origin}/admin/login`;
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl
      });

      if (resetErr) {
        return { success: false, error: resetErr.message };
      }

      return { success: true };
    } catch (err) {
      const generalErr = err as Error;
      return { success: false, error: generalErr.message };
    }
  };

  // Manually refresh the user's role profile from the database
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    const { profile: userProfile, role: userRole } = await fetchAdminRole(user.id, user.email);
    setProfile(userProfile);
    setRole(userRole);
  };

  // Check if current user has any of the required roles (Super Admin always has permission)
  const hasPermission = useCallback((requiredRoles: AdminRole[]): boolean => {
    if (!role) return false;
    if (role === 'SUPER_ADMIN') return true;
    return requiredRoles.includes(role);
  }, [role]);

  // Check if current user can access a specific administrative route
  const canAccessRoute = useCallback((route: AdminRouteId): boolean => {
    const required = ROUTE_PERMISSIONS[route];
    if (!required) return false;
    return hasPermission(required);
  }, [hasPermission]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    profile,
    role,
    isLoading,
    error,
    login,
    logout,
    resetPassword,
    refreshProfile,
    hasPermission,
    canAccessRoute
  }), [user, session, profile, role, isLoading, error, fetchAdminRole, hasPermission, canAccessRoute]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
