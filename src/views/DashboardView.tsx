import React from 'react';
import { 
  Music, 
  Users, 
  FileSpreadsheet, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Play, 
  Pause, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  Disc3,
  FileCheck2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { NavSection } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (section: NavSection) => void;
  onOpenNewSong: () => void;
  onOpenImportCsv: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewSong,
  onOpenImportCsv
}) => {
  const { 
    artist, 
    songs, 
    collaborators, 
    royalties, 
    auditData, 
    togglePlaySong, 
    playingSongId, 
    isPlayingAudio,
    setViewingSongId,
    generateSongCertificate
  } = useMusic();

  // Financial aggregates
  const totalGrossRoyalties = royalties.reduce((sum, r) => sum + r.amountGross, 0);
  const totalStreams = royalties.reduce((sum, r) => sum + r.streamCount, 0);

  // Group royalties by platform for visual breakdown
  const platformBreakdown: Record<string, number> = {};
  royalties.forEach(r => {
    platformBreakdown[r.platform] = (platformBreakdown[r.platform] || 0) + r.amountGross;
  });

  const sortedPlatforms = Object.entries(platformBreakdown).sort((a, b) => b[1] - a[1]);

  // Monthly revenue trend (Last 3 months: Ago, Set, Out)
  const monthlyRevenue: Record<string, number> = {
    '2026-08': 0,
    '2026-09': 0,
    '2026-10': 0
  };
  royalties.forEach(r => {
    if (monthlyRevenue[r.period] !== undefined) {
      monthlyRevenue[r.period] += r.amountGross;
    }
  });

  const maxMonthRev = Math.max(...Object.values(monthlyRevenue), 1);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner with Artist Persona context */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Painel do Artista Independente
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{artist.association} ({artist.ipiCae})</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Olá, {artist.artisticName}!
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Monitore a proteção de suas obras, garanta que suas divisões de composição totalizem 100% e acompanhe seus demonstrativos de royalties em um único lugar.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewSong}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Obra</span>
            </button>
            <button
              onClick={() => onNavigate('copyright')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Auditoria de Direitos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workshop Walkthrough Guide Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-white font-semibold">Roteiro de Demonstração do Workshop:</strong> Explore o cadastro de música com splits, verificação de inconsistência em <em className="text-indigo-300">"Sintonia Noturna"</em> e importação de arquivo CSV.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('copyright')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Ver Divergência Exemplo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Músicas */}
        <button
          onClick={() => onNavigate('songs')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Músicas no Catálogo</span>
            <Music className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{songs.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {songs.filter(s => s.status === 'released').length} lançadas · {songs.filter(s => s.status === 'draft').length} rascunhos
          </span>
        </button>

        {/* Card 2: Colaboradores */}
        <button
          onClick={() => onNavigate('collaborators')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Colaboradores</span>
            <Users className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{collaborators.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {collaborators.filter(c => c.verifiedData).length} verificados · 1 pendente
          </span>
        </button>

        {/* Card 3: Demonstrativos */}
        <button
          onClick={() => onNavigate('royalties')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Demonstrativos</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{royalties.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            6 plataformas integradas
          </span>
        </button>

        {/* Card 4: Obras Incompletas */}
        <button
          onClick={() => onNavigate('copyright')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Obras Incompletas</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {auditData.totalWithWarnings}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Falta ISRC ou titular sem CPF
          </span>
        </button>

        {/* Card 5: Divergências Ativas */}
        <button
          onClick={() => onNavigate('copyright')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Divergências</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {auditData.criticalAlertsCount}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Splits que não somam 100%
          </span>
        </button>

        {/* Card 6: Total Demonstrativo */}
        <button
          onClick={() => onNavigate('royalties')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Total Royalties</span>
            <TrendingUp className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold font-mono text-white tabular-nums">
            R$ {totalGrossRoyalties.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {totalStreams.toLocaleString('pt-BR')} reproduções
          </span>
        </button>

      </div>

      {/* Main Grid: Charts & Catalogs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Evolution Chart & Song List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Evolution Chart */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Evolução Mensal de Royalties Demonstrativos</h3>
                <p className="text-xs text-slate-400">Valores consolidados por período dos relatórios importados</p>
              </div>
              <button
                onClick={onOpenImportCsv}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Importar CSV</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-4 grid grid-cols-3 gap-4 h-44 items-end border-b border-slate-800 pb-2">
              {[
                { month: 'Agosto 2026', key: '2026-08', val: monthlyRevenue['2026-08'] },
                { month: 'Setembro 2026', key: '2026-09', val: monthlyRevenue['2026-09'] },
                { month: 'Outubro 2026', key: '2026-10', val: monthlyRevenue['2026-10'] }
              ].map((item) => {
                const heightPct = Math.round((item.val / maxMonthRev) * 100);
                return (
                  <div key={item.key} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono text-slate-300 font-bold tabular-nums">
                      R$ {item.val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="w-full max-w-[90px] bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-32">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">{item.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>* Valores informativos com base em demonstrativos de distribuidoras e agregadores.</span>
              <span className="font-mono text-slate-300">Média: R$ {(totalGrossRoyalties / 3).toFixed(2)}/mês</span>
            </div>
          </div>

          {/* Quick Song Catalog Spotlight */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Minhas Músicas Registradas</h3>
                <p className="text-xs text-slate-400">Obras cadastradas com custódia de evidências e splits</p>
              </div>
              <button
                onClick={() => onNavigate('songs')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Ver Todas ({songs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {songs.slice(0, 4).map((song) => {
                const isPlaying = isPlayingAudio && playingSongId === song.id;
                const compSum = song.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0);
                const hasDivergence = compSum !== 100;

                return (
                  <div key={song.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative group shrink-0">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100/1e293b/a5b4fc?text=Obra';
                          }}
                        />
                        <button
                          onClick={() => togglePlaySong(song)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg text-white transition-opacity cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingSongId(song.id)}
                            className="font-bold text-slate-200 hover:text-indigo-400 truncate text-left cursor-pointer"
                          >
                            {song.title}
                          </button>
                          {hasDivergence && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-800 shrink-0">
                              Split: {compSum}%
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {song.type} · {song.genre} · {song.compositionSplits.length} compositores
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => generateSongCertificate(song.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors border border-slate-700"
                      >
                        Comprovante
                      </button>
                      <button
                        onClick={() => setViewingSongId(song.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Abrir detalhes da obra"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1 span): Platform Distribution & Recent Activities */}
        <div className="space-y-6">
          
          {/* Revenue by Platform */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Distribuição por Plataforma</h3>
            <p className="text-xs text-slate-400">Participação percentual na receita consolidada</p>

            <div className="space-y-3 pt-2">
              {sortedPlatforms.map(([platform, amount]) => {
                const pct = totalGrossRoyalties > 0 ? (amount / totalGrossRoyalties) * 100 : 0;
                return (
                  <div key={platform} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-medium">{platform}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        R$ {amount.toFixed(2)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Alerts Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Auditoria Cadastral</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                ECAD / Abramus Compliant
              </span>
            </div>

            {auditData.allAlerts.length > 0 ? (
              <div className="space-y-2.5">
                {auditData.allAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                        : 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{alert.title}</span>
                    </div>
                    <p className="text-[11px] opacity-80 line-clamp-2">
                      {alert.description}
                    </p>
                    <button
                      onClick={() => onNavigate('copyright')}
                      className="text-[10px] font-semibold text-indigo-400 hover:underline pt-1 block"
                    >
                      Resolver no Analisador &rarr;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-emerald-400 bg-emerald-950/20 rounded-lg border border-emerald-900/40">
                <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                <span>Nenhuma pendência ativa no catálogo!</span>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Atividades Recentes</h3>
            
            <div className="space-y-3 text-xs">
              {[
                { title: 'Demonstrativo Outubro 2026 importado', desc: 'ONErpm / Spotify · 5 plataformas', time: 'Há 3 dias' },
                { title: 'Custódia técnica gerada', desc: 'Comprovante emitido para "Aurora Boreal"', time: 'Há 1 semana' },
                { title: 'Alerta de divergência detectado', desc: 'Splits de "Sintonia Noturna" somam 90%', time: 'Há 2 semanas' },
                { title: 'Novo parceiro cadastrado', desc: 'Lucas Santana (DJ Luk Beats) associado', time: 'Há 1 mês' }
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-200">{act.title}</p>
                    <p className="text-[11px] text-slate-400">{act.desc}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
