import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminRouteId, ROUTE_PERMISSIONS } from '../../types/auth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  Mail, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Lock,
  UserCheck,
  Building2
} from 'lucide-react';
import { CrestLogo, IslamicStarIcon } from '../../components/IslamicPattern';

interface AdminLayoutProps {
  currentRoute: AdminRouteId;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  children
}) => {
  const { user, profile, role, logout, canAccessRoute } = useAuth();

  const navigationItems: { id: AdminRouteId; label: string; icon: React.FC<{ className?: string }>; path: string }[] = [
    { id: 'dashboard', label: 'Admin Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'journal', label: 'Tamweel Journal', icon: BookOpen, path: '/admin/journal' },
    { id: 'activities', label: 'Activities & Events', icon: Calendar, path: '/admin/activities' },
    { id: 'faculty', label: 'Faculty Directory', icon: Users, path: '/admin/faculty' },
    { id: 'enquiries', label: 'Enquiries & SBC', icon: Mail, path: '/admin/enquiries' },
    { id: 'settings', label: 'Admin Settings', icon: Settings, path: '/admin/settings' }
  ];

  const handleLogout = async () => {
    await logout();
    onNavigate('/admin/login');
  };

  const getRoleBadgeColor = (r: string | null) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'bg-gold text-forest border-gold';
      case 'JOURNAL_EDITOR':
        return 'bg-emerald-deep text-white border-emerald-deep';
      case 'CONTENT_EDITOR':
        return 'bg-forest text-gold border-forest';
      case 'EVENTS_MANAGER':
        return 'bg-blue-800 text-white border-blue-700';
      case 'RESOURCE_MANAGER':
        return 'bg-amber-800 text-white border-amber-700';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-surface-lightGreen/30 flex flex-col selection:bg-forest selection:text-white">
      
      {/* Top Admin Navbar */}
      <header className="bg-forest text-white border-b-2 border-gold/40 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Department Identity & Back Link */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('/')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gold transition"
                title="Return to Public Website"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div 
                onClick={() => onNavigate('/admin')}
                className="flex items-center space-x-3 cursor-pointer select-none"
              >
                <CrestLogo size={38} className="bg-white border-gold/60 shadow-sm" />
                <div className="flex items-center space-x-3">
                  <img 
                    src="/dief-title.png" 
                    alt="Department of Islamic Economics & Finance" 
                    className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
                  />
                  <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded text-sage-light font-sans font-normal hidden sm:inline">
                    Admin Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Authenticated User Info & Logout Button */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Role Badge */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-sage-light">Logged in as</span>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(role)}`}>
                    {role || 'NO_ROLE'}
                  </span>
                </div>
              </div>

              {/* User Email Pill */}
              <div className="hidden sm:flex items-center space-x-2 bg-forest-dark/80 px-3 py-1.5 rounded-xl border border-gold/30">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold font-mono">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-white truncate max-w-[150px]">
                    {profile?.fullName || user?.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-sage-subtle truncate max-w-[150px]">
                    {user?.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                title="Sign out of administrative session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Sub-Navigation & Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Left Sub-Nav Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-forest/10 p-3 shadow-soft space-y-1 sticky top-24">
            
            <div className="px-3 py-2 text-[10px] font-bold text-gold-dark uppercase tracking-wider font-sans border-b border-gray-100 mb-1 flex items-center justify-between">
              <span>Admin Modules</span>
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = canAccessRoute(item.id);
              const isActive = currentRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => isAllowed && onNavigate(item.path)}
                  disabled={!isAllowed}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-forest text-gold shadow-sm font-bold'
                      : isAllowed
                      ? 'text-charcoal hover:bg-surface-lightGreen/70 hover:text-forest'
                      : 'text-gray-300 bg-gray-50/50 cursor-not-allowed opacity-60'
                  }`}
                  title={!isAllowed ? `Requires clearance: ${ROUTE_PERMISSIONS[item.id].join(', ')}` : item.label}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : isAllowed ? 'text-forest' : 'text-gray-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {!isAllowed && (
                    <Lock className="w-3 h-3 text-gray-300" />
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-100 mt-2 px-3 py-1 text-[11px] text-charcoal-muted flex items-center justify-between">
              <span className="truncate">Active Role:</span>
              <span className="font-mono font-bold text-forest text-[10px]">{role}</span>
            </div>

          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* Admin Micro Footer */}
      <footer className="border-t border-forest/10 bg-white py-3 px-4 text-center text-xs text-charcoal-muted">
        Department of Islamic Economics and Finance • Under Kulliyya of Sharia, Darul Huda Islamic University
      </footer>

    </div>
  );
};
