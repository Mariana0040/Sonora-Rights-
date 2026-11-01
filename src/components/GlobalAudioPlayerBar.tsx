import React from 'react';
import { Play, Pause, Square, Volume2, Music, ExternalLink } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const GlobalAudioPlayerBar: React.FC = () => {
  const { 
    songs, 
    playingSongId, 
    isPlayingAudio, 
    audioProgressSec, 
    audioDurationSec, 
    togglePlaySong, 
    stopAudio,
    setViewingSongId
  } = useMusic();

  if (!playingSongId) return null;

  const currentSong = songs.find(s => s.id === playingSongId);
  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = audioDurationSec > 0 ? (audioProgressSec / audioDurationSec) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-indigo-500/30 px-6 py-2.5 shadow-2xl flex items-center justify-between gap-6 transition-all">
      {/* Track Info */}
      <div className="flex items-center gap-3.5 min-w-0 max-w-xs md:max-w-md">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/100x100/1e293b/a5b4fc?text=Obra';
          }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white truncate">{currentSong.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-950 text-indigo-300 rounded border border-indigo-800 shrink-0">
              {currentSong.audioToneType === 'lofi' ? 'Beat Lo-Fi' : currentSong.audioToneType === 'ambient' ? 'Master Demo' : 'Guia Acústica'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {currentSong.audioFileName || 'Áudio Guia / Sintetizador'} · {currentSong.genre}
          </p>
        </div>
      </div>

      {/* Playback Controls & Progress Bar */}
      <div className="flex-1 max-w-xl flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => togglePlaySong(currentSong)}
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-md"
            title={isPlayingAudio ? 'Pausar' : 'Reproduzir'}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={stopAudio}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            title="Parar e Fechar"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="w-full flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="tabular-nums w-8 text-right">{formatTime(audioProgressSec)}</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
          <span className="tabular-nums w-8">{formatTime(audioDurationSec)}</span>
        </div>
      </div>

      {/* Right Action */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <button
          onClick={() => setViewingSongId(currentSong.id)}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>Ver Ficha Técnica</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
