import React, { useState, useEffect, useRef } from 'react';
import { FacultyProfile, FacultyCategory, FacultyPublicationStatus } from '../../../types/faculty';
import { FacultyProfileInput } from '../../../lib/facultyService';
import {
  X, Upload, Image as ImageIcon, User, GraduationCap,
  Mail, Phone, Link as LinkIcon, ArrowUp, ArrowDown,
  Loader2, AlertCircle, CheckCircle2, Briefcase
} from 'lucide-react';

interface FacultyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit: FacultyProfile | null;
  categories: FacultyCategory[];
  onSave: (data: FacultyProfileInput, photoFile?: File | null) => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const FacultyFormModal: React.FC<FacultyFormModalProps> = ({
  isOpen, onClose, profileToEdit, categories, onSave, onShowToast
}) => {
  // ── Core fields ──────────────────────────────────────────────────────────────
  const [fullName,          setFullName]          = useState('');
  const [designation,       setDesignation]       = useState('');
  const [department,        setDepartment]        = useState('Department of Islamic Economics and Finance');
  const [categoryName,      setCategoryName]      = useState('');
  const [categoryId,        setCategoryId]        = useState<string | null>(null);
  const [employmentType,    setEmploymentType]    = useState('');
  const [shortBio,          setShortBio]          = useState('');
  const [fullBio,           setFullBio]           = useState('');
  const [qualifications,    setQualifications]    = useState('');
  const [specializations,   setSpecializations]   = useState('');
  const [researchInterests, setResearchInterests] = useState('');
  const [publications,      setPublications]      = useState('');
  const [email,             setEmail]             = useState('');
  const [officeInfo,        setOfficeInfo]        = useState('');
  const [profileLinks,      setProfileLinks]      = useState('');
  const [displayOrder,      setDisplayOrder]      = useState(0);
  const [status,            setStatus]            = useState<FacultyPublicationStatus>('Draft');
  const [photoUrl,          setPhotoUrl]          = useState('');

  // ── Photo upload ──────────────────────────────────────────────────────────────
  const [photoFile,    setPhotoFile]    = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── UI state ──────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // ── Populate when editing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (profileToEdit) {
      setFullName(profileToEdit.full_name);
      setDesignation(profileToEdit.designation);
      setDepartment(profileToEdit.department);
      setCategoryName(profileToEdit.category_name);
      setCategoryId(profileToEdit.category_id || null);
      setEmploymentType(profileToEdit.employment_type || '');
      setShortBio(profileToEdit.short_bio || '');
      setFullBio(profileToEdit.full_bio || '');
      setQualifications(profileToEdit.qualifications || '');
      setSpecializations(profileToEdit.specializations || '');
      setResearchInterests(profileToEdit.research_interests || '');
      setPublications(profileToEdit.publications || '');
      setEmail(profileToEdit.email || '');
      setOfficeInfo(profileToEdit.office_info || '');
      setProfileLinks(profileToEdit.profile_links || '');
      setDisplayOrder(profileToEdit.display_order);
      setStatus(profileToEdit.status);
      setPhotoUrl(profileToEdit.photo_url || '');
      setPhotoPreview(profileToEdit.photo_url || null);
    } else {
      setFullName(''); setDesignation('');
      setDepartment('Department of Islamic Economics and Finance');
      setCategoryName(categories[0]?.name || '');
      setCategoryId(categories[0]?.id || null);
      setEmploymentType('Full-time');
      setShortBio(''); setFullBio(''); setQualifications('');
      setSpecializations(''); setResearchInterests('');
      setPublications(''); setEmail('islamiceco@darulhudaiu.ac.in');
      setOfficeInfo(''); setProfileLinks('');
      setDisplayOrder(0); setStatus('Draft');
      setPhotoUrl(''); setPhotoPreview(null);
    }
    setPhotoFile(null); setError(null);
  }, [isOpen, profileToEdit, categories]);

  if (!isOpen) return null;

  // ── Photo selection ───────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Photo must be an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('Photo must not exceed 5 MB.'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleCategoryChange = (name: string) => {
    setCategoryName(name);
    const cat = categories.find(c => c.name === name);
    setCategoryId(cat?.id || null);
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim())   { setError('Full name is required.'); return; }
    if (!designation.trim()) { setError('Designation is required.'); return; }
    if (!categoryName)      { setError('Please select a category.'); return; }

    setSubmitting(true); setError(null);

    const payload: FacultyProfileInput = {
      full_name:          fullName.trim(),
      designation:        designation.trim(),
      department:         department.trim(),
      category_id:        categoryId,
      category_name:      categoryName,
      employment_type:    employmentType.trim() || null,
      photo_url:          photoUrl.trim() || null,
      short_bio:          shortBio.trim() || null,
      full_bio:           fullBio.trim() || null,
      qualifications:     qualifications.trim() || null,
      specializations:    specializations.trim() || null,
      research_interests: researchInterests.trim() || null,
      publications:       publications.trim() || null,
      email:              email.trim() || null,
      office_info:        officeInfo.trim() || null,
      profile_links:      profileLinks.trim() || null,
      display_order:      displayOrder,
      status
    };

    try {
      await onSave(payload, photoFile);
      onShowToast(
        profileToEdit ? 'Profile Updated' : 'Profile Created',
        `"${fullName.trim()}" saved successfully.`,
        'success'
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-forest/15 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">

        {/* Header */}
        <div className="bg-forest px-6 sm:px-8 py-5 flex items-center justify-between border-b-2 border-gold/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gold/20 text-gold border border-gold/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold text-white">
                {profileToEdit ? 'Edit Faculty Profile' : 'Add Faculty Member'}
              </h2>
              <p className="text-xs text-sage-light">
                {profileToEdit ? `Editing: ${profileToEdit.full_name}` : 'Create a new academic staff profile'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-ivory/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Section 1: Identity ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Identity & Role
              <span className="text-muted font-normal ml-2 normal-case">* required</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Full Name *</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Khalid Hassan Al-Rashidi"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Designation *</label>
                <input type="text" value={designation} onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor, Head of Department"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Category *</label>
                <select value={categoryName} onChange={e => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required>
                  {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Employment Type</label>
                <select value={employmentType} onChange={e => setEmploymentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50">
                  <option value="">— Unspecified —</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Visiting</option>
                  <option>Adjunct</option>
                  <option>Emeritus</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Academic Department</label>
              <input type="text" value={department} onChange={e => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          {/* ── Section 2: Photo ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Profile Photograph
            </h3>

            <div className="bg-sand/30 p-5 rounded-2xl border border-sand-dark/40 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold/40 bg-sand flex-shrink-0 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-forest/30" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input type="file" ref={photoInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                <button type="button" onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest text-white hover:bg-forest-light text-xs font-semibold shadow-sm transition-colors">
                  <Upload className="w-4 h-4 text-gold" />
                  <span>{photoPreview ? 'Replace Photo' : 'Upload Photo'}</span>
                </button>
                {photoPreview && (
                  <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(''); }}
                    className="ml-2 text-xs text-rose-600 hover:underline">
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-muted">Max 5 MB · JPEG, PNG or WebP · Stored in Supabase `faculty` bucket</p>
                <p className="text-[11px] text-muted">Or provide a direct image URL:</p>
                <input type="url" value={photoUrl}
                  onChange={e => { setPhotoUrl(e.target.value); if (!photoFile) setPhotoPreview(e.target.value || null); }}
                  placeholder="https://…"
                  className="w-full px-3 py-1.5 rounded-lg border border-sand-dark bg-white text-xs text-forest placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Biography & Academics ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Biography & Academic Profile
            </h3>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Short Biography (Card Preview)</label>
              <textarea value={shortBio} onChange={e => setShortBio(e.target.value)} rows={2}
                placeholder="A one to two sentence academic profile summary shown on faculty cards…"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Full Biography (Detail View)</label>
              <textarea value={fullBio} onChange={e => setFullBio(e.target.value)} rows={4}
                placeholder="Comprehensive academic biography, career background, and institutional contributions…"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Academic Qualifications</label>
              <input type="text" value={qualifications} onChange={e => setQualifications(e.target.value)}
                placeholder="e.g. Ph.D. in Economics, Calicut University · M.A. in Islamic Finance, INCEIF"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Areas of Specialization</label>
                <textarea value={specializations} onChange={e => setSpecializations(e.target.value)} rows={2}
                  placeholder="e.g. Islamic Banking, Fiqh al-Muamalat, Zakat Institutions"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Research Interests</label>
                <textarea value={researchInterests} onChange={e => setResearchInterests(e.target.value)} rows={2}
                  placeholder="e.g. Sukuk Structuring, Ethical Investment Screening, Waqf Management"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Publications / Selected Works (Optional)</label>
              <textarea value={publications} onChange={e => setPublications(e.target.value)} rows={3}
                placeholder="List notable papers, books or chapters authored…"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
          </div>

          {/* ── Section 4: Contact & Links ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Contact & Professional Links (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="faculty@darulhudaiu.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Office / Contact Info</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input type="text" value={officeInfo} onChange={e => setOfficeInfo(e.target.value)}
                    placeholder="+91 XXX XXX XXXX or Room 204"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">Professional Profile Links (Optional)</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                <input type="text" value={profileLinks} onChange={e => setProfileLinks(e.target.value)}
                  placeholder="https://orcid.org/… · https://scholar.google.com/…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
            </div>
          </div>

          {/* ── Section 5: Publication & Ordering ── */}
          <div className="space-y-4 p-5 rounded-2xl bg-sand/20 border border-sand-dark/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest">
              Publication Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Publication Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as FacultyPublicationStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50">
                  <option value="Draft">Draft — Internal Only</option>
                  <option value="Published">Published — Publicly Visible</option>
                  <option value="Archived">Archived — Hidden</option>
                </select>
                <p className="text-[11px] text-muted mt-1">Only <strong>Published</strong> profiles appear on the public website.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">Display Order</label>
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))}
                  min={0} step={1}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <p className="text-[11px] text-muted mt-1">Lower numbers appear first on the public page.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-sand flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-sand-dark text-forest font-semibold text-sm hover:bg-sand transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forest hover:bg-forest-light text-white rounded-xl text-sm font-semibold shadow-md transition disabled:opacity-50">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin text-gold" /><span>Saving…</span></>
                : <><CheckCircle2 className="w-4 h-4 text-gold" /><span>{profileToEdit ? 'Save Changes' : 'Create Profile'}</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
