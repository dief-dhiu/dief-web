import React, { useState } from 'react';
import { FacultyCategory } from '../../../types/faculty';
import { createFacultyCategory, deleteFacultyCategory } from '../../../lib/facultyService';
import { X, Tag, FolderPlus, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface FacultyCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FacultyCategory[];
  onRefresh: () => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  canManage: boolean;
}

export const FacultyCategoriesModal: React.FC<FacultyCategoriesModalProps> = ({
  isOpen, onClose, categories, onRefresh, onShowToast, canManage
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required.'); return; }
    setSubmitting(true); setError(null);
    try {
      await createFacultyCategory(name, desc);
      onShowToast('Category Created', `"${name.trim()}" added.`, 'success');
      setName(''); setDesc('');
      await onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to add category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: FacultyCategory) => {
    if (!window.confirm(`Delete category "${cat.name}"? Faculty assigned to it will be uncategorised.`)) return;
    setDeletingId(cat.id);
    try {
      await deleteFacultyCategory(cat.id);
      onShowToast('Category Removed', `"${cat.name}" deleted.`, 'info');
      await onRefresh();
    } catch (err: any) {
      onShowToast('Delete Failed', err.message, 'warning');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-forest/15 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">

        {/* Header */}
        <div className="bg-forest px-6 py-5 flex items-center justify-between border-b-2 border-gold/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-editorial font-bold text-white">Faculty Categories</h2>
              <p className="text-xs text-sage-light">Organise staff by role or department</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Add form */}
          {canManage && (
            <form onSubmit={handleAdd} className="bg-forest/5 p-5 rounded-2xl border border-forest/15 space-y-3">
              <div className="flex items-center space-x-2 text-forest font-semibold text-sm">
                <FolderPlus className="w-4 h-4 text-gold" />
                <span>Add New Category</span>
              </div>
              <input
                type="text" placeholder="Category name" value={name}
                onChange={e => setName(e.target.value)} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/15 bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <input
                type="text" placeholder="Optional description" value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/15 bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <button
                type="submit" disabled={submitting || !name.trim()}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-forest hover:bg-emerald-deep text-white rounded-xl text-sm font-semibold shadow-soft transition disabled:opacity-50"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin text-gold" /><span>Adding…</span></> : <><FolderPlus className="w-4 h-4 text-gold" /><span>Create Category</span></>}
              </button>
            </form>
          )}

          {/* List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Current Categories ({categories.length})
            </h3>
            <div className="divide-y divide-forest/10 border border-forest/15 rounded-2xl overflow-hidden bg-white">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">No categories yet.</div>
              ) : categories.map((cat, i) => (
                <div key={cat.id || i} className="p-4 flex items-center justify-between hover:bg-forest/5 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-forest text-sm">{cat.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest/10 text-forest">{cat.slug}</span>
                    </div>
                    {cat.description && <p className="text-xs text-muted mt-0.5">{cat.description}</p>}
                  </div>
                  {canManage && (
                    <button onClick={() => handleDelete(cat)} disabled={deletingId === cat.id}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors">
                      {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-forest/5 border-t border-forest/15 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-forest/15 text-forest font-semibold text-sm hover:bg-forest/10 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
