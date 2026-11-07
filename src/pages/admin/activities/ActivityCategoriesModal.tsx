import React, { useState } from 'react';
import { ActivityCategory } from '../../../types/activity';
import { createActivityCategory, deleteActivityCategory } from '../../../lib/activitiesService';
import { 
  X, 
  FolderPlus, 
  Trash2, 
  Tag, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ActivityCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ActivityCategory[];
  onRefreshCategories: () => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  canManage: boolean;
}

export const ActivityCategoriesModal: React.FC<ActivityCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRefreshCategories,
  onShowToast,
  canManage
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setError('Please provide a category name.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createActivityCategory(newCatName, newCatDesc);
      onShowToast('Category Created', `"${newCatName.trim()}" added successfully.`, 'success');
      setNewCatName('');
      setNewCatDesc('');
      await onRefreshCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to add category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: ActivityCategory) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    setDeletingId(cat.id);
    try {
      await deleteActivityCategory(cat.id);
      onShowToast('Category Removed', `"${cat.name}" has been deleted.`, 'info');
      await onRefreshCategories();
    } catch (err: any) {
      onShowToast('Delete Failed', err.message || 'Could not delete category.', 'warning');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-forest/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-forest px-6 py-5 text-white flex items-center justify-between border-b-2 border-gold/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-editorial font-bold">Activity Categories</h2>
              <p className="text-xs text-sage-light">Organize academic events, seminars, and programs</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-ivory/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Add Category Form (if allowed) */}
          {canManage && (
            <form onSubmit={handleAddCategory} className="bg-sand/30 p-5 rounded-2xl border border-sand-dark/30 space-y-4">
              <div className="flex items-center space-x-2 text-forest font-semibold text-sm">
                <FolderPlus className="w-4 h-4 text-gold" />
                <span>Add New Category</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g., Symposiums, Webinars)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required
                />
                <input
                  type="text"
                  placeholder="Optional brief description"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !newCatName.trim()}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Adding Category...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4 text-gold" />
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Categories List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Configured Categories ({categories.length})
            </h3>
            <div className="divide-y divide-sand border border-sand-dark/30 rounded-2xl overflow-hidden bg-white">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">No categories configured.</div>
              ) : (
                categories.map((cat, idx) => (
                  <div key={cat.id || idx} className="p-4 flex items-center justify-between hover:bg-sand/10 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-forest text-sm">{cat.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand text-muted">
                          {cat.slug}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-muted leading-relaxed">{cat.description}</p>
                      )}
                    </div>
                    {canManage && (
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        disabled={deletingId === cat.id}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        {deletingId === cat.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-sand/30 border-t border-sand flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-sand-dark text-forest font-semibold text-sm hover:bg-sand transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
