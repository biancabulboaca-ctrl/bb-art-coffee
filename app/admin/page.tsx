'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, CheckCircle, XCircle, Clock, Trash2, Search, ChevronUp, ChevronDown, Pencil, Plus, X, ChevronLeft, ImageIcon, Star } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── TIPURI ───────────────────────────────────────────────────────────────────
type Rezervare = {
  id: number; nume: string; email: string; telefon: string;
  numar_persoane: number; data: string; ora: string;
  status: 'în așteptare' | 'confirmat' | 'respins'; created_at: string;
};
type Categorie = { id: number; nume: string; ordine: number; produse: { count: number }[] };
type Produs = {
  id: number; categorie_id: number; nume: string; descriere: string;
  pret: number; disponibil: boolean; ordine: number; imagine: string;
  categorii: { id: number; nume: string };
};
type Galerie = { id: number; titlu: string; perioada: string; descriere: string; activa: boolean; ordine: number; tablouri: { count: number }[] };
type Tablou = {
  id: number; galerie_id: number; titlu: string; mediu: string;
  dimensiuni: string; an: number; pret: number; imagine: string;
  disponibil: boolean; ordine: number;
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
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

async function uploadImagine(bucket: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const nume = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(nume, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(nume);
  return data.publicUrl;
}

// ── INPUT IMAGINE ─────────────────────────────────────────────────────────────
function InputImagine({ bucket, value, onChange }: { bucket: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImagine(bucket, file);
      onChange(url);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  }
  return (
    <div>
      <label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Imagine</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
        ) : (
          <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            <ImageIcon size={20} className="text-white/20" />
          </div>
        )}
        <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed rounded-xl text-xs cursor-pointer transition-all
          ${uploading ? 'border-teal-400/30 text-teal-400/50' : 'border-white/20 text-white/40 hover:border-teal-400/50 hover:text-white/60'}`}>
          {uploading ? <><Loader2 size={14} className="animate-spin"/> Se încarcă...</> : <><Plus size={14}/> Alege poză</>}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
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

// ── TAB REZERVĂRI ─────────────────────────────────────────────────────────────
function TabRezervari() {
  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loading, setLoading] = useState(true);
  const [actiune, setActiune] = useState<number | null>(null);
  const [filtru, setFiltru] = useState<string>('toate');
  const [cautare, setCautare] = useState('');

  async function incarca() { setLoading(true); setRezervari(await api('/api/rezervari')); setLoading(false); }
  useEffect(() => { incarca(); }, []);

  async function schimbaStatus(id: number, status: string) {
    setActiune(id); await api('/api/rezervari', 'PATCH', { id, status }); await incarca(); setActiune(null);
  }
  async function sterge(id: number) {
    if (!confirm('Ștergi definitiv această rezervare?')) return;
    setActiune(id); await api('/api/rezervari', 'DELETE', { id }); await incarca(); setActiune(null);
  }

  const nr = { toate: rezervari.length, 'în așteptare': rezervari.filter(r => r.status === 'în așteptare').length, confirmat: rezervari.filter(r => r.status === 'confirmat').length, respins: rezervari.filter(r => r.status === 'respins').length };
  const filtrate = useMemo(() => rezervari.filter(r => filtru === 'toate' || r.status === filtru).filter(r => r.nume.toLowerCase().includes(cautare.toLowerCase())), [rezervari, filtru, cautare]);

  return (
    <div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={cautare} onChange={e => setCautare(e.target.value)} placeholder="Caută după nume..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm outline-none focus:border-teal-400/60 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['toate','în așteptare','confirmat','respins'] as const).map(f => (
            <button key={f} onClick={() => setFiltru(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${filtru === f ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${filtru === f ? 'bg-white/20' : 'bg-white/10'}`}>{nr[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>
      : filtrate.length === 0 ? <div className="text-center py-32 text-white/30 text-lg">Nicio rezervare găsită.</div>
      : (
        <>
          <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                {['Nume','Contact','Data & Ora','Persoane','Status','Acțiuni'].map((h,i) => <th key={h} className={`px-5 py-4 font-medium ${i===5?'text-right':'text-left'}`}>{h}</th>)}
              </tr></thead>
              <tbody>{filtrate.map((r,i) => {
                const cfg = STATUS_CONFIG[r.status]; const Icon = cfg.icon;
                return (
                  <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i===filtrate.length-1?'border-0':''}`}>
                    <td className="px-5 py-4 text-white font-medium">{r.nume}</td>
                    <td className="px-5 py-4"><div className="text-white/70 truncate max-w-[180px]">{r.email}</div><div className="text-white/40 text-xs">{r.telefon}</div></td>
                    <td className="px-5 py-4"><div className="text-white/80">{dataFrumos(r.data)}</div><div className="text-white/40 text-xs">{r.ora.slice(0,5)}</div></td>
                    <td className="px-5 py-4 text-white/70">{r.numar_persoane} pers.</td>
                    <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.pill}`}><Icon size={11}/> {cfg.label}</span></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2 justify-end">
                      {actiune===r.id ? <Loader2 size={18} className="animate-spin text-white/30"/> : <>
                        {r.status==='în așteptare' && <>
                          <button onClick={() => schimbaStatus(r.id,'confirmat')} className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400 font-medium">Confirmă</button>
                          <button onClick={() => schimbaStatus(r.id,'respins')} className="px-3 py-1.5 bg-white/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20 border border-red-400/20 font-medium">Respinge</button>
                        </>}
                        {r.status!=='în așteptare' && <button onClick={() => schimbaStatus(r.id,'în așteptare')} className="px-3 py-1.5 bg-white/5 text-white/30 text-xs rounded-lg hover:bg-white/10 border border-white/10">Resetează</button>}
                        <button onClick={() => sterge(r.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                      </>}
                    </div></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <div className="md:hidden grid gap-3">
            {filtrate.map(r => {
              const cfg = STATUS_CONFIG[r.status]; const Icon = cfg.icon;
              return (
                <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div><p className="text-white font-semibold">{r.nume}</p><p className="text-white/40 text-xs">{r.email}</p></div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.pill}`}><Icon size={11}/> {cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    {[['Data',dataFrumos(r.data)],['Ora',r.ora.slice(0,5)],['Pers.',String(r.numar_persoane)]].map(([l,v]) => (
                      <div key={l} className="bg-white/5 rounded-xl py-2"><p className="text-white/40 text-xs">{l}</p><p className="text-white text-xs font-medium">{v}</p></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {actiune===r.id ? <Loader2 size={18} className="animate-spin text-white/30 mx-auto"/> : <>
                      {r.status==='în așteptare' && <>
                        <button onClick={() => schimbaStatus(r.id,'confirmat')} className="flex-1 py-2 bg-teal-500 text-white text-xs rounded-xl font-medium">Confirmă</button>
                        <button onClick={() => schimbaStatus(r.id,'respins')} className="flex-1 py-2 bg-white/5 text-red-400 text-xs rounded-xl border border-red-400/20 font-medium">Respinge</button>
                      </>}
                      {r.status!=='în așteptare' && <button onClick={() => schimbaStatus(r.id,'în așteptare')} className="flex-1 py-2 bg-white/5 text-white/30 text-xs rounded-xl border border-white/10">Resetează</button>}
                      <button onClick={() => sterge(r.id)} className="p-2 text-white/20 hover:text-red-400 rounded-xl"><Trash2 size={16}/></button>
                    </>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {filtrate.length > 0 && <p className="text-center text-white/20 text-xs mt-6">{filtrate.length} {filtrate.length===1?'rezervare':'rezervări'}</p>}
    </div>
  );
}

// ── TAB CATEGORII ─────────────────────────────────────────────────────────────
function TabCategorii() {
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number|null>(null);
  const [editNume, setEditNume] = useState('');
  const [numeNou, setNumeNou] = useState('');
  const [adauga, setAdauga] = useState(false);
  const [eroare, setEroare] = useState('');

  async function incarca() { setLoading(true); setCategorii(await api('/api/categorii')); setLoading(false); }
  useEffect(() => { incarca(); }, []);

  async function mutaOrdine(cat: Categorie, dir: -1|1) {
    const idx = categorii.findIndex(c => c.id===cat.id);
    const vecin = categorii[idx+dir];
    if (!vecin) return;
    await Promise.all([api('/api/categorii','PATCH',{id:cat.id,ordine:vecin.ordine}),api('/api/categorii','PATCH',{id:vecin.id,ordine:cat.ordine})]);
    await incarca();
  }
  async function salveazaEdit() { if (!editNume.trim()) return; await api('/api/categorii','PATCH',{id:editId,nume:editNume.trim()}); setEditId(null); await incarca(); }
  async function adaugaCategorie() { if (!numeNou.trim()) return; await api('/api/categorii','POST',{nume:numeNou.trim()}); setNumeNou(''); setAdauga(false); await incarca(); }
  async function sterge(cat: Categorie) {
    const nr = cat.produse?.[0]?.count??0;
    if (nr>0) { setEroare(`"${cat.nume}" are ${nr} produse. Șterge mai întâi produsele.`); return; }
    if (!confirm(`Ștergi categoria "${cat.nume}"?`)) return;
    await api('/api/categorii','DELETE',{id:cat.id}); await incarca();
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>;
  return (
    <div>
      {eroare && <div className="flex items-center justify-between bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm">{eroare}<button onClick={()=>setEroare('')}><X size={16}/></button></div>}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
            <th className="text-left px-5 py-4 font-medium w-20">Ord.</th>
            <th className="text-left px-5 py-4 font-medium">Categorie</th>
            <th className="text-left px-5 py-4 font-medium">Produse</th>
            <th className="text-right px-5 py-4 font-medium">Acțiuni</th>
          </tr></thead>
          <tbody>{categorii.map((cat,i) => (
            <tr key={cat.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i===categorii.length-1?'border-0':''}`}>
              <td className="px-5 py-3"><div className="flex flex-col gap-0.5">
                <button onClick={()=>mutaOrdine(cat,-1)} disabled={i===0} className="text-white/30 hover:text-white disabled:opacity-10"><ChevronUp size={14}/></button>
                <button onClick={()=>mutaOrdine(cat,1)} disabled={i===categorii.length-1} className="text-white/30 hover:text-white disabled:opacity-10"><ChevronDown size={14}/></button>
              </div></td>
              <td className="px-5 py-3">{editId===cat.id
                ? <input value={editNume} onChange={e=>setEditNume(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')salveazaEdit();if(e.key==='Escape')setEditId(null);}} autoFocus className="bg-white/10 border border-teal-400/60 rounded-lg px-3 py-1.5 text-white text-sm outline-none w-48"/>
                : <span className="text-white font-medium">{cat.nume}</span>}</td>
              <td className="px-5 py-3"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/60 text-xs font-semibold">{cat.produse?.[0]?.count??0}</span></td>
              <td className="px-5 py-3"><div className="flex items-center gap-2 justify-end">
                {editId===cat.id ? <>
                  <button onClick={salveazaEdit} className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400 font-medium">Salvează</button>
                  <button onClick={()=>setEditId(null)} className="px-3 py-1.5 bg-white/10 text-white/50 text-xs rounded-lg">Anulează</button>
                </> : <>
                  <button onClick={()=>{setEditId(cat.id);setEditNume(cat.nume);}} className="p-1.5 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"><Pencil size={15}/></button>
                  <button onClick={()=>sterge(cat)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                </>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {adauga ? (
        <div className="flex gap-2">
          <input value={numeNou} onChange={e=>setNumeNou(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')adaugaCategorie();if(e.key==='Escape')setAdauga(false);}} placeholder="Nume categorie..." autoFocus className="flex-1 bg-white/10 border border-teal-400/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-white/30"/>
          <button onClick={adaugaCategorie} className="px-4 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-400">Adaugă</button>
          <button onClick={()=>{setAdauga(false);setNumeNou('');}} className="px-4 py-2.5 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20">Anulează</button>
        </div>
      ) : (
        <button onClick={()=>setAdauga(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/20 hover:text-white transition-all"><Plus size={15}/> Adaugă categorie</button>
      )}
      <p className="text-white/20 text-xs mt-4">* O categorie poate fi ștearsă doar dacă nu are produse asociate.</p>
    </div>
  );
}

// ── MODAL PRODUS / TABLOU ─────────────────────────────────────────────────────
function ModalProdusForms({ categorii, initial, onSave, onClose }: { categorii: Categorie[]; initial?: Partial<Produs>; onSave: (d:object)=>void; onClose: ()=>void }) {
  const [form, setForm] = useState({ categorie_id: initial?.categorie_id??categorii[0]?.id??0, nume: initial?.nume??'', descriere: initial?.descriere??'', pret: initial?.pret??'', imagine: initial?.imagine??'' });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.7)'}}>
      <div className="w-full max-w-md bg-[#1a2a35] border border-white/20 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg" style={{fontFamily:'var(--font-title-elegant)'}}>{initial?.id?'Editează produs':'Produs nou'}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20}/></button>
        </div>
        <div className="flex flex-col gap-3">
          <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Categorie</label>
            <select value={form.categorie_id} onChange={e=>setForm(f=>({...f,categorie_id:Number(e.target.value)}))} className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60">
              {categorii.map(c=><option key={c.id} value={c.id} className="bg-[#1a2a35]">{c.nume}</option>)}
            </select></div>
          <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Nume *</label>
            <input value={form.nume} onChange={e=>setForm(f=>({...f,nume:e.target.value}))} placeholder="ex: Cappuccino" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
          <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Descriere</label>
            <textarea value={form.descriere} onChange={e=>setForm(f=>({...f,descriere:e.target.value}))} rows={2} placeholder="Ingrediente, detalii..." className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20 resize-none"/></div>
          <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Preț (RON) *</label>
            <input type="number" step="0.5" value={form.pret} onChange={e=>setForm(f=>({...f,pret:e.target.value}))} placeholder="0.00" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
          <InputImagine bucket="produse" value={form.imagine} onChange={url=>setForm(f=>({...f,imagine:url}))}/>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={()=>onSave(form)} disabled={!form.nume||!form.pret} className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20 transition-all">{initial?.id?'Salvează':'Adaugă'}</button>
          <button onClick={onClose} className="px-5 py-3 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20">Anulează</button>
        </div>
      </div>
    </div>
  );
}

// ── TAB PRODUSE ───────────────────────────────────────────────────────────────
function TabProduse() {
  const [produse, setProduse] = useState<Produs[]>([]);
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtraCat, setFiltraCat] = useState<number|'toate'>('toate');
  const [modal, setModal] = useState<Partial<Produs>|null>(null);

  async function incarca() { setLoading(true); const [p,c] = await Promise.all([api('/api/produse'),api('/api/categorii')]); setProduse(p); setCategorii(c); setLoading(false); }
  useEffect(() => { incarca(); }, []);

  async function toggleDisponibil(p: Produs) { await api('/api/produse','PATCH',{id:p.id,disponibil:!p.disponibil}); await incarca(); }
  async function sterge(id: number) { if (!confirm('Ștergi acest produs?')) return; await api('/api/produse','DELETE',{id}); await incarca(); }
  async function salveaza(data: object) { if (modal?.id) await api('/api/produse','PATCH',{id:modal.id,...data}); else await api('/api/produse','POST',data); setModal(null); await incarca(); }

  const filtrate = produse.filter(p=>filtraCat==='toate'||p.categorie_id===filtraCat);

  if (loading) return <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>;
  return (
    <div>
      {modal!==null && <ModalProdusForms categorii={categorii} initial={modal} onSave={salveaza} onClose={()=>setModal(null)}/>}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={()=>setFiltraCat('toate')} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filtraCat==='toate'?'bg-teal-500 text-white':'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>Toate ({produse.length})</button>
        {categorii.map(c=>(
          <button key={c.id} onClick={()=>setFiltraCat(c.id)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filtraCat===c.id?'bg-teal-500 text-white':'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'}`}>{c.nume} ({produse.filter(p=>p.categorie_id===c.id).length})</button>
        ))}
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden mb-4">
        {filtrate.length===0
          ? <div className="text-center py-16 text-white/30">Niciun produs. Apasă „Adaugă produs".</div>
          : <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-4 font-medium">Produs</th>
                <th className="text-left px-5 py-4 font-medium hidden sm:table-cell">Categorie</th>
                <th className="text-left px-5 py-4 font-medium">Preț</th>
                <th className="text-left px-5 py-4 font-medium">Disponibil</th>
                <th className="text-right px-5 py-4 font-medium">Acțiuni</th>
              </tr></thead>
              <tbody>{filtrate.map((p,i)=>(
                <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i===filtrate.length-1?'border-0':''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.imagine ? <img src={p.imagine} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/> : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><ImageIcon size={14} className="text-white/20"/></div>}
                      <div><p className="text-white font-medium">{p.nume}</p>{p.descriere&&<p className="text-white/35 text-xs truncate max-w-xs">{p.descriere}</p>}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell"><span className="text-white/50 text-xs bg-white/10 px-2.5 py-1 rounded-full">{p.categorii?.nume}</span></td>
                  <td className="px-5 py-3 text-teal-400 font-semibold">{Number(p.pret).toFixed(2)} lei</td>
                  <td className="px-5 py-3">
                    <button onClick={()=>toggleDisponibil(p)} className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${p.disponibil?'bg-teal-500':'bg-white/20'}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${p.disponibil?'translate-x-4':'translate-x-0.5'}`}/>
                    </button>
                  </td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2 justify-end">
                    <button onClick={()=>setModal(p)} className="p-1.5 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"><Pencil size={15}/></button>
                    <button onClick={()=>sterge(p.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>}
      </div>
      <button onClick={()=>setModal({})} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/20 hover:text-white transition-all"><Plus size={15}/> Adaugă produs</button>
    </div>
  );
}

// ── MODAL TABLOU ──────────────────────────────────────────────────────────────
function ModalTablou({ initial, galerieId, onSave, onClose }: { initial?: Partial<Tablou>; galerieId: number; onSave:(d:object)=>void; onClose:()=>void }) {
  const [form, setForm] = useState({ galerie_id: galerieId, titlu: initial?.titlu??'', mediu: initial?.mediu??'', dimensiuni: initial?.dimensiuni??'', an: initial?.an??2025, pret: initial?.pret??1000, imagine: initial?.imagine??'' });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.7)'}}>
      <div className="w-full max-w-md bg-[#1a2a35] border border-white/20 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg" style={{fontFamily:'var(--font-title-elegant)'}}>{initial?.id?'Editează tablou':'Tablou nou'}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20}/></button>
        </div>
        <div className="flex flex-col gap-3">
          <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Titlu *</label>
            <input value={form.titlu} onChange={e=>setForm(f=>({...f,titlu:e.target.value}))} placeholder="ex: Ina și moliile" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Mediu</label>
              <input value={form.mediu} onChange={e=>setForm(f=>({...f,mediu:e.target.value}))} placeholder="ex: Acrili, ulei" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
            <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Dimensiuni</label>
              <input value={form.dimensiuni} onChange={e=>setForm(f=>({...f,dimensiuni:e.target.value}))} placeholder="ex: 70×80 cm" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">An</label>
              <input type="number" value={form.an} onChange={e=>setForm(f=>({...f,an:Number(e.target.value)}))} className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60"/></div>
            <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Preț (€)</label>
              <input type="number" value={form.pret} onChange={e=>setForm(f=>({...f,pret:Number(e.target.value)}))} className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60"/></div>
          </div>
          <InputImagine bucket="tablouri" value={form.imagine} onChange={url=>setForm(f=>({...f,imagine:url}))}/>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={()=>onSave(form)} disabled={!form.titlu} className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20">{initial?.id?'Salvează':'Adaugă'}</button>
          <button onClick={onClose} className="px-5 py-3 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20">Anulează</button>
        </div>
      </div>
    </div>
  );
}

// ── TAB GALERII ───────────────────────────────────────────────────────────────
function TabGalerii() {
  const [galerii, setGalerii]     = useState<Galerie[]>([]);
  const [tablouri, setTablouri]   = useState<Tablou[]>([]);
  const [loading, setLoading]     = useState(true);
  const [galarieSelectata, setGalarieSelectata] = useState<Galerie|null>(null);
  const [modalGalerie, setModalGalerie] = useState<Partial<Galerie>|null>(null);
  const [modalTablou, setModalTablou]   = useState<Partial<Tablou>|null>(null);
  const [adaugaGalerie, setAdaugaGalerie] = useState(false);
  const [formGalerie, setFormGalerie] = useState({titlu:'',perioada:'',descriere:''});

  async function incarcaGalerii() { setLoading(true); setGalerii(await api('/api/galerii')); setLoading(false); }
  async function incarcaTablouri(galerieId: number) { setTablouri(await api(`/api/tablouri?galerie_id=${galerieId}`)); }

  useEffect(() => { incarcaGalerii(); }, []);

  async function selecteazaGalerie(g: Galerie) { setGalarieSelectata(g); await incarcaTablouri(g.id); }

  async function salveazaGalerie() {
    if (!formGalerie.titlu.trim()) return;
    if (modalGalerie?.id) await api('/api/galerii','PATCH',{id:modalGalerie.id,...formGalerie});
    else await api('/api/galerii','POST',formGalerie);
    setModalGalerie(null); setAdaugaGalerie(false); setFormGalerie({titlu:'',perioada:'',descriere:''}); await incarcaGalerii();
  }

  async function stergeGalerie(g: Galerie) {
    if (!confirm(`Ștergi galeria "${g.titlu}"? Se șterg și tablourile ei.`)) return;
    await api('/api/galerii','DELETE',{id:g.id}); await incarcaGalerii();
  }

  async function toggleActiva(g: Galerie) {
    await api('/api/galerii','PATCH',{id:g.id,activa:!g.activa}); await incarcaGalerii();
    if (galarieSelectata?.id===g.id) setGalarieSelectata({...galarieSelectata,activa:!g.activa});
  }

  async function salveazaTablou(data: object) {
    if (modalTablou?.id) await api('/api/tablouri','PATCH',{id:modalTablou.id,...data});
    else await api('/api/tablouri','POST',data);
    setModalTablou(null);
    if (galarieSelectata) await incarcaTablouri(galarieSelectata.id);
    await incarcaGalerii();
  }
  async function stergeTablou(id: number) {
    if (!confirm('Ștergi acest tablou?')) return;
    await api('/api/tablouri','DELETE',{id});
    if (galarieSelectata) await incarcaTablouri(galarieSelectata.id);
    await incarcaGalerii();
  }
  async function toggleDisponibilTablou(t: Tablou) {
    await api('/api/tablouri','PATCH',{id:t.id,disponibil:!t.disponibil});
    if (galarieSelectata) await incarcaTablouri(galarieSelectata.id);
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-white/40"><Loader2 size={28} className="animate-spin mr-3"/> Se încarcă...</div>;

  // ── VEDERE TABLOURI ──
  if (galarieSelectata) return (
    <div>
      {modalTablou!==null && <ModalTablou initial={modalTablou} galerieId={galarieSelectata.id} onSave={salveazaTablou} onClose={()=>setModalTablou(null)}/>}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={()=>setGalarieSelectata(null)} className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm"><ChevronLeft size={16}/> Galerii</button>
        <span className="text-white/20">·</span>
        <h2 className="text-white font-semibold" style={{fontFamily:'var(--font-title-elegant)'}}>{galarieSelectata.titlu}</h2>
        {galarieSelectata.activa && <span className="text-xs bg-teal-500/20 text-teal-400 border border-teal-400/30 px-2.5 py-0.5 rounded-full">Activă</span>}
      </div>

      {/* Grid tablouri */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {tablouri.map(t=>(
          <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
            <div className="aspect-square bg-white/5 relative overflow-hidden">
              {t.imagine ? <img src={t.imagine} alt={t.titlu} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-white/15"/></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={()=>setModalTablou(t)} className="p-2 bg-white/20 hover:bg-teal-500 rounded-xl transition-all"><Pencil size={14} className="text-white"/></button>
                <button onClick={()=>stergeTablou(t.id)} className="p-2 bg-white/20 hover:bg-red-500 rounded-xl transition-all"><Trash2 size={14} className="text-white"/></button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate">{t.titlu}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-teal-400 text-xs font-semibold">{t.pret} €</span>
                <button onClick={()=>toggleDisponibilTablou(t)} className={`relative inline-flex h-4 w-7 rounded-full transition-colors ${t.disponibil?'bg-teal-500':'bg-white/20'}`}>
                  <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform mt-0.5 ${t.disponibil?'translate-x-3.5':'translate-x-0.5'}`}/>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Card adaugă */}
        <button onClick={()=>setModalTablou({})} className="aspect-square bg-white/5 border border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-teal-400/40 hover:bg-white/10 transition-all">
          <Plus size={24}/><span className="text-xs">Adaugă tablou</span>
        </button>
      </div>
      <p className="text-white/20 text-xs">{tablouri.length} {tablouri.length===1?'tablou':'tablouri'} în această galerie</p>
    </div>
  );

  // ── VEDERE GALERII ──
  return (
    <div>
      {(adaugaGalerie||modalGalerie) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.7)'}}>
          <div className="w-full max-w-md bg-[#1a2a35] border border-white/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg" style={{fontFamily:'var(--font-title-elegant)'}}>{modalGalerie?.id?'Editează galerie':'Galerie nouă'}</h3>
              <button onClick={()=>{setModalGalerie(null);setAdaugaGalerie(false);setFormGalerie({titlu:'',perioada:'',descriere:''}); }} className="text-white/30 hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-3">
              <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Titlu *</label>
                <input value={formGalerie.titlu} onChange={e=>setFormGalerie(f=>({...f,titlu:e.target.value}))} placeholder="ex: Frânturi de Suflete" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
              <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Perioada</label>
                <input value={formGalerie.perioada} onChange={e=>setFormGalerie(f=>({...f,perioada:e.target.value}))} placeholder="ex: Aprilie – Mai 2026" className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20"/></div>
              <div><label className="block text-white/40 text-xs uppercase tracking-widest mb-1.5">Descriere</label>
                <textarea value={formGalerie.descriere} onChange={e=>setFormGalerie(f=>({...f,descriere:e.target.value}))} rows={3} placeholder="Descrierea expoziției..." className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-teal-400/60 placeholder-white/20 resize-none"/></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={salveazaGalerie} disabled={!formGalerie.titlu} className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20">{modalGalerie?.id?'Salvează':'Adaugă'}</button>
              <button onClick={()=>{setModalGalerie(null);setAdaugaGalerie(false);setFormGalerie({titlu:'',perioada:'',descriere:''}); }} className="px-5 py-3 bg-white/10 text-white/50 rounded-xl text-sm hover:bg-white/20">Anulează</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {galerii.map(g=>(
          <div key={g.id} className="bg-white/10 border border-white/15 rounded-2xl p-5 hover:border-white/25 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {g.activa && <Star size={12} className="text-teal-400 fill-teal-400 flex-shrink-0"/>}
                  <h3 className="text-white font-semibold truncate" style={{fontFamily:'var(--font-title-elegant)'}}>{g.titlu}</h3>
                </div>
                <p className="text-white/40 text-xs">{g.perioada}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={()=>{setModalGalerie(g);setFormGalerie({titlu:g.titlu,perioada:g.perioada,descriere:g.descriere});}} className="p-1.5 text-white/30 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"><Pencil size={14}/></button>
                <button onClick={()=>stergeGalerie(g)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14}/></button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={()=>selecteazaGalerie(g)} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
                {g.tablouri?.[0]?.count??0} tablouri →
              </button>
              <button onClick={()=>toggleActiva(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${g.activa?'bg-teal-500/20 text-teal-400 border border-teal-400/30':'bg-white/5 text-white/30 border border-white/10 hover:border-teal-400/30 hover:text-teal-400/60'}`}>
                {g.activa?'Activă':'Setează activă'}
              </button>
            </div>
          </div>
        ))}

        {/* Card adaugă galerie */}
        <button onClick={()=>{setAdaugaGalerie(true);setFormGalerie({titlu:'',perioada:'',descriere:''}); }}
          className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-teal-400/40 hover:bg-white/10 transition-all min-h-[120px]">
          <Plus size={24}/><span className="text-sm">Galerie nouă</span>
        </button>
      </div>
      <p className="text-white/20 text-xs">{galerii.length} {galerii.length===1?'galerie':'galerii'} · click pe numărul de tablouri pentru a le gestiona</p>
    </div>
  );
}

// ── PAGINA PRINCIPALĂ ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'rezervari', label: 'Rezervări' },
  { id: 'produse',   label: 'Produse' },
  { id: 'categorii', label: 'Categorii' },
  { id: 'galerii',   label: 'Galerii' },
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

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 mb-6 w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setTabActiv(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${tabActiv === tab.id ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {tabActiv === 'rezervari' && <TabRezervari />}
        {tabActiv === 'produse'   && <TabProduse />}
        {tabActiv === 'categorii' && <TabCategorii />}
        {tabActiv === 'galerii'   && <TabGalerii />}
      </div>
    </main>
  );
}
