import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminRole, AdminRouteId, ROUTE_PERMISSIONS } from '../types/auth';
import { ShieldAlert, ShieldX, Lock, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AdminRole[];
  routeId?: AdminRouteId;
  onNavigate: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  routeId,
  onNavigate
}) => {
  const { user, session, role, profile, isLoading, logout } = useAuth();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-forest/15 shadow-elevated max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest/5 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-forest animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="font-editorial text-xl font-bold text-forest">
              Verifying Administrative Credentials
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Consulting Kulliyya of Sharia secure authorization directory...
            </p>
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-[11px] font-semibold text-gold-dark pt-2">
            <IslamicStarIcon size={12} className="text-gold" />
            <span>Department of Islamic Economics and Finance</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Redirect to Login
  if (!user || !session) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-forest/15 shadow-elevated max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest text-gold flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl font-bold text-forest">
              Authentication Required
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              This administrative module is restricted to authorized faculty and departmental staff.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => onNavigate('/admin/login')}
              className="w-full py-3 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow-soft transition"
            >
              Proceed to Department Admin Login
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 text-xs text-charcoal-muted hover:text-forest transition"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated in Auth, but No Authorized Admin Role in admin_roles table
  if (!role) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-elevated max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
            <ShieldX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-red-600 uppercase bg-red-100/60 px-3 py-1 rounded-full">
              403 Unauthorized Access
            </span>
            <h2 className="font-editorial text-2xl font-bold text-forest">
              No Administrative Role Assigned
            </h2>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Your account <span className="font-mono font-semibold text-forest">({user.email})</span> is authenticated, but is not registered with an active role in the <code className="bg-gray-100 px-1 py-0.5 rounded text-forest font-mono">admin_roles</code> database table.
            </p>
          </div>

          <div className="p-4 bg-forest/5 rounded-xl border border-gray-200 text-left text-xs text-charcoal-muted space-y-2">
            <div className="font-bold text-forest flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-gold-dark" />
              <span>Administrative Provisioning Protocol</span>
            </div>
            <p className="leading-relaxed">
              In accordance with department security policy, public registration is strictly disabled. Please contact the <strong>Super Administrator</strong> or <strong>Dean of Kulliyya of Sharia</strong> to provision your role.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => logout()}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Current Account</span>
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold rounded-xl transition"
            >
              Public Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Role Permission Check
  const effectiveRequiredRoles = requiredRoles || (routeId ? ROUTE_PERMISSIONS[routeId] : undefined);

  if (effectiveRequiredRoles && effectiveRequiredRoles.length > 0) {
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isPermitted = isSuperAdmin || effectiveRequiredRoles.includes(role);

    if (!isPermitted) {
      return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gold/30 shadow-elevated max-w-lg w-full text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest text-gold-dark uppercase bg-gold/15 px-3 py-1 rounded-full">
                Role Permission Required
              </span>
              <h2 className="font-editorial text-2xl font-bold text-forest">
                Section Restricted
              </h2>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Your current role <span className="font-bold text-forest">[{role}]</span> does not hold administrative clearance to manage this section.
              </p>
            </div>

            <div className="p-4 bg-forest/5 rounded-xl border border-forest/15 text-left text-xs space-y-1.5">
              <div className="font-bold text-forest">Permitted Roles:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {effectiveRequiredRoles.map((r) => (
                  <span key={r} className="px-2 py-0.5 bg-forest text-gold text-[10px] font-mono rounded">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('/admin')}
                className="flex-1 py-3 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow-soft transition flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Admin Overview</span>
              </button>
              <button
                onClick={() => logout()}
                className="py-3 px-4 border border-gray-300 hover:bg-gray-50 text-charcoal text-xs font-semibold rounded-xl transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 5. Authorized -> Render Protected Content
  return <>{children}</>;
};
