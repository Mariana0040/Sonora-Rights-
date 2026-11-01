import React, { useState } from 'react';
import { 
  DollarSign, 
  FileUp, 
  Download, 
  Plus, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Calendar, 
  Music, 
  Building2,
  X,
  UploadCloud,
  ChevronDown,
  Info
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { RoyaltyStatement } from '../types/music';

interface RoyaltiesViewProps {
  isImportOpen?: boolean;
  onCloseImport?: () => void;
}

export const RoyaltiesView: React.FC<RoyaltiesViewProps> = ({ 
  isImportOpen: initialImportOpen = false,
  onCloseImport 
}) => {
  const { 
    royalties, 
    songs, 
    addRoyaltyStatement, 
    importRoyaltyCsv 
  } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSongFilter, setSelectedSongFilter] = useState<string>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(initialImportOpen);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [importResult, setImportResult] = useState<{ addedCount: number; errors: string[] } | null>(null);

  // Manual statement form
  const [manualSongId, setManualSongId] = useState(songs[0]?.id || '');
  const [manualPlatform, setManualPlatform] = useState<RoyaltyStatement['platform']>('Spotify');
  const [manualPeriod, setManualPeriod] = useState('2026-10');
  const [manualStreams, setManualStreams] = useState(15000);
  const [manualGross, setManualGross] = useState(250.00);
  const [manualNet, setManualNet] = useState(212.50);
  const [manualNotes, setManualNotes] = useState('Lançamento manual de demonstrativo');

  // Filtered statements
  const filteredRoyalties = royalties.filter(r => {
    const matchesSearch = 
      r.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.period.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedPlatform !== 'all' && r.platform !== selectedPlatform) return false;
    if (selectedSongFilter !== 'all' && r.songId !== selectedSongFilter) return false;

    return true;
  });

  // Aggregates
  const totalGross = filteredRoyalties.reduce((acc, r) => acc + r.amountGross, 0);
  const totalNet = filteredRoyalties.reduce((acc, r) => acc + r.amountNet, 0);
  const totalStreams = filteredRoyalties.reduce((acc, r) => acc + r.streamCount, 0);

  // Song revenue aggregation
  const songRevenueMap: Record<string, number> = {};
  filteredRoyalties.forEach(r => {
    songRevenueMap[r.songTitle] = (songRevenueMap[r.songTitle] || 0) + r.amountGross;
  });

  // Download sample CSV
  const handleDownloadSampleCsv = () => {
    const sample = `Música;Plataforma;Período;Streams;Valor Bruto;Valor Líquido;Notas
Aurora Boreal;Spotify;2026-11;45000;840.50;714.42;Relatório ONErpm Novembro
Sintonia Noturna;Apple Music;2026-11;12000;420.00;357.00;Distribuição mensal
Ecos do Vento;Deezer;2026-11;8500;187.00;158.95;Execuções streaming Brasil
Aurora Boreal;TikTok;2026-11;105000;231.00;196.35;Sincronização em vídeos`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modelo_demonstrativo_royalties_sonora.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessCsvImport = () => {
    if (!csvRawText.trim()) return;
    const res = importRoyaltyCsv(csvRawText);
    setImportResult(res);
    if (res.addedCount > 0) {
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportResult(null);
        setCsvRawText('');
      }, 2500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvRawText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveManualStatement = (e: React.FormEvent) => {
    e.preventDefault();
    const song = songs.find(s => s.id === manualSongId);
    if (!song) return;

    addRoyaltyStatement({
      statementRef: `MAN-${manualPeriod}-${Date.now().toString().slice(-4)}`,
      platform: manualPlatform,
      period: manualPeriod,
      songId: song.id,
      songTitle: song.title,
      streamCount: Number(manualStreams) || 0,
      amountGross: Number(manualGross) || 0,
      amountNet: Number(manualNet) || 0,
      currency: 'BRL',
      status: 'reconciled',
      importBatchId: `manual-entry-${Date.now()}`,
      importDate: new Date().toISOString().split('T')[0],
      notes: manualNotes
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gestão de Royalties & Faturamento</h2>
          <p className="text-xs text-slate-400">
            Acompanhe demonstrativos importados de distribuidoras, receitas por música e relatórios de execução pública.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadSampleCsv}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Baixar planilha modelo CSV pronta para teste"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar Modelo CSV</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lançamento Manual</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Receita Bruta Total</span>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            R$ {totalGross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500">Valores informativos de demonstrativos</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Receita Líquida Estimada</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            R$ {totalNet.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500">Após deduções de distribuidoras (~15%)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total de Reproduções</span>
          <p className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
            {totalStreams.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-slate-500">Streams e execuções reportadas</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Demonstrativos</span>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {filteredRoyalties.length} lotes
          </p>
          <span className="text-[10px] text-slate-500">Spotify, Apple, YouTube, Deezer, TikTok</span>
        </div>
      </div>

      {/* Revenue Breakdown by Song Cards */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Rendimento Consolidado por Música</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {Object.entries(songRevenueMap).map(([title, amount]) => {
            const pct = totalGross > 0 ? (amount / totalGross) * 100 : 0;
            return (
              <div key={title} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 truncate pr-2">{title}</span>
                  <span className="font-mono text-indigo-400 font-bold tabular-nums">
                    R$ {amount.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block text-right">
                  {pct.toFixed(1)}% do catálogo
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar por música, plataforma ou mês..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs overflow-x-auto">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
          >
            <option value="all">Todas as Plataformas</option>
            <option value="Spotify">Spotify</option>
            <option value="Apple Music">Apple Music</option>
            <option value="YouTube Music">YouTube Music</option>
            <option value="Deezer">Deezer</option>
            <option value="TikTok">TikTok</option>
            <option value="ECAD / Rádio">ECAD / Rádio</option>
          </select>

          <select
            value={selectedSongFilter}
            onChange={(e) => setSelectedSongFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
          >
            <option value="all">Todas as Músicas</option>
            {songs.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Royalties Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Demonstrativos Cadastrados ({filteredRoyalties.length})
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Valores em Reais (BRL)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">Período</th>
                <th className="p-3">Obra Musical</th>
                <th className="p-3">Plataforma / Canal</th>
                <th className="p-3 text-right">Streams</th>
                <th className="p-3 text-right">Valor Bruto</th>
                <th className="p-3 text-right">Valor Líquido</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredRoyalties.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 pl-4 font-mono text-slate-400 whitespace-nowrap">
                    {item.period}
                  </td>
                  <td className="p-3 font-semibold text-slate-100 whitespace-nowrap">
                    {item.songTitle}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {item.platform}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-300">
                    {item.streamCount.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-white tabular-nums whitespace-nowrap">
                    R$ {item.amountGross.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-400 tabular-nums whitespace-nowrap">
                    R$ {item.amountNet.toFixed(2)}
                  </td>
                  <td className="p-3">
                    {item.status === 'discrepancy' ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
                        Divergência
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                        Conciliado
                      </span>
                    )}
                  </td>
                  <td className="p-3 pr-4 text-slate-400 text-[11px] truncate max-w-xs">
                    {item.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scope Disclaimer Box (Required by prompt) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Nota sobre o Módulo Financeiro:</strong> Os valores demonstrados no protótipo foram inseridos ou importados diretamente pelo artista via relatórios CSV. O sistema organiza e cruza demonstrativos de diferentes agregadores, não calculando royalties reais de maneira estimada apenas pelo número de reproduções nem substituindo os extratos oficiais emitidos pelo ECAD ou associações.
        </p>
      </div>

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-xs">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Importar Demonstrativo de Royalties (CSV)</h3>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  if (onCloseImport) onCloseImport();
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Importe relatórios de distribuição de plataformas digitais (ONErpm, DistroKid, CD Baby, TuneCore ou planilha interna).
              </p>

              {/* Upload Drop Area */}
              <div className="p-4 border border-dashed border-slate-700 rounded-xl text-center bg-slate-950/60 hover:border-indigo-500 transition-colors">
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold inline-block">
                    Selecionar Arquivo .CSV do Computador
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-2">
                  Ou cole o conteúdo CSV no campo abaixo
                </p>
              </div>

              {/* Text Area for Direct CSV Paste */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium text-[11px]">Conteúdo CSV:</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCsvRawText(`Música;Plataforma;Período;Streams;Valor Bruto;Valor Líquido;Notas
Aurora Boreal;Spotify;2026-11;45000;840.50;714.42;Relatório ONErpm Novembro
Sintonia Noturna;Apple Music;2026-11;12000;420.00;357.00;Distribuição mensal
Ecos do Vento;Deezer;2026-11;8500;187.00;158.95;Execuções streaming Brasil
Aurora Boreal;TikTok;2026-11;105000;231.00;196.35;Sincronização em vídeos`);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Preencher Exemplo de Teste
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder={`Música;Plataforma;Período;Streams;Valor Bruto;Valor Líquido\nAurora Boreal;Spotify;2026-11;45000;840.50;714.42`}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                />
              </div>

              {importResult && (
                <div className={`p-3 rounded-lg border text-xs ${
                  importResult.addedCount > 0 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}>
                  {importResult.addedCount > 0 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{importResult.addedCount} demonstrativos importados e conciliados com sucesso!</span>
                    </div>
                  ) : (
                    <div>
                      <strong>Erro na importação:</strong> {importResult.errors.join(', ')}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo Modelo</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      if (onCloseImport) onCloseImport();
                    }}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessCsvImport}
                    disabled={!csvRawText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Processar e Importar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-xs">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Lançar Rendimento de Royalty</h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualStatement} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Música Vinculada</label>
                <select
                  value={manualSongId}
                  onChange={(e) => setManualSongId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                >
                  {songs.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plataforma</label>
                  <select
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as RoyaltyStatement['platform'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  >
                    <option value="Spotify">Spotify</option>
                    <option value="Apple Music">Apple Music</option>
                    <option value="YouTube Music">YouTube Music</option>
                    <option value="Deezer">Deezer</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Amazon Music">Amazon Music</option>
                    <option value="ECAD / Rádio">ECAD / Rádio</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Período (YYYY-MM)</label>
                  <input
                    type="month"
                    value={manualPeriod}
                    onChange={(e) => setManualPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Quantidade de Streams / Execuções</label>
                <input
                  type="number"
                  value={manualStreams}
                  onChange={(e) => setManualStreams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Valor Bruto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualGross}
                    onChange={(e) => {
                      const g = parseFloat(e.target.value) || 0;
                      setManualGross(g);
                      setManualNet(Math.round(g * 0.85 * 100) / 100);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Valor Líquido (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualNet}
                    onChange={(e) => setManualNet(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Observações do Repasse</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
