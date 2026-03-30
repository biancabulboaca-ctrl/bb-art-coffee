"use client";
import { useRef, useEffect, useState } from "react";

export default function ContactSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="contact"
      ref={ref}
      className={`py-20 px-6 bg-[#f3ede7] transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-10 text-gray-900">Vino să ne vizitezi</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📍</span>
            <div className="font-semibold text-lg mb-1">Adresă</div>
            <div className="text-gray-700">Strada Nicolae Bălcescu nr. 17, Sibiu</div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🕐</span>
            <div className="font-semibold text-lg mb-1">Program</div>
            <div className="text-gray-700">Luni–Vineri 08:00–20:00<br/>Sâmbătă–Duminică 09:00–21:00</div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📧</span>
            <div className="font-semibold text-lg mb-1">Email</div>
            <div className="text-gray-700">contact@bbartcoffee.ro</div>
          </div>
        </div>
        <form className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 max-w-xl mx-auto">
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="nume" className="font-medium">Nume</label>
            <input id="nume" name="nume" type="text" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="email" className="font-medium">Email</label>
            <input id="email" name="email" type="email" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="mesaj" className="font-medium">Mesaj</label>
            <textarea id="mesaj" name="mesaj" rows={4} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" />
          </div>
          <button type="submit" className="mt-2 bg-teal-600 text-white font-semibold py-2 px-6 rounded hover:bg-teal-700 transition">Trimite</button>
        </form>
      </div>
    </section>
  );
}