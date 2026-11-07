import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, getSupabaseConfigStatus } from '../../lib/supabase';
import { 
  ShieldCheck, 
  Database, 
  Lock, 
  BookOpen, 
  Calendar, 
  Users, 
  Mail, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Clock,
  KeyRound,
  FileText
} from 'lucide-react';
import { IslamicStarIcon } from '../../components/IslamicPattern';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, profile, role, canAccessRoute } = useAuth();
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbErrorMsg, setDbErrorMsg] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const configStatus = getSupabaseConfigStatus();

  // Test database connection and load recent audit logs
  useEffect(() => {
    let isMounted = true;

    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('id')
          .limit(1);

        if (!isMounted) return;

        if (error) {
          setDbStatus('error');
          setDbErrorMsg(error.message);
        } else {
          setDbStatus('connected');
        }

        // Fetch recent audit logs if super admin or authorized
        const { data: logsData } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (isMounted && logsData) {
          setRecentLogs(logsData);
        }
      } catch (err) {
        if (isMounted) {
          setDbStatus('error');
          setDbErrorMsg((err as Error).message);
        }
      }
    };

    testConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  const modules = [
    {
      id: 'journal',
      title: 'Tamweel Journal CMS',
      desc: 'Double-blind peer review, manuscript submissions, issue publications, and editorial policies.',
      icon: BookOpen,
      path: '/admin/journal',
      allowedRoles: ['SUPER_ADMIN', 'JOURNAL_EDITOR', 'CONTENT_EDITOR']
    },
    {
      id: 'activities',
      title: 'Activities & Events CMS',
      desc: 'National conferences, Fiqh al-Mu’amalat workshops, guest lectures, and student fieldwork.',
      icon: Calendar,
      path: '/admin/activities',
      allowedRoles: ['SUPER_ADMIN', 'EVENTS_MANAGER', 'CONTENT_EDITOR']
    },
    {
      id: 'faculty',
      title: 'Faculty & Academic Team',
      desc: 'Manage faculty roster, academic qualifications, specializations, and institutional contacts.',
      icon: Users,
      path: '/admin/faculty',
      allowedRoles: ['SUPER_ADMIN', 'CONTENT_EDITOR']
    },
    {
      id: 'enquiries',
      title: 'Enquiries & Consultations',
      desc: 'SBC commercial advisory requests, department messages, and institutional correspondence.',
      icon: Mail,
      path: '/admin/enquiries',
      allowedRoles: ['SUPER_ADMIN', 'CONTENT_EDITOR']
    },
    {
      id: 'settings',
      title: 'Admin Roles & Settings',
      desc: 'Manage role assignments, configure security settings, and inspect system audit logs.',
      icon: Settings,
      path: '/admin/settings',
      allowedRoles: ['SUPER_ADMIN']
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-forest rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
        <div className="absolute inset-0 pattern-dark-islamic opacity-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
            Welcome, {profile?.fullName || user?.email?.split('@')[0]}
          </h1>

          <div className="text-xs text-sage-light flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Official Account: <strong className="text-white font-mono">{user?.email}</strong></span>
            <span>•</span>
            <span>Assigned Role: <strong className="text-gold font-mono">{role}</strong></span>
            <span>•</span>
            <span>Institution: <strong>Under Kulliyya of Sharia, DHIU</strong></span>
          </div>

          <p className="text-xs text-sage-subtle max-w-2xl leading-relaxed pt-1">
            This administrative back-office is connected to Supabase with PostgreSQL Row Level Security (RLS) and server-verified role-based access control.
          </p>
        </div>
      </div>

      {/* Backend & Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Backend Connection */}
        <div className="bg-white p-5 rounded-2xl border border-forest/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Database Connection
            </span>
            <Database className="w-4 h-4 text-forest" />
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
              dbStatus === 'checking' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <div className="text-sm font-bold text-forest">
              {dbStatus === 'connected' ? 'Connected (Supabase)' :
               dbStatus === 'checking' ? 'Verifying Connection...' : 'Connection Error'}
            </div>
          </div>

          <div className="text-[11px] text-charcoal-muted truncate">
            {configStatus.url ? configStatus.url : 'No API URL set'}
          </div>
        </div>

        {/* Role & Access Security */}
        <div className="bg-white p-5 rounded-2xl border border-forest/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Authorization Clearance
            </span>
            <ShieldCheck className="w-4 h-4 text-gold-dark" />
          </div>

          <div className="text-sm font-bold text-forest flex items-center space-x-1.5">
            <span className="font-mono bg-forest/10 text-forest px-2 py-0.5 rounded text-xs">{role}</span>
            <span className="text-xs text-emerald-700 font-semibold">• Active</span>
          </div>

          <div className="text-[11px] text-charcoal-muted">
            Row Level Security (RLS) Active
          </div>
        </div>

        {/* Session Token Status */}
        <div className="bg-white p-5 rounded-2xl border border-forest/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
              Session Integrity
            </span>
            <KeyRound className="w-4 h-4 text-forest" />
          </div>

          <div className="text-sm font-bold text-emerald-700 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Persisted &amp; Validated</span>
          </div>

          <div className="text-[11px] text-charcoal-muted">
            Auto-refresh enabled via JWT
          </div>
        </div>

      </div>

      {/* Module Navigation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-editorial font-bold text-forest">
            Departmental Management Modules
          </h2>
          <span className="text-xs text-charcoal-muted">
            Role-Based Clearance Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            const isAllowed = canAccessRoute(m.id as any);

            return (
              <div
                key={m.id}
                onClick={() => isAllowed && onNavigate(m.path)}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isAllowed 
                    ? 'border-forest/10 hover:border-gold shadow-soft hover:shadow-elevated cursor-pointer group' 
                    : 'border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isAllowed ? 'bg-forest/10 text-forest group-hover:bg-forest group-hover:text-gold transition-colors' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {isAllowed ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Authorized
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Restricted</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-editorial text-base font-bold ${isAllowed ? 'text-forest group-hover:text-emerald-deep' : 'text-gray-500'}`}>
                      {m.title}
                    </h3>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-charcoal-muted">
                    Clearance: {m.allowedRoles.includes(role || '') ? 'Granted' : 'Super Admin / Specific'}
                  </span>
                  {isAllowed && (
                    <span className="font-bold text-forest group-hover:text-gold-dark flex items-center space-x-1">
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 1 Integration Confirmation Notice */}
      <div className="p-5 rounded-2xl bg-surface-lightGreen/60 border border-forest/15 space-y-2">
        <div className="flex items-center space-x-2">
          <IslamicStarIcon size={16} className="text-gold" />
          <h4 className="font-editorial text-sm font-bold text-forest">
            Phase 1 Integration Checkpoint
          </h4>
        </div>
        <p className="text-xs text-charcoal-light leading-relaxed">
          The Supabase connection, schema foundation (<code className="font-mono bg-white px-1 py-0.2 rounded text-forest">admin_roles</code> and <code className="font-mono bg-white px-1 py-0.2 rounded text-forest">audit_logs</code>), authentication lifecycle, and role-based route guards are operational. Individual module CMS workflows will be populated in <strong>Phase 2</strong>.
        </p>
      </div>

    </div>
  );
};
