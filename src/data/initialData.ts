import { ArtistProfile, Collaborator, SongWork, RoyaltyStatement } from '../types/music';

export const INITIAL_ARTIST: ArtistProfile = {
  id: 'artist-gabriel-1',
  name: 'Gabriel Menezes da Silva',
  artisticName: 'Gabe Luz',
  email: 'gabriel.luz@sonoramusic.indie.br',
  avatarUrl: '/src/assets/images/artist_avatar_gabriel_1793466023679.jpg',
  bio: 'Cantor, compositor e produtor musical independente de São Paulo. Explorando fusões entre Indie Pop, MPB contemporânea e batidas urbanas lo-fi.',
  genres: ['Indie Pop', 'MPB Contemporânea', 'Lo-Fi Urbano', 'R&B Brasileiro'],
  cpfCnpj: '418.920.318-72',
  ipiCae: '00892419283',
  association: 'ABRAMUS',
  cityState: 'São Paulo - SP',
  phone: '(11) 98721-4432',
  socialLinks: {
    spotify: 'https://spotify.com/artist/gabeluz',
    instagram: 'https://instagram.com/gabeluz.music',
    youtube: 'https://youtube.com/@gabeluzoficial',
    soundcloud: 'https://soundcloud.com/gabeluz'
  }
};

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'collab-gabriel',
    artisticName: 'Gabe Luz',
    fullName: 'Gabriel Menezes da Silva',
    cpfCnpj: '418.920.318-72',
    ipiCae: '00892419283',
    association: 'ABRAMUS',
    email: 'gabriel.luz@sonoramusic.indie.br',
    phone: '(11) 98721-4432',
    primaryRole: 'Compositor',
    verifiedData: true,
    notes: 'Titular principal / Administrador da conta',
    songsCount: 4
  },
  {
    id: 'collab-mariana',
    artisticName: 'Mari Costa',
    fullName: 'Mariana Duarte Costa',
    cpfCnpj: '329.841.520-11',
    ipiCae: '00714902314',
    association: 'UBC',
    email: 'mariana.costa.letras@gmail.com',
    phone: '(21) 99342-8819',
    primaryRole: 'Letrista',
    verifiedData: true,
    notes: 'Parceira de composição lírica e harmonias vocais',
    songsCount: 2
  },
  {
    id: 'collab-djluk',
    artisticName: 'DJ Luk Beats',
    fullName: 'Lucas Santana Ferraz',
    cpfCnpj: '502.119.782-90',
    ipiCae: '00918239011',
    association: 'ABRAMUS',
    email: 'lukbeats.prod@studiobox.com',
    phone: '(11) 97103-9944',
    primaryRole: 'Beatmaker',
    verifiedData: true,
    notes: 'Produção musical, arranjo rítmico e beats digitais',
    songsCount: 2
  },
  {
    id: 'collab-bia',
    artisticName: 'Bia Voice',
    fullName: 'Beatriz Alencar de Souza',
    cpfCnpj: '445.672.901-33',
    ipiCae: '00832941002',
    association: 'SOCINPRO',
    email: 'beatriz.voice@alencar.art',
    phone: '(31) 98455-1200',
    primaryRole: 'Intérprete',
    verifiedData: true,
    notes: 'Participação especial (feat vocais principais em Sintonia Noturna)',
    songsCount: 1
  },
  {
    id: 'collab-thiago',
    artisticName: 'Thiago Guitarras',
    fullName: 'Thiago Ribeiro Mendes',
    cpfCnpj: '', // Incompleto propositalmente para o Analisador de Direitos
    ipiCae: '',
    association: 'Pendente',
    email: 'thiago.rib.guitar@gmail.com',
    phone: '(11) 96541-2289',
    primaryRole: 'Músico Acompanhante',
    verifiedData: false,
    notes: 'Gravou os violões e guitarras em Ecos do Vento. Falta envio do CPF e cadastro na associação.',
    songsCount: 1
  },
  {
    id: 'collab-felipe',
    artisticName: 'Lipe Mix',
    fullName: 'Felipe Ramos Toledo',
    cpfCnpj: '289.441.988-51',
    ipiCae: '00694182901',
    association: 'AMAR',
    email: 'lipemix.master@soundeng.br',
    phone: '(41) 99823-7711',
    primaryRole: 'Mix / Master',
    verifiedData: true,
    notes: 'Engenheiro de mixagem e masterização analógica',
    songsCount: 2
  }
];

export const INITIAL_SONGS: SongWork[] = [
  {
    id: 'song-aurora',
    title: 'Aurora Boreal',
    type: 'Single Comercial',
    status: 'released',
    creationDate: '2026-03-15',
    genre: 'Indie Pop',
    bpm: 118,
    musicalKey: 'Dó Maior (C)',
    duration: '3:24',
    coverUrl: '/src/assets/images/album_cover_aurora_1793466023392.jpg',
    iswc: 'T-309.841.920-4',
    isrc: 'BR-GB1-26-00012',
    audioFileName: 'aurora_boreal_master_v3_final.wav',
    audioFileSize: '34.2 MB',
    audioDurationSec: 204,
    hasAudio: true,
    audioToneType: 'ambient',
    fileHashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    lyrics: `[Verso 1]
A luz da rua reflete na poça da avenida
Eu sinto o vento frio cortar a despedida
Mas quando o sol se põe e o céu azul começa a arder
É como ver aurora sem sair de onde eu nascer

[Refrão]
Aurora boreal no concreto da cidade
Trazendo de volta toda a minha verdade
Eu corro pro estúdio antes do dia clarear
Cada acorde é um motivo pra continuar
É o som que ninguém pode apagar

[Verso 2]
No monitor a onda corre sem parar
Grave batendo forte, você vai lembrar
Das noites em claro procurando a melodia
Que transformou angústia pura em poesia

[Ponte]
E mesmo se o mundo inteiro esquecer
O que foi gravado aqui vai viver`,
    compositionSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Compositor', percentage: 60 },
      { collaboratorId: 'collab-mariana', collaboratorName: 'Mari Costa', role: 'Letrista', percentage: 40 }
    ],
    masterSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Produtor Fonográfico', percentage: 70 },
      { collaboratorId: 'collab-djluk', collaboratorName: 'DJ Luk Beats', role: 'Produtor Musical', percentage: 30 }
    ],
    documents: [
      { id: 'doc-1', name: 'Comprovante_Autoria_Aurora_Boreal.pdf', type: 'Comprovante', uploadDate: '2026-03-18', size: '1.2 MB', fileHash: 'd7a8fbb307d7809469ca933b02dd32a9' },
      { id: 'doc-2', name: 'Contrato_Splits_Mariana_Gabe.pdf', type: 'Contrato', uploadDate: '2026-03-20', size: '2.4 MB' },
      { id: 'doc-3', name: 'Letra_Oficial_Cifrada.txt', type: 'Letra / Cifra', uploadDate: '2026-03-15', size: '12 KB' }
    ],
    versions: [
      { id: 'v-1', versionNumber: 'v1.0 (Demo Acústica)', date: '2026-03-10', description: 'Gravação inicial no celular com voz e violão', fileName: 'aurora_demo_cel.m4a', fileSize: '4.8 MB' },
      { id: 'v-2', versionNumber: 'v2.1 (Arranjo com Bateria)', date: '2026-03-16', description: 'Beats adicionados por DJ Luk no Ableton', fileName: 'aurora_arr_djluk.wav', fileSize: '28.1 MB' },
      { id: 'v-3', versionNumber: 'v3.0 (Master Final)', date: '2026-03-25', description: 'Master finalizada pronta para plataformas', fileName: 'aurora_boreal_master_v3_final.wav', fileSize: '34.2 MB' }
    ],
    lastEvidenceTimestamp: '2026-03-18T14:22:00Z',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-25T18:30:00Z'
  },
  {
    id: 'song-sintonia',
    title: 'Sintonia Noturna (feat. Bia Voice)',
    type: 'Colaboração / Feat',
    status: 'documented',
    creationDate: '2026-06-02',
    genre: 'Lo-Fi Urbano',
    bpm: 92,
    musicalKey: 'Sol Menor (Gm)',
    duration: '2:58',
    coverUrl: '/src/assets/images/album_cover_sintonia_1793466024595.jpg',
    iswc: 'T-310.228.401-8',
    isrc: 'BR-GB1-26-00045',
    audioFileName: 'sintonia_noturna_mixdown.wav',
    audioFileSize: '29.8 MB',
    audioDurationSec: 178,
    hasAudio: true,
    audioToneType: 'lofi',
    fileHashSha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    lyrics: `[Intro: Instrumental Beat & Filtro Lo-Fi]

[Verso 1: Gabe Luz]
Passa das três da manhã, café já esfriou
O som do metrô distante na janela ecoou
Eu tô plugado na mesa de som
Tentando achar a frequência do teu tom

[Refrão: Bia Voice & Gabe Luz]
É sintonia noturna que a gente encontrou
Quando o mundo dorme, o nosso beat acordou
Pode o sinal cair, a conexão falhar
Essa canção já tá solta no ar

[Verso 2: Bia Voice]
Minha voz encontra o teu sintetizador
Não precisa contrato pra falar de amor
Mas precisa de registro pra ninguém roubar
O que a gente construiu sem pestanejar

[Outro]
Sintonia... No ar... Gabe Luz e Bia...`,
    // ATENÇÃO: Splits totalizam 90% (45% + 45%) de propósito para testar o Analisador de Direitos!
    compositionSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Compositor', percentage: 45 },
      { collaboratorId: 'collab-bia', collaboratorName: 'Bia Voice', role: 'Compositora', percentage: 45 }
    ],
    masterSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Produtor Fonográfico', percentage: 50 },
      { collaboratorId: 'collab-djluk', collaboratorName: 'DJ Luk Beats', role: 'Beatmaker', percentage: 30 },
      { collaboratorId: 'collab-bia', collaboratorName: 'Bia Voice', role: 'Intérprete Principal', percentage: 20 }
    ],
    documents: [
      { id: 'doc-4', name: 'Comprovante_Custodia_Sintonia.pdf', type: 'Comprovante', uploadDate: '2026-06-05', size: '980 KB', fileHash: 'c4ca4238a0b923820dcc509a6f75849b' },
      { id: 'doc-5', name: 'Autorizacao_Voz_Bia_Voice.pdf', type: 'Contrato', uploadDate: '2026-06-03', size: '1.8 MB' }
    ],
    versions: [
      { id: 'v-4', versionNumber: 'v1.0 (Beat Guide)', date: '2026-06-02', description: 'Base instrumental criada por DJ Luk', fileName: 'sintonia_beat_guide.mp3', fileSize: '6.2 MB' },
      { id: 'v-5', versionNumber: 'v2.0 (Vozes Gravadas)', date: '2026-06-04', description: 'Captação de voz de Bia Voice e Gabe', fileName: 'sintonia_noturna_mixdown.wav', fileSize: '29.8 MB' }
    ],
    lastEvidenceTimestamp: '2026-06-05T11:15:00Z',
    createdAt: '2026-06-02T16:00:00Z',
    updatedAt: '2026-06-08T12:00:00Z'
  },
  {
    id: 'song-ecos',
    title: 'Ecos do Vento',
    type: 'Autoral / Inédita',
    status: 'draft',
    creationDate: '2026-08-14',
    genre: 'MPB Contemporânea',
    bpm: 80,
    musicalKey: 'Mi Menor (Em)',
    duration: '4:10',
    coverUrl: '/src/assets/images/album_cover_ecos_1793466023514.jpg',
    iswc: 'T-312.909.112-0',
    isrc: '', // Incompleto propositalmente
    audioFileName: 'ecos_do_vento_violao_guia.mp3',
    audioFileSize: '8.4 MB',
    audioDurationSec: 250,
    hasAudio: true,
    audioToneType: 'chords',
    fileHashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    lyrics: `[Verso 1]
Folhas secas na varanda do quintal
Um acorde menor, quase natural
O tempo não perdoa quem fica a esperar
A música nasce quando a voz quer chorar

[Refrão]
Ecos do vento que vêm do cerrado
Trazem a lembrança do amor passado
Não tenho medo de recomeçar
Com seis cordas e o peito aberto pra cantar`,
    compositionSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Compositor', percentage: 70 },
      { collaboratorId: 'collab-mariana', collaboratorName: 'Mari Costa', role: 'Letrista', percentage: 30 }
    ],
    // Thiago Ribeiro não tem CPF completo
    masterSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Produtor Fonográfico', percentage: 60 },
      { collaboratorId: 'collab-thiago', collaboratorName: 'Thiago Guitarras', role: 'Músico Acompanhante', percentage: 40 }
    ],
    documents: [
      { id: 'doc-6', name: 'Manuscrito_Letra_Ecos.png', type: 'Letra / Cifra', uploadDate: '2026-08-14', size: '3.1 MB' }
    ],
    versions: [
      { id: 'v-6', versionNumber: 'v1.0 (Guia com Violão)', date: '2026-08-14', description: 'Captação acústica inicial', fileName: 'ecos_do_vento_violao_guia.mp3', fileSize: '8.4 MB' }
    ],
    lastEvidenceTimestamp: '2026-08-15T09:30:00Z',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'song-passo',
    title: 'Passo a Passo (Acoustic)',
    type: 'Beat / Instrumental',
    status: 'draft',
    creationDate: '2026-10-22',
    genre: 'R&B Brasileiro',
    bpm: 104,
    musicalKey: 'Lá Maior (A)',
    duration: '2:45',
    coverUrl: '/src/assets/images/album_cover_aurora_1793466023392.jpg',
    iswc: '',
    isrc: '',
    audioFileName: '',
    audioFileSize: '',
    audioDurationSec: 0,
    hasAudio: false,
    fileHashSha256: '',
    lyrics: `[Rascunho de Letra em Andamento]
Passo a passo no asfalto quente
Cada sonho que brota na mente
Sem pressa pra chegar
Basta o groove não parar...`,
    compositionSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Compositor', percentage: 100 }
    ],
    masterSplits: [
      { collaboratorId: 'collab-gabriel', collaboratorName: 'Gabe Luz', role: 'Produtor Fonográfico', percentage: 100 }
    ],
    documents: [],
    versions: [
      { id: 'v-7', versionNumber: 'v0.1 (Ideia de Letra)', date: '2026-10-22', description: 'Rascunho inicial de letra no caderno', fileName: '', fileSize: '' }
    ],
    lastEvidenceTimestamp: '',
    createdAt: '2026-10-22T14:00:00Z',
    updatedAt: '2026-10-22T14:00:00Z'
  }
];

export const INITIAL_ROYALTIES: RoyaltyStatement[] = [
  // Aurora Boreal
  {
    id: 'roy-1',
    statementRef: 'SPOT-2026-10-AB',
    platform: 'Spotify',
    period: '2026-10',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 42150,
    amountGross: 785.40,
    amountNet: 667.59,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28',
    notes: 'Demonstrativo mensal consolidado via ONErpm/DistroKid'
  },
  {
    id: 'roy-2',
    statementRef: 'APPL-2026-10-AB',
    platform: 'Apple Music',
    period: '2026-10',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 11400,
    amountGross: 399.00,
    amountNet: 339.15,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28',
    notes: 'Taxa de streaming Apple Music padrão Brasil'
  },
  {
    id: 'roy-3',
    statementRef: 'YOUT-2026-10-AB',
    platform: 'YouTube Music',
    period: '2026-10',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 28900,
    amountGross: 346.80,
    amountNet: 294.78,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28'
  },
  {
    id: 'roy-4',
    statementRef: 'DEEZ-2026-10-AB',
    platform: 'Deezer',
    period: '2026-10',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 6800,
    amountGross: 149.60,
    amountNet: 127.16,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28'
  },
  {
    id: 'roy-5',
    statementRef: 'TIKT-2026-10-AB',
    platform: 'TikTok',
    period: '2026-10',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 95400,
    amountGross: 210.00,
    amountNet: 178.50,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28',
    notes: 'Uso de trecho de áudio em vídeos curtos'
  },
  // Setembro 2026
  {
    id: 'roy-6',
    statementRef: 'SPOT-2026-09-AB',
    platform: 'Spotify',
    period: '2026-09',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 38200,
    amountGross: 712.00,
    amountNet: 605.20,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-09-distro',
    importDate: '2026-09-29'
  },
  {
    id: 'roy-7',
    statementRef: 'APPL-2026-09-AB',
    platform: 'Apple Music',
    period: '2026-09',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 9800,
    amountGross: 343.00,
    amountNet: 291.55,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-09-distro',
    importDate: '2026-09-29'
  },
  // Sintonia Noturna
  {
    id: 'roy-8',
    statementRef: 'SPOT-2026-10-SN',
    platform: 'Spotify',
    period: '2026-10',
    songId: 'song-sintonia',
    songTitle: 'Sintonia Noturna (feat. Bia Voice)',
    streamCount: 29400,
    amountGross: 548.00,
    amountNet: 465.80,
    currency: 'BRL',
    status: 'discrepancy',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28',
    notes: 'Alerta da distribuidora: splits de composição não somam 100% no catálogo.'
  },
  {
    id: 'roy-9',
    statementRef: 'APPL-2026-10-SN',
    platform: 'Apple Music',
    period: '2026-10',
    songId: 'song-sintonia',
    songTitle: 'Sintonia Noturna (feat. Bia Voice)',
    streamCount: 8200,
    amountGross: 287.00,
    amountNet: 243.95,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28'
  },
  {
    id: 'roy-10',
    statementRef: 'YOUT-2026-10-SN',
    platform: 'YouTube Music',
    period: '2026-10',
    songId: 'song-sintonia',
    songTitle: 'Sintonia Noturna (feat. Bia Voice)',
    streamCount: 19500,
    amountGross: 234.00,
    amountNet: 198.90,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-10-distro',
    importDate: '2026-10-28'
  },
  {
    id: 'roy-11',
    statementRef: 'SPOT-2026-09-SN',
    platform: 'Spotify',
    period: '2026-09',
    songId: 'song-sintonia',
    songTitle: 'Sintonia Noturna (feat. Bia Voice)',
    streamCount: 22100,
    amountGross: 412.00,
    amountNet: 350.20,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-09-distro',
    importDate: '2026-09-29'
  },
  // Agosto 2026
  {
    id: 'roy-12',
    statementRef: 'SPOT-2026-08-SN',
    platform: 'Spotify',
    period: '2026-08',
    songId: 'song-sintonia',
    songTitle: 'Sintonia Noturna (feat. Bia Voice)',
    streamCount: 18400,
    amountGross: 343.00,
    amountNet: 291.55,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-08-distro',
    importDate: '2026-08-30'
  },
  {
    id: 'roy-13',
    statementRef: 'SPOT-2026-08-AB',
    platform: 'Spotify',
    period: '2026-08',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 31200,
    amountGross: 582.00,
    amountNet: 494.70,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-2026-08-distro',
    importDate: '2026-08-30'
  },
  {
    id: 'roy-14',
    statementRef: 'ECAD-2026-09-AB',
    platform: 'ECAD / Rádio',
    period: '2026-09',
    songId: 'song-aurora',
    songTitle: 'Aurora Boreal',
    streamCount: 140, // Execuções em rádio web / universitária
    amountGross: 184.20,
    amountNet: 165.78,
    currency: 'BRL',
    status: 'reconciled',
    importBatchId: 'batch-ecad-trim3',
    importDate: '2026-09-25',
    notes: 'Distribuição trimestral de execução pública (Rádios Web/Comunitárias)'
  }
];
