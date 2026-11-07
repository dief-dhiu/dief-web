import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FacultyProfile,
  FacultyCategory,
  FacultyDashboardStats,
  FacultyPublicationStatus,
} from '../../../types/faculty';
import {
  fetchFacultyDashboardStats,
  fetchAdminFacultyProfiles,
  fetchFacultyCategories,
  createFacultyProfile,
  updateFacultyProfile,
  deleteFacultyProfile,
  setFacultyProfileStatus,
  FacultyProfileInput,
} from '../../../lib/facultyService';
import { FacultyDashboardView } from './FacultyDashboardView';
import { FacultyListView } from './FacultyListView';
import { FacultyFormModal } from './FacultyFormModal';
import { FacultyDetailModal } from './FacultyDetailModal';
import { FacultyCategoriesModal } from './FacultyCategoriesModal';
import {
  LayoutDashboard,
  Users,
  Tag,
  PlusCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface FacultyCMSProps {
  onNavigate: (path: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const FacultyCMS: React.FC<FacultyCMSProps> = ({ onNavigate, onShowToast }) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'list'>('overview');

  // Data States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FacultyDashboardStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    recent: [],
  });
  const [profiles, setProfiles] = useState<FacultyProfile[]>([]);
  const [categories, setCategories] = useState<FacultyCategory[]>([]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<FacultyProfile | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<FacultyProfile | null>(null);

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const canManageCategories = role === 'SUPER_ADMIN' || role === 'CONTENT_EDITOR';

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Categories
      const cats = await fetchFacultyCategories();
      setCategories(cats);

      // 2. Stats
      const s = await fetchFacultyDashboardStats();
      setStats(s);

      // 3. Profiles
      const profs = await fetchAdminFacultyProfiles();
      setProfiles(profs);
    } catch (err: any) {
      console.error('[FacultyCMS] Error loading data:', err);
      onShowToast('Data Load Notice', err.message || 'Could not fetch faculty profiles.', 'warning');
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Profile Save (Create or Update)
  const handleSaveProfile = async (
    payload: FacultyProfileInput,
    photoFile?: File | null
  ) => {
    if (profileToEdit) {
      await updateFacultyProfile(profileToEdit.id, payload, photoFile);
    } else {
      await createFacultyProfile(payload, photoFile);
    }
    await loadAllData();
  };

  // Profile Delete
  const handleDeleteProfile = async (profile: FacultyProfile) => {
    try {
      await deleteFacultyProfile(profile.id);
      onShowToast('Profile Removed', `"${profile.full_name}" was deleted.`, 'info');
      await loadAllData();
    } catch (err: any) {
      onShowToast('Delete Error', err.message || 'Failed to delete profile.', 'warning');
      throw err;
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (
    profile: FacultyProfile,
    newStatus: FacultyPublicationStatus
  ) => {
    try {
      await setFacultyProfileStatus(profile.id, newStatus);
      onShowToast(
        'Status Updated',
        `"${profile.full_name}" is now ${newStatus}.`,
        'success'
      );
      await loadAllData();

      // If detail modal is open with this profile, update it
      if (selectedProfile && selectedProfile.id === profile.id) {
        setSelectedProfile({ ...selectedProfile, status: newStatus });
      }
    } catch (err: any) {
      onShowToast('Status Error', err.message || 'Failed to update status.', 'warning');
    }
  };

  // Open Handlers
  const handleOpenNewModal = () => {
    setProfileToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (profile: FacultyProfile) => {
    setProfileToEdit(profile);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (profile: FacultyProfile) => {
    setSelectedProfile(profile);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Sub-navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand pb-4">
        {/* Tab Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest hover:bg-sand/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-gold" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-forest text-white shadow-sm'
                : 'text-forest hover:bg-sand/60'
            }`}
          >
            <Users className="w-4 h-4 text-gold" />
            <span>All Profiles ({profiles.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsCategoriesModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-charcoal bg-white border border-sand hover:bg-sand/50 rounded-xl transition-colors shadow-soft"
            title="Manage Faculty Categories"
          >
            <Tag className="w-3.5 h-3.5 text-gold-dark" />
            <span className="hidden sm:inline">Categories</span>
          </button>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-charcoal bg-white border border-sand hover:bg-sand/50 rounded-xl transition-colors shadow-soft disabled:opacity-50"
            title="Refresh Faculty Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-forest ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('/about')}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-forest bg-forest/5 hover:bg-forest/10 rounded-xl transition-colors border border-forest/10"
            title="View Public Faculty Directory"
          >
            <ExternalLink className="w-3.5 h-3.5 text-forest" />
            <span className="hidden sm:inline">Live Directory</span>
          </button>

          <button
            onClick={handleOpenNewModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-forest hover:bg-forest-light rounded-xl transition-all shadow-soft"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>New Faculty Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Tab View */}
      {activeTab === 'overview' && (
        <FacultyDashboardView
          stats={stats}
          loading={loading}
          onSelectTab={setActiveTab}
          onOpenNewModal={handleOpenNewModal}
          onOpenCategories={() => setIsCategoriesModalOpen(true)}
          onViewProfile={handleOpenDetailModal}
          onRefresh={loadAllData}
        />
      )}

      {activeTab === 'list' && (
        <FacultyListView
          profiles={profiles}
          categories={categories}
          loading={loading}
          onViewProfile={handleOpenDetailModal}
          onEditProfile={handleOpenEditModal}
          onDeleteProfile={handleDeleteProfile}
          onToggleStatus={handleToggleStatus}
          onOpenNewModal={handleOpenNewModal}
        />
      )}

      {/* 3. Form Modal (Create / Edit) */}
      <FacultyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        profileToEdit={profileToEdit}
        categories={categories}
        onSave={handleSaveProfile}
        onShowToast={onShowToast}
      />

      {/* 4. Detail Modal (View Single Profile) */}
      <FacultyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        profile={selectedProfile}
        onEdit={(profile) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(profile);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* 5. Categories Modal */}
      <FacultyCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        onRefresh={loadAllData}
        onShowToast={onShowToast}
        canManage={canManageCategories}
      />
    </div>
  );
};
