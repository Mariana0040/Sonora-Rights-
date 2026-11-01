import React, { useState } from 'react';
import { 
  Music, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  FileCheck2, 
  AlertCircle, 
  ShieldCheck, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronRight,
  Disc,
  Clock,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongWork } from '../types/music';

interface SongsViewProps {
  onOpenNewSong: () => void;
}

export const SongsView: React.FC<SongsViewProps> = ({ onOpenNewSong }) => {
  const { 
    songs, 
    togglePlaySong, 
    playingSongId, 
    isPlayingAudio, 
    setViewingSongId, 
    generateSongCertificate,
    auditData
  } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'released' | 'documented' | 'draft' | 'alerts'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredSongs = songs.filter(song => {
    // Search filter
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.isrc && song.isrc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.iswc && song.iswc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      song.compositionSplits.some(s => s.collaboratorName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'released') return song.status === 'released';
    if (selectedFilter === 'documented') return song.status === 'documented';
    if (selectedFilter === 'draft') return song.status === 'draft';
    if (selectedFilter === 'alerts') {
      const compSum = song.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0);
      return compSum !== 100 || !song.hasAudio;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Catálogo de Obras Musicais</h2>
          <p className="text-xs text-slate-400">
            Gerencie suas composições, letras, áudios-guia e porcentagens de participação de cada titular.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewSong}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por título, gênero, ISRC ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs">
          {[
            { id: 'all', label: 'Todas as Obras', count: songs.length },
            { id: 'released', label: 'Lançadas', count: songs.filter(s => s.status === 'released').length },
            { id: 'documented', label: 'Documentadas', count: songs.filter(s => s.status === 'documented').length },
            { id: 'draft', label: 'Rascunhos', count: songs.filter(s => s.status === 'draft').length },
            { id: 'alerts', label: 'Com Alertas', count: auditData.totalWithErrors + auditData.totalWithWarnings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer text-xs ${
                selectedFilter === tab.id
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1 text-[10px] font-mono opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

      </div>

      {/* Songs Display */}
      {filteredSongs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
          <Music className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Nenhuma obra encontrada</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tente modificar a busca ou registre uma nova música para iniciar seu catálogo musical.
          </p>
          <button
            onClick={onOpenNewSong}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Cadastrar Primeira Obra
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSongs.map((song) => {
            const isPlaying = isPlayingAudio && playingSongId === song.id;
            const compSum = song.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0);
            const roundedCompSum = Math.round(compSum * 100) / 100;
            const hasDivergence = roundedCompSum !== 100;

            return (
              <div
                key={song.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover & Quick Play */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/1e293b/a5b4fc?text=Obra+Musical';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Floating Audio Play button */}
                    <button
                      onClick={() => togglePlaySong(song)}
                      className="absolute bottom-3 right-3 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      title={isPlaying ? 'Pausar áudio' : 'Ouvir demonstração'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    {/* Badge status */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-slate-300 border border-slate-700">
                        {song.type}
                      </span>
                      {hasDivergence ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Splits: {roundedCompSum}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          100% OK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {song.genre} · BPM: {song.bpm || '—'} · Tom: {song.musicalKey || '—'}
                      </p>
                    </div>

                    {/* Splits mini summary */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Composição ({song.compositionSplits.length} autores)</span>
                        <span className="font-mono">{roundedCompSum}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        {song.compositionSplits.map((split, i) => (
                          <div
                            key={i}
                            className="h-full bg-indigo-500 border-r border-slate-900 last:border-0"
                            style={{ width: `${Math.min(split.percentage, 100)}%` }}
                            title={`${split.collaboratorName}: ${split.percentage}%`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Metadata tokens */}
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>ISRC: {song.isrc || 'Pendente'}</span>
                      <span className="font-mono text-slate-500">
                        {song.versions.length} {song.versions.length === 1 ? 'versão' : 'versões'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => generateSongCertificate(song.id)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Comprovante</span>
                  </button>

                  <button
                    onClick={() => setViewingSongId(song.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">Obra / Título</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Gênero</th>
                <th className="p-3">Compositores & Splits</th>
                <th className="p-3">ISRC</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredSongs.map((song) => {
                const compSum = song.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0);
                const hasDivergence = compSum !== 100;
                const isPlaying = isPlayingAudio && playingSongId === song.id;

                return (
                  <tr key={song.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 pl-4 font-semibold flex items-center gap-2.5">
                      <button
                        onClick={() => togglePlaySong(song)}
                        className="p-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setViewingSongId(song.id)}
                        className="hover:text-indigo-400 font-bold text-left"
                      >
                        {song.title}
                      </button>
                    </td>
                    <td className="p-3 text-slate-400">{song.type}</td>
                    <td className="p-3 text-slate-400">{song.genre}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300">{compSum}%</span>
                        <span className="text-[11px] text-slate-400">
                          ({song.compositionSplits.map(s => `${s.collaboratorName}: ${s.percentage}%`).join(', ')})
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {song.isrc || '—'}
                    </td>
                    <td className="p-3">
                      {hasDivergence ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">
                          Divergência
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-right space-x-2">
                      <button
                        onClick={() => generateSongCertificate(song.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Comprovante
                      </button>
                      <button
                        onClick={() => setViewingSongId(song.id)}
                        className="text-xs text-slate-300 hover:text-white font-medium"
                      >
                        Ficha Técnica
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
