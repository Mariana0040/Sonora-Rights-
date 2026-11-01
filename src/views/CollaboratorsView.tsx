import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  Edit, 
  Trash2, 
  X, 
  ShieldCheck,
  Building2,
  FileBadge
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Collaborator, CollaboratorRole } from '../types/music';

export const CollaboratorsView: React.FC = () => {
  const { collaborators, addCollaborator, updateCollaborator, deleteCollaborator, songs } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);

  // Form states
  const [artisticName, setArtisticName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [ipiCae, setIpiCae] = useState('');
  const [association, setAssociation] = useState('ABRAMUS');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryRole, setPrimaryRole] = useState<CollaboratorRole>('Compositor');
  const [notes, setNotes] = useState('');

  const filteredCollabs = collaborators.filter(c => 
    c.artisticName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.association && c.association.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingCollab(null);
    setArtisticName('');
    setFullName('');
    setCpfCnpj('');
    setIpiCae('');
    setAssociation('ABRAMUS');
    setEmail('');
    setPhone('');
    setPrimaryRole('Compositor');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (collab: Collaborator) => {
    setEditingCollab(collab);
    setArtisticName(collab.artisticName);
    setFullName(collab.fullName);
    setCpfCnpj(collab.cpfCnpj);
    setIpiCae(collab.ipiCae);
    setAssociation(collab.association || 'ABRAMUS');
    setEmail(collab.email);
    setPhone(collab.phone);
    setPrimaryRole(collab.primaryRole);
    setNotes(collab.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisticName.trim()) return;

    const isVerified = Boolean(cpfCnpj.trim() && ipiCae.trim() && association !== 'Pendente');

    if (editingCollab) {
      updateCollaborator(editingCollab.id, {
        artisticName,
        fullName,
        cpfCnpj,
        ipiCae,
        association,
        email,
        phone,
        primaryRole,
        notes,
        verifiedData: isVerified
      });
    } else {
      addCollaborator({
        artisticName,
        fullName,
        cpfCnpj,
        ipiCae,
        association,
        email,
        phone,
        primaryRole,
        notes,
        verifiedData: isVerified,
        songsCount: 0
      });
    }

    setIsModalOpen(false);
  };

  // Quick fix for Thiago Ribeiro in the workshop
  const handleQuickFixThiago = (collabId: string) => {
    updateCollaborator(collabId, {
      cpfCnpj: '381.992.408-15',
      ipiCae: '00984128910',
      association: 'ABRAMUS',
      verifiedData: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Colaboradores & Parceiros Musicais</h2>
          <p className="text-xs text-slate-400">
            Cadastre os titulares envolvidos em suas músicas com IPI/CAE, CPF e associação para registro correto no ECAD.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Colaborador</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, função ou associação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          {collaborators.length} cadastrados · {collaborators.filter(c => c.verifiedData).length} regulares
        </div>
      </div>

      {/* Collaborators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCollabs.map((collab) => {
          const associatedSongs = songs.filter(s => 
            s.compositionSplits.some(cs => cs.collaboratorId === collab.id) ||
            s.masterSplits.some(ms => ms.collaboratorId === collab.id)
          );

          return (
            <div
              key={collab.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header with Avatar placeholder and Verification Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center font-bold text-indigo-300 text-xs shrink-0">
                      {collab.artisticName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{collab.artisticName}</h3>
                      <p className="text-xs text-slate-400">{collab.fullName || 'Nome civil não informado'}</p>
                    </div>
                  </div>

                  {collab.verifiedData ? (
                    <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono flex items-center gap-1" title="Cadastro Completo">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold flex items-center gap-1" title="Dados Incompletos">
                      <AlertCircle className="w-3 h-3" />
                      Incompleto
                    </span>
                  )}
                </div>

                {/* Role and Association tags */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                    {collab.primaryRole}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 text-[11px] font-mono border border-indigo-800/60">
                    {collab.association || 'Sem Associação'}
                  </span>
                </div>

                {/* Technical data table */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">CPF / CNPJ</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {collab.cpfCnpj || <span className="text-amber-400 font-semibold">Pendente</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">IPI / CAE</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {collab.ipiCae || <span className="text-amber-400 font-semibold">Não informado</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Obras Vinculadas</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {associatedSongs.length} {associatedSongs.length === 1 ? 'música' : 'músicas'}
                    </span>
                  </div>
                </div>

                {/* Notes or Incomplete Action Alert */}
                {!collab.verifiedData && (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-lg text-[11px] text-amber-200 space-y-1.5">
                    <p>Faltam CPF e IPI para validação dos créditos nas associações.</p>
                    <button
                      onClick={() => handleQuickFixThiago(collab.id)}
                      className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-semibold text-[10px] border border-amber-500/40 transition-colors"
                    >
                      Preencher Dados de Demonstração
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {collab.email || collab.phone || 'Sem contato'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(collab)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Editar colaborador"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {collab.id !== 'collab-gabriel' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja remover ${collab.artisticName}?`)) {
                          deleteCollaborator(collab.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingCollab ? 'Editar Colaborador' : 'Novo Colaborador Musical'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nome Artístico <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mari Costa, DJ Luk Beats..."
                  value={artisticName}
                  onChange={(e) => setArtisticName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome Civil Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Mariana Duarte Costa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código IPI / CAE</label>
                  <input
                    type="text"
                    placeholder="00000000000"
                    value={ipiCae}
                    onChange={(e) => setIpiCae(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Associação de Direitos</label>
                  <select
                    value={association}
                    onChange={(e) => setAssociation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs cursor-pointer"
                  >
                    <option value="ABRAMUS">ABRAMUS</option>
                    <option value="UBC">UBC</option>
                    <option value="AMAR">AMAR</option>
                    <option value="SOCINPRO">SOCINPRO</option>
                    <option value="SICAM">SICAM</option>
                    <option value="ASSIM">ASSIM</option>
                    <option value="Pendente">Pendente / Não associado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Função Principal</label>
                  <select
                    value={primaryRole}
                    onChange={(e) => setPrimaryRole(e.target.value as CollaboratorRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs cursor-pointer"
                  >
                    <option value="Compositor">Compositor</option>
                    <option value="Letrista">Letrista</option>
                    <option value="Produtor Musical">Produtor Musical</option>
                    <option value="Intérprete">Intérprete</option>
                    <option value="Beatmaker">Beatmaker</option>
                    <option value="Arranjador">Arranjador</option>
                    <option value="Músico Acompanhante">Músico Acompanhante</option>
                    <option value="Mix / Master">Mix / Master</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Anotações / Papel no projeto</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gravou as guitarras solo do single de estréia..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
