'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import CoffeeLogo from '@/components/CoffeeLogo';

const LUNI = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
               'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
const ZILE = ['Lu','Ma','Mi','Jo','Vi','Sâ','Du'];

const ORE = Array.from({ length: 25 }, (_, i) => {
  const h = 10 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

function toStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dataFrumos(str: string) {
  const [y, m, z] = str.split('-');
  return `${z} ${LUNI[Number(m)-1]} ${y}`;
}

export default function RezervariPage() {
  const today    = new Date();
  const todayStr = toStr(today);
  const maxDate  = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());

  // Pornim calendarul pe prima lună cu zile disponibile
  const initMonth = today.getDate() >= 25 ? today.getMonth() + 1 : today.getMonth();
  const initYear  = initMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();

  const [step, setStep]               = useState(1);
  const [calYear, setCalYear]         = useState(initYear);
  const [calMonth, setCalMonth]       = useState(initMonth > 11 ? 0 : initMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOra, setSelectedOra]   = useState<string | null>(null);
  const [form, setForm]               = useState({ nume: '', email: '', telefon: '', numar_persoane: 2 });
  const [loading, setLoading]         = useState(false);
  const [eroare, setEroare]           = useState('');
  const [confirmat, setConfirmat]     = useState(false);
  const [campErori, setCampErori]     = useState({ email: '', telefon: '' });

  // Email: caractere valide înainte de @, @ o singură dată, domeniu.extensie(min 2 car)
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  function valideazaEmail(val: string) {
    if (!val) return 'Email-ul este obligatoriu.';
    if ((val.match(/@/g) || []).length !== 1) return 'Email-ul trebuie să conțină un singur @.';
    if (!REGEX_EMAIL.test(val)) return 'Introdu un email valid (ex: ana@email.ro).';
    return '';
  }

  function valideazaTelefon(val: string) {
    const curat = val.replace(/[\s\-()]/g, '');
    if (!curat) return 'Telefonul este obligatoriu.';
    if (!/^07\d{8}$/.test(curat)) return 'Numărul trebuie să înceapă cu 07 urmat de 8 cifre.';
    return '';
  }
  function valideazaForm() {
    const erEmail   = valideazaEmail(form.email);
    const erTelefon = valideazaTelefon(form.telefon);
    setCampErori({ email: erEmail, telefon: erTelefon });
    return !erEmail && !erTelefon;
  }

  const prevDisabled = new Date(calYear, calMonth - 1, 1) < new Date(today.getFullYear(), today.getMonth(), 1);
  const nextDisabled = new Date(calYear, calMonth + 1, 1) > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  function navLuna(dir: number) {
    let m = calMonth + dir, y = calYear;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setCalMonth(m); setCalYear(y);
  }

  function selectData(str: string, y: number, m: number) {
    setSelectedDate(str); setCalYear(y); setCalMonth(m);
  }

  // Zile rapide
  const zileRapide = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d   = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const str = toStr(d);
    const zi  = ZILE[(d.getDay() + 6) % 7];
    const label = i === 0 ? 'Azi'
      : i === 1 ? `Mâine`
      : `${zi} ${d.getDate()} ${LUNI[d.getMonth()].slice(0,3)}`;
    return { str, label, d };
  }), []);

  // Celule calendar
  const firstDay  = new Date(calYear, calMonth, 1).getDay();
  const offset    = (firstDay + 6) % 7;
  const zileInLuna = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({length: zileInLuna}, (_,i)=>i+1)];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedOra) return;
    if (!valideazaForm()) return;
    setLoading(true); setEroare('');
    try {
      const res = await fetch('/api/rezervari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, data: selectedDate, ora: selectedOra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.eroare || 'Eroare. Încearcă din nou.');
      setConfirmat(true);
    } catch (err: unknown) {
      setEroare(err instanceof Error ? err.message : 'Eroare. Încearcă din nou.');
    } finally { setLoading(false); }
  }

  function reset() {
    setStep(1); setSelectedDate(null); setSelectedOra(null);
    setForm({ nume: '', email: '', telefon: '', numar_persoane: 2 });
    setEroare(''); setConfirmat(false);
    setCalYear(initYear); setCalMonth(initMonth > 11 ? 0 : initMonth);
  }

  // ── CONFIRMARE ──
  if (confirmat) return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)' }}>
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <CoffeeLogo size={52} />
        </div>
        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="text-teal-400" size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily:'var(--font-title-elegant)' }}>
          Rezervare confirmată!
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Te vom contacta în curând.<br/>Abia așteptăm să te vedem!
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={reset}
            className="py-3 border border-orange-400/50 text-orange-400 rounded-2xl text-sm font-semibold hover:bg-orange-500/20 transition-all">
            + Rezervare nouă
          </button>
          <Link href="/" className="py-3 bg-teal-500 text-white rounded-2xl text-sm font-semibold hover:bg-teal-400 transition-all text-center">
            Înapoi la site
          </Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-4"
      style={{ background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)' }}>
      <div className="w-full max-w-lg">

        {/* Link înapoi la site */}
        <div className="flex justify-end mb-3">
          <Link href="/" className="text-xs text-white/30 hover:text-teal-400 transition-colors tracking-widest uppercase">
            ← Site
          </Link>
        </div>

        {/* Card principal */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header card */}
          <div className="px-5 pt-4 pb-3 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'var(--font-title-elegant)' }}>
              Rezervare masă
            </h1>
            <p className="text-white/40 text-xs mt-0.5 tracking-wide">Completează în 3 pași simpli</p>

            {/* Pași */}
            <div className="flex items-center mt-3">
              {[1,2,3].map((s,i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${step===s ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40'
                        : step>s  ? 'bg-orange-400 text-white'
                        : 'border border-white/20 text-white/30'}`}>
                      {s}
                    </div>
                    <span className={`text-xs uppercase tracking-widest hidden sm:block transition-colors
                      ${step===s ? 'text-teal-400 font-semibold' : step>s ? 'text-orange-400' : 'text-white/20'}`}>
                      {['Data','Ora','Detalii'][i]}
                    </span>
                  </div>
                  {i<2 && <div className="flex-1 h-px bg-white/10 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Body card */}
          <div className="px-5 py-4">

            {/* ── PAS 1: DATA ── */}
            {step===1 && (
              <div>
                {/* Zile rapide */}
                <div className="flex gap-1 flex-wrap mb-3">
                  {zileRapide.map(({str,label,d}) => (
                    <button key={str}
                      onClick={() => selectData(str, d.getFullYear(), d.getMonth())}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap
                        ${selectedDate===str
                          ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/30'
                          : 'border-white/15 text-white/60 hover:border-teal-400/60 hover:text-white bg-white/5'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Calendar nav */}
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => navLuna(-1)} disabled={prevDisabled}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/50 hover:border-teal-400/50 hover:text-teal-400 disabled:opacity-20 disabled:cursor-default transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-white font-semibold text-sm" style={{ fontFamily:'var(--font-title-elegant)', fontSize:'1.1rem' }}>
                    {LUNI[calMonth]} {calYear}
                  </span>
                  <button onClick={() => navLuna(1)} disabled={nextDisabled}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/50 hover:border-teal-400/50 hover:text-teal-400 disabled:opacity-20 disabled:cursor-default transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Grid calendar */}
                <div className="grid grid-cols-7 gap-0.5 mb-3">
                  {ZILE.map(z => (
                    <div key={z} className="text-center text-xs text-white/25 uppercase tracking-wider py-0.5">{z}</div>
                  ))}
                  {cells.map((zi, idx) => {
                    if (!zi) return <div key={idx} />;
                    const d   = new Date(calYear, calMonth, zi);
                    const str = toStr(d);
                    const disabled = d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || d > maxDate;
                    const isToday  = str === todayStr;
                    const selected = selectedDate === str;
                    return (
                      <button key={idx} onClick={() => !disabled && selectData(str, calYear, calMonth)} disabled={disabled}
                        className={`h-8 flex items-center justify-center text-xs rounded-lg transition-all duration-150 font-medium
                          ${selected  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/40'
                            : disabled ? 'text-white/15 cursor-default'
                            : isToday  ? 'text-orange-400 font-bold hover:bg-white/10'
                            : 'text-white/70 hover:bg-teal-500/20 hover:text-white'}`}>
                        {zi}
                      </button>
                    );
                  })}
                </div>

                <button onClick={() => setStep(2)} disabled={!selectedDate}
                  className="w-full py-2.5 bg-teal-500 text-white rounded-2xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20 transition-all shadow-lg shadow-teal-500/20">
                  Continuă →
                </button>
              </div>
            )}

            {/* ── PAS 2: ORA ── */}
            {step===2 && (
              <div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-5">
                  {ORE.map(o => (
                    <button key={o} onClick={() => setSelectedOra(o)}
                      className={`py-2.5 text-xs rounded-xl border font-medium transition-all
                        ${selectedOra===o
                          ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/30'
                          : 'border-white/15 text-white/60 bg-white/5 hover:border-teal-400/50 hover:text-white hover:bg-teal-500/10'}`}>
                      {o}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-4 py-3 border border-white/15 text-white/50 rounded-2xl text-sm hover:border-white/30 hover:text-white transition-all">
                    <ChevronLeft size={15}/> Înapoi
                  </button>
                  <button onClick={() => setStep(3)} disabled={!selectedOra}
                    className="flex-1 py-3 bg-teal-500 text-white rounded-2xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20 transition-all">
                    Continuă →
                  </button>
                </div>
              </div>
            )}

            {/* ── PAS 3: DETALII ── */}
            {step===3 && (
              <form onSubmit={handleSubmit}>
                {/* Sumar */}
                <div className="flex gap-4 bg-teal-500/10 border border-teal-400/20 rounded-2xl px-4 py-3 mb-5">
                  <div>
                    <p className="text-teal-400/70 text-xs uppercase tracking-widest mb-0.5">Data</p>
                    <p className="text-white font-semibold text-sm">{selectedDate && dataFrumos(selectedDate)}</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-teal-400/70 text-xs uppercase tracking-widest mb-0.5">Ora</p>
                    <p className="text-white font-semibold text-sm">{selectedOra}</p>
                  </div>
                </div>

                {/* Câmpuri */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Nume *</label>
                    <input required value={form.nume} onChange={e => setForm({...form, nume:e.target.value})}
                      placeholder="Ana Ionescu"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Persoane *</label>
                    <select required value={form.numar_persoane} onChange={e => setForm({...form, numar_persoane:Number(e.target.value)})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-teal-400/60 transition-all">
                      {Array.from({length:12},(_,i)=>i+1).map(n=>(
                        <option key={n} value={n} className="bg-gray-800">{n} {n===1?'persoană':'persoane'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Email *</label>
                    <input required type="email" value={form.email}
                      onChange={e => { setForm({...form, email:e.target.value}); setCampErori(p=>({...p, email:''})); }}
                      onBlur={e => setCampErori(p=>({...p, email: valideazaEmail(e.target.value)}))}
                      placeholder="ana@email.ro"
                      className={`w-full px-3 py-2.5 bg-white/10 border rounded-xl text-white text-sm placeholder-white/20 outline-none focus:bg-white/15 transition-all
                        ${campErori.email ? 'border-red-400/60 focus:border-red-400' : 'border-white/15 focus:border-teal-400/60'}`} />
                    {campErori.email && <p className="text-red-400 text-xs mt-1.5">{campErori.email}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Telefon *</label>
                    <input required type="tel" value={form.telefon}
                      onChange={e => { setForm({...form, telefon:e.target.value}); setCampErori(p=>({...p, telefon:''})); }}
                      onBlur={e => setCampErori(p=>({...p, telefon: valideazaTelefon(e.target.value)}))}
                      placeholder="07xx xxx xxx"
                      className={`w-full px-3 py-2.5 bg-white/10 border rounded-xl text-white text-sm placeholder-white/20 outline-none focus:bg-white/15 transition-all
                        ${campErori.telefon ? 'border-red-400/60 focus:border-red-400' : 'border-white/15 focus:border-teal-400/60'}`} />
                    {campErori.telefon && <p className="text-red-400 text-xs mt-1.5">{campErori.telefon}</p>}
                  </div>
                </div>

                {eroare && (
                  <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5 mb-3">
                    {eroare}
                  </p>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex items-center gap-1 px-4 py-3 border border-white/15 text-white/50 rounded-2xl text-sm hover:border-white/30 hover:text-white transition-all">
                    <ChevronLeft size={15}/> Înapoi
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-3 bg-teal-500 text-white rounded-2xl font-semibold text-sm hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/20 transition-all flex items-center justify-center gap-2">
                    {loading && <Loader2 size={15} className="animate-spin"/>}
                    {loading ? 'Se trimite...' : 'Confirmă rezervarea'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
