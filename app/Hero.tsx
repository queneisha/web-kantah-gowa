import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[650px] bg-gray-200 overflow-hidden flex items-center">
      {/* Background Image - Pastikan file ada di folder public */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center brightness-90"></div>
      
      <div className="container mx-auto px-16 relative z-10 flex justify-between items-center w-full">
        <div className="bg-white/95 p-12 rounded-[50px] max-w-2xl shadow-2xl border border-white/20">
          <h1 className="text-5xl font-black text-[#7c4d2d] mb-4">Selamat Datang !</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sistem Informasi Kantor Pertanahan Gowa</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Platform digital untuk Notaris dan PPAT dalam melakukan pendaftaran, pengajuan permohonan, dan pemantauan status layanan pertanahan secara efisien dan terpadu.
          </p>
          <Link href="/Register"> {/* 2. Bungkus tombol dengan Link ke path /register */}
  <button className="bg-[#56b35a] hover:bg-[#43a047] text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-lg transition-transform hover:scale-105">
    Mulai Sekarang
  </button>
</Link>
        </div>

        {/* Gambar Maskot */}
        <div className="hidden lg:block relative mt-35">
          <img src="/maskot.png" alt="Maskot" className="h-[700px] object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}