import React, { useState, useEffect, useRef } from 'react';
import { 
  ActivityRecord, 
  ActivityCategory, 
  ActivityPublicationStatus,
  ActivityGalleryItem
} from '../../../types/activity';
import { ActivityInputPayload } from '../../../lib/activitiesService';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Link as LinkIcon, 
  Phone, 
  Star, 
  Loader2, 
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit: ActivityRecord | null;
  categories: ActivityCategory[];
  onSave: (
    data: ActivityInputPayload,
    posterFile?: File | null,
    galleryFiles?: File[],
    removedGalleryIds?: string[]
  ) => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  activityToEdit,
  categories,
  onSave,
  onShowToast
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [venue, setVenue] = useState('');
  const [speakerDetails, setSpeakerDetails] = useState('');
  const [organizingBody, setOrganizingBody] = useState('Department of Islamic Economics and Finance');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [status, setStatus] = useState<ActivityPublicationStatus>('Draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');

  // Media files state
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  
  // Gallery
  const [existingGallery, setExistingGallery] = useState<ActivityGalleryItem[]>([]);
  const [removedGalleryIds, setRemovedGalleryIds] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const posterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setShortDescription(activityToEdit.short_description);
      setFullDescription(activityToEdit.full_description || '');
      setCategoryName(activityToEdit.category_name);
      setStartDate(activityToEdit.start_date);
      setStartTime(activityToEdit.start_time || '09:30 AM');
      setEndDate(activityToEdit.end_date || '');
      setEndTime(activityToEdit.end_time || '04:30 PM');
      setVenue(activityToEdit.venue);
      setSpeakerDetails(activityToEdit.speaker_details || '');
      setOrganizingBody(activityToEdit.organizing_body || 'Department of Islamic Economics and Finance');
      setRegistrationUrl(activityToEdit.registration_url || '');
      setContactInfo(activityToEdit.contact_info || '');
      setStatus(activityToEdit.status);
      setIsFeatured(activityToEdit.is_featured);
      setFeaturedImageUrl(activityToEdit.featured_image_url || '');
      setPosterPreview(activityToEdit.featured_image_url || null);
      setExistingGallery(activityToEdit.gallery || []);
    } else {
      // Defaults for new activity
      setTitle('');
      setShortDescription('');
      setFullDescription('');
      setCategoryName(categories[0]?.name || 'Seminars');
      setStartDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:30 AM');
      setEndDate('');
      setEndTime('04:30 PM');
      setVenue('DIEF Academic Auditorium, DHIU Chemmad');
      setSpeakerDetails('');
      setOrganizingBody('Department of Islamic Economics and Finance');
      setRegistrationUrl('');
      setContactInfo('dief@dhiu.in | +91 494 2460575');
      setStatus('Draft');
      setIsFeatured(false);
      setFeaturedImageUrl('');
      setPosterPreview(null);
      setExistingGallery([]);
    }

    setPosterFile(null);
    setRemovedGalleryIds([]);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
    setError(null);
  }, [activityToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Handle poster image selection
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Featured poster must be an image (JPEG, PNG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Poster image exceeds maximum 5MB size limit.');
        return;
      }
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Handle gallery files selection
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      const validFiles: File[] = [];
      const newPreviews: string[] = [];

      for (const file of selected) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) continue;
        validFiles.push(file);
      }

      setNewGalleryFiles((prev) => [...prev, ...validFiles]);

      validFiles.forEach((f) => {
        const reader = new FileReader();
        reader.onload = () => {
          setNewGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(f);
      });
    }
  };

  const handleRemoveExistingGalleryItem = (galleryId: string) => {
    setExistingGallery((prev) => prev.filter((item) => item.id !== galleryId));
    setRemovedGalleryIds((prev) => [...prev, galleryId]);
  };

  const handleRemoveNewGalleryItem = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Activity title is required.');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }
    if (!categoryName) {
      setError('Please select a category.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (!venue.trim()) {
      setError('Venue is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const matchedCat = categories.find((c) => c.name === categoryName);

    const payload: ActivityInputPayload = {
      title: title.trim(),
      short_description: shortDescription.trim(),
      full_description: fullDescription.trim() || null,
      category_id: matchedCat?.id || null,
      category_name: categoryName,
      start_date: startDate,
      start_time: startTime.trim() || null,
      end_date: endDate || null,
      end_time: endTime.trim() || null,
      venue: venue.trim(),
      speaker_details: speakerDetails.trim() || null,
      organizing_body: organizingBody.trim() || 'Department of Islamic Economics and Finance',
      registration_url: registrationUrl.trim() || null,
      contact_info: contactInfo.trim() || null,
      status,
      is_featured: isFeatured,
      featured_image_url: featuredImageUrl.trim() || null
    };

    try {
      await onSave(payload, posterFile, newGalleryFiles, removedGalleryIds);
      onShowToast(
        activityToEdit ? 'Activity Updated' : 'Activity Created',
        `"${title.trim()}" saved successfully.`,
        'success'
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save activity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-forest/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-forest px-6 sm:px-8 py-5 text-white flex items-center justify-between border-b-2 border-gold/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gold/20 text-gold border border-gold/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold">
                {activityToEdit ? 'Edit Academic Activity' : 'Add New Activity'}
              </h2>
              <p className="text-xs text-sage-light">
                {activityToEdit ? `Updating: ${activityToEdit.title}` : 'Publish seminars, conferences, and student events'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-ivory/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1 flex items-center justify-between">
              <span>Event Details</span>
              <span className="text-[11px] text-muted font-normal">* Indicates required field</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Activity Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., National Seminar on Contemporary Islamic Banking & Shariah Audit Architecture"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Organizing Body / Committee
                </label>
                <input
                  type="text"
                  value={organizingBody}
                  onChange={(e) => setOrganizingBody(e.target.value)}
                  placeholder="e.g., Department of Islamic Economics and Finance"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Short Description (Overview) *
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                placeholder="A concise 1-2 sentence overview for cards and listings..."
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Full Description & Programme Details (Optional)
              </label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                rows={4}
                placeholder="Comprehensive description of topics, session schedules, participating scholars, and outcomes..."
                className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          {/* Section 2: Date, Time & Location */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Date, Timing & Venue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="09:30 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="04:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Venue / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g., DIEF Academic Auditorium, DHIU Chemmad"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Speakers, Guests & Resource Persons
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={speakerDetails}
                    onChange={(e) => setSpeakerDetails(e.target.value)}
                    placeholder="e.g., Dr. Luqmanul Hakeem, Guest Shariah Scholars"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Poster Upload */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1 flex items-center justify-between">
              <span>Event Poster & Gallery</span>
              <span className="text-[11px] text-muted font-normal">Stored securely in Supabase Storage (`activities` bucket)</span>
            </h3>

            {/* Featured Poster Upload */}
            <div className="bg-sand/30 p-5 rounded-2xl border border-sand-dark/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-forest">Featured Poster / Banner Image</h4>
                  <p className="text-xs text-muted">Recommended: 16:9 ratio, max 5MB (JPEG, PNG, WebP)</p>
                </div>
                {posterPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPosterFile(null);
                      setPosterPreview(null);
                      setFeaturedImageUrl('');
                    }}
                    className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Poster</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {posterPreview ? (
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border-2 border-gold/40 shadow-sm relative group bg-black/5 flex-shrink-0">
                    <img 
                      src={posterPreview} 
                      alt="Poster Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Poster Selected
                    </div>
                  </div>
                ) : (
                  <div className="w-full sm:w-48 h-32 rounded-xl border-2 border-dashed border-sand-dark bg-white flex flex-col items-center justify-center text-muted text-xs flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-sand-dark mb-1" />
                    <span>No Poster Set</span>
                  </div>
                )}

                <div className="w-full space-y-2">
                  <input
                    type="file"
                    ref={posterInputRef}
                    onChange={handlePosterChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => posterInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest text-white hover:bg-forest-light text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-gold" />
                    <span>{posterPreview ? 'Change Poster Image' : 'Upload Poster Image'}</span>
                  </button>
                  <p className="text-[11px] text-muted">Or provide a direct image URL below:</p>
                  <input
                    type="url"
                    value={featuredImageUrl}
                    onChange={(e) => {
                      setFeaturedImageUrl(e.target.value);
                      if (!posterFile) setPosterPreview(e.target.value || null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-1.5 rounded-lg border border-sand-dark bg-white text-xs text-forest placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Images Upload */}
            <div className="bg-sand/30 p-5 rounded-2xl border border-sand-dark/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-forest">Additional Photo Gallery</h4>
                  <p className="text-xs text-muted">Upload high-resolution event photographs</p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-sand-dark hover:bg-sand text-forest text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold" />
                    <span>Add Photos</span>
                  </button>
                </div>
              </div>

              {/* Grid of Existing and New Gallery Images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {/* Existing Gallery Images */}
                {existingGallery.map((item) => (
                  <div key={item.id} className="relative aspect-video rounded-lg overflow-hidden border border-sand-dark group">
                    <img src={item.image_url} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingGalleryItem(item.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">Saved</span>
                  </div>
                ))}

                {/* New Gallery Previews */}
                {newGalleryPreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gold/50 group">
                    <img src={preview} alt="New upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewGalleryItem(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Cancel upload"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] bg-gold text-forest font-semibold px-1 rounded">New</span>
                  </div>
                ))}

                {existingGallery.length === 0 && newGalleryPreviews.length === 0 && (
                  <div className="col-span-full py-4 text-center text-xs text-muted border border-dashed border-sand-dark rounded-xl">
                    No additional gallery photos added yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Registration, Contact & Publication */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-sand pb-1">
              Registration, Contact & Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Registration URL (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://forms.gle/... or https://dief.dhiu.in/register/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Contact Information (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g., dief@dhiu.in | +91 494 2460575"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark bg-white text-sm text-forest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-sand/20 border border-sand-dark/40 items-center">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ActivityPublicationStatus)}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-dark bg-white text-sm text-forest font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="Draft">Draft (Internal Only)</option>
                  <option value="Published">Published (Publicly Visible)</option>
                  <option value="Archived">Archived (Internal Archive)</option>
                </select>
                <p className="text-[11px] text-muted mt-1">
                  Only <strong>Published</strong> activities appear on the public DIEF portal.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2 sm:pt-0">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 text-forest rounded border-sand-dark focus:ring-gold accent-forest"
                />
                <label htmlFor="featuredToggle" className="cursor-pointer">
                  <div className="text-sm font-semibold text-forest flex items-center space-x-1.5">
                    <Star className={`w-4 h-4 ${isFeatured ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                    <span>Featured Activity Banner</span>
                  </div>
                  <span className="text-xs text-muted block">
                    Highlight in top featured banner on public activities page
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-sand flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-sand-dark text-forest font-semibold text-sm hover:bg-sand transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forest hover:bg-forest-light text-white rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>Saving Activity...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  <span>{activityToEdit ? 'Save Changes' : 'Create Activity'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
