import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * LegacyHashRedirect
 * Automatically translates legacy hash-based URLs (e.g. /#tamweel, /#about, /#home)
 * to clean, modern URLs (/tamweel, /about, /), maintaining 100% backward compatibility.
 */
export const LegacyHashRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Redirect /home to /
    if (location.pathname === '/home') {
      navigate('/', { replace: true });
      return;
    }

    // 2. Check for legacy hash routes
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    // Check if the hash matches a legacy public page
    const legacyPublicMap: Record<string, string> = {
      '': '/',
      '/': '/',
      'home': '/',
      'about': '/about',
      'dhib': '/dhib',
      'sbc': '/sbc',
      'tamweel': '/tamweel',
      'activities': '/activities',
      'contact': '/contact'
    };

    // If it's a known page ID, redirect and clear hash
    if (legacyPublicMap[hash] !== undefined) {
      const targetPath = legacyPublicMap[hash];
      navigate(targetPath, { replace: true });
      return;
    }

    // If hash starts with admin
    if (hash.startsWith('admin') || hash.startsWith('/admin')) {
      const adminPath = hash.startsWith('/') ? hash : `/${hash}`;
      navigate(adminPath, { replace: true });
      return;
    }

    // If hash is a sub-path like #tamweel/art-1
    if (hash.startsWith('tamweel/')) {
      const articleId = hash.replace('tamweel/', '');
      navigate(`/tamweel/${articleId}`, { replace: true });
      return;
    }

    if (hash.startsWith('activities/')) {
      const activityId = hash.replace('activities/', '');
      navigate(`/activities/${activityId}`, { replace: true });
      return;
    }
  }, [location.pathname, location.hash, navigate]);

  return null;
};
