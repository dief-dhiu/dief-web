import React, { useState, useEffect } from 'react';
import { 
  PageId, 
  EventItem, 
  JournalArticle, 
  ResourceItem, 
  ConsultationRequest, 
  PaperSubmission, 
  ContactMessage, 
  FacultyMember 
} from './types';
import { 
  INITIAL_FACULTY, 
  INITIAL_EVENTS, 
  INITIAL_ARTICLES, 
  INITIAL_RESOURCES, 
  INITIAL_CONSULTATIONS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_MESSAGES 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdminDrawer } from './components/AdminDrawer';
import { NotificationToast, ToastData } from './components/NotificationToast';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DhibPage } from './pages/DhibPage';
import { SbcPage } from './pages/SbcPage';
import { TamweelPage } from './pages/TamweelPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  // Navigation & Deep linking state
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const hash = window.location.hash.replace('#', '') as PageId;
    const validPages: PageId[] = ['home', 'about', 'dhib', 'sbc', 'tamweel', 'activities', 'resources', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });
  const [selectedTargetId, setSelectedTargetId] = useState<string | undefined>(undefined);

  // Persistent Portal State
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('dief_events_v2');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [articles] = useState<JournalArticle[]>(INITIAL_ARTICLES);

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem('dief_resources_v2');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [faculty] = useState<FacultyMember[]>(INITIAL_FACULTY);

  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('dief_consultations');
      return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
    } catch {
      return INITIAL_CONSULTATIONS;
    }
  });

  const [submissions, setSubmissions] = useState<PaperSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('dief_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('dief_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // UI Modals & Feedback
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('dief_events_v2', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('dief_resources_v2', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('dief_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('dief_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('dief_messages', JSON.stringify(messages));
  }, [messages]);

  // Sync hash changes
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  const showToast = (title: string, message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleNavigate = (page: PageId, targetId?: string) => {
    setCurrentPage(page);
    setSelectedTargetId(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Consultation from SBC
  const handleAddConsultation = (req: Omit<ConsultationRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newReq: ConsultationRequest = {
      ...req,
      id: `sbc-req-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toLocaleString(),
      status: 'Pending Review'
    };
    setConsultations((prev) => [newReq, ...prev]);
  };

  // Add Paper Submission from Tamweel
  const handleAddSubmission = (sub: Omit<PaperSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: PaperSubmission = {
      ...sub,
      id: `tamweel-sub-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted'
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  // Add Contact Message
  const handleAddMessage = (msg: Omit<ContactMessage, 'id' | 'submittedAt'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toLocaleString()
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  // Admin Actions
  const handleUpdateConsultationStatus = (id: string, status: ConsultationRequest['status']) => {
    setConsultations((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    showToast('Status Updated', `Consultation request marked as ${status}.`, 'info');
  };

  const handleUpdateSubmissionStatus = (id: string, status: PaperSubmission['status']) => {
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
    showToast('Review Status Updated', `Paper status updated to ${status}.`, 'info');
  };

  const handleAddEvent = (ev: Omit<EventItem, 'id'>) => {
    const newEv: EventItem = {
      ...ev,
      id: `ev-${Date.now().toString().slice(-4)}`
    };
    setEvents((prev) => [newEv, ...prev]);
  };

  const handleAddResource = (res: Omit<ResourceItem, 'id'>) => {
    const newRes: ResourceItem = {
      ...res,
      id: `res-${Date.now().toString().slice(-4)}`
    };
    setResources((prev) => [newRes, ...prev]);
  };

  const handleResetData = () => {
    setEvents(INITIAL_EVENTS);
    setResources(INITIAL_RESOURCES);
    setConsultations(INITIAL_CONSULTATIONS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setMessages(INITIAL_MESSAGES);
    localStorage.clear();
    showToast('Factory Reset', 'Portal datasets reset to initial academic state.', 'warning');
  };

  const pendingCount = consultations.filter((c) => c.status === 'Pending Review').length +
                       submissions.filter((s) => s.status === 'Submitted').length;

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-forest selection:text-ivory">
      
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminDrawerOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            events={events}
            articles={articles}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            faculty={faculty}
          />
        )}

        {currentPage === 'dhib' && (
          <DhibPage
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'sbc' && (
          <SbcPage
            onNavigate={handleNavigate}
            onSubmitConsultation={handleAddConsultation}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'tamweel' && (
          <TamweelPage
            onNavigate={handleNavigate}
            articles={articles}
            selectedArticleId={selectedTargetId}
            onSubmitPaper={handleAddSubmission}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'activities' && (
          <ActivitiesPage
            onNavigate={handleNavigate}
            events={events}
            selectedEventId={selectedTargetId}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage
            onNavigate={handleNavigate}
            resources={resources}
            selectedResourceId={selectedTargetId}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onSubmitContact={handleAddMessage}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminDrawerOpen(true)}
      />

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
        events={events}
        articles={articles}
        resources={resources}
      />

      {/* Department Admin CMS Drawer */}
      <AdminDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        consultations={consultations}
        onUpdateConsultationStatus={handleUpdateConsultationStatus}
        submissions={submissions}
        onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
        messages={messages}
        onAddEvent={handleAddEvent}
        onAddResource={handleAddResource}
        onResetData={handleResetData}
      />

      {/* Toast Feedback Notifications */}
      <NotificationToast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

    </div>
  );
}
export default App;
