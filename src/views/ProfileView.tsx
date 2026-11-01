import React, { useState } from 'react';
import { 
  User, 
  Save, 
  Check, 
  Globe, 
  Music, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Instagram,
  Youtube,
  Radio
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const ProfileView: React.FC = () => {
  const { artist, updateArtistProfile, songs, collaborators, royalties } = useMusic();

  const [name, setName] = useState(artist.name);
  const [artisticName, setArtisticName] = useState(artist.artisticName);
  const [email, setEmail] = useState(artist.email);
  const [phone, setPhone] = useState(artist.phone);
  const [cityState, setCityState] = useState(artist.cityState);
  const [bio, setBio] = useState(artist.bio);
  const [cpfCnpj, setCpfCnpj] = useState(artist.cpfCnpj);
  const [ipiCae, setIpiCae] = useState(artist.ipiCae);
  const [association, setAssociation] = useState(artist.association);
  const [genres, setGenres] = useState(artist.genres.join(', '));
  const [spotifyLink, setSpotifyLink] = useState(artist.socialLinks.spotify || '');
  const [instagramLink, setInstagramLink] = useState(artist.socialLinks.instagram || '');
  const [youtubeLink, setYoutubeLink] = useState(artist.socialLinks.youtube || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtistProfile({
      name,
      artisticName,
      email,
      phone,
      cityState,
      bio,
      cpfCnpj,
      ipiCae,
      association,
      genres: genres.split(',').map(g => g.trim()).filter(Boolean),
      socialLinks: {
        spotify: spotifyLink,
        instagram: instagramLink,
        youtube: youtubeLink
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalGross = royalties.reduce((sum, r) => sum + r.amountGross, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={artist.avatarUrl}
          alt={artist.artisticName}
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-xl shrink-0"
          onError={(e) => {
            e.currentTarget.src = 'https://ui-avatars.com/api/?name=Gabe+Luz&background=6366f1&color=fff&size=150';
          }}
        />

        <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white tracking-tight">{artist.artisticName}</h2>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono font-bold">
              {artist.association}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              IPI: {artist.ipiCae}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {artist.name} · {artist.cityState}
          </p>
          <p className="text-xs text-slate-400 max-w-xl line-clamp-2">
            {artist.bio}
          </p>
        </div>

        {/* Mini stats */}
        <div className="flex sm:flex-col gap-4 sm:gap-2 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Obras Registradas</span>
            <span className="font-mono font-bold text-white text-sm">{songs.length}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Colaboradores</span>
            <span className="font-mono font-bold text-sky-400 text-sm">{collaborators.length}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Royalties</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">R$ {totalGross.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Perfil e informações cadastrais atualizados com sucesso!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
        
        {/* Section 1: Dados Pessoais & Artísticos */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
            1. Identidade Artística & Dados Pessoais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Artístico</label>
              <input
                type="text"
                required
                value={artisticName}
                onChange={(e) => setArtisticName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Civil Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">E-mail Profissional</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Cidade / Estado</label>
                <input
                  type="text"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Gêneros Musicais (separados por vírgula)</label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Mini Biografia Profissional</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cadastro no ECAD & Associações */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
            2. Filiação e Dados Fiscais de Direitos Autorais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Associação de Gestão Coletiva</label>
              <select
                value={association}
                onChange={(e) => setAssociation(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs cursor-pointer"
              >
                <option value="ABRAMUS">ABRAMUS</option>
                <option value="UBC">UBC</option>
                <option value="AMAR">AMAR</option>
                <option value="SOCINPRO">SOCINPRO</option>
                <option value="SICAM">SICAM</option>
                <option value="ASSIM">ASSIM</option>
                <option value="Nenhuma">Ainda não associado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Código IPI / CAE</label>
              <input
                type="text"
                value={ipiCae}
                onChange={(e) => setIpiCae(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">CPF / CNPJ do Titular</label>
              <input
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Links de Streaming e Redes */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
            3. Plataformas Musicais e Redes Sociais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Perfil no Spotify</span>
              </label>
              <input
                type="url"
                placeholder="https://open.spotify.com/artist/..."
                value={spotifyLink}
                onChange={(e) => setSpotifyLink(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-rose-500" />
                <span>Canal no YouTube</span>
              </label>
              <input
                type="text"
                placeholder="https://youtube.com/@..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Form Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Informações do Perfil</span>
          </button>
        </div>

      </form>

    </div>
  );
};
