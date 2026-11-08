import React, { useState } from 'react';
import { 
  ConsultationRequest, 
  PaperSubmission, 
  ContactMessage, 
  EventItem, 
  ResourceItem 
} from '../types';
import { 
  X, 
  Settings, 
  Briefcase, 
  BookOpen, 
  Mail, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  ShieldCheck,
  FileCheck,
  Calendar,
  Download
} from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  consultations: ConsultationRequest[];
  onUpdateConsultationStatus: (id: string, status: ConsultationRequest['status']) => void;
  submissions: PaperSubmission[];
  onUpdateSubmissionStatus: (id: string, status: PaperSubmission['status']) => void;
  messages: ContactMessage[];
  onAddEvent: (event: Omit<EventItem, 'id'>) => void;
  onAddResource?: (resource: Omit<ResourceItem, 'id'>) => void;
  onResetData: () => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  consultations,
  onUpdateConsultationStatus,
  submissions,
  onUpdateSubmissionStatus,
  messages,
  onAddEvent,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'sbc' | 'tamweel' | 'contact' | 'newEvent'>('sbc');

  // Form states for new event
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<EventItem['category']>('Seminars');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('Department Seminar Hall, DHIU Campus');
  const [eventDesc, setEventDesc] = useState('');
  const [eventSpeaker, setEventSpeaker] = useState('[Designated Guest Speaker]');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim()) return;

    onAddEvent({
      title: eventTitle,
      category: eventCategory,
      date: eventDate,
      year: parseInt(eventDate.match(/\d{4}/)?.[0] || '2026', 10),
      time: '10:00 AM – 01:00 PM IST',
      venue: eventVenue,
      description: eventDesc || 'Academic session organized by the Department of Islamic Economics and Finance.',
      speakerPlaceholder: eventSpeaker,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      isUpcoming: true
    });

    setEventTitle('');
    setEventDate('');
    setEventDesc('');
    setFeedbackMsg('New departmental event published to the portal!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-forest-dark/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-gold/40 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-forest text-white p-5 flex items-center justify-between border-b border-gold/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-forest-dark rounded-xl border border-gold/30 text-gold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold font-editorial text-white">Department CMS Hub</span>
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30 font-semibold">
                  Admin Verified
                </span>
              </div>
              <p className="text-xs text-sage-light">
                Manage inquiries, submissions, live content updates & event listings
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-sage-light hover:text-white hover:bg-emerald-deep/40 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-forest/5 border-b border-forest/10 px-4 flex items-center space-x-2 overflow-x-auto py-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sbc')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'sbc' 
                ? 'bg-forest text-white shadow-soft' 
                : 'text-charcoal hover:bg-forest/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-gold" />
            <span>SBC Consultations</span>
            <span className="px-1.5 py-0.2 bg-gold/30 text-white rounded-full text-[10px]">
              {consultations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tamweel')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'tamweel' 
                ? 'bg-forest text-white shadow-soft' 
                : 'text-charcoal hover:bg-forest/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span>Tamweel Submissions</span>
            <span className="px-1.5 py-0.2 bg-gold/30 text-white rounded-full text-[10px]">
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'contact' 
                ? 'bg-forest text-white shadow-soft' 
                : 'text-charcoal hover:bg-forest/10'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-gold" />
            <span>Messages</span>
            <span className="px-1.5 py-0.2 bg-gold/30 text-white rounded-full text-[10px]">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('newEvent')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition shrink-0 ${
              activeTab === 'newEvent' 
                ? 'bg-forest text-white shadow-soft' 
                : 'text-charcoal hover:bg-forest/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>+ Add Event</span>
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className="bg-forest text-gold px-4 py-2.5 text-xs font-semibold flex items-center space-x-2 animate-fadeIn border-b border-gold/40">
            <CheckCircle className="w-4 h-4 text-gold shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 bg-white space-y-6">
          
          {/* TAB 1: SBC CONSULTATIONS */}
          {activeTab === 'sbc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-editorial text-base font-bold text-forest">
                    Shariah Business Consultancy (SBC) Client Enquiries
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    Review incoming business requests and update review status.
                  </p>
                </div>
              </div>

              {consultations.length === 0 ? (
                <div className="text-center py-12 text-charcoal-muted border-2 border-dashed border-gray-200 rounded-xl">
                  No consultation enquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((item) => (
                    <div 
                      key={item.id}
                      className="border border-forest/15 rounded-xl p-4 bg-forest/5 hover:bg-white transition shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-forest">{item.name}</span>
                            <span className="text-xs text-charcoal-muted">({item.organization})</span>
                          </div>
                          <div className="text-xs text-gold-dark font-medium">{item.email}</div>
                        </div>
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateConsultationStatus(item.id, e.target.value as ConsultationRequest['status'])}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition ${
                            item.status === 'Resolved' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.status === 'In Discussion'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-100 text-xs space-y-1">
                        <div><strong className="text-forest">Area of Enquiry:</strong> {item.areaOfEnquiry}</div>
                        <div><strong className="text-forest">Scope:</strong> {item.projectScope}</div>
                        <div><strong className="text-forest">Message:</strong> {item.message}</div>
                      </div>

                      <div className="text-[10px] text-charcoal-muted flex items-center justify-between pt-1">
                        <span>Submitted: {item.submittedAt}</span>
                        <span className="font-mono">ID: {item.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TAMWEEL SUBMISSIONS */}
          {activeTab === 'tamweel' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-base font-bold text-forest">
                  Tamweel Journal — Manuscripts & Paper Submissions
                </h4>
                <p className="text-xs text-charcoal-muted">
                  Double-blind peer-review workflow and editorial board triage.
                </p>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-12 text-charcoal-muted border-2 border-dashed border-gray-200 rounded-xl">
                  No manuscript submissions received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id}
                      className="border border-forest/15 rounded-xl p-4 bg-forest/5 hover:bg-white transition shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-wider bg-gold/15 px-2 py-0.5 rounded">
                            {sub.track}
                          </span>
                          <h5 className="font-bold text-sm text-forest mt-1">{sub.title}</h5>
                          <div className="text-xs text-charcoal-muted mt-0.5">
                            Author(s): {sub.authors} • Affiliation: {sub.affiliation}
                          </div>
                        </div>
                        <select
                          value={sub.status}
                          onChange={(e) => onUpdateSubmissionStatus(sub.id, e.target.value as PaperSubmission['status'])}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : sub.status === 'Revision Requested'
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : sub.status === 'Under Review'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Revision Requested">Revision Requested</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-100 text-xs space-y-1.5">
                        <div><strong className="text-forest">Abstract:</strong> {sub.abstractText}</div>
                        <div><strong className="text-forest">Keywords:</strong> {sub.keywords}</div>
                        <div className="flex items-center space-x-2 text-[11px] text-forest font-medium pt-1">
                          <FileCheck className="w-3.5 h-3.5 text-gold" />
                          <span>Manuscript file: <span className="font-mono">{sub.fileName}</span></span>
                        </div>
                      </div>

                      <div className="text-[10px] text-charcoal-muted flex items-center justify-between pt-1">
                        <span>Submitted on {sub.submittedAt}</span>
                        <span className="font-mono">Reference: {sub.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-base font-bold text-forest">
                  Department Enquiries & General Correspondence
                </h4>
                <p className="text-xs text-charcoal-muted">
                  Official inquiries received through the contact desk.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 text-charcoal-muted border-2 border-dashed border-gray-200 rounded-xl">
                  No contact messages received.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div 
                      key={m.id}
                      className="border border-forest/15 rounded-xl p-4 bg-forest/5 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm text-forest">{m.name}</div>
                          <div className="text-xs text-gold-dark font-medium">{m.email}</div>
                        </div>
                        <span className="text-[10px] bg-white border border-gray-200 text-forest px-2 py-0.5 rounded font-semibold">
                          {m.category}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-charcoal">{m.subject}</div>
                      <p className="text-xs text-charcoal-light bg-white p-2.5 rounded-lg border border-gray-100">
                        {m.message}
                      </p>
                      <div className="text-[10px] text-charcoal-muted">
                        Received: {m.submittedAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADD EVENT */}
          {activeTab === 'newEvent' && (
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <h4 className="font-editorial text-base font-bold text-forest">
                  Publish New Academic Event / Announcement
                </h4>
                <p className="text-xs text-charcoal-muted">
                  Instantly publish seminars, workshops, or guest lectures to the homepage and Activities archive.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. International Symposium on Green Sukuk Frameworks"
                  className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventItem['category'])}
                    className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                  >
                    <option value="Seminars">Seminars</option>
                    <option value="Conferences">Conferences</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Guest Lectures">Guest Lectures</option>
                    <option value="Student Activities">Student Activities</option>
                    <option value="Internships">Internships</option>
                    <option value="Academic Visits">Academic Visits</option>
                    <option value="Research Events">Research Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. January 18, 2027"
                    className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Venue / Platform</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Speaker / Facilitator Placeholder</label>
                <input
                  type="text"
                  value={eventSpeaker}
                  onChange={(e) => setEventSpeaker(e.target.value)}
                  placeholder="[Speaker / Panelist to be announced]"
                  className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Summary of the academic topics, learning objectives, and attendees..."
                  className="w-full px-3 py-2 text-xs border border-forest/20 rounded-lg focus:border-forest focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-forest hover:bg-emerald-deep text-white font-semibold text-xs rounded-xl shadow-soft transition"
              >
                Publish Event to Portal
              </button>
            </form>
          )}

        </div>

        {/* Drawer Footer with Reset & Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-charcoal-muted">
          <div className="flex items-center space-x-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Changes persist automatically in local state storage</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset portal data back to factory defaults?')) {
                onResetData();
                setFeedbackMsg('Portal data reset to factory initial state.');
                setTimeout(() => setFeedbackMsg(null), 3000);
              }
            }}
            className="flex items-center space-x-1 text-red-700 hover:text-red-900 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
