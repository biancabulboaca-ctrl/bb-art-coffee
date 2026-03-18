"use client";

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6" style={{backgroundColor: "#FAF7F2"}}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4">De ce BB Art Coffee?</h2>
        <p className="text-center text-gray-500 mb-12">Artă originală, cafea de specialitate, atmosferă unică în Sibiu</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Stânga: card mare Artă Originală, full height */}
          <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full md:h-auto">
            <img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800" alt="Arta" className="w-full h-64 md:h-full object-cover"/>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">Artă Originală</h3>
              <p className="text-gray-500">Tablourile de pe pereți sunt disponibile pentru achiziție</p>
            </div>
          </div>
          {/* Dreapta: 3 carduri stivuite vertical */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1 flex flex-col">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800" alt="Cafea" className="w-full h-32 object-cover"/>
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-1">Cafea de Specialitate</h3>
                <p className="text-gray-500 text-sm">Boabe selecționate, preparate cu pasiune</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1 flex flex-col">
              <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800" alt="Bunatati Delicioase" className="w-full h-32 object-cover"/>
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-1">Bunătăți Delicioase</h3>
                <p className="text-gray-500 text-sm">Patiserie artizanală, prăjituri de casă și croissante proaspete în fiecare dimineață</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1 flex flex-col">
              <img src="https://images.unsplash.com/photo-1639488013074-dcd13020150b?w=800" alt="Sibiu" className="w-full h-32 object-cover"/>
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-1">Inima Sibiului</h3>
                <p className="text-gray-500 text-sm">În centrul istoric UNESCO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
