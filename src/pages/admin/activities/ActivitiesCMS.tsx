import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ActivityRecord,
  ActivityCategory,
  ActivitiesDashboardStats,
  ActivityPublicationStatus
} from '../../../types/activity';
import {
  fetchActivitiesDashboardStats,
  fetchAdminActivities,
  fetchActivityCategories,
  createActivity,
  updateActivity,
  deleteActivity,
  setActivityPublicationStatus,
  toggleActivityFeatured,
  ActivityInputPayload
} from '../../../lib/activitiesService';
import { ActivitiesDashboardView } from './ActivitiesDashboardView';
import { ActivitiesListView } from './ActivitiesListView';
import { ActivityFormModal } from './ActivityFormModal';
import { ActivityDetailModal } from './ActivityDetailModal';
import { ActivityCategoriesModal } from './ActivityCategoriesModal';
import {
  LayoutDashboard,
  Calendar,
  Tag,
  PlusCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ActivitiesCMSProps {
  onNavigate: (path: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ActivitiesCMS: React.FC<ActivitiesCMSProps> = ({ onNavigate, onShowToast }) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'list'>('overview');

  // Data States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActivitiesDashboardStats>({
    total: 0,
    published: 0,
    upcoming: 0,
    past: 0,
    draft: 0,
    recent: []
  });
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<ActivityRecord | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const canManageCategories = role === 'SUPER_ADMIN' || role === 'EVENTS_MANAGER';

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Categories
      const cats = await fetchActivityCategories();
      setCategories(cats);

      // 2. Stats
      const s = await fetchActivitiesDashboardStats();
      setStats(s);

      // 3. Activities
      const actList = await fetchAdminActivities();
      setActivities(actList);
    } catch (err: any) {
      console.error('[ActivitiesCMS] Error loading data:', err);
      onShowToast('Data Load Notice', err.message || 'Could not fetch activities.', 'warning');
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Activity Save (Create or Update)
  const handleSaveActivity = async (
    payload: ActivityInputPayload,
    posterFile?: File | null,
    galleryFiles?: File[],
    removedGalleryIds?: string[]
  ) => {
    if (activityToEdit) {
      await updateActivity(
        activityToEdit.id,
        payload,
        posterFile,
        galleryFiles,
        removedGalleryIds
      );
    } else {
      await createActivity(payload, posterFile, galleryFiles);
    }
    await loadAllData();
  };

  // Activity Delete
  const handleDeleteActivity = async (activity: ActivityRecord) => {
    try {
      await deleteActivity(activity.id);
      onShowToast('Activity Removed', `"${activity.title}" was deleted.`, 'info');
      await loadAllData();
    } catch (err: any) {
      onShowToast('Delete Error', err.message || 'Failed to delete activity.', 'warning');
      throw err;
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (
    activity: ActivityRecord,
    newStatus: ActivityPublicationStatus
  ) => {
    try {
      await setActivityPublicationStatus(activity.id, newStatus);
      onShowToast(
        'Status Updated',
        `"${activity.title}" is now ${newStatus}.`,
        'success'
      );
      await loadAllData();

      // If detail modal is open with this activity, update it
      if (selectedActivity && selectedActivity.id === activity.id) {
        setSelectedActivity({ ...selectedActivity, status: newStatus });
      }
    } catch (err: any) {
      onShowToast('Status Error', err.message || 'Failed to update status.', 'warning');
    }
  };

  // Quick Featured Toggle
  const handleToggleFeatured = async (activity: ActivityRecord, isFeatured: boolean) => {
    try {
      await toggleActivityFeatured(activity.id, isFeatured);
      onShowToast(
        'Featured State Changed',
        isFeatured ? `Added "${activity.title}" to featured banner.` : `Removed from featured banner.`,
        'success'
      );
      await loadAllData();
    } catch (err: any) {
      onShowToast('Error', err.message || 'Failed to update featured flag.', 'warning');
    }
  };

  // Open Handlers
  const handleOpenNewModal = () => {
    setActivityToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (activity: ActivityRecord) => {
    setActivityToEdit(activity);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* 1. Sub-navigation Tabs */}
      <div className="bg-white rounded-2xl border border-forest/15 p-2 shadow-soft flex flex-wrap items-center justify-between gap-2">

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'overview'
                ? 'bg-forest text-white shadow-soft hover:bg-emerald-deep'
                : 'text-forest hover:bg-forest/10'
              }`}
          >
            <LayoutDashboard className="w-4 h-4 text-gold" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'list'
                ? 'bg-forest text-white shadow-soft hover:bg-emerald-deep'
                : 'text-forest hover:bg-forest/10'
              }`}
          >
            <Calendar className="w-4 h-4 text-gold" />
            <span>All Activities ({activities.length})</span>
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCategoriesModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-forest/20 text-forest hover:bg-forest/5 text-xs font-semibold transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={loadAllData}
            title="Refresh All"
            className="p-2 rounded-xl border border-forest/20 text-forest hover:bg-forest/5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('/activities')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-forest/5 hover:bg-forest/10 text-forest text-xs font-semibold transition-colors border border-forest/15"
          >
            <span>Live Public Page</span>
            <ExternalLink className="w-3 h-3 text-gold" />
          </button>
        </div>

      </div>

      {/* 2. Main Tab Views */}
      {activeTab === 'overview' && (
        <ActivitiesDashboardView
          stats={stats}
          loading={loading}
          onSelectTab={setActiveTab}
          onOpenNewActivityModal={handleOpenNewModal}
          onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
          onViewActivity={handleOpenDetailModal}
          onRefresh={loadAllData}
        />
      )}

      {activeTab === 'list' && (
        <ActivitiesListView
          activities={activities}
          categories={categories}
          loading={loading}
          onOpenNewActivityModal={handleOpenNewModal}
          onViewActivity={handleOpenDetailModal}
          onEditActivity={handleOpenEditModal}
          onDeleteActivity={handleDeleteActivity}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* 3. Modals */}
      <ActivityFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        activityToEdit={activityToEdit}
        categories={categories}
        onSave={handleSaveActivity}
        onShowToast={onShowToast}
      />

      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activity={selectedActivity}
        onEdit={(act) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(act);
        }}
        onToggleStatus={handleToggleStatus}
      />

      <ActivityCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        onRefreshCategories={async () => {
          const cats = await fetchActivityCategories();
          setCategories(cats);
        }}
        onShowToast={onShowToast}
        canManage={canManageCategories}
      />

    </div>
  );
};
