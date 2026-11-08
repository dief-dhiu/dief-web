import React, { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  EyeOff,
  Archive,
  Users,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { FacultyProfile, FacultyCategory, FacultyPublicationStatus } from '../../../types/faculty';

interface FacultyListViewProps {
  profiles: FacultyProfile[];
  categories: FacultyCategory[];
  loading: boolean;
  onViewProfile: (profile: FacultyProfile) => void;
  onEditProfile: (profile: FacultyProfile) => void;
  onDeleteProfile: (profile: FacultyProfile) => void;
  onToggleStatus: (profile: FacultyProfile, newStatus: FacultyPublicationStatus) => void;
  onOpenNewModal: () => void;
}

type SortOption = 'display_order_asc' | 'display_order_desc' | 'name_az' | 'name_za' | 'recently_updated';

const STATUS_OPTIONS: { value: '' | FacultyPublicationStatus; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'Published', label: 'Published' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Archived', label: 'Archived' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'display_order_asc', label: 'Display Order (Asc)' },
  { value: 'display_order_desc', label: 'Display Order (Desc)' },
  { value: 'name_az', label: 'Name A → Z' },
  { value: 'name_za', label: 'Name Z → A' },
  { value: 'recently_updated', label: 'Recently Updated' },
];

function statusBadge(status: FacultyPublicationStatus) {
  if (status === 'Published') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
        <CheckCircle className="w-2.5 h-2.5" /> Published
      </span>
    );
  }
  if (status === 'Draft') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
        <Pencil className="w-2.5 h-2.5" /> Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
      <Archive className="w-2.5 h-2.5" /> Archived
    </span>
  );
}

function nextStatus(current: FacultyPublicationStatus): FacultyPublicationStatus {
  if (current === 'Published') return 'Draft';
  return 'Published';
}

export const FacultyListView: React.FC<FacultyListViewProps> = ({
  profiles,
  categories,
  loading,
  onViewProfile,
  onEditProfile,
  onDeleteProfile,
  onToggleStatus,
  onOpenNewModal,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | FacultyPublicationStatus>('');
  const [sortBy, setSortBy] = useState<SortOption>('display_order_asc');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Client-side filter + sort on already-fetched profiles
  const filtered = profiles
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.full_name.toLowerCase().includes(q) ||
        (p.designation ?? '').toLowerCase().includes(q) ||
        (p.specializations ?? '').toLowerCase().includes(q);
      const matchCategory = !categoryFilter || p.category_id === categoryFilter || p.category_name === categoryFilter;
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'display_order_asc') return (a.display_order ?? 0) - (b.display_order ?? 0);
      if (sortBy === 'display_order_desc') return (b.display_order ?? 0) - (a.display_order ?? 0);
      if (sortBy === 'name_az') return a.full_name.localeCompare(b.full_name);
      if (sortBy === 'name_za') return b.full_name.localeCompare(a.full_name);
      // recently_updated
      return new Date(b.updated_at ?? b.created_at ?? '').getTime() - new Date(a.updated_at ?? a.created_at ?? '').getTime();
    });

  const handleDelete = (profile: FacultyProfile) => {
    if (confirmDeleteId === profile.id) {
      onDeleteProfile(profile);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(profile.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-muted">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Loading faculty profiles…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search by name, designation, or specialization…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | FacultyPublicationStatus)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Add button */}
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-emerald-deep transition-colors shrink-0 shadow-soft"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Results count */}
      <div className="text-xs text-charcoal-muted">
        Showing <span className="font-semibold text-forest">{filtered.length}</span> of{' '}
        <span className="font-semibold">{profiles.length}</span> profiles
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-forest/40" />
          </div>
          <h3 className="text-base font-semibold text-charcoal mb-1">
            {profiles.length === 0 ? 'No faculty profiles yet' : 'No profiles match your filters'}
          </h3>
          <p className="text-xs text-charcoal-muted mb-5 max-w-xs">
            {profiles.length === 0
              ? 'Add the first faculty member to get started.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {profiles.length === 0 && (
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-emerald-deep transition-colors shadow-soft"
            >
              <Plus className="w-4 h-4" />
              Add First Member
            </button>
          )}
        </div>
      )}

      {/* Profile grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-2xl border border-forest/15 shadow-soft hover:shadow-elevated transition-all flex flex-col overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-start gap-4 p-5">
                {/* Photo */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-forest/5 border border-gold/30 shrink-0 flex items-center justify-center">
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-6 h-6 text-forest/30" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-editorial text-sm font-bold text-forest leading-snug line-clamp-2">
                      {profile.full_name}
                    </h3>
                    {statusBadge(profile.status)}
                  </div>
                  {profile.designation && (
                    <p className="text-xs text-charcoal-muted line-clamp-1">{profile.designation}</p>
                  )}
                  {profile.category_name && (
                    <span className="inline-block text-[10px] font-semibold text-gold-dark bg-gold/10 px-2 py-0.5 rounded">
                      {profile.category_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio preview */}
              {profile.short_bio && (
                <div className="px-5 pb-3">
                  <p className="text-xs text-charcoal-light line-clamp-2 leading-relaxed">{profile.short_bio}</p>
                </div>
              )}

              {/* Meta row */}
              <div className="mt-auto px-5 py-2.5 bg-forest/5 border-t border-forest/10 flex items-center justify-between text-[10px] text-charcoal-muted">
                <span>Order: <strong className="text-forest">{profile.display_order ?? '—'}</strong></span>
                <span>{profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : '—'}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => onViewProfile(profile)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-forest bg-forest/5 hover:bg-forest/10 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => onEditProfile(profile)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(profile, nextStatus(profile.status))}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors text-amber-700 bg-amber-50 hover:bg-amber-100"
                  title={profile.status === 'Published' ? 'Unpublish' : 'Publish'}
                >
                  {profile.status === 'Published' ? (
                    <><EyeOff className="w-3.5 h-3.5" /> Unpublish</>
                  ) : (
                    <><CheckCircle className="w-3.5 h-3.5" /> Publish</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(profile)}
                  className={`ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                    confirmDeleteId === profile.id
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 bg-red-50 hover:bg-red-100'
                  }`}
                  title={confirmDeleteId === profile.id ? 'Click again to confirm delete' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmDeleteId === profile.id ? 'Confirm?' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
