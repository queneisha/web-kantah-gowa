"use client";
import {useState, useEffect} from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";

export default function Home() {
  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
  });


  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await fetch('http://localhost:8000/api/hero-display',{ cache: 'no-store' });
        const data = await response.json();

        if (data) {
          setKonten({
            footerText1: data.footerText1,
            footerText2: data.footerText2
          });
        }
      } catch (error){
        console.error('gagal mengambil data: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <footer className="bg-[#1a1a1a] text-white py-6 text-center">
        <p className="text-[10px] font-bold">{konten.footerText1}</p>
        <p className="text-[9px] opacity-60 mt-1 tracking-widest">{konten.footerText2}</p>
      </footer>
    </main>
  );
}