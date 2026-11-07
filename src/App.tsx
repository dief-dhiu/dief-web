import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
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
  INITIAL_RESOURCES, 
  INITIAL_CONSULTATIONS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_MESSAGES 
} from './data/mockData';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSectionPlaceholder } from './pages/admin/AdminSectionPlaceholder';
import { AdminSettings } from './pages/admin/AdminSettings';
import { JournalCMS } from './pages/admin/journal/JournalCMS';
import { ActivitiesCMS } from './pages/admin/activities/ActivitiesCMS';
import { FacultyCMS } from './pages/admin/faculty/FacultyCMS';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdminDrawer } from './components/AdminDrawer';
import { NotificationToast, ToastData } from './components/NotificationToast';
import { ScrollToTop } from './components/ScrollToTop';
import { LegacyHashRedirect } from './components/LegacyHashRedirect';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DhibPage } from './pages/DhibPage';
import { SbcPage } from './pages/SbcPage';
import { TamweelPage } from './pages/TamweelPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function AppContent() {
  const navigate = useNavigate();

  // Persistent Portal State
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('dief_events_v2');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [articles] = useState<JournalArticle[]>([]);

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

  const showToast = (title: string, message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handlePublicNavigate = (page: PageId | string, targetId?: string) => {
    const pageMap: Record<string, string> = {
      home: '/',
      about: '/about',
      dhib: '/dhib',
      sbc: '/sbc',
      tamweel: targetId ? `/tamweel/${targetId}` : '/tamweel',
      activities: targetId ? `/activities/${targetId}` : '/activities',
      contact: '/contact'
    };
    const dest = pageMap[page] || (page.startsWith('/') ? page : `/${page}`);
    navigate(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminNavigate = (path: string) => {
    navigate(path);
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

  // Admin Actions for local preview
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

  // Shared Public Layout Wrapper
  const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-forest selection:text-ivory">
        <Navbar
          onNavigate={handlePublicNavigate}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenAdmin={() => handleAdminNavigate('/admin')}
          pendingCount={pendingCount}
        />

        <main className="flex-1">
          {children}
        </main>

        <Footer
          onNavigate={handlePublicNavigate}
          onOpenAdmin={() => handleAdminNavigate('/admin')}
        />

        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onNavigate={handlePublicNavigate}
          events={events}
          articles={articles}
        />

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

        <NotificationToast
          toasts={toasts}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    );
  };

  return (
    <Routes>
      {/* ========================================== */}
      {/* 1. ADMIN CMS ROUTES (PROTECTED / ISOLATED) */}
      {/* ========================================== */}
      <Route path="/admin/login" element={<AdminLogin onNavigate={handleAdminNavigate} />} />

      <Route path="/admin" element={
        <ProtectedRoute routeId="dashboard" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="dashboard" onNavigate={handleAdminNavigate}>
            <AdminDashboard onNavigate={handleAdminNavigate} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/journal" element={
        <ProtectedRoute routeId="journal" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="journal" onNavigate={handleAdminNavigate}>
            <JournalCMS onNavigate={handleAdminNavigate} onShowToast={showToast} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/activities" element={
        <ProtectedRoute routeId="activities" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="activities" onNavigate={handleAdminNavigate}>
            <ActivitiesCMS onNavigate={handleAdminNavigate} onShowToast={showToast} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/faculty" element={
        <ProtectedRoute routeId="faculty" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="faculty" onNavigate={handleAdminNavigate}>
            <FacultyCMS onNavigate={handleAdminNavigate} onShowToast={showToast} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/enquiries" element={
        <ProtectedRoute routeId="enquiries" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="enquiries" onNavigate={handleAdminNavigate}>
            <AdminSectionPlaceholder routeId="enquiries" onNavigate={handleAdminNavigate} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute routeId="settings" onNavigate={handleAdminNavigate}>
          <AdminLayout currentRoute="settings" onNavigate={handleAdminNavigate}>
            <AdminSettings onNavigate={handleAdminNavigate} />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* ========================================== */}
      {/* 2. PUBLIC CANONICAL & CLEAN ROUTES         */}
      {/* ========================================== */}
      {/* Canonical Homepage at / */}
      <Route path="/" element={
        <PublicLayout>
          <HomePage onNavigate={handlePublicNavigate} events={events} articles={articles} />
        </PublicLayout>
      } />

      {/* Legacy /home redirects to / */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Clean public routes */}
      <Route path="/about" element={
        <PublicLayout>
          <AboutPage onNavigate={handlePublicNavigate} faculty={faculty} />
        </PublicLayout>
      } />

      <Route path="/dhib" element={
        <PublicLayout>
          <DhibPage onNavigate={handlePublicNavigate} onShowToast={showToast} />
        </PublicLayout>
      } />

      <Route path="/sbc" element={
        <PublicLayout>
          <SbcPage onNavigate={handlePublicNavigate} onSubmitConsultation={handleAddConsultation} onShowToast={showToast} />
        </PublicLayout>
      } />

      {/* Tamweel Journal (with support for shareable /tamweel/:articleId deep link) */}
      <Route path="/tamweel" element={
        <PublicLayout>
          <TamweelPage onNavigate={handlePublicNavigate} articles={articles} onSubmitPaper={handleAddSubmission} onShowToast={showToast} />
        </PublicLayout>
      } />
      <Route path="/tamweel/:articleId" element={
        <PublicLayout>
          <TamweelPage onNavigate={handlePublicNavigate} articles={articles} onSubmitPaper={handleAddSubmission} onShowToast={showToast} />
        </PublicLayout>
      } />

      {/* Activities & Events (with support for shareable /activities/:activityId deep link) */}
      <Route path="/activities" element={
        <PublicLayout>
          <ActivitiesPage onNavigate={handlePublicNavigate} events={events} onShowToast={showToast} />
        </PublicLayout>
      } />
      <Route path="/activities/:activityId" element={
        <PublicLayout>
          <ActivitiesPage onNavigate={handlePublicNavigate} events={events} onShowToast={showToast} />
        </PublicLayout>
      } />

      <Route path="/contact" element={
        <PublicLayout>
          <ContactPage onNavigate={handlePublicNavigate} onSubmitContact={handleAddMessage} onShowToast={showToast} />
        </PublicLayout>
      } />

      {/* ========================================== */}
      {/* 3. 404 BRANDED ERROR PAGE                  */}
      {/* ========================================== */}
      <Route path="*" element={
        <PublicLayout>
          <NotFoundPage onOpenSearch={() => setSearchModalOpen(true)} />
        </PublicLayout>
      } />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <LegacyHashRedirect />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
