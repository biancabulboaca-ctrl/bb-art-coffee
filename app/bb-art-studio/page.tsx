'use client';

import { useState } from 'react';
import Link from 'next/link';

const EXPOZITIE = {
  titlu: 'Frânturi de Suflete',
  perioada: 'Aprilie – Mai 2026',
  descriere: [
    'Sunt urme.',
    'Urme lăsate de oameni care mi-au fost aproape. Sau doar au trecut prin viața mea suficient cât să lase lumină, umbră, o expresie care nu s-a șters.',
    'În fiecare chip există o poveste nerostită. Nu încerc să o explic. Încerc doar să o păstrez. Un fel de jurnal de chipuri.',
    'Aceste lucrări nu sunt despre perfecțiunea trăsăturilor. Sunt despre vibrație. Despre ce rămâne după ce momentul trece. Fragmente. Amintiri. Frânturi de suflete.',
  ],
};

const ARTIST_STATEMENT = 'Pictez de când mă știu, iar culoarea a fost mereu un spațiu de liniște și claritate. Practica mea se înscrie într-un registru aproape de „open impressionism", unde gestul rămâne liber, dar compoziția este atent construită. Lucrez în straturi: un strat de bază din acrilic, care fixează structura și tensiunea cromatică, peste care intervin cu accente și „highlights" în ulei, pentru profunzime, lumină și vibrație tactilă.';

const TABLOURI = [
  { titlu: 'Ina și moliile',     mediu: 'Acrili, ulei',          dimensiuni: '70×80 cm', an: 2025, imagine: '/art/ina-si-moliile.jpg' },
  { titlu: 'Iris și calul',      mediu: 'Acrili, ulei',          dimensiuni: '70×80 cm', an: 2025, imagine: '/art/iris-si-calul.jpg' },
  { titlu: '6 Pui',              mediu: 'Acrili, ulei, pastel',  dimensiuni: '80×60 cm', an: 2025, imagine: '/art/6-pui.jpg' },
  { titlu: 'Andrei Rădașcă',     mediu: 'Acrili, ulei, pastel',  dimensiuni: '70×50 cm', an: 2025, imagine: '/art/andrei-radasca.jpg' },
  { titlu: 'Fetița curcubeu',    mediu: 'Acrili, ulei, pastel',  dimensiuni: '70×50 cm', an: 2025, imagine: '/art/fetita-curcubeu.jpg' },
  { titlu: '2 Dinți și 6 păsări',mediu: 'Acrili, ulei, pastel',  dimensiuni: '80×60 cm', an: 2025, imagine: '/art/2-dinti-si-6-pasari.jpg' },
  { titlu: '2 Pui',              mediu: 'Acrili, ulei, pastel',  dimensiuni: '40×40 cm', an: 2025, imagine: '/art/2-pui.jpg' },
  { titlu: 'Ina Lina',           mediu: 'Acrili, ulei, pastel',  dimensiuni: '40×40 cm', an: 2025, imagine: '/art/ina-lina.jpg' },
  { titlu: 'Plasture pe suflet', mediu: 'Acrili, ulei, pastel',  dimensiuni: '40×40 cm', an: 2025, imagine: '/art/plasture-pe-suflet.jpg' },
  { titlu: '2 Pisicoase',        mediu: 'Acrili, ulei, pastel',  dimensiuni: '40×40 cm', an: 2025, imagine: '/art/2-pisicoase.jpg' },
  { titlu: 'Mama Bună',          mediu: 'Acrili, ulei, pastel',  dimensiuni: '40×40 cm', an: 2025, imagine: '/art/mama-buna.jpg' },
];

function Tablou({ t }: { t: typeof TABLOURI[0] }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      {/* Imagine */}
      <div className="relative aspect-square bg-white/5 overflow-hidden">
        {!err ? (
          <img
            src={t.imagine}
            alt={t.titlu}
            onLoad={() => setLoaded(true)}
            onError={() => setErr(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : null}
        {/* Placeholder până se încarcă imaginea */}
        {(!loaded || err) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-white/10 text-5xl">🎨</div>
            <span className="text-white/20 text-xs">{t.titlu}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-white font-semibold text-base leading-tight" style={{ fontFamily: 'var(--font-title-elegant)' }}>
          {t.titlu}
        </h3>
        <p className="text-white/40 text-xs">{t.mediu} · {t.dimensiuni} · {t.an}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-white/30 text-xs uppercase tracking-widest">Disponibil</span>
          <span className="text-teal-400 font-bold text-sm">1.000 €</span>
        </div>
      </div>
    </div>
  );
}

export default function BBArtStudioPage() {
  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0f0f1a 0%,#1a1025 40%,#0f1a1a 100%)' }}>

      {/* ── HERO EXPOZIȚIE ── */}
      <section className="relative pt-28 pb-16 px-6 text-center overflow-hidden">
        {/* Decor fundal */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #a855f7 0%, transparent 70%)' }} />

        <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-3">Expoziție curentă</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-title-elegant)', color: '#c084fc' }}>
          Frânturi de Suflete
        </h1>
        <p className="text-white/30 text-sm tracking-widest mb-10">{EXPOZITIE.perioada}</p>

        {/* Descriere expoziție */}
        <div className="max-w-2xl mx-auto text-left md:text-center space-y-4">
          {EXPOZITIE.descriere.map((para, i) => (
            <p key={i} className={`leading-relaxed ${i === 0 ? 'text-white/90 text-lg italic' : 'text-white/55 text-base'}`}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/25 text-xs uppercase tracking-[0.25em]">Lucrări · {TABLOURI.length} piese</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TABLOURI.map((t) => (
            <Tablou key={t.titlu} t={t} />
          ))}
        </div>
      </section>

      {/* ── ARTIST STATEMENT ── */}
      <section className="px-6 py-16 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/25 text-xs uppercase tracking-[0.25em] mb-4">Artist Statement</p>
          <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-title-elegant)' }}>
            Bianca Bulboaca
          </h2>
          <p className="text-white/50 leading-relaxed text-base">{ARTIST_STATEMENT}</p>

          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            <a href="mailto:bbartstudiob@gmail.com"
              className="text-white/40 hover:text-teal-400 transition-colors text-sm">
              bbartstudiob@gmail.com
            </a>
            <span className="text-white/15">·</span>
            <a href="https://www.instagram.com/bb.studioart/" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-teal-400 transition-colors text-sm">
              @bb.studioart
            </a>
            <span className="text-white/15">·</span>
            <span className="text-white/40 text-sm">+40 728 994 711</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="text-center py-8 border-t border-white/5">
        <Link href="/" className="text-white/20 hover:text-teal-400 transition-colors text-xs uppercase tracking-widest">
          ← BB Art Caffè
        </Link>
      </div>

    </main>
  );
}
