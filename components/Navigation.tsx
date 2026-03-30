'use client';

import { useState, useEffect } from 'react';
import CoffeeLogo from './CoffeeLogo';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 py-3'
        : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <CoffeeLogo size={36} />
          <span className="text-white font-semibold text-sm tracking-wide group-hover:text-teal-400 transition-colors hidden sm:block"
            style={{ fontFamily: 'var(--font-title-elegant)', fontSize: '1.1rem' }}>
            BB Art Caffè
          </span>
        </a>

        {/* Buton rezervare */}
        <a href="/rezervari"
          className="px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          style={{ background: '#F97316', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#EA580C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}>
          Rezervă acum
        </a>

      </div>
    </nav>
  );
}
