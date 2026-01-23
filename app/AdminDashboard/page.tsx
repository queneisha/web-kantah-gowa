"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  UserCheck, 
  Clock 
} from "lucide-react";

export default function AdminDashboard() {
  // State untuk kontrol pop-up keluar
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR HITAM */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - Admin</h1>
            <p className="text-[10px] opacity-70">Sistem Manajemen Internal</p>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR COKELAT */}
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20">
          <nav className="flex-1 px-4 py-8 space-y-4">
            <Link href="/AdminDashboard">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold transition shadow-lg">
                <LayoutDashboard size={22} /> Beranda
              </button>
            </Link>

            <Link href="/AdminDashboard/DataUser">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left">
                <Users size={22} /> Data User
              </button>
            </Link>

            <Link href="/AdminDashboard/DataPermohonan">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left">
                <FileText size={22} /> Data Permohonan
              </button>
            </Link>
            
            <Link href="/AdminDashboard/Pengaturan">  
            <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left">
              <Settings size={22} /> Pengaturan
            </button>
            </Link>

            <div className="pt-4 mt-4 border-t border-white/20">
               <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl font-bold transition text-left"
               >
                <LogOut size={22} /> Keluar
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

            {/* KARTU STATISTIK - Warna angka diubah disini */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                label="Total User Terdaftar" 
                value="2" 
                sub="Notaris & PPAT" 
                color="border-black" 
                textColor="text-black" 
                icon={<Users className="text-black" />} 
              />
              <StatCard 
                label="User Menunggu ACC" 
                value="1" 
                sub="Perlu Verifikasi" 
                color="border-orange-500" 
                textColor="text-orange-500" 
                icon={<UserCheck className="text-orange-500" />} 
              />
              <StatCard 
                label="Total Permohonan" 
                value="4" 
                sub="Semua Permohonan" 
                color="border-green-500" 
                textColor="text-green-500" 
                icon={<FileText className="text-green-500" />} 
              />
              <StatCard 
                label="Permohonan Masuk" 
                value="1" 
                sub="Menunggu Verifikasi" 
                color="border-blue-500" 
                textColor="text-blue-500" 
                icon={<Clock className="text-blue-500" />} 
              />
            </div>

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

          {/* FOOTER HITAM */}
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
                className="px-8 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
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

// Sub-Component StatCard dengan textColor dinamis
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

// Sub-Component TableRow
function TableRow({ name, role, status, statusColor }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div className="flex flex-col">
        <span className="font-bold text-sm text-gray-800">{name}</span>
        <span className="text-[10px] font-bold text-gray-400 tracking-tighter">{role}</span>
      </div>
      <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}