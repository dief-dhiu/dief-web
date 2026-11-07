import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable validation and normalization
function getValidatedConfig(): { url: string; anonKey: string; isConfigured: boolean; error?: string } {
  let url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return {
      url: '',
      anonKey: '',
      isConfigured: false,
      error: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.'
    };
  }

  // Detect and correct accidental dashboard URLs (e.g., https://supabase.com/dashboard/project/<ref>)
  if (url.includes('supabase.com/dashboard/project/')) {
    const match = url.match(/project\/([a-z0-9_-]+)/i);
    if (match && match[1]) {
      const projectRef = match[1];
      url = `https://${projectRef}.supabase.co`;
      console.warn(
        `[Supabase Client] Detected dashboard URL in VITE_SUPABASE_URL. Normalized to project API URL: ${url}`
      );
    }
  }

  // Safety check: ensure service role keys are never mistakenly used in the frontend
  if (anonKey.startsWith('sb_service_') || anonKey.includes('service_role')) {
    console.error('[Supabase Client Security Alert] Service role key detected in client environment! Only use the anon/public key.');
    return {
      url: '',
      anonKey: '',
      isConfigured: false,
      error: 'Security Error: Service-role key cannot be exposed in the frontend.'
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      url: '',
      anonKey: '',
      isConfigured: false,
      error: `Invalid URL format in VITE_SUPABASE_URL: "${url}"`
    };
  }

  return {
    url,
    anonKey,
    isConfigured: true
  };
}

const config = getValidatedConfig();

/**
 * Singleton Supabase Client instance for DIEF Portal.
 * Configured with session persistence, auto token refresh, and URL session detection.
 */
export const supabase: SupabaseClient = createClient(
  config.isConfigured ? config.url : 'https://placeholder.supabase.co',
  config.isConfigured ? config.anonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'dief_admin_auth_token'
    }
  }
);

/**
 * Returns current configuration status and any setup errors.
 */
export function getSupabaseConfigStatus(): {
  isConfigured: boolean;
  url: string;
  error?: string;
} {
  return {
    isConfigured: config.isConfigured,
    url: config.url,
    error: config.error
  };
}
