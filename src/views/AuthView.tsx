import React, { useState } from 'react';
import { 
  Disc3, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Music2,
  ShieldCheck
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const AuthView: React.FC = () => {
  const { login, setArtist, artist } = useMusic();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [email, setEmail] = useState('gabriel.luz@sonoramusic.indie.br');
  const [password, setPassword] = useState('••••••••••');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regArtisticName, setRegArtisticName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAssociation, setRegAssociation] = useState('ABRAMUS');

  // Recovery message
  const [recoverySent, setRecoverySent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setArtist({
      id: `artist-${Date.now()}`,
      name: regName,
      artisticName: regArtisticName || regName,
      email: regEmail,
      avatarUrl: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(regArtisticName || regName) + '&background=6366f1&color=fff',
      bio: 'Artista independente cadastrado na plataforma Sonora Rights.',
      genres: ['Indie / Autoral'],
      cpfCnpj: 'Pendente',
      ipiCae: 'Pendente',
      association: regAssociation as any,
      cityState: 'Brasil',
      phone: '',
      socialLinks: {}
    });

    login(regEmail);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
    setTimeout(() => {
      setRecoverySent(false);
      setAuthMode('login');
    }, 3500);
  };

  const handleQuickDemoGabriel = () => {
    login('gabriel.luz@sonoramusic.indie.br');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
            <Disc3 className="w-7 h-7 text-indigo-100 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sonora Rights</h1>
          <p className="text-xs text-slate-400">
            Plataforma de Gestão Musical & Auditoria de Direitos para Artistas Independentes
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Acesso Rápido para Apresentação do Workshop</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Entrar com a persona do Gabriel (com músicas exemplo, demonstrativos e análise de divergência de 90% pronta).
          </p>
          <button
            onClick={handleQuickDemoGabriel}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Entrar como Gabriel Luz (Demonstração)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-mono">ou acesse sua conta</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg text-xs">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              authMode === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              authMode === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Criar Conta
          </button>
          <button
            onClick={() => setAuthMode('recovery')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              authMode === 'recovery' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recuperar
          </button>
        </div>

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">Senha</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('recovery')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer text-xs"
            >
              Entrar na Plataforma
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Civil Completo</label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Gabriel Ferreira"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Artístico / Pseudônimo</label>
              <input
                type="text"
                placeholder="Ex: MC Carlinhos, Gabriel Som"
                value={regArtisticName}
                onChange={(e) => setRegArtisticName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">E-mail</label>
              <input
                type="email"
                required
                placeholder="seu.email@musica.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Associação</label>
                <select
                  value={regAssociation}
                  onChange={(e) => setRegAssociation(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs cursor-pointer"
                >
                  <option value="ABRAMUS">ABRAMUS</option>
                  <option value="UBC">UBC</option>
                  <option value="AMAR">AMAR</option>
                  <option value="SOCINPRO">SOCINPRO</option>
                  <option value="Nenhuma">Ainda não associado</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 8 dígitos"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer text-xs"
            >
              Criar Conta de Artista
            </button>
          </form>
        )}

        {/* PASSWORD RECOVERY FORM */}
        {authMode === 'recovery' && (
          <form onSubmit={handleRecoverySubmit} className="space-y-4 text-xs">
            <p className="text-slate-400">
              Digite seu e-mail cadastrado para receber instruções de redefinição de acesso.
            </p>

            <div>
              <label className="block text-slate-300 font-medium mb-1">E-mail Cadastrado</label>
              <input
                type="email"
                required
                placeholder="gabriel.luz@sonoramusic.indie.br"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            {recoverySent && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instruções enviadas! Verifique sua caixa de entrada.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer text-xs"
            >
              Enviar Link de Redefinição
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-slate-500 leading-relaxed">
          Sonora Rights · Sistema Independente de Gestão de Catálogo Musical
        </div>

      </div>
    </div>
  );
};
