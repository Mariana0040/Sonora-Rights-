import React from 'react';
import { Plus, RotateCcw, ShieldCheck, AlertCircle, FileUp } from 'lucide-react';
import { NavSection } from './Sidebar';
import { useMusic } from '../context/MusicContext';

interface HeaderProps {
  activeSection: NavSection;
  onOpenNewSongModal: () => void;
  onOpenImportCsv?: () => void;
}

const SECTION_TITLES: Record<NavSection, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Geral', subtitle: 'Visão executiva do catálogo musical, royalties e pendências cadastrais' },
  songs: { title: 'Minhas Obras', subtitle: 'Catálogo de composições, gravações, letras e divisões de splits' },
  collaborators: { title: 'Colaboradores & Parceiros', subtitle: 'Gestão de compositores, produtores, músicos e dados para créditos' },
  copyright: { title: 'Analisador de Direitos Autorais', subtitle: 'Auditoria lógica de splits, titularidade e prevenção de divergências' },
  royalties: { title: 'Gestão de Royalties', subtitle: 'Demonstrativos financeiros por plataforma de streaming e conciliação' },
  documents: { title: 'Documentação de Autoria', subtitle: 'Registro de evidências de criação com carimbo temporal e hash SHA-256' },
  profile: { title: 'Meu Perfil Artístico', subtitle: 'Informações cadastrais, filiação e links profissionais' },
  settings: { title: 'Configurações', subtitle: 'Preferências da conta, backup de dados e suporte ao workshop' }
};

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenNewSongModal,
  onOpenImportCsv
}) => {
  const { auditData, resetToWorkshopDemo } = useMusic();
  const info = SECTION_TITLES[activeSection] || { title: 'Sonora Rights', subtitle: '' };

  const handleResetDemo = () => {
    if (window.confirm('Deseja recarregar os dados originais do workshop (com as músicas exemplo e alertas didáticos)?')) {
      resetToWorkshopDemo();
    }
  };

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between gap-8 sticky top-0 z-20">
      {/* Zone 1: Context Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
            {info.title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-md">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Zone 2: System Health & Audit Status */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        {auditData.criticalAlertsCount > 0 ? (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="tabular-nums">
              {auditData.criticalAlertsCount} {auditData.criticalAlertsCount === 1 ? 'divergência cadastral' : 'divergências cadastrais'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Auditoria 100% Regular</span>
          </div>
        )}
      </div>

      {/* Zone 3: Primary Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Reset Workshop Demo State */}
        <button
          onClick={handleResetDemo}
          title="Restaurar dados iniciais do workshop"
          className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-700/60"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline">Restaurar Demo</span>
        </button>

        {activeSection === 'royalties' && onOpenImportCsv && (
          <button
            onClick={onOpenImportCsv}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <FileUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Importar CSV</span>
          </button>
        )}

        <button
          onClick={onOpenNewSongModal}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Obra</span>
        </button>
      </div>
    </header>
  );
};
