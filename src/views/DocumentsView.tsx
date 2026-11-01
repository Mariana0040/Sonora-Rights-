import React, { useState } from 'react';
import { 
  FileText, 
  FileCheck2, 
  UploadCloud, 
  Search, 
  ShieldCheck, 
  Hash, 
  Printer, 
  Clock, 
  AlertTriangle,
  FolderOpen,
  Plus,
  FileCode,
  Check
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongWork, SongDocument } from '../types/music';

export const DocumentsView: React.FC = () => {
  const { songs, updateSong, generateSongCertificate, setViewingSongId } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongToAttach, setSelectedSongToAttach] = useState<SongWork | null>(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<SongDocument['type']>('Comprovante');
  const [attachedFileNotice, setAttachedFileNotice] = useState(false);

  const filteredSongs = songs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.fileHashSha256 && s.fileHashSha256.includes(searchQuery.toLowerCase()))
  );

  const handleAttachDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSongToAttach || !docName.trim()) return;

    const newDoc: SongDocument = {
      id: `doc-${Date.now()}`,
      name: docName.endsWith('.pdf') || docName.endsWith('.txt') ? docName : `${docName}.pdf`,
      type: docType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '1.4 MB',
      fileHash: Math.random().toString(16).substring(2, 10) + '...'
    };

    updateSong(selectedSongToAttach.id, {
      documents: [newDoc, ...selectedSongToAttach.documents]
    });

    setAttachedFileNotice(true);
    setTimeout(() => {
      setAttachedFileNotice(false);
      setSelectedSongToAttach(null);
      setDocName('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Documentação de Autoria & Evidências</h2>
          <p className="text-xs text-slate-400">
            Registro cronológico de criação, hashes SHA-256 de integridade e emissão de certificados de custódia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {songs.reduce((acc, s) => acc + (s.documents?.length || 0) + s.versions.length, 0)} Registros de Arquivos
          </span>
        </div>
      </div>

      {/* Mandatory Scope Disclaimer Banner (Prompt Instruction) */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">
            Aviso Legal Obrigatório sobre a Documentação da Plataforma:
          </h3>
          <p className="leading-relaxed opacity-90">
            O comprovante emitido por esta plataforma constitui um <strong>registro interno de evidências técnicas de anterioridade</strong> (carimbo temporal e hash imutável dos arquivos e letras). Ele <strong>NÃO substitui o registro oficial de direitos autorais</strong> perante órgãos públicos (como a Biblioteca Nacional / EDA ou Escola de Música da UFRJ) nem garante juridicamente a titularidade da obra em disputas judiciais.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por obra ou hash SHA-256..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          {filteredSongs.length} obras com custódia ativa
        </span>
      </div>

      {/* List of Evidence Records by Song */}
      <div className="space-y-4">
        {filteredSongs.map((song) => {
          const compSum = song.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0);
          const hasAudio = song.hasAudio;

          return (
            <div
              key={song.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{song.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {song.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Criada em {new Date(song.creationDate).toLocaleDateString('pt-BR')} · {song.compositionSplits.length} autores ({compSum}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSongToAttach(song)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Anexar Arquivo</span>
                  </button>

                  <button
                    onClick={() => generateSongCertificate(song.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Emitir Comprovante</span>
                  </button>
                </div>
              </div>

              {/* SHA-256 fingerprint card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono text-[11px] text-indigo-300 truncate">
                    {song.fileHashSha256 || 'Calculando hash cronológico...'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  SHA-256 Imutável
                </span>
              </div>

              {/* Attached Files & Version History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* Documents Column */}
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Arquivos Anexados ({song.documents.length})
                  </span>
                  {song.documents.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">Nenhum documento adicional anexado.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {song.documents.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center text-[11px] text-slate-300">
                          <span className="truncate pr-2">{doc.name}</span>
                          <span className="font-mono text-slate-500 shrink-0">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Versions Column */}
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Histórico de Versões & Demos ({song.versions.length})
                  </span>
                  <div className="space-y-1.5">
                    {song.versions.map((ver) => (
                      <div key={ver.id} className="flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-white font-mono">{ver.versionNumber}:</strong>{' '}
                          <span className="text-slate-400 truncate">{ver.description}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-2">{ver.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Attach Document Modal */}
      {selectedSongToAttach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-xs">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Anexar Documento a "{selectedSongToAttach.title}"
              </h3>
              <button
                onClick={() => setSelectedSongToAttach(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAttachDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Documento / Arquivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contrato_Splits_Assinado.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Categoria do Arquivo</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as SongDocument['type'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                >
                  <option value="Comprovante">Comprovante</option>
                  <option value="Contrato">Contrato de Splits</option>
                  <option value="Letra / Cifra">Letra / Cifra Oficial</option>
                  <option value="Guia de Gravação">Guia de Gravação / Áudio</option>
                  <option value="Declaração de Splits">Declaração de Splits</option>
                  <option value="Outro">Outro Documento</option>
                </select>
              </div>

              <div className="p-4 border border-dashed border-slate-700 rounded-lg text-center bg-slate-950/60">
                <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                <p className="text-slate-300">Selecione o arquivo no seu computador</p>
                <span className="text-[10px] text-slate-500">PDF, TXT, PNG, MP3 até 25MB</span>
              </div>

              {attachedFileNotice && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Arquivo anexado com sucesso e hash atualizado!</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSongToAttach(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Anexar e Gerar Hash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
