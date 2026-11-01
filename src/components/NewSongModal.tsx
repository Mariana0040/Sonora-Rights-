import React, { useState } from 'react';
import { 
  X, 
  Music, 
  Plus, 
  Trash2, 
  FileText, 
  Users, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle,
  Disc,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongType, SplitEntry } from '../types/music';

interface NewSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSongModal: React.FC<NewSongModalProps> = ({ isOpen, onClose }) => {
  const { artist, collaborators, addSong, setViewingSongId } = useMusic();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<SongType>('Autoral / Inédita');
  const [creationDate, setCreationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [genre, setGenre] = useState('Indie Pop');
  const [bpm, setBpm] = useState<number | undefined>(110);
  const [musicalKey, setMusicalKey] = useState('Dó Maior (C)');
  const [duration, setDuration] = useState('3:15');
  const [lyrics, setLyrics] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [hasAudio, setHasAudio] = useState(false);
  const [audioToneType, setAudioToneType] = useState<'chords' | 'lofi' | 'ambient'>('lofi');
  const [iswc, setIswc] = useState('');
  const [isrc, setIsrc] = useState('');

  // Initial composition splits: default to artist 100%
  const [compositionSplits, setCompositionSplits] = useState<SplitEntry[]>([
    {
      collaboratorId: 'collab-gabriel',
      collaboratorName: artist.artisticName || artist.name,
      role: 'Compositor',
      percentage: 100
    }
  ]);

  // Initial master splits
  const [masterSplits, setMasterSplits] = useState<SplitEntry[]>([
    {
      collaboratorId: 'collab-gabriel',
      collaboratorName: artist.artisticName || artist.name,
      role: 'Produtor Fonográfico',
      percentage: 100
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Real-time sum calculation
  const compSum = compositionSplits.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0);
  const roundedCompSum = Math.round(compSum * 100) / 100;

  const masterSum = masterSplits.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0);
  const roundedMasterSum = Math.round(masterSum * 100) / 100;

  const handleAddCompSplit = () => {
    // pick first collaborator not in list or default
    const available = collaborators.find(c => !compositionSplits.some(s => s.collaboratorId === c.id)) || collaborators[0];
    setCompositionSplits(prev => [
      ...prev,
      {
        collaboratorId: available ? available.id : `collab-${Date.now()}`,
        collaboratorName: available ? available.artisticName : 'Novo Parceiro',
        role: 'Compositor',
        percentage: 0
      }
    ]);
  };

  const handleRemoveCompSplit = (index: number) => {
    setCompositionSplits(prev => prev.filter((_, i) => i !== index));
  };

  const handleCompSplitChange = (index: number, field: keyof SplitEntry, value: string | number) => {
    setCompositionSplits(prev => {
      const next = [...prev];
      if (field === 'collaboratorId') {
        const found = collaborators.find(c => c.id === value);
        next[index] = {
          ...next[index],
          collaboratorId: String(value),
          collaboratorName: found ? found.artisticName : next[index].collaboratorName
        };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const handleSimulateAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      setHasAudio(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o título da obra musical.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newSong = await addSong({
        title,
        type,
        status: hasAudio && lyrics.length > 30 ? 'documented' : 'draft',
        creationDate,
        genre,
        bpm: bpm ? Number(bpm) : undefined,
        musicalKey,
        duration,
        coverUrl: '/src/assets/images/album_cover_sintonia_1793466024595.jpg',
        lyrics: lyrics || '[Instrumental / Letra em desenvolvimento]',
        iswc: iswc.trim() || undefined,
        isrc: isrc.trim() || undefined,
        audioFileName: audioFileName || (hasAudio ? `${title.toLowerCase().replace(/\s+/g, '_')}_demo.wav` : ''),
        audioFileSize: hasAudio ? '24.5 MB' : '',
        audioDurationSec: 195,
        hasAudio,
        audioToneType,
        compositionSplits,
        masterSplits,
        documents: [
          {
            id: `doc-${Date.now()}`,
            name: `Registro_Inicial_${title.replace(/\s+/g, '_')}.pdf`,
            type: 'Comprovante',
            uploadDate: creationDate,
            size: '512 KB'
          }
        ],
        versions: [
          {
            id: `v-${Date.now()}`,
            versionNumber: 'v1.0 (Registro Inicial)',
            date: creationDate,
            description: 'Cadastro inicial de autoria e splits na plataforma Sonora Rights',
            fileName: audioFileName || undefined,
            fileSize: hasAudio ? '24.5 MB' : undefined
          }
        ]
      });

      onClose();
      setViewingSongId(newSong.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Cadastrar Nova Obra Musical</h2>
              <p className="text-xs text-slate-400">Documentação de autoria, participantes e divisões de splits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Dados Gerais */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
              1. Identificação da Obra
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">
                  Nome da Música / Título da Obra <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Noite de Verão, Labirinto Urbano..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Obra</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as SongType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                >
                  <option value="Autoral / Inédita">Autoral / Inédita</option>
                  <option value="Single Comercial">Single Comercial</option>
                  <option value="Beat / Instrumental">Beat / Instrumental</option>
                  <option value="Colaboração / Feat">Colaboração / Feat</option>
                  <option value="Remix / Versão">Remix / Versão</option>
                  <option value="Trilha Sonora">Trilha Sonora</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Data de Criação</label>
                <input
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Gênero Musical</label>
                <input
                  type="text"
                  placeholder="Ex: Indie Pop, Lo-Fi, MPB..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Andamento (BPM)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={bpm || ''}
                    onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tom / Key</label>
                  <input
                    type="text"
                    placeholder="Ex: Am, G..."
                    value={musicalKey}
                    onChange={(e) => setMusicalKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Código ISWC (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: T-123.456.789-0"
                  value={iswc}
                  onChange={(e) => setIswc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Código ISRC (Fonograma, opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: BR-GB1-26-00099"
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Letra & Áudio Guia */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
              2. Evidências de Criação (Letra & Áudio)
            </h3>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Letra Completa da Música / Poesia / Estrutura
              </label>
              <textarea
                rows={5}
                placeholder="Insira a letra com versos, refrão e anotações de arranjo..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block">
                    {hasAudio ? `Áudio Anexado: ${audioFileName}` : 'Anexar Áudio Guia / Beat Demo'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {hasAudio ? 'Arquivo pronto para custódia de evidência técnica' : 'WAV, MP3 ou gravação do celular (máx. 50MB)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium cursor-pointer transition-colors border border-slate-700">
                  <span>{hasAudio ? 'Trocar Arquivo' : 'Selecionar Áudio'}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleSimulateAudioUpload}
                    className="hidden"
                  />
                </label>
                {!hasAudio && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasAudio(true);
                      setAudioFileName(`${title ? title.toLowerCase().replace(/\s+/g, '_') : 'demo'}_beat_guia.wav`);
                    }}
                    className="px-3 py-1.5 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800 rounded-lg font-medium transition-colors"
                  >
                    Simular Guia
                  </button>
                )}
              </div>
            </div>

            {hasAudio && (
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <span>Timbre para simulação sonora:</span>
                {(['lofi', 'ambient', 'chords'] as const).map(tone => (
                  <button
                    type="button"
                    key={tone}
                    onClick={() => setAudioToneType(tone)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                      audioToneType === tone
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tone === 'lofi' ? 'Beat Lo-Fi' : tone === 'ambient' ? 'Master Demo' : 'Acústico'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Splits de Composição */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                3. Autoria & Divisão de Splits (Composição / Obra)
              </h3>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                roundedCompSum === 100
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                Soma: {roundedCompSum}% {roundedCompSum === 100 ? '✓' : '(Deve ser 100%)'}
              </span>
            </div>

            <div className="space-y-2">
              {compositionSplits.map((split, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <select
                    value={split.collaboratorId}
                    onChange={(e) => handleCompSplitChange(i, 'collaboratorId', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none text-xs"
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.artisticName} ({c.fullName || c.primaryRole})
                      </option>
                    ))}
                  </select>

                  <select
                    value={split.role}
                    onChange={(e) => handleCompSplitChange(i, 'role', e.target.value)}
                    className="w-32 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="Compositor">Compositor</option>
                    <option value="Letrista">Letrista</option>
                    <option value="Arranjador">Arranjador</option>
                    <option value="Beatmaker">Beatmaker</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={split.percentage}
                      onChange={(e) => handleCompSplitChange(i, 'percentage', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-right font-mono text-white text-xs"
                    />
                    <span className="text-slate-400 font-mono">%</span>
                  </div>

                  {compositionSplits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCompSplit(i)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remover titular"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddCompSplit}
                className="w-full py-2 border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg text-slate-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Mais um Titular de Composição</span>
              </button>
            </div>

            {roundedCompSum !== 100 && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Atenção: Os splits de composição somam <strong>{roundedCompSum}%</strong>. Você pode cadastrar agora para rascunho, mas o Analisador de Direitos emitirá alerta até que o total atinja exatamente 100%.
                </span>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Ao salvar, a obra receberá hash SHA-256 e entrará no catálogo.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Salvando...' : 'Cadastrar Obra'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
