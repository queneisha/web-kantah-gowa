"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function UserDashboardPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const stats = [
    { 
      label: "Total Permohonan", 
      value: 0, 
      icon: <FileText size={24} className="text-black" />, 
      borderColor: "border-black",
      textColor: "text-black" 
    },
    { 
      label: "Disetujui", 
      value: 0, 
      icon: <CheckCircle size={24} className="text-green-500" />, 
      borderColor: "border-green-500",
      textColor: "text-green-500" 
    },
    { 
      label: "Diproses", 
      value: 0, 
      icon: <Clock size={24} className="text-orange-500" />, 
      borderColor: "border-orange-500",
      textColor: "text-orange-500" 
    },
    { 
      label: "Ditolak", 
      value: 0, 
      icon: <XCircle size={24} className="text-red-500" />, 
      borderColor: "border-red-500",
      textColor: "text-red-500" 
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      {/* --- HEADER (Navbar) --- */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <div className="text-left">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - User</h1>
            <p className="text-[10px] opacity-70">Sistem Informasi Internal Notaris & PPAT</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold tracking-tight">Nurul Karimah</h2>
          <p className="text-[10px] opacity-70">nkarimah421@gmail.com</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl">
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link href="/UserDashboard">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold shadow-lg text-left transition">
                <LayoutDashboard size={22} /> Beranda
              </button>
            </Link>
            <Link href="/UserDashboard/Permohonan">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold">
                <FileEdit size={22} /> Permohonan
              </button>
            </Link>
            <Link href="/UserDashboard/Riwayat">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold">
                <History size={22} /> Riwayat
              </button>
            </Link>
            <Link href="/UserDashboard/Notifikasi">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold">
                <Bell size={22} /> Notifikasi
              </button>
            </Link>
            
            <div className="pt-4 border-t border-white/20 mt-4">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl transition text-left font-bold"
              >
                <LogOut size={22} /> Keluar
              </button>
            </div>
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-10 flex-1">
            <div className="max-w-[1400px] mx-auto text-left">
              {/* HEADER SECTION DENGAN GARIS HORIZONTAL */}
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Beranda</h3>
                <p className="text-gray-500 font-medium">Selamat datang, Nurul Karimah</p>
                {/* Garis horizontal persis dashboard admin */}
                <hr className="mt-5 border-gray-200" />
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className={`bg-white p-7 rounded-[25px] shadow-sm border-2 ${stat.borderColor} flex justify-between items-start transition-transform hover:scale-[1.02]`}>
                    <div>
                     <p className="text-gray-400 text-[13px] font-bold mb-1 tracking-tight ">
          {stat.label}
        </p>
        <h4 className={`text-6xl font-black ${stat.textColor}`}>{stat.value}</h4>
                    </div>
                    <div className="mt-1">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACCOUNT INFO CARD */}
              <div className="max-w-2xl bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-8 text-white">
                  <span className="font-bold text-lg">Informasi Akun</span>
                </div>
                <div className="p-8 grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm text-gray-400 font-bold tracking-tight ">Nama Lengkap</p>
                    <p className="font-semibold text-gray-800 text-lg">Nurul Karimah</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold tracking-tight ">Email</p>
                    <p className="font-semibold text-gray-800 text-lg">nkarimah421@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold tracking-tight ">Jabatan</p>
                    <p className="font-semibold text-gray-800 text-lg">Notaris</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold tracking-tight ">No HP.</p>
                    <p className="font-semibold text-gray-800 text-lg">081341062046</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold mb-2 tracking-tight ">Status</p>
                    <span className="px-5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full ">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
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
                Anda akan keluar dari user panel. Anda perlu login kembali untuk mengakses sistem.
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