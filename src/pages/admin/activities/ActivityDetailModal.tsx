import React, { useState } from 'react';
import { ActivityRecord, ActivityPublicationStatus } from '../../../types/activity';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Link as LinkIcon, 
  Phone, 
  Star, 
  Edit, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  FileText
} from 'lucide-react';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityRecord | null;
  onEdit: (activity: ActivityRecord) => void;
  onToggleStatus: (activity: ActivityRecord, newStatus: ActivityPublicationStatus) => Promise<void>;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  onEdit,
  onToggleStatus
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  if (!isOpen || !activity) return null;

  const getStatusBadge = (status: ActivityPublicationStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const allImages: string[] = [];
  if (activity.featured_image_url) allImages.push(activity.featured_image_url);
  if (activity.gallery && activity.gallery.length > 0) {
    activity.gallery.forEach((g) => {
      if (g.image_url && !allImages.includes(g.image_url)) {
        allImages.push(g.image_url);
      }
    });
  }

  const isUpcoming = new Date(activity.start_date) >= new Date(new Date().toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-forest/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-forest px-6 sm:px-8 py-5 text-white flex items-center justify-between border-b-2 border-gold/40">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(activity.status)}`}>
              {activity.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold border border-gold/30">
              {activity.category_name}
            </span>
            {activity.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center space-x-1">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>Featured</span>
              </span>
            )}
            {isUpcoming ? (
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Upcoming
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] bg-white/10 text-white/70 border border-white/20 font-medium">
                Past Event
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold text-xs font-semibold border border-gold/30 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Banner Poster if present */}
          {activity.featured_image_url && (
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-forest/15 shadow-sm relative group bg-forest/5">
              <img 
                src={activity.featured_image_url} 
                alt={activity.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-mono">
                Official Poster
              </div>
            </div>
          )}

          {/* Title & Overview */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-forest leading-tight">
              {activity.title}
            </h1>
            <p className="text-base text-charcoal-light leading-relaxed font-sans bg-forest/5 p-4 rounded-xl border border-forest/15">
              {activity.short_description}
            </p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-forest/5 border border-forest/15 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Date & Schedule</span>
              </span>
              <p className="font-semibold text-forest">
                {new Date(activity.start_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              {activity.start_time && (
                <p className="text-xs text-muted flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{activity.start_time} {activity.end_time ? `– ${activity.end_time}` : ''}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>Venue</span>
              </span>
              <p className="font-semibold text-forest leading-snug">{activity.venue}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-gold" />
                <span>Organizing Body</span>
              </span>
              <p className="font-semibold text-forest leading-snug">
                {activity.organizing_body || 'Department of Islamic Economics and Finance'}
              </p>
            </div>

            {activity.speaker_details && (
              <div className="space-y-1 sm:col-span-2 md:col-span-3 pt-2 border-t border-forest/10">
                <span className="text-xs font-semibold text-muted flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span>Keynote Speakers & Guests</span>
                </span>
                <p className="font-semibold text-forest">{activity.speaker_details}</p>
              </div>
            )}
          </div>

          {/* Full Description / Details */}
          {activity.full_description && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-forest/15 pb-1 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-gold" />
                <span>Comprehensive Programme Description</span>
              </h3>
              <div className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line p-4 rounded-xl bg-white border border-forest/15">
                {activity.full_description}
              </div>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {activity.gallery && activity.gallery.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-forest border-b border-forest/15 pb-1">
                Event Photo Gallery ({activity.gallery.length} Images)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {activity.gallery.map((img, idx) => (
                  <div 
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-forest/15 cursor-pointer group shadow-sm hover:border-gold transition-all"
                  >
                    <img 
                      src={img.image_url} 
                      alt={img.caption || `Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 text-white text-[10px] truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links & Contact */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-forest/5 border border-forest/15">
            <div className="space-y-1">
              {activity.contact_info && (
                <div className="flex items-center space-x-2 text-xs text-forest">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  <span><strong>Contact:</strong> {activity.contact_info}</span>
                </div>
              )}
              <div className="text-[11px] text-muted">
                Created on {new Date(activity.created_at).toLocaleDateString()} • Last updated {new Date(activity.updated_at).toLocaleDateString()}
              </div>
            </div>

            {activity.registration_url && (
              <a
                href={activity.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-forest hover:bg-emerald-deep text-white rounded-xl text-xs font-semibold shadow-soft transition-colors"
              >
                <span>Registration Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-forest/5 border-t border-forest/15 flex items-center justify-between">
          <div>
            {activity.status === 'Published' ? (
              <button
                onClick={() => onToggleStatus(activity, 'Draft')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                Unpublish (Revert to Draft)
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(activity, 'Published')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                Publish Live to Website
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-emerald-deep shadow-soft transition-colors"
            >
              Edit Activity
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-forest/15 text-forest text-xs font-semibold hover:bg-forest/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox for gallery images if an image is clicked */}
      {activeImageIndex !== null && activity.gallery && activity.gallery[activeImageIndex] && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setActiveImageIndex(null)}
        >
          <button 
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>

          <img 
            src={activity.gallery[activeImageIndex].image_url} 
            alt="Enlarged view" 
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />

          {activity.gallery[activeImageIndex].caption && (
            <div className="absolute bottom-6 inset-x-0 text-center text-white text-sm bg-black/50 py-2 max-w-xl mx-auto rounded-lg">
              {activity.gallery[activeImageIndex].caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
