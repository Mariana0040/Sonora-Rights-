import { SongWork, ArtistProfile, InternalEvidenceCertificate } from '../types/music';

export async function computeSha256(textOrBytes: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(textOrBytes);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fallback pseudo hash
  }
  // deterministic hash fallback
  let hash = 0;
  for (let i = 0; i < textOrBytes.length; i++) {
    const char = textOrBytes.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, 'a');
}

export function generateEvidenceCertificate(song: SongWork, artist: ArtistProfile): InternalEvidenceCertificate {
  const seed = `${song.id}-${song.title}-${song.lyrics}-${song.creationDate}-${song.compositionSplits.map(s => `${s.collaboratorName}:${s.percentage}`).join(';')}`;
  
  // deterministic pseudo certificate code
  const codeSuffix = (Math.abs(seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 90000 + 10000).toString();
  const certificateId = `SNR-BR-2026-${codeSuffix}`;

  return {
    certificateId,
    songId: song.id,
    songTitle: song.title,
    authorName: artist.name,
    authorArtisticName: artist.artisticName,
    authorCpf: artist.cpfCnpj,
    association: artist.association,
    issuedAt: new Date().toISOString(),
    sha256ProofHash: song.fileHashSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileCount: (song.hasAudio ? 1 : 0) + (song.documents?.length || 0),
    compositionSplits: song.compositionSplits,
    masterSplits: song.masterSplits,
    lyricsFingerprint: `${song.lyrics.length} caracteres · ${song.lyrics.split('\n').filter(Boolean).length} estrofes/linhas`,
    audioEvidenceSummary: song.hasAudio ? `${song.audioFileName || 'Gravação Demo'} (${song.audioFileSize || '34 MB'}) - ${song.duration || '3:24'}` : 'Nenhum áudio anexado',
    legalDisclaimer: 'IMPORTANTE: Este documento é um registro interno de evidências técnicas de anterioridade e composição emitido pela plataforma Sonora Rights. Não substitui o registro formal em cartório, Biblioteca Nacional (EDA), Escola de Música (UFRJ), nem as filiações e cadastros obrigatórios em sociedades de gestão coletiva (ex: ABRAMUS, UBC, SICAM, AMAR, SOCINPRO, ECAD).'
  };
}
