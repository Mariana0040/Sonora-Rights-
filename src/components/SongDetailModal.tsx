import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck2, 
  Users, 
  FileText, 
  Music, 
  Calendar, 
  Plus, 
  Check, 
  Clock, 
  Disc,
  UploadCloud,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongWork, SplitEntry } from '../types/music';
import { auditSongWork } from '../utils/copyrightAuditor';

export const SongDetailModal: React.FC = () => {
  const { 
    viewingSongId, 
    setViewingSongId, 
    songs, 
    updateSong, 
    collaborators, 
    togglePlaySong, 
    playingSongId, 
    isPlayingAudio,
    generateSongCertificate,
    royalties
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'info' | 'splits' | 'lyrics' | 'versions' | 'audit'>('splits');
  const [editingSplits, setEditingSplits] = useState(false);
  const [tempCompositionSplits, setTempCompositionSplits] = useState<SplitEntry[]>([]);
  const [newVersionDescription, setNewVersionDescription] = useState('');

  if (!viewingSongId) return null;

  const song = songs.find(s => s.id === viewingSongId);
  if (!song) return null;

  const audit = auditSongWork(song, collaborators, royalties);
  const isPlaying = isPlayingAudio && playingSongId === song.id;

  const startEditSplits = () => {
    setTempCompositionSplits(JSON.parse(JSON.stringify(song.compositionSplits)));
    setEditingSplits(true);
  };

  const saveSplits = () => {
    updateSong(song.id, {
      compositionSplits: tempCompositionSplits
    });
    setEditingSplits(false);
  };

  const handleSplitChange = (index: number, val: number) => {
    setTempCompositionSplits(prev => {
      const next = [...prev];
      next[index] = { ...next[index], percentage: val };
      return next;
    });
  };

  const compTotal = editingSplits
    ? tempCompositionSplits.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0)
    : song.compositionSplits.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0);

  const roundedCompTotal = Math.round(compTotal * 100) / 100;

  const handleAddVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionDescription.trim()) return;
    const vCount = song.versions.length + 1;
    const newV = {
      id: `v-${Date.now()}`,
      versionNumber: `v${vCount}.0`,
      date: new Date().toISOString().split('T')[0],
      description: newVersionDescription,
      fileName: `demo_v${vCount}_rec.wav`,
      fileSize: '18.4 MB'
    };
    updateSong(song.id, {
      versions: [newV, ...song.versions]
    });
    setNewVersionDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={song.coverUrl}
                alt={song.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover border border-slate-700 shadow-md"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/100x100/1e293b/a5b4fc?text=Obra';
                }}
              />
              <button
                onClick={() => togglePlaySong(song)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg text-white transition-opacity cursor-pointer"
                title={isPlaying ? 'Pausar áudio' : 'Ouvir demonstração'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">{song.title}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {song.type}
                </span>
                {audit.hasErrors ? (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Divergência Ativa
                  </span>
                ) : audit.hasWarnings ? (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Pendente
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Regular 100%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Criada em {new Date(song.creationDate).toLocaleDateString('pt-BR')} · {song.genre} · BPM: {song.bpm || '—'} · Tom: {song.musicalKey || '—'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateSongCertificate(song.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Ver Comprovante</span>
            </button>
            <button
              onClick={() => setViewingSongId(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/80 border-b border-slate-800 flex gap-2 overflow-x-auto text-xs">
          {[
            { id: 'splits', label: 'Autoria & Splits', count: song.compositionSplits.length },
            { id: 'info', label: 'Ficha Técnica' },
            { id: 'lyrics', label: 'Letra da Música' },
            { id: 'versions', label: 'Versões & Arquivos', count: song.versions.length },
            { id: 'audit', label: 'Auditoria de Direitos', alertCount: audit.alerts.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.alertCount !== undefined && tab.alertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                  {tab.alertCount}
                </span>
              )}
              {tab.count !== undefined && (
                <span className="text-[10px] font-mono text-slate-500">
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB: SPLITS & PARTICIPAÇÃO */}
          {activeTab === 'splits' && (
            <div className="space-y-6">
              {/* Composition Splits */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Divisão de Composição (Direito de Autor / Obra)</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        roundedCompTotal === 100
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        Soma: {roundedCompTotal}% {roundedCompTotal === 100 ? '✓' : '(Incompleto)'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Percentual de partilha entre os autores da letra e da harmonia musical.
                    </p>
                  </div>

                  {!editingSplits ? (
                    <button
                      onClick={startEditSplits}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-950/60 hover:bg-indigo-900/60 rounded-lg border border-indigo-800/60 transition-colors"
                    >
                      Ajustar Splits
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSplits(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={saveSplits}
                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  )}
                </div>

                {/* Split Visual Progress Bar */}
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  {(editingSplits ? tempCompositionSplits : song.compositionSplits).map((split, i) => {
                    const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-teal-500', 'bg-sky-500', 'bg-amber-500'];
                    return (
                      <div
                        key={i}
                        className={`h-full ${colors[i % colors.length]} transition-all`}
                        style={{ width: `${Math.min(split.percentage, 100)}%` }}
                        title={`${split.collaboratorName}: ${split.percentage}%`}
                      />
                    );
                  })}
                </div>

                {/* Splits list */}
                <div className="divide-y divide-slate-800/80">
                  {(editingSplits ? tempCompositionSplits : song.compositionSplits).map((split, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{split.collaboratorName}</span>
                        <span className="text-slate-400 ml-2">· {split.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingSplits ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={split.percentage}
                              onChange={(e) => handleSplitChange(i, parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right font-mono text-white text-xs"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-100 tabular-nums">
                            {split.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {roundedCompTotal !== 100 && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Inconsistência na Divisão de Direitos:</strong>
                      A soma dos percentuais é de {roundedCompTotal}%. As entidades de arrecadação (ABRAMUS/UBC/ECAD) exigem 100.0% para validar o cadastro da obra.
                    </div>
                  </div>
                )}
              </div>

              {/* Master / Fonograma Splits */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Divisão de Fonograma (Direito Conexo / Master)</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Soma: {song.masterSplits.reduce((a, b) => a + Number(b.percentage), 0)}%
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Participação sobre a gravação definitiva (Produtor Fonográfico, Intérprete, Músicos).
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {song.masterSplits.map((split, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{split.collaboratorName}</span>
                        <span className="text-slate-400 ml-2">· {split.role}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-100 tabular-nums">
                        {split.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FICHA TÉCNICA */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Identificadores Oficiais</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-mono">ISWC (Código Internacional da Obra)</label>
                    <p className="font-mono text-slate-200 mt-0.5">{song.iswc || 'Não cadastrado'}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-mono">ISRC (Código da Gravação / Fonograma)</label>
                    <p className="font-mono text-slate-200 mt-0.5">{song.isrc || 'Não cadastrado'}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-mono">Tipo de Obra</label>
                    <p className="text-slate-200 mt-0.5">{song.type}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Parâmetros Musicais</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-mono">Gênero Musical</label>
                    <p className="text-slate-200 mt-0.5">{song.genre}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-mono">Andamento (BPM)</label>
                      <p className="font-mono text-slate-200 mt-0.5">{song.bpm || '—'}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-mono">Tonalidade</label>
                      <p className="font-mono text-slate-200 mt-0.5">{song.musicalKey || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-mono">Duração Estimada</label>
                    <p className="font-mono text-slate-200 mt-0.5">{song.duration || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Hash de Custódia Técnica</h4>
                <p className="font-mono text-[11px] text-indigo-300 break-all bg-slate-900 p-2.5 rounded border border-slate-800">
                  {song.fileHashSha256 || 'Calculado automaticamente na documentação'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Assinatura gerada a partir da anterioridade da letra, divisões de splits e arquivos de áudio anexados.
                </p>
              </div>
            </div>
          )}

          {/* TAB: LETRA */}
          {activeTab === 'lyrics' && (
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Letra Integral Registrada</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {song.lyrics.length} caracteres · {song.lyrics.split('\n').filter(Boolean).length} versos
                </span>
              </div>
              <pre className="p-4 bg-slate-900 rounded-lg text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-96 overflow-y-auto">
                {song.lyrics || 'Nenhuma letra cadastrada para esta obra musical.'}
              </pre>
            </div>
          )}

          {/* TAB: VERSÕES & ARQUIVOS */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              {/* Add version box */}
              <form onSubmit={handleAddVersion} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Registrar nova versão (ex: v2.1 Gravação com backing vocals adicionados)"
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shrink-0"
                >
                  Registrar Versão
                </button>
              </form>

              {/* Version History */}
              <div className="space-y-2.5">
                {song.versions.map((ver) => (
                  <div key={ver.id} className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{ver.versionNumber}</span>
                        <span className="text-slate-400">· {new Date(ver.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-slate-300">{ver.description}</p>
                    </div>
                    {ver.fileName && (
                      <div className="text-right text-[11px] font-mono text-slate-400">
                        <span>{ver.fileName}</span>
                        <span className="block text-slate-500">{ver.fileSize}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AUDITORIA DE DIREITOS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Status de Conformidade da Obra</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Análise em tempo real de consistência de cadastros, percentuais e titulares.
                  </p>
                </div>
                {audit.isFullyCompliant ? (
                  <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800 rounded-md text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    100% Regular
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-800 rounded-md text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {audit.alerts.length} Pontos de Atenção
                  </span>
                )}
              </div>

              {audit.alerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/30 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-medium text-slate-200">Nenhuma inconsistência detectada nesta obra.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Os percentuais somam 100%, todos os titulares estão cadastrados e a documentação está íntegra.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {audit.alerts.map((al) => (
                    <div
                      key={al.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        al.severity === 'critical'
                          ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                          : al.severity === 'warning'
                          ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {al.title}
                        </span>
                        <span className="uppercase text-[10px] font-mono opacity-80">
                          {al.severity === 'critical' ? 'Divergência Crítica' : 'Atenção Cadastral'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        {al.description}
                      </p>
                      <div className="pt-2 border-t border-slate-800/60 text-[11px]">
                        <strong className="text-white">Ação Sugerida:</strong> {al.suggestedAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
