'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Trash2, RefreshCw, Search, ChevronUp, ChevronDown, Pencil, Plus, X } from 'lucide-react';

// ── TIPURI ──────────────────────────────────────────────────────────────────

type Rezervare = {
  id: number; nume: string; email: string; telefon: string;
  numar_persoane: number; data: string; ora: string;
  status: 'în așteptare' | 'confirmat' | 'respins'; created_at: string;
};
type Categorie = { id: number; nume: string; ordine: number; produse: { count: number }[] };
type Produs = {
  id: number; categorie_id: number; nume: string; descriere: string;
  pret: number; disponibil: boolean; ordine: number;
  categorii: { id: number; nume: string };
};

// ── CONSTANTE ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  'în așteptare': { label: 'În așteptare', pill: 'bg-yellow-100/80 text-yellow-700 border-yellow-200', icon: Clock },
  'confirmat':    { label: 'Confirmat',    pill: 'bg-teal-100/80 text-teal-700 border-teal-200',       icon: CheckCircle },
  'respins':      { label: 'Respins',      pill: 'bg-red-100/80 text-red-500 border-red-200',          icon: XCircle },
};
const LUNI = ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];
const PAROLA_ADMIN = 'bbartcaffe2024';

function dataFrumos(str: string) {
  const [y, m, z] = str.split('-');
  return `${z} ${LUNI[Number(m) - 1]} ${y}`;
}

async function api(path: string, method = 'GET', body?: object) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ── LOGIN ────────────────────────────────────────────────────────────────────

function LoginAdmin({ onSuccess }: { onSuccess: () => void }) {
  const [parola, setParola] = useState('');
  const [eroare, setEroare] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parola === PAROLA_ADMIN) { sessionStorage.setItem('admin_auth', '1'); onSuccess(); }
    else { setEroare(true); setParola(''); }
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)' }}>
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-title-elegant)' }}>Admin</h1>
        <p className="text-white/40 text-xs mb-6 tracking-wide">BB Art Caffè — panou de administrare</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="password" value={parola} onChange={e => { setParola(e.target.value); setEroare(false); }}
            placeholder="Parolă" autoFocus
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white text-sm placeholder-white/30 outline-none focus:bg-white/15 transition-all ${eroare ? 'border-red-400/60' : 'border-white/15 focus:border-teal-400/60'}`} />
          {eroare && <p className="text-red-400 text-xs -mt-2">Parolă incorectă.</p>}
          <button type="submit" className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 transition-all">Intră</button>
        </form>
      </div>
    </main>
  );
}

// ── TAB REZERVĂRI ────────────────────────────────────────────────────────────

function TabRezervari() {
  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actiune, setActiune]     = useState<number | null>(null);
  const [filtru, setFiltru]       = useState<string>('toate');
  const [cautare, setCautare]     = useState('');

  async function incarca() {
    setLoading(true);
    setRezervari(await api('/api/rezervari'));
    setLoading(false);
  }
  useEffect(() => { incarca(); }, []);

  async function schimbaStatus(id: number, status: string) {
    setActiune(id);
    await api('/api/rezervari', 'PATCH', { id, status });
    await incarca(); setActiune(null);
  }
  async function sterge(id: number) {
    if (!confirm('Ștergi definitiv această rezervare?')) return;
    setActiune(id);
    await api('/api/rezervari', 'DELETE', { id });
    await incarca(); setActiune(null);
  }

  const nr = {
    toate: rezervari.length,
    'în așteptare': rezervari.filter(r => r.status === 'în așteptare').length,
    confirmat: rezervari.filter(r => r.status === 'confirmat').length,
    respins: rezervari.filter(r => r.status === 'respins').length,
  };
  const filtrate = useMemo(() =>
    rezervari.filter(r => filtru === 'toate' || r.status === filtru)
             .filter(r => r.nume.toLowerCase().includes(cautare.toLowerCase())),
    [rezervari, filtru, cautare]);

  return (
    <div>
      {/* Filtre */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={cautare} onChange={e => setCautare(e.target.value)} placeholder="Caută după nume..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm outline-none focus:border-teal-400/60 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['toate','în așteptare','confirmat','respins'] as const).map(f => (
            <button key={f} onClick={() => setFiltru(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${filtru === f ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filtru === f ? 'bg-white/20' : 'bg-white/10'}`}>{nr[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3" /> Se încarcă...</div>
      ) : filtrate.length === 0 ? (
        <div className="text-center py-32 text-white/30 text-lg">Nicio rezervare găsită.</div>
      ) : (
        <>
          {/* Tabel desktop */}
          <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                  {['Nume','Contact','Data & Ora','Persoane','Status','Acțiuni'].map((h, i) => (
                    <th key={h} className={`px-5 py-4 font-medium ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrate.map((r, i) => {
                  const cfg = STATUS_CONFIG[r.status]; const Icon = cfg.icon;
                  const eActiv = actiune === r.id; const inAsteptare = r.status === 'în așteptare';
                  return (
                    <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === filtrate.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-4 text-white font-medium">{r.nume}</td>
                      <td className="px-5 py-4"><div className="text-white/70 truncate max-w-[180px]">{r.email}</div><div className="text-white/40 text-xs">{r.telefon}</div></td>
                      <td className="px-5 py-4"><div className="text-white/80">{dataFrumos(r.data)}</div><div className="text-white/40 text-xs">{r.ora.slice(0,5)}</div></td>
                      <td className="px-5 py-4 text-white/70">{r.numar_persoane} pers.</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.pill}`}><Icon size={11}/> {cfg.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {eActiv ? <Loader2 size={18} className="animate-spin text-white/30"/> : <>
                            {inAsteptare && <>
                              <button onClick={() => schimbaStatus(r.id,'confirmat')} className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400 transition-all font-medium">Confirmă</button>
                              <button onClick={() => schimbaStatus(r.id,'respins')} className="px-3 py-1.5 bg-white/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-all border border-red-400/20 font-medium">Respinge</button>
                            </>}
                            {!inAsteptare && <button onClick={() => schimbaStatus(r.id,'în așteptare')} className="px-3 py-1.5 bg-white/5 text-white/30 text-xs rounded-lg hover:bg-white/10 hover:text-white/60 transition-all border border-white/10">Resetează</button>}
                            <button onClick={() => sterge(r.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Carduri mobile */}
          <div className="md:hidden grid gap-3">
            {filtrate.map(r => {
              const cfg = STATUS_CONFIG[r.status]; const Icon = cfg.icon;
              const eActiv = actiune === r.id; const inAsteptare = r.status === 'în așteptare';
              return (
                <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div><p className="text-white font-semibold">{r.nume}</p><p className="text-white/40 text-xs">{r.email}</p></div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.pill}`}><Icon size={11}/> {cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {[['Data', dataFrumos(r.data)],['Ora', r.ora.slice(0,5)],['Persoane', String(r.numar_persoane)]].map(([l,v]) => (
                      <div key={l} className="bg-white/5 rounded-xl py-2 px-1"><p className="text-white/40 text-xs mb-0.5">{l}</p><p className="text-white text-xs font-medium">{v}</p></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {eActiv ? <Loader2 size={18} className="animate-spin text-white/30 mx-auto"/> : <>
                      {inAsteptare && <>
                        <button onClick={() => schimbaStatus(r.id,'confirmat')} className="flex-1 py-2 bg-teal-500 text-white text-xs rounded-xl hover:bg-teal-400 font-medium">Confirmă</button>
                        <button onClick={() => schimbaStatus(r.id,'respins')} className="flex-1 py-2 bg-white/5 text-red-400 text-xs rounded-xl hover:bg-red-500/20 border border-red-400/20 font-medium">Respinge</button>
                      </>}
                      {!inAsteptare && <button onClick={() => schimbaStatus(r.id,'în așteptare')} className="flex-1 py-2 bg-white/5 text-white/30 text-xs rounded-xl hover:bg-white/10 border border-white/10">Resetează</button>}
                      <button onClick={() => sterge(r.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl"><Trash2 size={16}/></button>
                    </>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {filtrate.length > 0 && <p className="text-center text-white/20 text-xs mt-6">{filtrate.length} {filtrate.length === 1 ? 'rezervare' : 'rezervări'}</p>}
    </div>
  );
}

// ── TAB CATEGORII ─────────────────────────────────────────────────────────────

function TabCategorii() {
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editId, setEditId]       = useState<number | null>(null);
  const [editNume, setEditNume]   = useState('');
  const [numeNou, setNumeNou]     = useState('');
  const [adauga, setAdauga]       = useState(false);
  const [eroare, setEroare]       = useState('');

  async function incarca() {
    setLoading(true);
    setCategorii(await api('/api/categorii'));
    setLoading(false);
  }
  useEffect(() => { incarca(); }, []);

  async function mutaOrdine(cat: Categorie, dir: -1 | 1) {
    const idx = categorii.findIndex(c => c.id === cat.id);
    const vecin = categorii[idx + dir];
    if (!vecin) return;
    await Promise.all([
      api('/api/categorii', 'PATCH', { id: cat.id, ordine: vecin.ordine }),
      api('/api/categorii', 'PATCH', { id: vecin.id, ordine: cat.ordine }),
    ]);
    await incarca();
  }

  async function salveazaEdit() {
    if (!editNume.trim()) return;
    await api('/api/categorii', 'PATCH', { id: editId, nume: editNume.trim() });
    setEditId(null); await incarca();
  }

  async function adaugaCategorie() {
    if (!numeNou.trim()) return;
    await api('/api/categorii', 'POST', { nume: numeNou.trim() });
    setNumeNou(''); setAdauga(false); await incarca();
  }

  async function sterge(cat: Categorie) {
    const nr = cat.produse?.[0]?.count ?? 0;
    if (nr > 0) { setEroare(`"${cat.nume}" are ${nr} produse asociate. Șterge mai întâi produsele.`); return; }
    if (!confirm(`Ștergi categoria "${cat.nume}"?`)) return;
    await api('/api/categorii', 'DELETE', { id: cat.id });
    await incarca();
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>;

  return (
    <div>
      {eroare && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm">
          {eroare} <button onClick={() => setEroare('')}><X size={16}/></button>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
              <th className="text-left px-5 py-4 font-medium w-20">Ord.</th>
              <th className="text-left px-5 py-4 font-medium">Categorie</th>
              <th className="text-left px-5 py-4 font-medium">Produse</th>
              <th className="text-right px-5 py-4 font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {categorii.map((cat, i) => (
              <tr key={cat.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === categorii.length - 1 ? 'border-0' : ''}`}>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => mutaOrdine(cat, -1)} disabled={i === 0} className="text-white/30 hover:text-white disabled:opacity-10 transition-colors"><ChevronUp size={14}/></button>
                    <button onClick={() => mutaOrdine(cat, 1)} disabled={i === categorii.length - 1} className="text-white/30 hover:text-white disabled:opacity-10 transition-colors"><ChevronDown size={14}/></button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {editId === cat.id ? (
                    <input value={editNume} onChange={e => setEditNume(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') salveazaEdit(); if (e.key === 'Escape') setEditId(null); }}
                      autoFocus className="bg-white/10 border border-teal-400/60 rounded-lg px-3 py-1.5 text-white text-sm outline-none w-48" />
                  ) : (
                    <span className="text-white font-medium">{cat.nume}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/60 text-xs font-semibold">
                    {cat.produse?.[0]?.count ?? 0}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {editId === cat.id ? (
                      <>
                        <button onClick={salveazaEdit} className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400 font-medium">Salvează</button>
                        <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-white/10 text-white/50 text-xs rounded-lg hover:bg-white/20">Anulează</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(cat.id); setEditNume(cat.nume); }} className="p-1.5 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"><Pencil size={15}/></button>
                        <button onClick={() => sterge(cat)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adaugă categorie */}
      {adauga ? (
        <div className="flex gap-2">
          <input value={numeNou} onChange={e => setNumeNou(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') adaugaCategorie(); if (e.key === 'Escape') setAdauga(false); }}
            placeholder="Nume categorie..." autoFocus
            className="flex-1 bg-white/10 border border-teal-400/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-white/30" />
          <button onClick={adaugaCategorie} className="px-4 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-400 transition-all">Adaugă</button>
          <button onClick={() => { setAdauga(false); setNumeNou(''); }} className="px-4 py-2.5 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20 transition-all">Anulează</button>
        </div>
      ) : (
        <button onClick={() => setAdauga(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/20 hover:text-white transition-all">
          <Plus size={15}/> Adaugă categorie
        </button>
      )}
      <p className="text-white/20 text-xs mt-4">* O categorie poate fi ștearsă doar dacă nu are produse asociate.</p>
    </div>
  );
}

// ── TAB PRODUSE ───────────────────────────────────────────────────────────────

function ModalProdusForms({ categorii, initial, onSave, onClose }: {
  categorii: Categorie[];
  initial?: Partial<Produs>;
  onSave: (data: object) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    categorie_id: initial?.categorie_id ?? categorii[0]?.id ?? 0,
    nume: initial?.nume ?? '',
    descriere: initial?.descriere ?? '',
    pret: initial?.pret ?? '',
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md bg-[#1a2a35] border border-white/20 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-title-elegant)' }}>
            {initial?.id ? 'Editează produs' : 'Produs nou'}
          </h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={20}/></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Categorie</label>
            <select value={form.categorie_id} onChange={e => setForm(f => ({ ...f, categorie_id: Number(e.target.value) }))}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60">
              {categorii.map(c => <option key={c.id} value={c.id} className="bg-[#1a2a35]">{c.nume}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Nume *</label>
            <input value={form.nume} onChange={e => setForm(f => ({ ...f, nume: e.target.value }))} placeholder="ex: Cappuccino"
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20" />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Descriere</label>
            <textarea value={form.descriere} onChange={e => setForm(f => ({ ...f, descriere: e.target.value }))} rows={2} placeholder="Ingrediente, detalii..."
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20 resize-none" />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Preț (RON) *</label>
            <input type="number" step="0.5" value={form.pret} onChange={e => setForm(f => ({ ...f, pret: e.target.value }))} placeholder="0.00"
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => onSave(form)} disabled={!form.nume || !form.pret}
            className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20 transition-all">
            {initial?.id ? 'Salvează' : 'Adaugă'}
          </button>
          <button onClick={onClose} className="px-5 py-3 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20 transition-all">Anulează</button>
        </div>
      </div>
    </div>
  );
}

function TabProduse() {
  const [produse, setProduse]     = useState<Produs[]>([]);
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filtraCat, setFiltraCat] = useState<number | 'toate'>('toate');
  const [modal, setModal]         = useState<Partial<Produs> | null>(null);

  async function incarca() {
    setLoading(true);
    const [p, c] = await Promise.all([api('/api/produse'), api('/api/categorii')]);
    setProduse(p); setCategorii(c);
    setLoading(false);
  }
  useEffect(() => { incarca(); }, []);

  async function toggleDisponibil(p: Produs) {
    await api('/api/produse', 'PATCH', { id: p.id, disponibil: !p.disponibil });
    await incarca();
  }
  async function sterge(id: number) {
    if (!confirm('Ștergi acest produs?')) return;
    await api('/api/produse', 'DELETE', { id });
    await incarca();
  }
  async function salveaza(data: object) {
    if (modal?.id) await api('/api/produse', 'PATCH', { id: modal.id, ...data });
    else await api('/api/produse', 'POST', data);
    setModal(null); await incarca();
  }

  const filtrate = produse.filter(p => filtraCat === 'toate' || p.categorie_id === filtraCat);

  if (loading) return <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>;

  return (
    <div>
      {modal !== null && <ModalProdusForms categorii={categorii} initial={modal} onSave={salveaza} onClose={() => setModal(null)} />}

      {/* Filtre categorii */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFiltraCat('toate')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filtraCat === 'toate' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>
          Toate ({produse.length})
        </button>
        {categorii.map(c => {
          const nr = produse.filter(p => p.categorie_id === c.id).length;
          return (
            <button key={c.id} onClick={() => setFiltraCat(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filtraCat === c.id ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>
              {c.nume} ({nr})
            </button>
          );
        })}
      </div>

      {/* Tabel produse */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden mb-4">
        {filtrate.length === 0 ? (
          <div className="text-center py-16 text-white/30">Niciun produs în această categorie.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-4 font-medium">Produs</th>
                <th className="text-left px-5 py-4 font-medium hidden sm:table-cell">Categorie</th>
                <th className="text-left px-5 py-4 font-medium">Preț</th>
                <th className="text-left px-5 py-4 font-medium">Disponibil</th>
                <th className="text-right px-5 py-4 font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtrate.map((p, i) => (
                <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === filtrate.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{p.nume}</p>
                    {p.descriere && <p className="text-white/35 text-xs mt-0.5 max-w-xs truncate">{p.descriere}</p>}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-white/50 text-xs bg-white/10 px-2.5 py-1 rounded-full">{p.categorii?.nume}</span>
                  </td>
                  <td className="px-5 py-3 text-teal-400 font-semibold">{Number(p.pret).toFixed(2)} lei</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleDisponibil(p)}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${p.disponibil ? 'bg-teal-500' : 'bg-white/20'}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${p.disponibil ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal(p)} className="p-1.5 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"><Pencil size={15}/></button>
                      <button onClick={() => sterge(p.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/20 hover:text-white transition-all">
        <Plus size={15}/> Adaugă produs
      </button>
    </div>
  );
}

// ── PAGINA PRINCIPALĂ ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'rezervari', label: 'Rezervări' },
  { id: 'produse',   label: 'Produse' },
  { id: 'categorii', label: 'Categorii' },
];

export default function AdminPage() {
  const [autentificat, setAutentificat] = useState(false);
  const [tabActiv, setTabActiv]         = useState('rezervari');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAutentificat(true);
    setLoading(false);
  }, []);

  if (loading) return null;
  if (!autentificat) return <LoginAdmin onSuccess={() => setAutentificat(true)} />;

  return (
    <main className="min-h-screen px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 45%, #2c5364 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <a href="/" className="text-xs text-white/40 hover:text-teal-400 transition-colors mb-1 inline-block tracking-widest uppercase">← Site</a>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-title-elegant)' }}>Admin</h1>
            <p className="text-white/40 text-sm mt-1">BB Art Caffè — panou de administrare</p>
          </div>
          <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAutentificat(false); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/40 hover:text-white border border-white/10 hover:border-red-400/50 bg-white/5 hover:bg-red-500/10 transition-all text-sm">
            Ieși
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 mb-6 w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setTabActiv(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${tabActiv === tab.id ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conținut tab */}
        {tabActiv === 'rezervari' && <TabRezervari />}
        {tabActiv === 'produse'   && <TabProduse />}
        {tabActiv === 'categorii' && <TabCategorii />}

      </div>
    </main>
  );
}
