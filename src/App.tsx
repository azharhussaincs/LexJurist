import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { LawyersDiscoveryPage } from './pages/LawyersDiscoveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MessagingPage } from './pages/MessagingPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { JobsPage } from './pages/JobsPage';
import { EventsPage } from './pages/EventsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SavedPage } from './pages/SavedPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPages } from './pages/AuthPages';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname === '/' ? '/home' : window.location.pathname;
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname === '/' ? '/home' : window.location.pathname;
      setCurrentRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut: pressing "/" opens global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route dispatcher
  const renderRoute = () => {
    if (currentRoute === '/login') {
      return <AuthPages mode="login" onNavigate={navigate} />;
    }
    if (currentRoute === '/register') {
      return <AuthPages mode="register" onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/profile/')) {
      const userId = currentRoute.replace('/profile/', '');
      return <ProfilePage userId={userId} onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/communities/')) {
      const commId = currentRoute.replace('/communities/', '');
      return <CommunitiesPage communityId={commId} onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/jobs/')) {
      const jobId = currentRoute.replace('/jobs/', '');
      return <JobsPage selectedJobId={jobId} onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/events/')) {
      const eventId = currentRoute.replace('/events/', '');
      return <EventsPage selectedEventId={eventId} onNavigate={navigate} />;
    }

    switch (currentRoute) {
      case '/home':
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/lawyers':
        return <LawyersDiscoveryPage onNavigate={navigate} />;
      case '/connections':
        return <ConnectionsPage onNavigate={navigate} />;
      case '/messages':
        return <MessagingPage onNavigate={navigate} />;
      case '/communities':
        return <CommunitiesPage onNavigate={navigate} />;
      case '/jobs':
        return <JobsPage onNavigate={navigate} />;
      case '/events':
        return <EventsPage onNavigate={navigate} />;
      case '/notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case '/saved':
        return <SavedPage onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={navigate} />;
      case '/settings':
        return <SettingsPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const isAuthPage = currentRoute === '/login' || currentRoute === '/register';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner Notice */}
      <DisclaimerBanner />

      {/* Navigation Top Bar */}
      {!isAuthPage && (
        <Navbar
          currentRoute={currentRoute}
          onRouteChange={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Main Page Content */}
      <div className="flex-1">
        {renderRoute()}
      </div>

      {/* Global Legal Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={navigate}
      />

      {/* Dignified Footer */}
      {!isAuthPage && (
        <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-300 tracking-wider">
                LEXJURIST
              </span>
              <span>· Professional Legal Network & Peer Chamber</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => navigate('/settings')} className="hover:text-slate-200">
                Bar Compliance & Ethics
              </button>
              <button onClick={() => navigate('/lawyers')} className="hover:text-slate-200">
                Practitioner Directory
              </button>
              <button onClick={() => navigate('/communities')} className="hover:text-slate-200">
                Practice Groups
              </button>
              <button onClick={() => navigate('/admin')} className="hover:text-amber-400">
                Admin Console
              </button>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              © {new Date().getFullYear()} LexJurist Inc. Confidential peer forum.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
