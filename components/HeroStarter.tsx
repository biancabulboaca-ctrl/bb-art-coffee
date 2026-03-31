"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroStarter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Google Fonts CSS pentru Cormorant Garamond */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap');
        

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-title {
          animation: fadeInDown 1.5s ease-out forwards;
        }

        .animate-subtitle {
          animation: fadeInDown 1.5s ease-out forwards;
          opacity: 0;
        }

        .animate-buttons {
          animation: fadeInUp 1.5s ease-out forwards;
          opacity: 0;
        }


        .hero-title {
          font-family: 'Cormorant Garamond', serif;
        }

        .scroll-arrow {
          animation: bounce 2s infinite;
          transition: color 300ms ease;
        }

        .scroll-arrow:hover {
          color: #0d9488;
        }
      `}</style>

      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* TITLU PRINCIPAL */}
          <h1
            className={`hero-title text-8xl font-bold mb-4 leading-tight ${
              isVisible ? "animate-title" : "opacity-0"
            }`}
            style={{ color: '#F5E6C8' }}
          >
            BB Art Coffee
          </h1>

          {/* SUBTITLU */}
          <p
            className={`italic text-xl mb-12 letter-spacing: 0.05em ${
              isVisible ? "animate-subtitle" : "opacity-0"
            }`}
            style={{ color: '#E8D5A3' }}
          >
            Arta la fiecare ceașcă
          </p>

          {/* BUTTONS */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center ${
              isVisible ? "animate-buttons" : "opacity-0"
            }`}
          >
            {/* Button 1: Vezi Meniul */}
            <a href="#meniu" className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white rounded-lg hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center">
              Vezi Meniul
            </a>

            {/* Button 2: Vizitează-ne */}
            <a href="#contact" className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white rounded-lg hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center">
              Vizitează-ne
            </a>

            {/* Button 3: Descoperă Arta */}
            <a href="/bb-art-studio" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white rounded-lg hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
              style={{ minWidth: '10rem', textAlign: 'center' }}>
              Descoperă Arta
            </a>
          </div>
        </div>

        {/* VIDEO - Bottom Center */}
        <video
          className="absolute bottom-0 sm:bottom-14 left-1/2 -translate-x-1/2 max-w-[160px] sm:max-w-sm rounded-xl opacity-80 z-20"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/film.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* SCROLL ARROW */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
          {/* Double chevron for scroll indicator */}
          <div className="flex flex-col items-center">
            <ChevronDown size={32} className="scroll-arrow text-teal-500" />
            <ChevronDown size={32} className="scroll-arrow text-teal-500 -mt-3" />
          </div>
        </div>
      </section>
    </>
  );
}
