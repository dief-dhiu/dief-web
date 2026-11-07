import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminRouteId, ROUTE_PERMISSIONS } from '../../types/auth';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { IslamicStarIcon } from '../../components/IslamicPattern';

interface AdminSectionPlaceholderProps {
  routeId: AdminRouteId;
  onNavigate: (path: string) => void;
}

export const AdminSectionPlaceholder: React.FC<AdminSectionPlaceholderProps> = ({
  routeId,
  onNavigate
}) => {
  const { role, profile } = useAuth();

  const detailsMap: Record<AdminRouteId, {
    title: string;
    subtitle: string;
    arabic: string;
    icon: React.FC<{ className?: string }>;
    description: string;
    capabilities: string[];
  }> = {
    dashboard: {
      title: 'Admin Overview',
      subtitle: 'Central Administrative Control',
      arabic: 'لوحة التحكم المركزية',
      icon: ShieldCheck,
      description: 'Departmental operations overview.',
      capabilities: []
    },
    journal: {
      title: 'Tamweel Journal Management',
      subtitle: 'Editorial & Academic Periodical CMS',
      arabic: 'إدارة مجلة تمويل للاقتصاد والتمويل الإسلامي',
      icon: BookOpen,
      description: 'Manages peer-reviewed submissions, reviewer assignments, issue volumes, and published article repository.',
      capabilities: [
        'Editorial desk review & triage for submitted manuscripts',
        'Assigning double-blind expert peer reviewers',
        'Managing journal issues, volumes, DOI assignments, and PDF uploads',
        'Configuring Aims & Scope, Author Guidelines, and COPE ethics statements'
      ]
    },
    activities: {
      title: 'Department Activities & Events CMS',
      subtitle: 'Seminars, Conferences & Workshops Management',
      arabic: 'إدارة الأنشطة والندوات والمؤتمرات',
      icon: Calendar,
      description: 'Manages national conferences, academic workshops, guest lectures, student field immersions, and event calendars.',
      capabilities: [
        'Creating and scheduling new academic seminars and conferences',
        'Publishing registration links, venue agendas, and guest speaker rosters',
        'Archiving past departmental symposiums and proceedings',
        'Managing student field practice and cooperative society immersion records'
      ]
    },
    faculty: {
      title: 'Faculty & Academic Team Directory',
      subtitle: 'Academic Leadership Roster',
      arabic: 'إدارة الهيئة التدريسية والأكاديمية',
      icon: Users,
      description: 'Maintains verified faculty profiles under the Kulliyya of Sharia, Darul Huda Islamic University.',
      capabilities: [
        'Updating faculty qualifications, specializations, and bios',
        'Managing leadership appointments (HOD, Dean, Founding Leaders)',
        'Updating verified academic contact points and office visiting hours',
        'Publishing faculty research output and supervised student dissertations'
      ]
    },
    enquiries: {
      title: 'Enquiries & Consultations Management',
      subtitle: 'SBC Commercial Advisory & Correspondence',
      arabic: 'إدارة الاستشارات والمراسلات الرسمية',
      icon: Mail,
      description: 'Processes Shariah Business Consultancy (SBC) intake requests, institutional inquiries, and academic queries.',
      capabilities: [
        'Reviewing and categorizing incoming SBC consultation requests',
        'Assigning advisory status (Pending Review, In Discussion, Resolved)',
        'Managing official departmental email correspondence and inquiries',
        'Tracking enterprise Shariah contract review requests'
      ]
    },
    settings: {
      title: 'Department Settings & Roles',
      subtitle: 'Security & Access Administration',
      arabic: 'إعدادات النظام والأدوار الإدارية',
      icon: ShieldCheck,
      description: 'Super administrator controls for role provisioning and system audit logs.',
      capabilities: []
    }
  };

  const current = detailsMap[routeId] || detailsMap.journal;
  const Icon = current.icon;
  const allowedRoles = ROUTE_PERMISSIONS[routeId];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-forest/15 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                  {current.subtitle}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Access Granted
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-forest mt-0.5">
                {current.title}
              </h1>
              <div className="font-arabic text-sm text-sage-light" dir="rtl">
                {current.arabic}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin')}
            className="self-start sm:self-center px-4 py-2 border border-forest/20 hover:border-forest text-forest text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed max-w-3xl">
          {current.description}
        </p>

        {/* Role verification bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-muted">
          <div>
            <span>Your Active Role: </span>
            <strong className="text-forest font-mono">{role}</strong>
          </div>
          <div className="flex items-center space-x-1 text-[11px]">
            <span>Permitted Roles: </span>
            <span className="font-mono text-charcoal">{allowedRoles.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Phase 1 Integration Confirmation & Phase 2 Capabilities Preview */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center space-x-2">
          <IslamicStarIcon size={16} className="text-gold" />
          <h2 className="font-editorial text-lg font-bold text-forest">
            Module Architecture &amp; Phase 2 Preparedness
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lightGreen/50 border border-forest/15 text-xs text-charcoal-light space-y-2">
          <div className="flex items-center space-x-2 font-bold text-forest">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Phase 1 Authentication &amp; RLS Verified</span>
          </div>
          <p className="leading-relaxed">
            Direct navigation to <code className="bg-white px-1.5 py-0.5 rounded font-mono text-forest">/admin/{routeId}</code> is protected via <code className="bg-white px-1.5 py-0.5 rounded font-mono text-forest">ProtectedRoute</code> and verified through the Supabase <code className="bg-white px-1.5 py-0.5 rounded font-mono text-forest">admin_roles</code> database table.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
            Planned CMS Workflows for Phase 2:
          </h3>
          <ul className="space-y-2 text-xs text-charcoal-light">
            {current.capabilities.map((cap, i) => (
              <li key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-ivory/60 border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2.5">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Phase 1 Scope Note:</strong> Full CRUD management forms and interactive table controls for this module will be introduced in Phase 2 with your approval.
          </span>
        </div>
      </div>

    </div>
  );
};
