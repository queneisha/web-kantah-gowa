"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  ChevronDown
} from "lucide-react";

export default function RiwayatPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dataRiwayat = [
    { tgl: "11 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "32143", lokasi: "Somba Opu", desa: "Barombong", status: "Disetujui", catatan: "Verifikasi selesai. Permohonan disetujui." },
    { tgl: "11 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "32143", lokasi: "Somba Opu", desa: "Barombong", status: "Disetujui", catatan: "Verifikasi selesai. Permohonan disetujui." },
    { tgl: "11 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "32143", lokasi: "Somba Opu", desa: "Barombong", status: "Disetujui", catatan: "Verifikasi selesai. Permohonan disetujui." },
    { tgl: "12 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "65487", lokasi: "Palangga", desa: "Baringkanaya", status: "Ditolak", catatan: "Data sertifikat tidak sesuai dengan sistem." },
    { tgl: "12 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "65487", lokasi: "Palangga", desa: "Baringkanaya", status: "Ditolak", catatan: "Data sertifikat tidak sesuai dengan sistem." },
    { tgl: "12 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "65487", lokasi: "Palangga", desa: "Baringkanaya", status: "Ditolak", catatan: "Data sertifikat tidak sesuai dengan sistem." },
    { tgl: "13 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "54326", lokasi: "Katangka", desa: "Jeneberang", status: "Diproses", catatan: "Sedang dilakukan pengecekan kelengkapan administrasi." },
    { tgl: "13 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "54326", lokasi: "Katangka", desa: "Jeneberang", status: "Diproses", catatan: "Sedang dilakukan pengecekan kelengkapan administrasi." },
    { tgl: "13 Januari 2026", jenis: "SKPT", hak: "Hak Milik", no: "54326", lokasi: "Katangka", desa: "Jeneberang", status: "Diproses", catatan: "Sedang dilakukan pengecekan kelengkapan administrasi." },
    { tgl: "14 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "24556", lokasi: "Sepakat", desa: "Andi Tonro", status: "Menunggu", catatan: "-" },
    { tgl: "14 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "24556", lokasi: "Sepakat", desa: "Andi Tonro", status: "Menunggu", catatan: "-" },
    { tgl: "14 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", no: "24556", lokasi: "Sepakat", desa: "Andi Tonro", status: "Menunggu", catatan: "-" },
  ];

  // LOGIKA FILTER: Menyaring data tabel berdasarkan pilihan dropdown
  const dataTerfilter = dataRiwayat.filter((item) => {
    if (filterStatus === "Semua Status") return true;
    if (filterStatus === "Proses") return item.status === "Diproses"; // Menyesuaikan teks dropdown dan data
    return item.status === filterStatus;
  });

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
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
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold">
                <LayoutDashboard size={22} /> Beranda
              </button>
            </Link>
            <Link href="/UserDashboard/Permohonan">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold">
                <FileEdit size={22} /> Permohonan
              </button>
            </Link>
            <Link href="/UserDashboard/Riwayat">
              <button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold shadow-lg text-left transition">
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
            <div className="max-w-[1400px] mx-auto">
              
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Riwayat Permohonan</h3>
                <p className="text-gray-500 font-medium text-sm">Data historis seluruh permohonan Anda</p>
                <hr className="mt-5 border-gray-200" />
              </div>

              <div className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#7c4d2d] p-4 px-8 flex justify-between items-center text-white">
                  <span className="font-bold text-lg">Daftar Permohonan</span>
                  
                  {/* Dropdown Filter */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center justify-between gap-3 min-w-[140px] px-4 py-1.5 bg-[#f5f5f5] rounded-full text-[#4a4a4a] transition-all hover:bg-white shadow-inner"
                    >
                      <span className="text-xs font-bold">{filterStatus}</span>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-[20px] shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in duration-200">
                        {["Semua Status", "Proses", "Disetujui", "Ditolak", "Menunggu"].map((status) => (
                          <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                            className={`w-full text-center py-2 px-4 my-0.5 rounded-full text-xs font-bold transition-all
                              ${filterStatus === status 
                                ? "bg-[#2b6be6] text-white shadow-md" 
                                : "bg-[#f0f0f0] text-gray-700 hover:bg-gray-200"}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-[11px] font-bold text-gray-400">Tgl Daftar</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400">Jenis Pendaftaran</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400">Jenis Hak</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400">No. Sertipikat</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400">Lokasi</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 text-center">Status</th>
                        <th className="px-8 py-4 text-[11px] font-bold text-gray-400">Catatan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataTerfilter.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-gray-500">{item.tgl}</td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800">{item.jenis}</td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-600">{item.hak}</td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800">{item.no}</td>
                          <td className="px-6 py-5">
                             <div className="text-sm font-semibold text-gray-800">{item.lokasi}</div>
                             <div className="text-[10px] text-gray-400 font-semibold">{item.desa}</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold inline-block min-w-[90px] text-center
                              ${item.status === "Disetujui" ? "border-green-500 text-green-500 bg-green-50" : 
                                item.status === "Ditolak" ? "border-red-500 text-red-500 bg-red-50" : 
                                item.status === "Diproses" ? "border-blue-500 text-blue-500 bg-blue-50" : 
                                "border-orange-500 text-orange-500 bg-orange-50"}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs text-gray-500 italic">{item.catatan}</td>
                        </tr>
                      ))}
                      {dataTerfilter.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-20 text-center text-gray-400 font-bold italic">
                            Tidak ada data dengan status "{filterStatus}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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