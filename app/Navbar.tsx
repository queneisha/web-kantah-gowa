"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [navData, setNavData] = useState({
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navText3: "Administrator",
    navbarIcon: "/logo.png",
  });

  // Fetch navbar data dari backend
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display");
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
    
    // Listen untuk event update dari admin dashboard
    window.addEventListener("heroUpdated", fetchNavbarData);

    return () => {
      window.removeEventListener("heroUpdated", fetchNavbarData);
    };
  }, []);

  return (
    <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
      <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden">
            <Menu size={24} />
          </button>
          <img src={navData.navbarIcon} alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none">{navData.navText1}</h1>
            <p className="text-[10px] opacity-70">{navData.navText2}</p>
            <p className="text-[9px] opacity-60">{navData.navText3}</p>
          </div>
        </div>

      <div className="flex gap-4">
        {/* Hubungkan ke /login */}
        <Link href="/Login" className="px-6 py-1.5 border border-green-500 text-green-500 rounded-full text-sm font-bold hover:bg-green-500 hover:text-white transition">
          Login
        </Link>
        
        {/* Hubungkan ke /register */}
        <Link href="/Register" className="px-6 py-1.5 bg-[#8b5e3c] text-white rounded-full text-sm font-bold hover:bg-[#724d31] transition">
          Daftar Akun
        </Link>
      </div>
    </header>
  );
}