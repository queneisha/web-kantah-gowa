"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck,
  Info
} from "lucide-react";

export default function PengaturanPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden text-left">
      {/* NAVBAR - Identik dengan sebelumnya */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <div className="text-left">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - Admin</h1>
            <p className="text-[10px] opacity-70">Sistem Manajemen Internal</p>
          </div>
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR - Identik dengan sebelumnya */}
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl">
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link href="/AdminDashboard"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition font-bold text-left"><LayoutDashboard size={22} /> Beranda</button></Link>
            <Link href="/AdminDashboard/DataUser"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition font-bold text-left"><Users size={22} /> Data User</button></Link>
            <Link href="/AdminDashboard/DataPermohonan"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition font-bold text-left"><FileText size={22} /> Data Permohonan</button></Link>
            <Link href="/AdminDashboard/Pengaturan"><button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold shadow-lg text-left"><Settings size={22} /> Pengaturan</button></Link>
            <div className="pt-4 border-t border-white/20 mt-4">
              <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl transition font-bold text-left"><LogOut size={22} /> Keluar</button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT - Sesuai gambar pengatyr.png */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10">
            <div className="max-w-[1400px] mx-auto">
              <h3 className="text-3xl font-black text-gray-900">Pengaturan</h3>
              <p className="text-gray-500 font-medium mb-8">Informasi sistem dan konfigurasi</p>

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
                        <li>PII & Data Sensitif: Sistem ini dirancang untuk keamanan data pertanahan yang sesungguhnya, gunakan infrastruktur backend yang aman dan terenkripsi.</li>
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
                        <p className="text-[11px] uppercase font-bold opacity-50 tracking-widest mb-1">Nama Sistem</p>
                        <p className="font-bold text-sm">KANTAH Gowa Information System</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-bold opacity-50 tracking-widest mb-1">Framework</p>
                        <p className="font-bold text-sm">React + TypeScript</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-bold opacity-50 tracking-widest mb-1">Storage</p>
                        <p className="font-bold text-sm">Browser LocalStorage</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-bold opacity-50 tracking-widest mb-1">Versi</p>
                        <p className="font-bold text-sm">1.0.0 (Demo)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER - Identik dengan sebelumnya */}
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 uppercase tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
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