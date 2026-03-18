"use client";
import { useState } from "react";

const MENU = {
  Cafea: [
    { name: "Espresso", price: 12, desc: "Shot intens de cafea proaspăt măcinată", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400" },
    { name: "Americano", price: 14, desc: "Espresso cu apă fierbinte, gust echilibrat", img: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400" },
    { name: "Cappuccino", price: 16, desc: "Espresso, lapte spumat, cremă fină", img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
    { name: "Latte", price: 17, desc: "Espresso cu mult lapte cremos", img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400" },
    { name: "Flat White", price: 17, desc: "Dublu espresso, lapte catifelat", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400" },
  ],
  Specialty: [
    { name: "Cold Brew", price: 18, desc: "Cafea preparată la rece, 12 ore", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" },
    { name: "Nitro Cold Brew", price: 20, desc: "Cold brew cu azot, cremos și răcoritor", img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400" },
    { name: "Matcha Latte", price: 19, desc: "Matcha japoneză cu lapte de ovăz", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400" },
    { name: "Cortado", price: 15, desc: "Espresso echilibrat cu lapte cald", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400" },
    { name: "Affogato", price: 22, desc: "Espresso fierbinte peste înghetată de vanilie", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400" },
    { name: "Oat Milk Latte", price: 19, desc: "Latte cremos cu lapte de ovăz", img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400" },
  ],
  Patiserie: [
    { name: "Ecler Ciocolată", price: 18, desc: "Rețetă clasică franceză, cremă fină de ciocolată", img: "https://media.istockphoto.com/id/182403573/ro/fotografie/ciocolata-topping-eclair-cu-umplutura-crema.webp?s=2048x2048&w=is&k=20&c=htmwfrE1Sf5hr_nbNGyYDdCmqvAgRUEvpaJXYOlQiO4=" },
    { name: "Ecler Fructul Pasiunii", price: 20, desc: "Explozie de aromă tropicală", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400" },
    { name: "Ecler Caramel Sărat", price: 20, desc: "Dulce-sărat, irezistibil", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400" },
    { name: "Carrot Cake", price: 22, desc: "Cel mai bun carrot cake din Sibiu", img: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?w=400" },
    { name: "Cheesecake", price: 24, desc: "Cremos, cu blat de biscuiți", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400" },
    { name: "Gelato Artizanal", price: 15, desc: "Sorbet sau cremă, arome zilnice", img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400" },
  ],
  Băuturi: [
    { name: "Limonadă Fresh", price: 13, desc: "Lămâi stoarse, miere, mentă, gheață", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80" },
    { name: "Ceaiuri Naturale", price: 12, desc: "Selecție de ceaiuri din plante, servite cald sau rece", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80" },
    { name: "Ciocolată Caldă", price: 15, desc: "Ciocolată belgiană, lapte proaspăt", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80" },
    { name: "Apă plată/minerală", price: 7, desc: "Dorna, Borsec, 500ml", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&q=80" },
    { name: "Suc natural", price: 14, desc: "Portocale, mere sau mix, 100% natural", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  ],
};

const TABS = Object.keys(MENU);

import { useRef } from "react";

export default function MenuSection() {
  const [active, setActive] = useState(TABS[0]);
  const [fadeKey, setFadeKey] = useState(0);
  const fadeRef = useRef(null);
  // Fade-in la schimbare tab
  function handleTab(tab) {
    setActive(tab);
    setFadeKey(fadeKey + 1);
  }
  return (
    <section className="py-20 px-6 bg-white">
      <style>{`
        .menu-tab {
          border-width: 2px;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 0.75rem 2rem;
          transition: all 0.3s;
        }
        .menu-tab.active {
          background: #0D9488;
          color: #fff;
          border-color: #0D9488;
          transform: scale(1.05);
        }
        .menu-tab.inactive {
          background: #fff;
          color: #0D9488;
          border-color: #0D9488;
        }
        .menu-tab.inactive:hover {
          background: #f3f4f6;
          color: #0D9488;
        }
        .menu-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: menuFadeIn 0.5s ease forwards;
        }
        @keyframes menuFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-8">Meniul Nostru</h2>
        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`menu-tab ${active === tab ? 'active' : 'inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Grid produse + subtitle pentru Patiserie */}
        {active === "Patiserie" && (
          <p className="text-center text-sm text-gray-500 mb-6">În parteneriat cu Sucré Sibiu 🤍</p>
        )}
        <div key={fadeKey} className="grid grid-cols-1 md:grid-cols-3 gap-8 menu-fade">
          {MENU[active].map(item => (
            <div key={item.name} className="bg-[#FAF7F2] rounded-2xl p-0 shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-lg font-semibold text-[#0D9488]">{item.price} RON</span>
                </div>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
