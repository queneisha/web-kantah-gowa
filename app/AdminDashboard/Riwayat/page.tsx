"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut,
  Edit,
  Menu,
  Search,
  Download,
  Calendar,
  X,
  FileSpreadsheet,
  Settings
} from "lucide-react";

export default function RiwayatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBulan, setFilterBulan] = useState("Semua");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) setIsSidebarOpen(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  const initialData = [
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", tglDaftar: "11 Januari 2026", bulan: "Januari", jenisPendaftaran: "Pengecekan", jenisHak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", subLokasi: "Barombong", status: "Disetujui" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tglDaftar: "12 Januari 2026", bulan: "Januari", jenisPendaftaran: "SKPT", jenisHak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", subLokasi: "Baringkanaya", status: "Ditolak" },
    { nama: "Rahmat Hidayat", email: "rahmat@gmail.com", tglDaftar: "05 Februari 2026", bulan: "Februari", jenisPendaftaran: "Peralihan", jenisHak: "Hak Milik", noSertifikat: "99211", lokasi: "Somba Opu", subLokasi: "Tompobulu", status: "Disetujui" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", tglDaftar: "11 Januari 2026", bulan: "Januari", jenisPendaftaran: "Pengecekan", jenisHak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", subLokasi: "Barombong", status: "Disetujui" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tglDaftar: "12 Januari 2026", bulan: "Januari", jenisPendaftaran: "SKPT", jenisHak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", subLokasi: "Baringkanaya", status: "Ditolak" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", tglDaftar: "11 Januari 2026", bulan: "Januari", jenisPendaftaran: "Pengecekan", jenisHak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", subLokasi: "Barombong", status: "Disetujui" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tglDaftar: "12 Januari 2026", bulan: "Januari", jenisPendaftaran: "SKPT", jenisHak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", subLokasi: "Baringkanaya", status: "Ditolak" },
    { nama: "Rahmat Hidayat", email: "rahmat@gmail.com", tglDaftar: "05 Februari 2026", bulan: "Februari", jenisPendaftaran: "Peralihan", jenisHak: "Hak Milik", noSertifikat: "99211", lokasi: "Somba Opu", subLokasi: "Tompobulu", status: "Disetujui" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", tglDaftar: "11 Januari 2026", bulan: "Januari", jenisPendaftaran: "Pengecekan", jenisHak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", subLokasi: "Barombong", status: "Disetujui" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tglDaftar: "12 Januari 2026", bulan: "Januari", jenisPendaftaran: "SKPT", jenisHak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", subLokasi: "Baringkanaya", status: "Ditolak" },
    { nama: "Rahmat Hidayat", email: "rahmat@gmail.com", tglDaftar: "05 Februari 2026", bulan: "Februari", jenisPendaftaran: "Peralihan", jenisHak: "Hak Milik", noSertifikat: "99211", lokasi: "Somba Opu", subLokasi: "Tompobulu", status: "Disetujui" },
    { nama: "Rahmat Hidayat", email: "rahmat@gmail.com", tglDaftar: "05 Februari 2026", bulan: "Februari", jenisPendaftaran: "Peralihan", jenisHak: "Hak Milik", noSertifikat: "99211", lokasi: "Somba Opu", subLokasi: "Tompobulu", status: "Disetujui" },
  ];

  const filteredData = initialData.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.noSertifikat.includes(searchTerm);
    const matchesBulan = filterBulan === "Semua" || item.bulan === filterBulan;
    return matchesSearch && matchesBulan;
  });

  if (!mounted) return null;

  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap ${active ? "bg-[#56b35a] text-white shadow-lg" : "text-white hover:bg-white/10"} ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
        <Icon size={22} className="shrink-0" /> 
        {isSidebarOpen && <span>{label}</span>}
      </button>
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center">
          <div className="w-12 flex justify-start items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" active={true} />

            <div className="pt-4 mt-4 border-t border-white/20">
               <button onClick={() => setIsLogoutModalOpen(true)} className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
                <LogOut size={22} className="shrink-0 text-white" /> 
                {isSidebarOpen && <span className="text-white">Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          {/* Konten Utama */}
          <div className="p-10 flex-1">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b-2 border-gray-200 gap-4">
      <div>
        <h2 className="text-3xl font-black text-gray-900">Riwayat Permohonan</h2>
        <p className="text-gray-500 font-medium">Menampilkan {filteredData.length} data laporan</p>
      </div>
      <button 
        onClick={() => setIsExportModalOpen(true)} 
        className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
      >
        <Download size={20} /> Export Laporan
      </button>
    </div>

              {/* SEARCH & FILTER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                  <input type="text" placeholder="Cari berdasarkan nama pemohon atau nomor sertifikat..." className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-100 shadow-sm focus:border-[#56b35a] rounded-2xl outline-none font-semibold transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X size={20} /></button>}
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                  <select className="w-full pl-12 pr-8 py-4 text-gray-700 bg-white border-2 border-gray-100 shadow-sm rounded-2xl font-bold appearance-none outline-none focus:border-[#56b35a] cursor-pointer" value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)}>
                    <option value="Semua">Semua Bulan</option>
                    <option value="Januari">Januari 2026</option>
                    <option value="Februari">Februari 2026</option>
                    <option value="Maret">Maret 2026</option>
                  </select>
                </div>
              </div>

              {/* TABEL */}
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-900 border-b border-gray-200 text-left">
                        <th className="py-6 px-6 font-bold">Nama Notaris/PPAT</th>
                        <th className="py-6 px-6 font-bold">Tgl Daftar</th>
                        <th className="py-6 px-6 font-bold">Jenis Pendaftaran</th>
                        <th className="py-6 px-6 font-bold">Jenis Hak</th>
                        <th className="py-6 px-6 font-bold">No. Sertifikat</th>
                        <th className="py-6 px-6 font-bold">Lokasi</th>
                        <th className="py-6 px-6 text-center font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData.length > 0 ? (
                        filteredData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-6 px-6">
                              <div className="font-bold text-gray-800">{row.nama}</div>
                              <div className="text-xs text-gray-500">{row.email}</div>
                            </td>
                            <td className="py-6 px-6 font-medium text-gray-600">{row.tglDaftar}</td>
                            <td className="py-6 px-6 font-medium text-gray-600">{row.jenisPendaftaran}</td>
                            <td className="py-6 px-6 font-medium text-gray-600">{row.jenisHak}</td>
                            <td className="py-6 px-6 font-medium text-gray-600 tracking-wider">{row.noSertifikat}</td>
                            <td className="py-6 px-6">
                              <div className="font-bold text-gray-800">{row.lokasi}</div>
                              <div className="text-xs text-gray-500">{row.subLokasi}</div>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span className={`inline-block px-4 py-1 rounded-full border-2 font-bold text-[11px] min-w-[90px] ${row.status === "Disetujui" ? "border-green-500 text-green-600" : "border-red-400 text-red-500"}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={7} className="py-20 text-center text-gray-400 font-bold text-lg">Data tidak ditemukan...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BARU (Di dalam Main agar ikut Scroll) */}
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {isExportModalOpen && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

          <div className="bg-white rounded rounded-2xl w-full  max-w-md shadow-2xl overflow-hidden">

            <div className="p-8">

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-xl font-bold text-gray-800">Filter Laporan</h3>

                <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">

                  <X size={24} />

                </button>

              </div>

              

              <div className="space-y-6">

                <div className="space-y-2">

                  <label className="text-xs font-bold text-gray-400">Dari Tanggal</label>

                  <div className="relative">

                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                    <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#56b35a] rounded-2xl outline-none font-bold text-gray-700 transition" />

                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Sampai Tanggal</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#56b35a] rounded-2xl outline-none font-bold text-gray-700 transition" />
                  </div>
                </div>
                <div className="pt-4">
                  <button className="w-full bg-[#56b35a] hover:bg-[#469e4a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-3">
                    <FileSpreadsheet size={20} /> DOWNLOAD EXCEL (.xlsx)
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 font-bold leading-relaxed">
                    Data yang diunduh hanya permohonan dengan<br/>status "Disetujui" atau "Ditolak"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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