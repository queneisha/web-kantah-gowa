"use client";
import {useState, useEffect} from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";

export default function Home() {
  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });


  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await fetch('http://bpn.kadastrium.id/api/hero-display',{ cache: 'no-store' });
        const data = await response.json();

        if (data) {
          setKonten({
            footerText1: data.footerText1 || "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
            footerText2: data.footerText2 || "Sistem Informasi Internal untuk Notaris/PPATS dan PPAT"
          });
        }
      } catch (error){
        console.error('gagal mengambil data: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Footer Responsif */}
      <footer className="bg-[#1a1a1a] text-white py-8 px-4 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[9px] md:text-[11px] font-bold leading-relaxed tracking-wide">
            {konten.footerText1}
          </p>
          <p className="text-[8px] md:text-[10px] opacity-60 mt-2 tracking-[0.2em] md:tracking-widest">
            {konten.footerText2}
          </p>
        </div>
      </footer>
    </main>
  );
}