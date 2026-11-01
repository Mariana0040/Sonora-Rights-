import React, { createContext, useContext, useState, useEffect } from 'react';
import { ArtistProfile, Collaborator, SongWork, RoyaltyStatement, InternalEvidenceCertificate } from '../types/music';
import { INITIAL_ARTIST, INITIAL_COLLABORATORS, INITIAL_SONGS, INITIAL_ROYALTIES } from '../data/initialData';
import { auditCatalog, auditSongWork } from '../utils/copyrightAuditor';
import { generateEvidenceCertificate, computeSha256 } from '../utils/evidenceCertificate';
import { globalAudioPlayer } from '../utils/audioSynthesizer';

interface MusicContextType {
  artist: ArtistProfile;
  setArtist: React.Dispatch<React.SetStateAction<ArtistProfile>>;
  updateArtistProfile: (profile: Partial<ArtistProfile>) => void;
  collaborators: Collaborator[];
  addCollaborator: (collab: Omit<Collaborator, 'id'>) => void;
  updateCollaborator: (id: string, collab: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;
  songs: SongWork[];
  addSong: (song: Omit<SongWork, 'id' | 'createdAt' | 'updatedAt' | 'fileHashSha256' | 'lastEvidenceTimestamp'>) => Promise<SongWork>;
  updateSong: (id: string, updates: Partial<SongWork>) => void;
  deleteSong: (id: string) => void;
  royalties: RoyaltyStatement[];
  addRoyaltyStatement: (statement: Omit<RoyaltyStatement, 'id'>) => void;
  importRoyaltyCsv: (csvContent: string) => { addedCount: number; errors: string[] };
  generateSongCertificate: (songId: string) => InternalEvidenceCertificate | null;
  selectedCertificate: InternalEvidenceCertificate | null;
  setSelectedCertificate: (cert: InternalEvidenceCertificate | null) => void;
  viewingSongId: string | null;
  setViewingSongId: (id: string | null) => void;
  // Audio state
  playingSongId: string | null;
  isPlayingAudio: boolean;
  audioProgressSec: number;
  audioDurationSec: number;
  togglePlaySong: (song: SongWork) => void;
  stopAudio: () => void;
  // Audit summary
  auditData: ReturnType<typeof auditCatalog>;
  // Reset demo
  resetToWorkshopDemo: () => void;
  // Auth state
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const STORAGE_KEY_PREFIX = 'sonora_rights_v1_';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization with fallbacks
  const [artist, setArtist] = useState<ArtistProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}artist`);
      return saved ? JSON.parse(saved) : INITIAL_ARTIST;
    } catch {
      return INITIAL_ARTIST;
    }
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}collaborators`);
      return saved ? JSON.parse(saved) : INITIAL_COLLABORATORS;
    } catch {
      return INITIAL_COLLABORATORS;
    }
  });

  const [songs, setSongs] = useState<SongWork[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}songs`);
      return saved ? JSON.parse(saved) : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  });

  const [royalties, setRoyalties] = useState<RoyaltyStatement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}royalties`);
      return saved ? JSON.parse(saved) : INITIAL_ROYALTIES;
    } catch {
      return INITIAL_ROYALTIES;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`);
    return saved !== null ? saved === 'true' : true; // default true for demo presentation
  });

  const [viewingSongId, setViewingSongId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<InternalEvidenceCertificate | null>(null);

  // Audio player sync
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgressSec, setAudioProgressSec] = useState(0);
  const [audioDurationSec, setAudioDurationSec] = useState(180);

  useEffect(() => {
    globalAudioPlayer.subscribe((playing, songId, currentTime, duration) => {
      setIsPlayingAudio(playing);
      setPlayingSongId(songId);
      setAudioProgressSec(currentTime);
      setAudioDurationSec(duration);
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}artist`, JSON.stringify(artist));
    } catch (e) {
      console.warn('Failed saving artist', e);
    }
  }, [artist]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}collaborators`, JSON.stringify(collaborators));
    } catch (e) {
      console.warn('Failed saving collaborators', e);
    }
  }, [collaborators]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}songs`, JSON.stringify(songs));
    } catch (e) {
      console.warn('Failed saving songs', e);
    }
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}royalties`, JSON.stringify(royalties));
    } catch (e) {
      console.warn('Failed saving royalties', e);
    }
  }, [royalties]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, String(isAuthenticated));
  }, [isAuthenticated]);

  const updateArtistProfile = (profile: Partial<ArtistProfile>) => {
    setArtist(prev => ({ ...prev, ...profile }));
  };

  const addCollaborator = (collab: Omit<Collaborator, 'id'>) => {
    const newCollab: Collaborator = {
      ...collab,
      id: `collab-${Date.now()}`
    };
    setCollaborators(prev => [...prev, newCollab]);
  };

  const updateCollaborator = (id: string, updates: Partial<Collaborator>) => {
    setCollaborators(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  const addSong = async (songData: Omit<SongWork, 'id' | 'createdAt' | 'updatedAt' | 'fileHashSha256' | 'lastEvidenceTimestamp'>): Promise<SongWork> => {
    const nowIso = new Date().toISOString();
    const hashSeed = `${songData.title}-${songData.lyrics}-${songData.creationDate}-${Date.now()}`;
    const fileHash = await computeSha256(hashSeed);

    const newSong: SongWork = {
      ...songData,
      id: `song-${Date.now()}`,
      fileHashSha256: fileHash,
      lastEvidenceTimestamp: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setSongs(prev => [newSong, ...prev]);
    return newSong;
  };

  const updateSong = (id: string, updates: Partial<SongWork>) => {
    setSongs(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));
  };

  const deleteSong = (id: string) => {
    if (playingSongId === id) {
      globalAudioPlayer.stop();
    }
    setSongs(prev => prev.filter(s => s.id !== id));
    if (viewingSongId === id) {
      setViewingSongId(null);
    }
  };

  const addRoyaltyStatement = (statement: Omit<RoyaltyStatement, 'id'>) => {
    const newStmt: RoyaltyStatement = {
      ...statement,
      id: `roy-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setRoyalties(prev => [newStmt, ...prev]);
  };

  const importRoyaltyCsv = (csvContent: string): { addedCount: number; errors: string[] } => {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return { addedCount: 0, errors: ['O arquivo CSV está vazio ou contém apenas o cabeçalho.'] };
    }

    const errors: string[] = [];
    const newStatements: RoyaltyStatement[] = [];
    const batchId = `import-csv-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    // Detect separator (; or ,)
    const header = lines[0];
    const separator = header.includes(';') ? ';' : ',';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(separator).map(p => p.trim().replace(/^["']|["']$/g, ''));
      
      // Expected format: Música, Plataforma, Período, Streams, Valor Bruto, Valor Líquido, [Notas]
      if (parts.length >= 5) {
        const titleQuery = parts[0];
        const platformRaw = parts[1] as RoyaltyStatement['platform'];
        const period = parts[2] || '2026-10';
        const streamCount = parseInt(parts[3].replace(/[^\d]/g, ''), 10) || 0;
        const gross = parseFloat(parts[4].replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const net = parts[5] ? parseFloat(parts[5].replace(/[^\d.,]/g, '').replace(',', '.')) || gross * 0.85 : gross * 0.85;
        const notes = parts[6] || 'Importado via demonstrativo CSV';

        // Find matching song or create reference
        const matchedSong = songs.find(s => s.title.toLowerCase().includes(titleQuery.toLowerCase()));

        newStatements.push({
          id: `roy-csv-${Date.now()}-${i}`,
          statementRef: `CSV-${period}-${i}`,
          platform: ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'TikTok', 'Amazon Music', 'ECAD / Rádio', 'Outros'].includes(platformRaw) ? platformRaw : 'Spotify',
          period,
          songId: matchedSong ? matchedSong.id : 'unknown',
          songTitle: matchedSong ? matchedSong.title : titleQuery,
          streamCount,
          amountGross: gross,
          amountNet: net,
          currency: 'BRL',
          status: 'reconciled',
          importBatchId: batchId,
          importDate: today,
          notes
        });
      } else {
        errors.push(`Linha ${i + 1}: Formato incorreto (esperava ao menos 5 colunas).`);
      }
    }

    if (newStatements.length > 0) {
      setRoyalties(prev => [...newStatements, ...prev]);
    }

    return { addedCount: newStatements.length, errors };
  };

  const generateSongCertificate = (songId: string): InternalEvidenceCertificate | null => {
    const song = songs.find(s => s.id === songId);
    if (!song) return null;
    const cert = generateEvidenceCertificate(song, artist);
    setSelectedCertificate(cert);
    return cert;
  };

  const togglePlaySong = (song: SongWork) => {
    globalAudioPlayer.togglePlay(song.id, song.title, song.audioDurationSec || 180, song.audioToneType || 'lofi');
  };

  const stopAudio = () => {
    globalAudioPlayer.stop();
  };

  const resetToWorkshopDemo = () => {
    globalAudioPlayer.stop();
    setArtist(INITIAL_ARTIST);
    setCollaborators(INITIAL_COLLABORATORS);
    setSongs(INITIAL_SONGS);
    setRoyalties(INITIAL_ROYALTIES);
    setIsAuthenticated(true);
    setViewingSongId(null);
    setSelectedCertificate(null);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}artist`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}collaborators`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}songs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}royalties`);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, 'true');
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    if (email && email !== artist.email) {
      setArtist(prev => ({ ...prev, email }));
    }
  };

  const logout = () => {
    globalAudioPlayer.stop();
    setIsAuthenticated(false);
  };

  // Compute live audit data
  const auditData = auditCatalog(songs, collaborators, royalties);

  return (
    <MusicContext.Provider
      value={{
        artist,
        setArtist,
        updateArtistProfile,
        collaborators,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        songs,
        addSong,
        updateSong,
        deleteSong,
        royalties,
        addRoyaltyStatement,
        importRoyaltyCsv,
        generateSongCertificate,
        selectedCertificate,
        setSelectedCertificate,
        viewingSongId,
        setViewingSongId,
        playingSongId,
        isPlayingAudio,
        audioProgressSec,
        audioDurationSec,
        togglePlaySong,
        stopAudio,
        auditData,
        resetToWorkshopDemo,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
