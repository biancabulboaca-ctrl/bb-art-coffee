'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Trash2, RefreshCw, Search } from 'lucide-react';

type Rezervare = {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  numar_persoane: number;
  data: string;
  ora: string;
  status: 'în așteptare' | 'confirmat' | 'respins';
  created_at: string;
};

const STATUS_CONFIG = {
  'în așteptare': { label: 'În așteptare', pill: 'bg-yellow-100/80 text-yellow-700 border-yellow-200', icon: Clock },
  'confirmat':    { label: 'Confirmat',    pill: 'bg-teal-100/80 text-teal-700 border-teal-200',       icon: CheckCircle },
  'respins':      { label: 'Respins',      pill: 'bg-red-100/80 text-red-500 border-red-200',          icon: XCircle },
};

const LUNI = ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];

function dataFrumos(str: string) {
  const [y, m, z] = str.split('-');
  return `${z} ${LUNI[Number(m) - 1]} ${y}`;
}

const PAROLA_ADMIN = 'bbartcaffe2024';

function LoginAdmin({ onSuccess }: { onSuccess: () => void }) {
  const [parola, setParola] = useState('');
  const [eroare, setEroare] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parola === PAROLA_ADMIN) {
      sessionStorage.setItem('admin_auth', '1');
      onSuccess();
    } else {
      setEroare(true);
      setParola('');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)' }}>
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-title-elegant)' }}>
          Admin
        </h1>
        <p className="text-white/40 text-xs mb-6 tracking-wide">Introdu parola pentru acces</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={parola}
            onChange={e => { setParola(e.target.value); setEroare(false); }}
            placeholder="Parolă"
            autoFocus
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white text-sm placeholder-white/30 outline-none focus:bg-white/15 transition-all
              ${eroare ? 'border-red-400/60' : 'border-white/15 focus:border-teal-400/60'}`}
          />
          {eroare && <p className="text-red-400 text-xs -mt-2">Parolă incorectă.</p>}
          <button type="submit"
            className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 transition-all">
            Intră
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [autentificat, setAutentificat] = useState(false);
  const [rezervari, setRezervari]   = useState<Rezervare[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actiune, setActiune]       = useState<number | null>(null);
  const [filtru, setFiltru]         = useState<string>('toate');
  const [cautare, setCautare]       = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAutentificat(true);
    else setLoading(false);
  }, []);

  async function incarca() {
    setLoading(true);
    const res  = await fetch('/api/rezervari');
    const data = await res.json();
    setRezervari(data);
    setLoading(false);
  }

  useEffect(() => { if (autentificat) incarca(); }, [autentificat]);

  async function schimbaStatus(id: number, status: string) {
    setActiune(id);
    await fetch('/api/rezervari', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await incarca();
    setActiune(null);
  }

  async function sterge(id: number) {
    if (!confirm('Ștergi definitiv această rezervare?')) return;
    setActiune(id);
    await fetch('/api/rezervari', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await incarca();
    setActiune(null);
  }

  const filtrate = useMemo(() => {
    return rezervari
      .filter(r => filtru === 'toate' || r.status === filtru)
      .filter(r => r.nume.toLowerCase().includes(cautare.toLowerCase()));
  }, [rezervari, filtru, cautare]);

  const nr = {
    toate:          rezervari.length,
    'în așteptare': rezervari.filter(r => r.status === 'în așteptare').length,
    confirmat:      rezervari.filter(r => r.status === 'confirmat').length,
    respins:        rezervari.filter(r => r.status === 'respins').length,
  };

  if (!autentificat) return <LoginAdmin onSuccess={() => setAutentificat(true)} />;

  return (
    <main className="min-h-screen px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 45%, #2c5364 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <a href="/" className="text-xs text-white/40 hover:text-teal-400 transition-colors mb-1 inline-block tracking-widest uppercase">
              ← Site
            </a>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-title-elegant)' }}>
              Rezervări
            </h1>
            <p className="text-white/40 text-sm mt-1">BB Art Caffè — panou admin</p>
          </div>
          <button onClick={incarca}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/60 hover:text-white border border-white/10 hover:border-teal-400/50 bg-white/5 hover:bg-white/10 transition-all text-sm backdrop-blur-sm">
            <RefreshCw size={14} /> Reîncarcă
          </button>
        </div>

        {/* ── CĂUTARE + FILTRE ── */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          {/* Căutare */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={cautare}
              onChange={e => setCautare(e.target.value)}
              placeholder="Caută după nume..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all"
            />
          </div>

          {/* Filtre status */}
          <div className="flex gap-2 flex-wrap">
            {(['toate', 'în așteptare', 'confirmat', 'respins'] as const).map(f => (
              <button key={f} onClick={() => setFiltru(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap
                  ${filtru === f
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filtru === f ? 'bg-white/20' : 'bg-white/10'}`}>
                  {nr[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CONȚINUT ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32 text-white/40">
            <Loader2 size={28} className="animate-spin mr-3" /> Se încarcă...
          </div>
        ) : filtrate.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <p className="text-lg">Nicio rezervare găsită.</p>
          </div>
        ) : (
          <>
            {/* ── TABEL — desktop ── */}
            <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-4 font-medium">Nume</th>
                    <th className="text-left px-5 py-4 font-medium">Contact</th>
                    <th className="text-left px-5 py-4 font-medium">Data & Ora</th>
                    <th className="text-left px-5 py-4 font-medium">Persoane</th>
                    <th className="text-left px-5 py-4 font-medium">Status</th>
                    <th className="text-right px-5 py-4 font-medium">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrate.map((r, i) => {
                    const cfg = STATUS_CONFIG[r.status];
                    const Icon = cfg.icon;
                    const eActiv = actiune === r.id;
                    const inAsteptare = r.status === 'în așteptare';

                    return (
                      <tr key={r.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === filtrate.length - 1 ? 'border-0' : ''}`}>
                        <td className="px-5 py-4 text-white font-medium">{r.nume}</td>
                        <td className="px-5 py-4">
                          <div className="text-white/70 truncate max-w-[180px]">{r.email}</div>
                          <div className="text-white/40 text-xs">{r.telefon}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-white/80">{dataFrumos(r.data)}</div>
                          <div className="text-white/40 text-xs">{r.ora.slice(0,5)}</div>
                        </td>
                        <td className="px-5 py-4 text-white/70">{r.numar_persoane} pers.</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.pill}`}>
                            <Icon size={11} /> {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            {eActiv ? (
                              <Loader2 size={18} className="animate-spin text-white/30" />
                            ) : (
                              <>
                                {inAsteptare && (
                                  <>
                                    <button onClick={() => schimbaStatus(r.id, 'confirmat')}
                                      className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400 transition-all font-medium">
                                      Confirmă
                                    </button>
                                    <button onClick={() => schimbaStatus(r.id, 'respins')}
                                      className="px-3 py-1.5 bg-white/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-all border border-red-400/20 font-medium">
                                      Respinge
                                    </button>
                                  </>
                                )}
                                {!inAsteptare && (
                                  <button onClick={() => schimbaStatus(r.id, 'în așteptare')}
                                    className="px-3 py-1.5 bg-white/5 text-white/30 text-xs rounded-lg hover:bg-white/10 hover:text-white/60 transition-all border border-white/10">
                                    Resetează
                                  </button>
                                )}
                                <button onClick={() => sterge(r.id)}
                                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── CARDURI — mobile ── */}
            <div className="md:hidden grid gap-3">
              {filtrate.map(r => {
                const cfg = STATUS_CONFIG[r.status];
                const Icon = cfg.icon;
                const eActiv = actiune === r.id;
                const inAsteptare = r.status === 'în așteptare';

                return (
                  <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-white font-semibold text-base">{r.nume}</p>
                        <p className="text-white/40 text-xs mt-0.5">{r.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.pill}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-white/5 rounded-xl py-2 px-1">
                        <p className="text-white/40 text-xs mb-0.5">Data</p>
                        <p className="text-white text-xs font-medium">{dataFrumos(r.data)}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl py-2 px-1">
                        <p className="text-white/40 text-xs mb-0.5">Ora</p>
                        <p className="text-white text-xs font-medium">{r.ora.slice(0,5)}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl py-2 px-1">
                        <p className="text-white/40 text-xs mb-0.5">Persoane</p>
                        <p className="text-white text-xs font-medium">{r.numar_persoane}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      {eActiv ? (
                        <Loader2 size={18} className="animate-spin text-white/30 mx-auto" />
                      ) : (
                        <>
                          {inAsteptare && (
                            <>
                              <button onClick={() => schimbaStatus(r.id, 'confirmat')}
                                className="flex-1 py-2 bg-teal-500 text-white text-xs rounded-xl hover:bg-teal-400 transition-all font-medium">
                                Confirmă
                              </button>
                              <button onClick={() => schimbaStatus(r.id, 'respins')}
                                className="flex-1 py-2 bg-white/5 text-red-400 text-xs rounded-xl hover:bg-red-500/20 transition-all border border-red-400/20 font-medium">
                                Respinge
                              </button>
                            </>
                          )}
                          {!inAsteptare && (
                            <button onClick={() => schimbaStatus(r.id, 'în așteptare')}
                              className="flex-1 py-2 bg-white/5 text-white/30 text-xs rounded-xl hover:bg-white/10 transition-all border border-white/10">
                              Resetează
                            </button>
                          )}
                          <button onClick={() => sterge(r.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── FOOTER ── */}
        {filtrate.length > 0 && (
          <p className="text-center text-white/20 text-xs mt-6">
            {filtrate.length} {filtrate.length === 1 ? 'rezervare' : 'rezervări'}
          </p>
        )}
      </div>
    </main>
  );
}
