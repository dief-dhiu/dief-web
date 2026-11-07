import React from 'react';
import {
  X,
  UserCheck,
  Mail,
  Phone,
  Building,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Calendar,
  CheckCircle,
  Pencil,
  Archive,
  EyeOff
} from 'lucide-react';
import { FacultyProfile, FacultyPublicationStatus } from '../../../types/faculty';

interface FacultyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FacultyProfile | null;
  onEdit: (profile: FacultyProfile) => void;
  onToggleStatus: (profile: FacultyProfile, newStatus: FacultyPublicationStatus) => void;
}

export const FacultyDetailModal: React.FC<FacultyDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  onEdit,
  onToggleStatus,
}) => {
  if (!isOpen || !profile) return null;

  const nextStatus = profile.status === 'Published' ? 'Draft' : 'Published';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-forest/10 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-forest p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 border-2 border-gold/40 shrink-0 flex items-center justify-center shadow-lg">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCheck className="w-10 h-10 text-gold" />
              )}
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-gold/20 px-2.5 py-0.5 rounded-full">
                  {profile.category_name || 'Faculty Member'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    profile.status === 'Published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : profile.status === 'Draft'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}
                >
                  {profile.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                  {profile.status === 'Draft' && <Pencil className="w-3 h-3" />}
                  {profile.status === 'Archived' && <Archive className="w-3 h-3" />}
                  {profile.status}
                </span>
              </div>
              <h2 className="text-2xl font-editorial font-bold text-white leading-snug">
                {profile.full_name}
              </h2>
              {profile.designation && (
                <p className="text-sm text-gold-light font-medium">{profile.designation}</p>
              )}
              {profile.department && (
                <p className="text-xs text-white/70 flex items-center justify-center sm:justify-start gap-1">
                  <Building className="w-3 h-3 text-gold/80" /> {profile.department}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Contact & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-lightGreen/30 p-4 rounded-2xl border border-forest/10 text-xs text-charcoal">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Email</span>
                  <a href={`mailto:${profile.email}`} className="text-forest hover:underline font-mono">
                    {profile.email}
                  </a>
                </div>
              </div>
            )}
            {profile.office_info && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Office / Contact</span>
                  <span>{profile.office_info}</span>
                </div>
              </div>
            )}
            {profile.employment_type && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Employment</span>
                  <span>{profile.employment_type}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-forest shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Display Order</span>
                <span className="font-semibold text-forest">#{profile.display_order}</span>
              </div>
            </div>
          </div>

          {/* Biographies */}
          {profile.short_bio && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Short Bio</h3>
              <p className="text-sm text-charcoal-light leading-relaxed italic bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                "{profile.short_bio}"
              </p>
            </div>
          )}

          {profile.full_bio && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Full Biography</h3>
              <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">
                {profile.full_bio}
              </p>
            </div>
          )}

          {/* Academic Profile */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {profile.qualifications && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-gold-dark" /> Academic Qualifications
                </h4>
                <p className="text-sm text-charcoal-light">{profile.qualifications}</p>
              </div>
            )}

            {profile.specializations && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-dark" /> Areas of Specialization
                </h4>
                <p className="text-sm text-charcoal-light">{profile.specializations}</p>
              </div>
            )}

            {profile.research_interests && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gold-dark" /> Research Interests
                </h4>
                <p className="text-sm text-charcoal-light">{profile.research_interests}</p>
              </div>
            )}

            {profile.publications && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gold-dark" /> Selected Publications
                </h4>
                <p className="text-sm text-charcoal-light whitespace-pre-line">{profile.publications}</p>
              </div>
            )}

            {profile.profile_links && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gold-dark" /> Professional Links
                </h4>
                <p className="text-sm text-forest font-mono">{profile.profile_links}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(profile, nextStatus)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-charcoal"
            >
              {profile.status === 'Published' ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" /> Unpublish (Set to Draft)
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Publish Profile
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(profile);
              }}
              className="px-4 py-2 bg-forest text-white text-xs font-semibold rounded-xl hover:bg-forest/90 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-charcoal-muted text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
