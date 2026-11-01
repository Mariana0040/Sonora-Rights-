import React, { useState } from 'react';
import { Shield, Printer, Copy, Check, X, AlertTriangle, FileCheck2, Hash, Calendar, User } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const EvidenceCertificateModal: React.FC = () => {
  const { selectedCertificate, setSelectedCertificate, songs } = useMusic();
  const [copiedHash, setCopiedHash] = useState(false);

  if (!selectedCertificate) return null;

  const currentSong = songs.find(s => s.id === selectedCertificate.songId);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(selectedCertificate.sha256ProofHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Certificado Interno de Documentação de Obra
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              · {selectedCertificate.certificateId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={() => setSelectedCertificate(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-8 space-y-6 bg-slate-900 print:bg-white print:text-black">
          
          {/* Certificate Header Banner */}
          <div className="border-b border-slate-700 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-indigo-400 print:text-indigo-700" />
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold print:text-indigo-800">
                  Sonora Rights · Sistema de Custódia de Evidências
                </span>
              </div>
              <h2 className="text-xl font-bold text-white print:text-slate-900 tracking-tight">
                Comprovante de Registro de Anterioridade
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Certidão de custódia técnica e integridade cronológica de obra musical
              </p>
            </div>

            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300 text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Identificador Único</span>
              <span className="text-sm font-mono font-bold text-indigo-300 print:text-indigo-800">
                {selectedCertificate.certificateId}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Emitido em {new Date(selectedCertificate.issuedAt).toLocaleDateString('pt-BR')} às {new Date(selectedCertificate.issuedAt).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Song Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-lg border border-slate-800 print:border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Obra Musical</span>
              <h3 className="text-base font-bold text-white print:text-slate-900">{selectedCertificate.songTitle}</h3>
              <div className="mt-2 text-xs space-y-1 text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-400">Gênero:</strong> {currentSong?.genre || 'Indie / Pop'}</p>
                <p><strong className="text-slate-400">ISWC:</strong> {currentSong?.iswc || 'Em processo de emissão'}</p>
                <p><strong className="text-slate-400">ISRC:</strong> {currentSong?.isrc || 'Em processo de distribuição'}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 print:bg-slate-50 p-4 rounded-lg border border-slate-800 print:border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Titular Cadastrante</span>
              <h3 className="text-base font-bold text-white print:text-slate-900">{selectedCertificate.authorName}</h3>
              <div className="mt-2 text-xs space-y-1 text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-400">Nome Artístico:</strong> {selectedCertificate.authorArtisticName}</p>
                <p><strong className="text-slate-400">CPF:</strong> {selectedCertificate.authorCpf}</p>
                <p><strong className="text-slate-400">Associação Coletiva:</strong> {selectedCertificate.association}</p>
              </div>
            </div>
          </div>

          {/* Splits Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800">
              Declaração de Titulares & Divisão de Participação (Splits)
            </h4>

            {/* Composição */}
            <div className="bg-slate-950/40 print:bg-white rounded-lg border border-slate-800 print:border-slate-300 overflow-hidden">
              <div className="px-3 py-2 bg-slate-800/40 print:bg-slate-100 border-b border-slate-800 print:border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200 print:text-slate-800">Direito de Autor (Composição & Letra)</span>
                <span className="font-mono text-indigo-400 font-bold">
                  Total: {selectedCertificate.compositionSplits.reduce((a, b) => a + Number(b.percentage), 0)}%
                </span>
              </div>
              <div className="p-3 divide-y divide-slate-800/60 print:divide-slate-200 text-xs">
                {selectedCertificate.compositionSplits.map((split, i) => (
                  <div key={i} className="py-1.5 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-200 print:text-slate-900">{split.collaboratorName}</span>
                      <span className="text-slate-400 ml-2">({split.role})</span>
                    </div>
                    <span className="font-mono font-bold text-slate-200 print:text-slate-900 tabular-nums">
                      {split.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fonograma */}
            {selectedCertificate.masterSplits.length > 0 && (
              <div className="bg-slate-950/40 print:bg-white rounded-lg border border-slate-800 print:border-slate-300 overflow-hidden">
                <div className="px-3 py-2 bg-slate-800/40 print:bg-slate-100 border-b border-slate-800 print:border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 print:text-slate-800">Direito Conexo (Master & Gravação)</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    Total: {selectedCertificate.masterSplits.reduce((a, b) => a + Number(b.percentage), 0)}%
                  </span>
                </div>
                <div className="p-3 divide-y divide-slate-800/60 print:divide-slate-200 text-xs">
                  {selectedCertificate.masterSplits.map((split, i) => (
                    <div key={i} className="py-1.5 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-200 print:text-slate-900">{split.collaboratorName}</span>
                        <span className="text-slate-400 ml-2">({split.role})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-200 print:text-slate-900 tabular-nums">
                        {split.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Proof */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                Hash Criptográfico de Custódia (SHA-256)
              </span>
              <button
                onClick={handleCopyHash}
                className="no-print text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? 'Copiado!' : 'Copiar Hash'}</span>
              </button>
            </div>
            <p className="font-mono text-[11px] text-indigo-200 print:text-slate-800 break-all bg-slate-900 print:bg-white p-2.5 rounded border border-slate-800 print:border-slate-200">
              {selectedCertificate.sha256ProofHash}
            </p>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              Evidências vinculadas: {selectedCertificate.audioEvidenceSummary} · Letra: {selectedCertificate.lyricsFingerprint}
            </p>
          </div>

          {/* Legal Disclaimer Box - Obligatory prompt instruction */}
          <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-600/40 text-amber-200 print:bg-amber-50 print:text-amber-900 print:border-amber-300">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] space-y-1">
                <p className="font-semibold text-amber-300 print:text-amber-900 uppercase tracking-wide">
                  Aviso Legal & Limitação de Escopo:
                </p>
                <p className="leading-relaxed opacity-90">
                  {selectedCertificate.legalDisclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Stamp Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono gap-2">
            <span>PLATAFORMA SONORA RIGHTS · PROTOCOLO DE EVIDÊNCIA DIGITAL</span>
            <span>DATA DE GERAÇÃO: {new Date(selectedCertificate.issuedAt).toISOString()}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
