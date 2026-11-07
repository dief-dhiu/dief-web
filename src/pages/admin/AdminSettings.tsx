import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AdminRoleRecord } from '../../types/auth';
import { 
  Settings, 
  ShieldCheck, 
  Users, 
  FileText, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { IslamicStarIcon } from '../../components/IslamicPattern';

interface AdminSettingsProps {
  onNavigate: (path: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
  const { role, user } = useAuth();
  const [adminRoles, setAdminRoles] = useState<AdminRoleRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadSettingsData = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch all assigned roles from admin_roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('admin_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) {
        throw rolesError;
      }
      setAdminRoles(rolesData || []);

      // 2. Fetch recent audit logs from audit_logs
      const { data: logsData, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsError) {
        console.warn('Audit logs read warning:', logsError.message);
      } else {
        setAuditLogs(logsData || []);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-forest/15 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                  Super Administrator Only
                </span>
                <span className="text-[10px] bg-gold/15 text-gold-dark px-2 py-0.5 rounded border border-gold/30 font-semibold">
                  Restricted Clearance
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-forest mt-0.5">
                Admin Roles &amp; Security Settings
              </h1>
              <div className="font-arabic text-sm text-sage-light" dir="rtl">
                إدارة الصلاحيات والأدوار الأمنية
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={loadSettingsData}
              disabled={loading}
              className="p-2 border border-forest/20 hover:border-forest text-forest rounded-xl transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('/admin')}
              className="px-4 py-2 border border-forest/20 hover:border-forest text-forest text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed max-w-3xl">
          Super Administrator back-office controls. Manage authorized staff roles, inspect security access audit trails, and review database Row Level Security policies.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Error loading directory data: {errorMsg}</span>
        </div>
      )}

      {/* Admin Role Directory Table */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-forest" />
            <h2 className="font-editorial text-lg font-bold text-forest">
              Authorized Staff Directory ({adminRoles.length})
            </h2>
          </div>

          <span className="text-[10px] text-charcoal-muted font-mono bg-ivory px-2 py-1 rounded border border-gray-200">
            Source: public.admin_roles
          </span>
        </div>

        {adminRoles.length === 0 && !loading ? (
          <div className="p-8 text-center bg-ivory/50 rounded-2xl border border-dashed border-gray-200 text-xs text-charcoal-muted">
            No role records returned from the database yet. Run the initial provisioning script in Supabase SQL Editor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-charcoal-muted uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Administrator</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminRoles.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-lightGreen/20">
                    <td className="py-3 px-3">
                      <div className="font-bold text-forest">{r.full_name || 'Department Staff'}</div>
                      <div className="font-mono text-[10px] text-charcoal-muted truncate max-w-[200px]">
                        ID: {r.user_id}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-forest/10 text-forest border border-forest/20">
                        {r.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        r.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600'
                      }`}>
                        {r.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-charcoal-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log Entries */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-forest" />
            <h2 className="font-editorial text-lg font-bold text-forest">
              Security Audit Trail (Latest Events)
            </h2>
          </div>
          <span className="text-[10px] text-charcoal-muted font-mono bg-ivory px-2 py-1 rounded border border-gray-200">
            Source: public.audit_logs
          </span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-6 text-center bg-ivory/50 rounded-2xl border border-dashed border-gray-200 text-xs text-charcoal-muted">
            No audit events recorded yet. Authentication activities and administrative actions will appear here automatically.
          </div>
        ) : (
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-ivory/60 border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-forest flex items-center space-x-2">
                    <span className="font-mono text-[11px] bg-forest text-gold px-1.5 py-0.2 rounded">
                      {log.action}
                    </span>
                    <span>{log.user_email || 'System'}</span>
                  </div>
                  <div className="text-[10px] text-charcoal-muted mt-0.5">
                    Target: {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                  </div>
                </div>
                <div className="text-[10px] text-charcoal-muted font-mono">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Super Admin Provisioning Information Reference */}
      <div className="bg-surface-lightGreen/50 rounded-3xl border border-forest/10 p-6 sm:p-8 shadow-soft space-y-3">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-gold-dark" />
          <h3 className="font-editorial text-base font-bold text-forest">
            Provisioning Additional Department Administrators
          </h3>
        </div>
        <p className="text-xs text-charcoal-light leading-relaxed">
          Public signup is permanently disabled. To grant an administrative role to a faculty or editorial staff member:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-charcoal-muted pl-2">
          <li>Create the staff user in Supabase Authentication (<code className="bg-white px-1 rounded font-mono">Authentication -&gt; Users -&gt; Add User</code>).</li>
          <li>Assign their designated role in the <code className="bg-white px-1 rounded font-mono">admin_roles</code> table using their user UUID.</li>
          <li>Supported roles: <code className="font-mono text-forest">SUPER_ADMIN</code>, <code className="font-mono text-forest">JOURNAL_EDITOR</code>, <code className="font-mono text-forest">CONTENT_EDITOR</code>, <code className="font-mono text-forest">EVENTS_MANAGER</code>, <code className="font-mono text-forest">RESOURCE_MANAGER</code>.</li>
        </ol>
      </div>

    </div>
  );
};
