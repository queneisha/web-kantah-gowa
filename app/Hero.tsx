"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {

  interface HeroData {
    background?: string;
    heroTitle1?: string;
    heroTitle2?: string;
    heroTitle3?: string;
  }

interface HeroData {
  heroTitle1?: string;
  heroTitle2?: string;
  heroTitle3?: string;
  background?: string | null;
}
const [heroData, setHeroData] = useState<HeroData | null>(null);
  
useEffect(() => {
  const fetchHero = async () => {
    const res = await fetch("http://localhost:8000/api/hero-display");
    const data = await res.json();
    setHeroData(data);
  };

  fetchHero();

  window.addEventListener("heroUpdated", fetchHero);
  return () => window.removeEventListener("heroUpdated", fetchHero);
}, []);

  //siapkan state untk tampung data dri laravel
  const [data, setData] = useState({
    heroTitle1: "Selamat Datang !",
    heroTitle2: "Sistem Informasi Kantor Pertanahan Gowa",
    heroTitle3: "Platform digital untuk Notaris dan PPAT dalam melakukan pendaftaran, pengajuan permohonan, dan pemantauan status layanan pertanahan secara efisien dan terpadu.",
    background:"", //nti diambil dri laravel
  });

  //ambil data saat halaman dibuka
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display");
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchHeroData();
    window.addEventListener("heroUpdated", fetchHeroData);

    return ()=>{
      window.removeEventListener("heroUpdated", fetchHeroData);
    };
  }, []);
  
  return (
    <section className="relative w-full h-[650px] bg-gray-200 overflow-hidden flex items-center">
      {/* Background Image - Pastikan file ada di folder public */}
      <div className="absolute inset-0 bg-cover bg-center brightness-90 z-0">
        <img
        //kalau background kosong, pake gambar default. Klu ada, ambil dri laravel
        src= {heroData?.background ?? "/background.jpg"} 
        alt="Background"
        className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
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