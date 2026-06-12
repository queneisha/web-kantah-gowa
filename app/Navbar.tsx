"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Home, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  
  // State tambahan untuk kontrol menu mobile (tanpa merubah data asli)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [navData, setNavData] = useState({
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navText3: "Administrator",
    navbarIcon: "/logo.png",
  });

  // Identifikasi apakah sedang di halaman Login atau Register
  const isAuthPage = pathname === "/Login" || pathname === "/Register";

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const res = await fetch("http://bpn.kadastrium.id/api/hero-display", { cache: 'no-store' });
        const data = await res.json();
        setNavData({
          navText1: data.navText1 || "KANTAH Gowa",
          navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
          navText3: data.navText3 || "Administrator",
          navbarIcon: data.navbarIcon || "/logo.png",
        });
      } catch (error) {
        console.error("Gagal mengambil navbar data:", error);
      }
    };

    fetchNavbarData();
    window.addEventListener("heroUpdated", fetchNavbarData);
    return () => window.removeEventListener("heroUpdated", fetchNavbarData);
  }, []);

  // Menutup menu mobile saat pindah halaman
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-6 md:px-8 z-50 shadow-md relative">
      
      {/* BAGIAN KIRI: LOGO & JUDUL */}
      <div className="flex items-center gap-3 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <img src={navData.navbarIcon} alt="Logo" className="h-10 w-auto" />
        <div className="flex flex-col">
          <h1 className="font-bold text-sm md:text-lg leading-none">{navData.navText1}</h1>
          <p className="text-[9px] md:text-[10px] opacity-70">{navData.navText2}</p>
        </div>
      </div>

      {/* BAGIAN KANAN: TOMBOL NAVIGASI (Desktop & Mobile Overlay) */}
      <div className={`
        fixed lg:static top-20 left-0 w-full lg:w-auto bg-[#1a1a1a] lg:bg-transparent
        flex flex-col lg:flex-row items-center gap-4 p-6 lg:p-0
        transition-all duration-300 ease-in-out border-t border-white/10 lg:border-none
        ${isMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible lg:visible lg:translate-y-0 lg:opacity-100"}
      `}>
        
        {/* Tombol Beranda: Hanya muncul di halaman Login & Register */}
        {isAuthPage && (
          <Link 
            href="/" 
            className="w-full lg:w-auto px-4 py-1.5 text-gray-300 text-sm font-bold hover:text-white transition flex items-center justify-center gap-1"
          >
            <Home size={16} /> 
            Beranda
          </Link>
        )}

        {/* Tombol Login: Muncul jika BUKAN di halaman Login */}
        {pathname !== "/Login" && (
          <Link 
            href="/Login" 
            className="w-full lg:w-auto text-center px-6 py-1.5 border border-green-500 text-green-500 rounded-full text-sm font-bold hover:bg-green-500 hover:text-white transition"
          >
            Login
          </Link>
        )}

        {/* Tombol Daftar Akun: Muncul jika BUKAN di halaman Register */}
        {pathname !== "/Register" && (
          <Link 
            href="/Register" 
            className="w-full lg:w-auto text-center px-6 py-1.5 bg-[#8b5e3c] text-white rounded-full text-sm font-bold hover:bg-[#724d31] transition"
          >
            Daftar Akun
          </Link>
        )}
      </div>

    </header>
  );
}