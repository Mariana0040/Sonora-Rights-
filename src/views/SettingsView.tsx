import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Upload, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  Check, 
  FileJson,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SettingsView: React.FC = () => {
  const { artist, songs, collaborators, royalties, resetToWorkshopDemo } = useMusic();

  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyMissingData, setNotifyMissingData] = useState(true);
  const [notifyQuarterlyEcad, setNotifyQuarterlyEcad] = useState(true);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleExportBackup = () => {
    const data = {
      exportDate: new Date().toISOString(),
      platform: 'Sonora Rights v1.0',
      artist,
      songs,
      collaborators,
      royalties
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_sonora_rights_${artist.artisticName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar os dados de demonstração originais do workshop? (Todas as alterações manuais serão resetadas)')) {
      resetToWorkshopDemo();
      alert('Dados do workshop restaurados com sucesso!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Configurações & Backup</h2>
        <p className="text-slate-400">
          Gerencie preferências de alertas, exportação de dados e restauração do ambiente de apresentação.
        </p>
      </div>

      {backupSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Backup JSON exportado com sucesso para o seu dispositivo!</span>
        </div>
      )}

      {/* Alertas e Notificações */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Notificações e Auditoria Automática</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-200 block">Alertar divergências de splits ≠ 100%</span>
              <span className="text-[11px] text-slate-400">
                Emitir aviso imediato ao detectar divisões de autoria ou gravação com somatório inconsistente.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyCritical}
              onChange={(e) => setNotifyCritical(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-200 block">Notificar dados cadastrais incompletos</span>
              <span className="text-[11px] text-slate-400">
                Sinalizar parceiros sem CPF, IPI ou filiação a sociedade de gestão coletiva.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyMissingData}
              onChange={(e) => setNotifyMissingData(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-200 block">Lembretes de fechamento trimestral ECAD</span>
              <span className="text-[11px] text-slate-400">
                Aviso prévio para cadastrar fonogramas antes da virada das distribuições trimestrais.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyQuarterlyEcad}
              onChange={(e) => setNotifyQuarterlyEcad(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
          </label>
        </div>
      </div>

      {/* Backup & Export */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FileJson className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Portabilidade & Backup de Obras</h3>
        </div>

        <p className="text-slate-300">
          Baixe uma cópia completa de todas as suas músicas, divisões de participação, letras e registros de royalties para armazenamento seguro em seu computador.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Catálogo Completo (JSON)</span>
          </button>
        </div>
      </div>

      {/* Workshop Demo Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm">Ambiente de Demonstração (Workshop)</h3>
        </div>

        <p className="text-slate-300">
          Restaurar os dados iniciais pré-carregados para a persona Gabriel (com os exemplos de Aurora Boreal, Sintonia Noturna com divergência de split de 90%, e relatórios de royalties para demonstração).
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Estado Inicial de Demonstração</span>
        </button>
      </div>

      {/* Direct link to official guidelines */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
        <h4 className="font-bold text-slate-200">Sociedades de Gestão Coletiva Oficiais (Brasil)</h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <a
            href="https://www.abramus.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:underline"
          >
            <span>ABRAMUS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-600">·</span>
          <a
            href="https://www.ubc.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:underline"
          >
            <span>UBC (União Brasileira de Compositores)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-600">·</span>
          <a
            href="https://www.ecad.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:underline"
          >
            <span>ECAD</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
