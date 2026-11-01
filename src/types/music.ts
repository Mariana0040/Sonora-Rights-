export interface ArtistProfile {
  id: string;
  name: string;
  artisticName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  genres: string[];
  cpfCnpj: string;
  ipiCae: string;
  association: 'ABRAMUS' | 'UBC' | 'AMAR' | 'SOCINPRO' | 'SICAM' | 'ASSIM' | 'Nenhuma';
  cityState: string;
  phone: string;
  socialLinks: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
    soundcloud?: string;
    website?: string;
  };
}

export type CollaboratorRole = 
  | 'Compositor' 
  | 'Produtor Musical' 
  | 'Letrista' 
  | 'Intérprete' 
  | 'Beatmaker' 
  | 'Arranjador' 
  | 'Músico Acompanhante' 
  | 'Mix / Master';

export interface Collaborator {
  id: string;
  artisticName: string;
  fullName: string;
  cpfCnpj: string;
  ipiCae: string;
  association: string;
  email: string;
  phone: string;
  primaryRole: CollaboratorRole;
  verifiedData: boolean;
  notes?: string;
  songsCount?: number;
}

export interface SplitEntry {
  collaboratorId: string;
  collaboratorName: string;
  role: CollaboratorRole | string;
  percentage: number;
}

export interface SongVersion {
  id: string;
  versionNumber: string;
  date: string;
  description: string;
  fileName?: string;
  fileSize?: string;
}

export interface SongDocument {
  id: string;
  name: string;
  type: 'Comprovante' | 'Contrato' | 'Letra / Cifra' | 'Guia de Gravação' | 'Declaração de Splits' | 'Outro';
  uploadDate: string;
  size: string;
  fileHash?: string;
}

export type SongType = 
  | 'Autoral / Inédita'
  | 'Single Comercial'
  | 'Beat / Instrumental'
  | 'Colaboração / Feat'
  | 'Remix / Versão'
  | 'Trilha Sonora';

export interface SongWork {
  id: string;
  title: string;
  type: SongType;
  status: 'draft' | 'documented' | 'released';
  creationDate: string;
  genre: string;
  bpm?: number;
  musicalKey?: string;
  duration?: string;
  coverUrl: string;
  lyrics: string;
  iswc?: string; // Código Internacional de Obra Musical
  isrc?: string; // Código Internacional de Gravação / Fonograma
  audioFileName?: string;
  audioFileSize?: string;
  audioDurationSec?: number;
  hasAudio: boolean;
  audioToneType?: 'chords' | 'lofi' | 'ambient';
  fileHashSha256: string;
  compositionSplits: SplitEntry[]; // Direitos Autorais / Obra (deve totalizar 100%)
  masterSplits: SplitEntry[];      // Direitos Conexos / Fonograma (deve totalizar 100%)
  documents: SongDocument[];
  versions: SongVersion[];
  lastEvidenceTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'verified';

export interface CopyrightAlert {
  id: string;
  songId: string;
  songTitle: string;
  severity: AlertSeverity;
  category: 
    | 'splits_sum' 
    | 'missing_composers' 
    | 'incomplete_collaborator_id' 
    | 'metadata_mismatch' 
    | 'unregistered_isrc' 
    | 'missing_audio_proof';
  title: string;
  description: string;
  suggestedAction: string;
  resolved: boolean;
}

export interface RoyaltyStatement {
  id: string;
  statementRef: string;
  platform: 'Spotify' | 'Apple Music' | 'YouTube Music' | 'Deezer' | 'TikTok' | 'Amazon Music' | 'ECAD / Rádio' | 'Outros';
  period: string; // YYYY-MM
  songId: string;
  songTitle: string;
  streamCount: number;
  amountGross: number;
  amountNet: number;
  currency: string;
  status: 'reconciled' | 'pending_split' | 'discrepancy';
  importBatchId: string;
  importDate: string;
  notes?: string;
}

export interface InternalEvidenceCertificate {
  certificateId: string;
  songId: string;
  songTitle: string;
  authorName: string;
  authorArtisticName: string;
  authorCpf: string;
  association: string;
  issuedAt: string;
  sha256ProofHash: string;
  fileCount: number;
  compositionSplits: SplitEntry[];
  masterSplits: SplitEntry[];
  lyricsFingerprint: string;
  audioEvidenceSummary: string;
  legalDisclaimer: string;
}
