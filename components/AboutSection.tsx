"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
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
      ref={ref}
      className={`py-20 px-6 bg-[#FAF7F2] transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Image with overlay */}
        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/patiserie/Hero 1.jpeg"
            alt="BB Art Coffee interior"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#f3ede7cc] to-[#e0cfc0cc] mix-blend-multiply" />
        </div>
        {/* Right: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="h-1 w-20 mb-4 rounded bg-gradient-to-r from-[#eab308] to-[#0D9488]" />
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-6 text-gray-900">Unde arta întâlnește cafeaua</h2>
          <p className="mb-4 text-lg text-gray-700">BB Art Coffee s-a născut dintr-o convingere simplă: că frumosul și savoarea merg mână în mână. Suntem mai mult decât o cafenea — suntem un spațiu unde lucrările originale de artă ale Biancăi Bulboaca stau alături de cafele de specialitate și bunătăți făcute cu drag.</p>
          <p className="mb-4 text-lg text-gray-700">Fiecare tablou de pe pereții noștri este de vânzare. Fiecare ceașcă este preparată cu atenție. Fiecare vizită poate fi începutul unei povești — cu o operă de artă sau cu o prăjitură care te face să închizi ochii.</p>
          <p className="text-lg text-gray-700">Ne găsești în inima Sibiului, pe Strada Nicolae Bălcescu. Vino să stai. Vino să privești. Vino să guști.</p>
        </div>
      </div>
    </section>
  );
}
