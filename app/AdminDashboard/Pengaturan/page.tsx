"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck,
  Info,
  Edit,
  Menu,
  FileSpreadsheet
} from "lucide-react";

export default function PengaturanPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 1. Sinkronisasi Sidebar dengan localStorage (Memory Sidebar)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  // 2. Simpan status sidebar saat di-toggle
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  // Helper untuk Sidebar Item
  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button 
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg" : "hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <Icon size={22} className="shrink-0" /> 
        {isSidebarOpen && <span>{label}</span>}
      </button>

      {/* TOOLTIP: Sejajar sempurna dengan ikon */}
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  // Mencegah Hydration Mismatch
  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR HITAM */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center">
          <div className="w-12 flex justify-start items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto shrink-0" />
            <div className="flex flex-col min-w-max">
              <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - Admin</h1>
              <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
            </div>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR COKELAT */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" active={true} />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />

            {/* Tombol Keluar */}
            <div className="pt-4 mt-4 border-t border-white/20">
               <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
               >
                <LogOut size={22} className="shrink-0" /> 
                {isSidebarOpen && <span>Keluar</span>}
                
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl top-1/2 -translate-y-1/2 whitespace-nowrap">
                    Keluar
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                  </div>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-3xl font-black text-gray-900">Pengaturan</h3>
              <p className="border-b-2 border-gray-200 pb-4 text-gray-500 font-medium mb-8">Informasi sistem dan konfigurasi</p>

              <div className="space-y-6">
                {/* Section Keamanan & Privasi */}
                <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                  <div className="bg-[#8b5e3c] p-4 px-10 flex items-center gap-3 text-white">
                    <ShieldCheck size={24} />
                    <span className="font-bold text-lg">Keamanan & Privasi</span>
                  </div>
                  <div className="p-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-[25px] p-8 text-blue-900">
                      <div className="flex items-center gap-2 mb-4 font-bold">
                        <Info size={18} />
                        <span>Penting untuk Produksi</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-2 text-[13px] font-medium leading-relaxed opacity-80">
                        <li>Satu Email = Satu Akun: Sistem sudah mencegah duplikasi email.</li>
                        <li>Isolasi Data User: Setiap user hanya bisa melihat data mereka sendiri.</li>
                        <li>Password Hashing: Untuk produksi, password harus di-hash menggunakan bcrypt atau argon2.</li>
                        <li>HTTPS: Pastikan menggunakan HTTPS untuk enkripsi data saat transmisi.</li>
                        <li>PII & Data Sensitif: Sistem ini dirancang untuk keamanan data pertanahan yang sesungguhnya.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Section Informasi Sistem */}
                <div className="bg-[#8b5e3c] rounded-[35px] shadow-xl overflow-hidden text-white">
                  <div className="p-8 px-10">
                    <h4 className="text-xl font-bold mb-1">Informasi Sistem</h4>
                    <p className="text-[12px] opacity-70 mb-8">Detail versi dan konfigurasi</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                      <div>
                        <p className="text-[11px] font-bold opacity-50 tracking-widest mb-1">Nama Sistem</p>
                        <p className="font-bold text-sm">KANTAH Gowa Information System</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold opacity-50 tracking-widest mb-1">Framework</p>
                        <p className="font-bold text-sm">React + TypeScript</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold opacity-50 tracking-widest mb-1">Storage</p>
                        <p className="font-bold text-sm">Browser LocalStorage</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold opacity-50 tracking-widest mb-1">Versi</p>
                        <p className="font-bold text-sm">1.0.0 (Demo)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* MODAL POP UP KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Anda akan keluar dari admin panel. Anda perlu login kembali untuk mengakses sistem.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-8 py-2.5 rounded-full border-2 border-gray-600 text-gray-600 font-bold hover:bg-gray-50 transition"
              >
                Batal
              </button>

              <Link href="/">
                <button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                  Ya, Keluar
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}