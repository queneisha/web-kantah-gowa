"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  interface HeroData {
    heroTitle1?: string;
    heroTitle2?: string;
    heroTitle3?: string | null;
    background?: string | null;
  }

  const [data, setData] = useState({
    heroTitle1: "Selamat Datang",
    heroTitle2: "Sistem Informasi Kantor Pertanahan Gowa",
    heroTitle3: "Platform digital untuk Notaris/PPAT/PPATS dalam melakukan pendaftaran, pengajuan permohonan, dan pemantauan status layanan pertanahan secara efisien dan terpadu.",
    background: null as string | null,
    navbarIcon: null as string | null,
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display", { cache: 'no-store' });
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchHeroData();
    window.addEventListener("heroUpdated", fetchHeroData);

    return () => {
      window.removeEventListener("heroUpdated", fetchHeroData);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[500px] md:h-[650px] bg-gray-200 overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={data?.background || "/background.jpg"}
          alt="Background"
          className="w-full h-full object-cover brightness-75 md:brightness-90 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-4 md:px-16 relative z-10 flex justify-center items-center w-full">
        <div className="bg-white/95 p-6 md:p-12 rounded-[30px] md:rounded-[50px] max-w-2xl shadow-2xl border border-white/20 text-center md:text-left mx-4 md:mx-0">
          
          {/* Title 1: Responsif Ukuran Teks */}
          <h1 className="text-3xl md:text-5xl font-black text-[#7c4d2d] mb-3 md:mb-4">
            {data.heroTitle1}
          </h1>

          {/* Title 2: Responsif Ukuran Teks */}
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">
            {data.heroTitle2}
          </h2>

          {/* Title 3: Responsif Leading & Padding */}
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
            {data.heroTitle3}
          </p>

          <Link href="/Register">
            <button className="w-full md:w-auto bg-[#56b35a] hover:bg-[#43a047] text-white px-8 md:px-10 py-3 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg transition-transform active:scale-95 md:hover:scale-105">
              Mulai Sekarang
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}