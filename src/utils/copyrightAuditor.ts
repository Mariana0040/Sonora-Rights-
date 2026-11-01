import { SongWork, Collaborator, RoyaltyStatement, CopyrightAlert } from '../types/music';

export interface SongAuditSummary {
  songId: string;
  songTitle: string;
  hasErrors: boolean;
  hasWarnings: boolean;
  isFullyCompliant: boolean;
  compositionSum: number;
  masterSum: number;
  alerts: CopyrightAlert[];
}

export function auditSongWork(song: SongWork, collaborators: Collaborator[], royalties: RoyaltyStatement[] = []): SongAuditSummary {
  const alerts: CopyrightAlert[] = [];
  const collabMap = new Map(collaborators.map(c => [c.id, c]));

  // 1. Verificar soma dos percentuais da Composição (Obra)
  const compositionSum = song.compositionSplits.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
  const roundedCompSum = Math.round(compositionSum * 100) / 100;

  if (song.compositionSplits.length === 0) {
    alerts.push({
      id: `alert-no-comp-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'critical',
      category: 'missing_composers',
      title: 'Obra sem compositores cadastrados',
      description: 'Nenhum titular de direitos autorais (composição/letra) foi vinculado a esta obra musical.',
      suggestedAction: 'Cadastre ao menos um compositor informando a divisão de 100% da autoria.',
      resolved: false
    });
  } else if (roundedCompSum !== 100) {
    alerts.push({
      id: `alert-comp-sum-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'critical',
      category: 'splits_sum',
      title: `Divisão de composição soma ${roundedCompSum}% (deve ser 100%)`,
      description: `A soma das porcentagens de autoria dos compositores totaliza ${roundedCompSum}%. Em sociedades como a ABRAMUS/UBC e distribuidoras, percentuais incompletos impedem o repasse correto de direitos autorais de execução e sincronização.`,
      suggestedAction: `Ajuste os percentuais dos parceiros para que o somatório atinja exatamente 100% (${100 - roundedCompSum > 0 ? `faltam ${(100 - roundedCompSum).toFixed(1)}%` : `excesso de ${(roundedCompSum - 100).toFixed(1)}%`}).`,
      resolved: false
    });
  }

  // 2. Verificar soma dos percentuais de Fonograma / Master (Gravação)
  const masterSum = song.masterSplits.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
  const roundedMasterSum = Math.round(masterSum * 100) / 100;

  if (song.masterSplits.length > 0 && roundedMasterSum !== 100) {
    alerts.push({
      id: `alert-master-sum-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'warning',
      category: 'splits_sum',
      title: `Divisão fonográfica (Master) soma ${roundedMasterSum}%`,
      description: `Os direitos conexos da gravação (produtor fonográfico, intérpretes e músicos) devem totalizar 100% para evitar retenção de pagamentos de direitos conexos no ECAD.`,
      suggestedAction: 'Revise os percentuais dos participantes da gravação até totalizarem 100%.',
      resolved: false
    });
  }

  // 3. Verificar colaboradores com dados incompletos (CPF / IPI / Associação)
  const allInvolvedCollabIds = new Set([
    ...song.compositionSplits.map(s => s.collaboratorId),
    ...song.masterSplits.map(s => s.collaboratorId)
  ]);

  allInvolvedCollabIds.forEach(collabId => {
    const collab = collabMap.get(collabId);
    if (collab) {
      const missingFields: string[] = [];
      if (!collab.cpfCnpj || collab.cpfCnpj.trim() === '') missingFields.push('CPF/CNPJ');
      if (!collab.ipiCae || collab.ipiCae.trim() === '') missingFields.push('Código IPI/CAE');
      if (!collab.association || collab.association === 'Pendente' || collab.association === 'Nenhuma') missingFields.push('Associação Coletiva');

      if (missingFields.length > 0) {
        alerts.push({
          id: `alert-collab-${song.id}-${collab.id}`,
          songId: song.id,
          songTitle: song.title,
          severity: 'warning',
          category: 'incomplete_collaborator_id',
          title: `Cadastro incompleto: ${collab.artisticName}`,
          description: `O colaborador ${collab.fullName || collab.artisticName} possui dados essenciais em aberto: ${missingFields.join(', ')}. Sem esses dados, associações e distribuidoras podem não conseguir creditar o titular.`,
          suggestedAction: `Solicite ao parceiro o envio de ${missingFields.join(' e ')} e atualize a ficha do colaborador.`,
          resolved: false
        });
      }
    }
  });

  // 4. Verificar ausência de ISRC ou ISWC se a música já estiver documentada/lançada
  if (song.status === 'released' && (!song.isrc || song.isrc.trim() === '')) {
    alerts.push({
      id: `alert-no-isrc-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'warning',
      category: 'unregistered_isrc',
      title: 'Obra lançada sem código ISRC cadastrado',
      description: 'Músicas distribuídas digitalmente geram um código ISRC único para a gravação. O não preenchimento dificulta a conciliação automática com relatórios de streaming.',
      suggestedAction: 'Insira o ISRC gerado pela sua distribuidora (ex: ONErpm, Tratore, DistroKid, CD Baby).',
      resolved: false
    });
  }

  // 5. Verificar comprovação de áudio ou letra
  if (!song.hasAudio && (!song.lyrics || song.lyrics.trim().length < 20)) {
    alerts.push({
      id: `alert-no-evidence-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'info',
      category: 'missing_audio_proof',
      title: 'Sem letra ou áudio-guia anexado',
      description: 'Esta obra ainda não possui arquivo de áudio ou letra completa para geração do comprovante de evidência técnica interna.',
      suggestedAction: 'Anexe a gravação demo, beat ou a letra completa para resguardar a anterioridade da criação.',
      resolved: false
    });
  }

  // 6. Verificar divergências em demonstrativos de royalties importados
  const songRoyalties = royalties.filter(r => r.songId === song.id);
  const discrepancyStatement = songRoyalties.find(r => r.status === 'discrepancy');
  if (discrepancyStatement) {
    alerts.push({
      id: `alert-royalty-disc-${song.id}`,
      songId: song.id,
      songTitle: song.title,
      severity: 'critical',
      category: 'metadata_mismatch',
      title: `Divergência financeira no demonstrativo da plataforma (${discrepancyStatement.platform})`,
      description: discrepancyStatement.notes || 'A plataforma reportou retenção ou divergência de créditos cadastrais neste período.',
      suggestedAction: 'Verifique se os dados do fonograma cadastrados na distribuidora coincidem exatamente com o split registrado.',
      resolved: false
    });
  }

  const hasErrors = alerts.some(a => a.severity === 'critical');
  const hasWarnings = alerts.some(a => a.severity === 'warning');
  const isFullyCompliant = !hasErrors && !hasWarnings;

  return {
    songId: song.id,
    songTitle: song.title,
    hasErrors,
    hasWarnings,
    isFullyCompliant,
    compositionSum: roundedCompSum,
    masterSum: roundedMasterSum,
    alerts
  };
}

export function auditCatalog(songs: SongWork[], collaborators: Collaborator[], royalties: RoyaltyStatement[] = []): {
  audits: SongAuditSummary[];
  allAlerts: CopyrightAlert[];
  totalCompliant: number;
  totalWithErrors: number;
  totalWithWarnings: number;
  criticalAlertsCount: number;
  warningAlertsCount: number;
} {
  const audits = songs.map(s => auditSongWork(s, collaborators, royalties));
  const allAlerts = audits.flatMap(a => a.alerts);
  
  const totalCompliant = audits.filter(a => a.isFullyCompliant).length;
  const totalWithErrors = audits.filter(a => a.hasErrors).length;
  const totalWithWarnings = audits.filter(a => a.hasWarnings && !a.hasErrors).length;
  const criticalAlertsCount = allAlerts.filter(a => a.severity === 'critical').length;
  const warningAlertsCount = allAlerts.filter(a => a.severity === 'warning').length;

  return {
    audits,
    allAlerts,
    totalCompliant,
    totalWithErrors,
    totalWithWarnings,
    criticalAlertsCount,
    warningAlertsCount
  };
}
