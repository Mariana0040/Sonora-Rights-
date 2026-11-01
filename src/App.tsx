import React, { useState } from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Sidebar, NavSection } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalAudioPlayerBar } from './components/GlobalAudioPlayerBar';
import { SongDetailModal } from './components/SongDetailModal';
import { NewSongModal } from './components/NewSongModal';
import { EvidenceCertificateModal } from './components/EvidenceCertificateModal';

// Views
import { DashboardView } from './views/DashboardView';
import { SongsView } from './views/SongsView';
import { CollaboratorsView } from './views/CollaboratorsView';
import { CopyrightView } from './views/CopyrightView';
import { RoyaltiesView } from './views/RoyaltiesView';
import { DocumentsView } from './views/DocumentsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, playingSongId } = useMusic();
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isNewSongModalOpen, setIsNewSongModalOpen] = useState(false);
  const [isDirectCsvOpen, setIsDirectCsvOpen] = useState(false);

  // If user is not authenticated, show Auth Screen
  if (!isAuthenticated) {
    return <AuthView />;
  }

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(sec) => setActiveSection(sec)}
            onOpenNewSong={() => setIsNewSongModalOpen(true)}
            onOpenImportCsv={() => {
              setActiveSection('royalties');
              setIsDirectCsvOpen(true);
            }}
          />
        );
      case 'songs':
        return <SongsView onOpenNewSong={() => setIsNewSongModalOpen(true)} />;
      case 'collaborators':
        return <CollaboratorsView />;
      case 'copyright':
        return <CopyrightView />;
      case 'royalties':
        return (
          <RoyaltiesView
            isImportOpen={isDirectCsvOpen}
            onCloseImport={() => setIsDirectCsvOpen(false)}
          />
        );
      case 'documents':
        return <DocumentsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setActiveSection} onOpenNewSong={() => setIsNewSongModalOpen(true)} onOpenImportCsv={() => {}} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar navigation */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setIsDirectCsvOpen(false);
        }}
        onOpenNewSongModal={() => setIsNewSongModalOpen(true)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeSection={activeSection}
          onOpenNewSongModal={() => setIsNewSongModalOpen(true)}
          onOpenImportCsv={() => {
            setActiveSection('royalties');
            setIsDirectCsvOpen(true);
          }}
        />

        {/* Scrollable Viewport with bottom padding for audio player bar */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 ${playingSongId ? 'pb-28' : 'pb-12'}`}>
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewSongModal
        isOpen={isNewSongModalOpen}
        onClose={() => setIsNewSongModalOpen(false)}
      />

      <SongDetailModal />

      <EvidenceCertificateModal />

      {/* Global Audio Player Bar */}
      <GlobalAudioPlayerBar />

    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainAppContent />
    </MusicProvider>
  );
}
