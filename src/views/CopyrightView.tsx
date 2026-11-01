import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Wrench, 
  FileCheck2, 
  BookOpen, 
  Music, 
  ArrowRight,
  Disc3,
  HelpCircle
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { CopyrightAlert } from '../types/music';

export const CopyrightView: React.FC = () => {
  const { 
    songs, 
    updateSong, 
    collaborators, 
    updateCollaborator, 
    royalties, 
    auditData, 
    setViewingSongId,
    generateSongCertificate
  } = useMusic();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'compliant'>('all');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const filteredAlerts = auditData.allAlerts.filter(a => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return a.severity === 'critical';
    if (activeFilter === 'warning') return a.severity === 'warning';
    return true;
  });

  // Quick fix handler for workshop demonstration
  const handleQuickResolve = (alert: CopyrightAlert) => {
    if (alert.category === 'splits_sum' && alert.songId === 'song-sintonia') {
      // Fix Sintonia Noturna splits from 45/45 to 50/50 so it sums 100%
      updateSong('song-sintonia', {
        compositionSplits: [
          { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Compositor', percentage: 50 },
          { collaboratorId: 'collab-bia', collaboratorName: 'Bia Voice', role: 'Compositora', percentage: 50 }
        ]
      });
      setSuccessNotice('Splits de "Sintonia Noturna" equalizados para 50% / 50% (Total: 100%). Divergência resolvida com sucesso!');
      setTimeout(() => setSuccessNotice(null), 4000);
    } else if (alert.category === 'incomplete_collaborator_id') {
      // Complete Thiago's CPF and IPI
      const thiago = collaborators.find(c => c.id === 'collab-thiago');
      if (thiago) {
        updateCollaborator(thiago.id, {
          cpfCnpj: '381.992.408-15',
          ipiCae: '00984128910',
          association: 'ABRAMUS',
          verifiedData: true
        });
        setSuccessNotice('Dados de Thiago Ribeiro (CPF e IPI ABRAMUS) preenchidos com sucesso!');
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } else if (alert.category === 'unregistered_isrc' && alert.songId === 'song-ecos') {
      updateSong('song-ecos', {
        isrc: 'BR-GB1-26-00088'
      });
      setSuccessNotice('Código ISRC preliminar registrado para "Ecos do Vento".');
      setTimeout(() => setSuccessNotice(null), 4000);
    } else {
      setViewingSongId(alert.songId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Auditoria Preventiva de Catálogo
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Analisador de Direitos Autorais & Splits</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Identifique inconsistências de porcentagens, ausência de identificadores (ISRC/ISWC) e titulares incompletos antes de submeter às associações e distribuidoras.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            {songs.length} Obras Monitoradas
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-xs font-semibold text-emerald-400 hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Metric Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total Auditado</span>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{songs.length} obras</p>
          <span className="text-[10px] text-slate-500">100% do catálogo coberto</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Conformes & Regulares</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {auditData.totalCompliant} obras
          </p>
          <span className="text-[10px] text-emerald-500/80">Splits 100% e dados completos</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Pendências / Atenção</span>
          <p className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {auditData.warningAlertsCount} pendências
          </p>
          <span className="text-[10px] text-amber-500/80">Faltam dados secundários</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Divergências Críticas</span>
          <p className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {auditData.criticalAlertsCount} divergências
          </p>
          <span className="text-[10px] text-rose-500/80">Splits ≠ 100% ou relatórios conflitantes</span>
        </div>

      </div>

      {/* Mandatory Scope & Neutrality Box (Prompt Instruction) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Esclarecimento Sobre o Analisador de Direitos:</span>
        </div>
        <p>
          Este módulo realiza a verificação de coerência lógica, matemática e cadastral das obras cadastradas pelo artista.
          <strong className="text-slate-300"> Uma divergência identificada não representa automaticamente uma violação de direitos autorais</strong>,
          mas sim uma inconsistência que pode ocasionar retenção de royalties no ECAD ou rejeição por distribuidoras digitais.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Todos os Alertas ({auditData.allAlerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'critical' ? 'bg-rose-950 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Divergências Críticas ({auditData.criticalAlertsCount})
        </button>
        <button
          onClick={() => setActiveFilter('warning')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'warning' ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Avisos Cadastrais ({auditData.warningAlertsCount})
        </button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="p-10 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Catálogo Regularizado!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não há inconsistências pendentes nesta categoria. Todas as divisões somam 100% e os cadastros estão completos.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCritical
                    ? 'bg-slate-900/90 border-rose-900/60 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/90 border-amber-900/60 shadow-lg shadow-amber-950/20'
                }`}
              >
                {/* Alert Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCritical ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{alert.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Obra: {alert.songTitle}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                        {isCritical ? 'Divergência de Divisão' : 'Pendência de Informação'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Fix Button */}
                  <button
                    onClick={() => handleQuickResolve(alert)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shrink-0"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Corrigir Inconsistência</span>
                  </button>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-slate-200">Motivo do Alerta:</strong> {alert.description}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Ação Recomendada:</strong> {alert.suggestedAction}
                  </p>
                </div>

                {/* Footer Link to song */}
                <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                  <button
                    onClick={() => setViewingSongId(alert.songId)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <span>Abrir Ficha Técnica de "{alert.songTitle}"</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => generateSongCertificate(alert.songId)}
                    className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Ver Comprovante Atual</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Educational Knowledge Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Guia Rápido de Direitos Autorais na Música</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-indigo-300">Obra Musical vs. Fonograma</h4>
            <p className="text-slate-400 leading-relaxed">
              A <strong>Obra</strong> é a composição (letra e melodia), protegida pelo código <strong>ISWC</strong> e arrecadada por compositores e editoras. O <strong>Fonograma</strong> é a gravação sonora específica em estúdio, identificada pelo <strong>ISRC</strong> e dividida entre produtor fonográfico, intérpretes e músicos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-indigo-300">Por que somar 100%?</h4>
            <p className="text-slate-400 leading-relaxed">
              O banco de dados do ECAD e as associações como Abramus e UBC recusam ou colocam em retenção obras cujas porcentagens declared de autoria somem menos ou mais de 100%, impedindo a distribuição de royalties de rádio, TV e shows.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-indigo-300">O que é o IPI / CAE?</h4>
            <p className="text-slate-400 leading-relaxed">
              O <em>Interested Party Information</em> (IPI) é o número internacional de identidade atribuído pela CISAC a todo compositor, letrista e editor afiliado a uma sociedade de gestão coletiva em qualquer país do mundo.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
