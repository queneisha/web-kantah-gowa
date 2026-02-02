"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Settings,
  ChevronDown
} from "lucide-react";

export default function RiwayatPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // State untuk Dropdown Custom
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const daftarBulan = ["Semua", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [riwayatData, setRiwayatData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch riwayat permohonan
  const fetchRiwayatPermohonan = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch('http://localhost:8000/api/all-permohonan', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const data = await response.json();
        const finished = data.filter((item: any) => 
          item.status === "Disetujui" || item.status === "Ditolak"
        );
        setRiwayatData(finished);
      }
    } catch (error) {
      console.error('Gagal fetch riwayat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) setIsSidebarOpen(JSON.parse(saved));
    fetchRiwayatPermohonan();
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  const parseDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const getMonthName = (monthNum: string) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const num = parseInt(monthNum);
    return months[num - 1] || "N/A";
  };

  const displayData = riwayatData.map((item: any) => ({
    nama: item.nama || "N/A",
    email: item.email || "N/A",
    tglDaftar: parseDate(item.tgl),
    bulan: item.tgl ? getMonthName(item.tgl.split('-')[1]) : "N/A",
    jenisPendaftaran: item.jenis || "N/A",
    keteranganLainnya: item.jenis_lainnya || "-",
    jenisHak: item.hak || "N/A",
    noSertifikat: item.noSertifikat || "N/A",
    lokasi: item.lokasi || "N/A",
    subLokasi: item.kecamatan || "N/A",
    catatan: item.catatan || "-",
    status: item.status || "N/A"
  }));

  const filteredData = displayData.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.noSertifikat.includes(searchTerm);
    const matchesBulan = filterBulan === "Semua" || item.bulan === filterBulan;
    return matchesSearch && matchesBulan;
  });

  if (!mounted) return null;

  const handleLogout = async () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("sidebarStatus");
    router.push("/");
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap ${active ? "bg-[#56b35a] text-white shadow-lg" : "text-white hover:bg-white/10"} ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
        <Icon size={22} className="shrink-0" /> 
        {isSidebarOpen && <span>{label}</span>}
      </button>
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
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

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative">
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

              {/* SEARCH & FILTER AREA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                  <input type="text" placeholder="Cari berdasarkan nama pemohon atau nomor sertifikat..." className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-100 shadow-sm focus:border-[#56b35a] rounded-2xl outline-none font-semibold transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X size={20} /></button>}
                </div>

                {/* CUSTOM DROPDOWN DENGAN SELEKSI MELENGKUNG */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between pl-12 pr-5 py-4 text-gray-700 bg-white border-2 border-gray-400 shadow-md rounded-[20px] font-bold outline-none focus:border-[#56b35a] transition relative"
                  >
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                    <span className="truncate">{filterBulan === "Semua" ? "Semua Bulan" : `${filterBulan} 2026`}</span>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                      
                      <div className="absolute top-[110%] left-0 w-full bg-white border-2 border-gray-100 shadow-2xl rounded-[30px] z-50 animate-in fade-in zoom-in duration-200 p-2">
                        <div className="max-h-[280px] overflow-y-auto py-1 custom-scrollbar pr-1">
                          {daftarBulan.map((bulan) => (
                            <button
                              key={bulan}
                              onClick={() => {
                                setFilterBulan(bulan);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3 font-bold transition-all mb-1 last:mb-0
                                ${filterBulan === bulan 
                                  ? "bg-[#56b35a] text-white rounded-[20px] shadow-sm" 
                                  : "text-gray-700 hover:bg-gray-100 rounded-[20px]"}`}
                            >
                              {bulan === "Semua" ? "Semua Bulan" : `${bulan} 2026`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
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
                        <th className="py-6 px-6 font-bold">Keterangan Lainnya</th>
                        <th className="py-6 px-6 font-bold">Jenis Hak</th>
                        <th className="py-6 px-6 font-bold">No. Sertifikat</th>
                        <th className="py-6 px-6 font-bold">Lokasi</th>
                        <th className="py-6 px-6 font-bold">Catatan</th>
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
                            <td className="py-6 px-6 font-medium text-gray-600 text-sm">{row.keteranganLainnya}</td>
                            <td className="py-6 px-6 font-medium text-gray-600">{row.jenisHak}</td>
                            <td className="py-6 px-6 font-medium text-gray-600 tracking-wider">{row.noSertifikat}</td>
                            <td className="py-6 px-6">
                              <div className="font-bold text-gray-800">{row.lokasi}</div>
                              <div className="text-xs text-gray-500">{row.subLokasi}</div>
                            </td>
                            <td className="py-6 px-6 font-medium text-gray-600 text-sm">{row.catatan}</td>
                            <td className="py-6 px-6 text-center">
                              <span className={`inline-block px-4 py-1 rounded-full border-2 font-bold text-[11px] min-w-[90px] ${row.status === "Disetujui" ? "border-green-500 text-green-600" : "border-red-400 text-red-500"}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={9} className="py-20 text-center text-gray-400 font-bold text-lg">Data tidak ditemukan...</td></tr>
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

      {/* MODAL EXPORT & MODAL KELUAR (Tetap Sama) */}
      {/* ... bagian modal anda tetap aman di sini ... */}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}