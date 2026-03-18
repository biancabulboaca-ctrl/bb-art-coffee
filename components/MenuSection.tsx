"use client";
type MenuKey = "Cafea" | "Specialty" | "Patiserie" | "Băuturi";
import { useState } from "react";
import Image from "next/image";

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
    { name: "Ecler Ciocolată", price: 18, desc: "Rețetă clasică franceză, cremă fină de ciocolată", img: "/patiserie/ecler ciocolata.jpg" },
    { name: "Ecler Fructul Pasiunii", price: 20, desc: "Explozie de aromă tropicală", img: "/patiserie/ecler fructul pasiunii.jpg" },
    { name: "Ecler Caramel Sărat", price: 20, desc: "Dulce-sărat, irezistibil", img: "/patiserie/ecler caramel sarat.jpg" },
    { name: "Carrot Cake", price: 22, desc: "Cel mai bun carrot cake din Sibiu", img: "/patiserie/carrot cake.jpg" },
    { name: "Inghetata artizanala", price: 15, desc: "Sorbet sau cremă, arome zilnice", img: "/patiserie/inghetata.jpg" },
    { name: "Medovik", price: 19, desc: "Tort cu foi de miere și cremă fină", img: "/patiserie/medovik.jpg" },
    { name: "Pavlova", price: 23, desc: "Bezea crocantă, cremă și fructe proaspete", img: "/patiserie/pavlova.jpg" },
  ],
  Băuturi: [
    { name: "Limonadă Clasică", price: 12, desc: "Lămâie, mentă, sirop de trestie", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop" },
    { name: "Limonadă Lavandă & Afine", price: 15, desc: "Florală, răcoritoare, violet", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { name: "Suc de Portocale Proaspăt", price: 13, desc: "Stors la comandă", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop" },
    { name: "Suc Morcov-Ghimbir-Lămâie", price: 14, desc: "Energizant natural", img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop" },
    { name: "Ceai Earl Grey", price: 10, desc: "Bergamot, floral, cald", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop" },
    { name: "Ceai Rooibos & Vanilie", price: 11, desc: "Fără cofeină, dulce natural", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=300&fit=crop" },
    { name: "Smoothie Verde", price: 20, desc: "Spanac, banana, măr, ghimbir", img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop" },
    { name: "Smoothie Berry", price: 20, desc: "Căpșuni, zmeură, afine, iaurt", img: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400&h=300&fit=crop" },
    { name: "Smoothie Tropical", price: 20, desc: "Mango, ananas, cocos, lime", img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop" },
  ],
};

const TABS = Object.keys(MENU);

import { useRef } from "react";

export default function MenuSection() {
  const [active, setActive] = useState<MenuKey>("Cafea");
  const [fadeKey, setFadeKey] = useState(0);
  const fadeRef = useRef(null);
  // Fade-in la schimbare tab
function handleTab(tab: MenuKey) {
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
              onClick={() => handleTab(tab as MenuKey)}
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
                {active === "Patiserie" ? (
                  item.img ? (
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f3ede7] flex items-center justify-center text-gray-400 text-lg">Fără imagine</div>
                  )
                ) : active === "Băuturi" ? (
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                )}
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
