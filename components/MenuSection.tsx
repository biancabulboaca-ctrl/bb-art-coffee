"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Categorie = { id: number; nume: string; ordine: number };
type Produs = {
  id: number; categorie_id: number; nume: string; descriere: string;
  pret: number; imagine: string; disponibil: boolean;
};

export default function MenuSection() {
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [produse, setProduse]     = useState<Produs[]>([]);
  const [activa, setActiva]       = useState<number | null>(null);
  const [fadeKey, setFadeKey]     = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categorii').then(r => r.json()),
      fetch('/api/produse').then(r => r.json()),
    ]).then(([cats, prods]) => {
      setCategorii(cats);
      setProduse(prods);
      if (cats.length > 0) setActiva(cats[0].id);
      setLoading(false);
    });
  }, []);

  function handleTab(id: number) {
    setActiva(id);
    setFadeKey(k => k + 1);
  }

  const produseActive = produse.filter(p => p.categorie_id === activa && p.disponibil);
  const catActiva = categorii.find(c => c.id === activa);

  return (
    <section className="py-20 px-6 bg-white">
      <style>{`
        .menu-tab { border-width:2px; border-radius:0.5rem; font-weight:600; font-size:1.1rem; padding:0.75rem 2rem; transition:all 0.3s; }
        .menu-tab.active { background:#0D9488; color:#fff; border-color:#0D9488; transform:scale(1.05); }
        .menu-tab.inactive { background:#fff; color:#0D9488; border-color:#0D9488; }
        .menu-tab.inactive:hover { background:#f3f4f6; }
        .menu-fade { opacity:0; transform:translateY(20px); animation:menuFadeIn 0.5s ease forwards; }
        @keyframes menuFadeIn { to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-8">Meniul Nostru</h2>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Se încarcă meniul...</div>
        ) : (
          <>
            {/* Tabs categorii */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
              {categorii.map(cat => (
                <button key={cat.id} onClick={() => handleTab(cat.id)}
                  className={`menu-tab ${activa === cat.id ? 'active' : 'inactive'}`}>
                  {cat.nume}
                </button>
              ))}
            </div>

            {/* Subtitlu Patiserie */}
            {catActiva?.nume === 'Patiserie' && (
              <p className="text-center text-sm text-gray-500 mb-6">În parteneriat cu Sucré Sibiu 🤍</p>
            )}

            {/* Grid produse */}
            {produseActive.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Niciun produs disponibil în această categorie.
              </div>
            ) : (
              <div key={fadeKey} className="grid grid-cols-1 md:grid-cols-3 gap-8 menu-fade">
                {produseActive.map(item => (
                  <div key={item.id} className="bg-[#FAF7F2] rounded-2xl shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col overflow-hidden">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                      {item.imagine ? (
                        item.imagine.startsWith('http') ? (
                          <img src={item.imagine} alt={item.nume} className="w-full h-full object-cover" />
                        ) : (
                          <Image src={item.imagine} alt={item.nume} width={400} height={300} className="object-cover w-full h-full" />
                        )
                      ) : (
                        <div className="w-full h-full bg-[#f3ede7] flex items-center justify-center text-gray-300 text-4xl">☕</div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{item.nume}</h3>
                        <span className="text-lg font-semibold text-[#0D9488]">{item.pret} RON</span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.descriere}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
