import React from 'react';
import { 
  LayoutDashboard, 
  Music2, 
  Users, 
  ShieldAlert, 
  DollarSign, 
  FileText, 
  User, 
  Settings, 
  Plus, 
  Disc3, 
  AlertTriangle,
  Play,
  Square,
  LogOut
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export type NavSection = 
  | 'dashboard' 
  | 'songs' 
  | 'collaborators' 
  | 'copyright' 
  | 'royalties' 
  | 'documents' 
  | 'profile' 
  | 'settings';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenNewSongModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onOpenNewSongModal
}) => {
  const { 
    artist, 
    auditData, 
    isPlayingAudio, 
    playingSongId, 
    songs, 
    stopAudio,
    logout
  } = useMusic();

  const currentPlayingSong = songs.find(s => s.id === playingSongId);

  const navItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'songs' as NavSection, label: 'Minhas Obras', icon: Music2, count: songs.length },
    { id: 'collaborators' as NavSection, label: 'Colaboradores', icon: Users },
    { 
      id: 'copyright' as NavSection, 
      label: 'Direitos Autorais', 
      icon: ShieldAlert, 
      alertCount: auditData.criticalAlertsCount + auditData.warningAlertsCount 
    },
    { id: 'royalties' as NavSection, label: 'Royalties', icon: DollarSign },
    { id: 'documents' as NavSection, label: 'Documentos', icon: FileText },
    { id: 'profile' as NavSection, label: 'Meu Perfil', icon: User },
    { id: 'settings' as NavSection, label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand & Logo */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Disc3 className="w-5 h-5 text-indigo-100 animate-spin" style={{ animationDuration: isPlayingAudio ? '4s' : '0s' }} />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">Sonora Rights</span>
              <p className="text-[11px] text-slate-400">Gestão Musical & Obras</p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={onOpenNewSongModal}
            className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.alertCount !== undefined && item.alertCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 shrink-0">
                    {item.alertCount}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Active Audio Widget & User Profile */}
      <div className="p-3 border-t border-slate-800 space-y-3">
        {/* Real-time mini audio monitor */}
        {isPlayingAudio && currentPlayingSong && (
          <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <p className="text-[10px] uppercase font-mono text-indigo-300 tracking-wider">Reproduzindo Áudio</p>
              <p className="font-medium text-slate-200 truncate text-[11px]">{currentPlayingSong.title}</p>
            </div>
            <button
              onClick={stopAudio}
              title="Parar reprodução"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

        {/* User Profile Mini Bar */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
          <button
            onClick={() => onSelectSection('profile')}
            className="flex items-center gap-2.5 truncate text-left cursor-pointer hover:opacity-85 transition-opacity"
          >
            <img
              src={artist.avatarUrl}
              alt={artist.artisticName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://ui-avatars.com/api/?name=Gabe+Luz&background=6366f1&color=fff';
              }}
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{artist.artisticName}</p>
              <p className="text-[10px] text-slate-400 truncate">{artist.association} · Artista</p>
            </div>
          </button>

          <button
            onClick={logout}
            title="Sair / Trocar de conta"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
