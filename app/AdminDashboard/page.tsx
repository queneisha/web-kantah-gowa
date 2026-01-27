"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  UserCheck, 
  Clock, 
  Edit,
  Menu, 
  FileSpreadsheet
} from "lucide-react";

export default function AdminDashboard() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 1. Efek untuk menangani mounting dan membaca localStorage (Cegah Hydration Error)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  // 2. Simpan status sidebar setiap kali berubah
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
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <Icon size={22} className="shrink-0" /> 
        {isSidebarOpen && <span>{label}</span>}
      </button>

      {/* TOOLTIP: Muncul saat sidebar tertutup */}
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  // Jangan render apapun sebelum mounted untuk menghindari mismatch HTML server vs client
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
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" active={true} />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />

            {/* Tombol Keluar */}
            <div className="pt-4 mt-4 border-t border-white/20">
               <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
               >
                <LogOut size={22} className="shrink-0 text-white" /> 
                {isSidebarOpen && <span className="text-white">Keluar</span>}
                
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

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10 space-y-10 max-w-7xl mx-auto w-full">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-3xl font-black text-gray-900">Beranda</h3>
              <p className="text-gray-500 font-medium">Selamat datang di Panel Administrasi KANTAH Gowa</p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total User Terdaftar" value="2" sub="Notaris & PPAT" color="border-black" textColor="text-black" icon={<Users className="text-black" />} />
              <StatCard label="User Menunggu ACC" value="1" sub="Perlu Verifikasi" color="border-orange-500" textColor="text-orange-500" icon={<UserCheck className="text-orange-500" />} />
              <StatCard label="Total Permohonan" value="4" sub="Semua Permohonan" color="border-green-500" textColor="text-green-500" icon={<FileText className="text-green-500" />} />
              <StatCard label="Permohonan Masuk" value="1" sub="Menunggu Verifikasi" color="border-blue-500" textColor="text-blue-500" icon={<Clock className="text-blue-500" />} />
            </div>

            {/* TABLES SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#8b5e3c] rounded-[30px] overflow-hidden shadow-lg border-2 border-[#7c4d2d]">
                <div className="p-4 px-8 text-white font-bold text-lg">User Terbaru</div>
                <div className="bg-white p-6 space-y-4">
                  <TableRow name="Nabila Humairah AR" role="PPAT" status="Aktif" statusColor="bg-green-100 text-green-600 border-green-500" />
                  <TableRow name="Niki Renaningtyas" role="Notaris" status="Aktif" statusColor="bg-green-100 text-green-600 border-green-500" />
                  <TableRow name="Nurul Karimah" role="Notaris" status="Menunggu" statusColor="bg-orange-100 text-orange-600 border-orange-500" />
                </div>
              </div>

              <div className="bg-[#8b5e3c] rounded-[30px] overflow-hidden shadow-lg border-2 border-[#7c4d2d]">
                <div className="p-4 px-8 text-white font-bold text-lg">Permohonan Terbaru</div>
                <div className="bg-white p-6 space-y-4">
                  <TableRow name="Nabila Humairah AR" role="PENGECEKAN" status="Disetujui" statusColor="bg-green-100 text-green-600 border-green-500" />
                  <TableRow name="Niki Renaningtyas" role="SKPT" status="Ditolak" statusColor="bg-red-100 text-red-600 border-red-500" />
                  <TableRow name="Nabila Humairah AR" role="SKPT" status="Diproses" statusColor="bg-blue-100 text-blue-600 border-blue-500" />
                  <TableRow name="Nabila Humairah AR" role="PENGECEKAN" status="Menunggu" statusColor="bg-orange-100 text-orange-600 border-orange-500" />
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* MODAL POP UP KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <Link href="/"><button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold shadow-lg">Ya, Keluar</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Pendukung
function StatCard({ label, value, sub, color, icon, textColor }: any) {
  return (
    <div className={`bg-white p-6 rounded-[25px] border-2 ${color} shadow-sm transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400">{label}</p>
          <h4 className={`text-5xl font-black ${textColor}`}>{value}</h4>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl">{icon}</div>
      </div>
      <p className="text-xs font-bold text-gray-400 mt-6">{sub}</p>
    </div>
  );
}

function TableRow({ name, role, status, statusColor }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div className="flex flex-col text-left">
        <span className="font-bold text-sm text-gray-800">{name}</span>
        <span className="text-[10px] font-bold text-gray-400 tracking-tighter">{role}</span>
      </div>
      <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}