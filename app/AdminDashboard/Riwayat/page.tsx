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
  
  // State untuk Dropdown Bulan (Visual di Tabel)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const daftarBulan = ["Semua", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [riwayatData, setRiwayatData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // State Baru untuk Filter Export Tanggal
  const [tanggalDari, setTanggalDari] = useState("");
  const [tanggalSampai, setTanggalSampai] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
  });

  // Fetch Data Riwayat
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
      if (response.status === 401 || response.status === 403) {
        setNotification({ 
          type: 'error', 
          message: 'Sesi berakhir atau tidak memiliki akses. Silakan login ulang.' 
        });
        
        try {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } catch (e) {
          // ignore
        }
      
        setTimeout(() => {
          if (typeof window !== 'undefined') window.location.href = '/Login';
        }, 1200);
        
        return;
      }

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
    
    // Fetch Navbar & Footer Data
    const fetchSettings = async () => {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token'): null;
      try {
        const res = await fetch("http://localhost:8000/api/hero-display" , {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}) 
          }
        });
        const data = await res.json();
        if (res.ok) {
          setNavData({
            navText1: data.navText1 || "KANTAH Gowa",
            navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
            navbarIcon: data.navbarIcon || "/logo.png",
          });
          setKonten({
            footerText1: data.footerText1 || "© 2026 Kantor Pertanahan Kabupaten Gowa.",
            footerText2: data.footerText2 || "Sistem Informasi Internal"
          });
        }
      } catch (e) { console.error(e); }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen, mounted]);

  // Helper Functions
  const parseDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      }
      return dateStr;
    } catch (e) { return dateStr; }
  };

  const getMonthName = (monthNum: string) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[parseInt(monthNum) - 1] || "N/A";
  };

  // Logika Export dengan Filter Tanggal
  const handleExport = async () => {
    if (!tanggalDari || !tanggalSampai) {
      alert("Harap pilih rentang tanggal ekspor.");
      return;
    }

    try {
      setIsExporting(true);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      
      const response = await fetch(
        `http://localhost:8000/api/export-permohonan?tanggal_dari=${tanggalDari}&tanggal_sampai=${tanggalSampai}`, 
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ...(token ? { Authorization: `Bearer ${token}`} : {})
          }
        }
      );

      if (response.status === 401 || response.status === 403) {
        setNotification({ 
          type: 'error', 
          message: 'Sesi berakhir atau tidak memiliki akses. Silakan login ulang.' 
        });
        
        try {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } catch (e) {
          // ignore
        }
      
        setTimeout(() => {
          if (typeof window !== 'undefined') window.location.href = '/Login';
        }, 1200);
        
        return;
      }
      
      if (!response.ok) throw new Error("Gagal mengunduh file.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Permohonan_${tanggalDari}_sd_${tanggalSampai}.xls`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsExportModalOpen(false);
    } catch (error){
      console.error("Export error:", error);
      alert("Terjadi kesalahan saat mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("sidebarStatus");
    router.push("/");
  };

  // Filter Data untuk Tampilan Tabel
  const displayData = riwayatData.map((item: any) => ({
    ...item,
    tglDaftar: parseDate(item.tgl),
    bulanLabel: item.tgl ? getMonthName(item.tgl.split('-')[1]) : "N/A"
  }));

  const filteredData = displayData.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.noSertifikat.includes(searchTerm);
    const matchesBulan = filterBulan === "Semua" || item.bulanLabel === filterBulan;
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
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3 ml-8">
            <img src={navData.navbarIcon} alt="Logo" className="h-10 w-auto" />
            <div className="flex flex-col">
              <h1 className="font-bold text-lg leading-none">{navData.navText1} - Admin</h1>
              <p className="text-[10px] opacity-70">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white transition-all duration-300 shadow-xl z-20`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" active={true} />
            <div className="pt-4 border-t border-white/20">
              <button onClick={() => setIsLogoutModalOpen(true)} className={`flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold ${isSidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
                <LogOut size={22} /> {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-10">
        {notification && (
        <div className={`fixed top-5 right-5 z-[200] px-6 py-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
          <div className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-end mb-8 pb-4 border-b-2 border-gray-200">
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

            {/* SEARCH & DROPDOWN FILTER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau nomor sertifikat..." 
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#56b35a] outline-none font-semibold transition shadow-sm"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between pl-12 pr-5 py-4 bg-white border-2 border-gray-400 rounded-[20px] font-bold shadow-md"
                >
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                  <span>{filterBulan === "Semua" ? "Semua Bulan" : `${filterBulan} 2026`}</span>
                  <ChevronDown size={20} className={isDropdownOpen ? 'rotate-180' : ''} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-[110%] left-0 w-full bg-white border-2 border-gray-100 shadow-2xl rounded-[30px] z-50 p-2">
                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                      {daftarBulan.map((bulan) => (
                        <button
                          key={bulan}
                          onClick={() => { setFilterBulan(bulan); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-5 py-3 font-bold mb-1 rounded-[20px] ${filterBulan === bulan ? "bg-[#56b35a] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                          {bulan === "Semua" ? "Semua Bulan" : `${bulan} 2026`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TABEL */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-900 border-b text-left">
                      <th className="py-6 px-6 font-bold">Nama Notaris/PPAT</th>
                      <th className="py-6 px-6 font-bold">Tgl Daftar</th>
                      <th className="py-6 px-6 font-bold">Jenis Pendaftaran</th>
                      <th className="py-6 px-6 font-bold">No. Sertifikat</th>
                      <th className="py-6 px-6 font-bold">Lokasi</th>
                      <th className="py-6 px-6 text-center font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.length > 0 ? (
                      filteredData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-6 px-6">
                            <div className="font-bold text-gray-800">{row.nama}</div>
                            <div className="text-xs text-gray-500">{row.email}</div>
                          </td>
                          <td className="py-6 px-6 font-medium text-gray-600">{row.tglDaftar}</td>
                          <td className="py-6 px-6 font-medium text-gray-600">{row.jenis}</td>
                          <td className="py-6 px-6 font-mono text-gray-800">{row.noSertifikat}</td>
                          <td className="py-6 px-6">
                            <div className="font-bold text-gray-800">{row.lokasi}</div>
                            <div className="text-xs text-gray-500">{row.kecamatan}</div>
                          </td>
                          <td className="py-6 px-6 text-center">
                            <span className={`px-4 py-1 rounded-full border-2 font-bold text-[11px] ${row.status === "Disetujui" ? "border-green-500 text-green-600" : "border-red-400 text-red-500"}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="py-20 text-center text-gray-400 font-bold">Data tidak ditemukan...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
          
        </main>
        
      </div>

      {/* MODAL EXPORT LAPORAN DENGAN FILTER TANGGAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Tanggal Export</h3>
                <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">Dari Tanggal</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="date" value={tanggalDari} onChange={(e) => setTanggalDari(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#56b35a] rounded-2xl outline-none font-bold text-gray-700 transition" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">Sampai Tanggal</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="date" value={tanggalSampai} onChange={(e) => setTanggalSampai(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#56b35a] rounded-2xl outline-none font-bold text-gray-700 transition" />
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={!tanggalDari || !tanggalSampai || isExporting}
                  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 mt-4
                    ${!tanggalDari || !tanggalSampai || isExporting ? "bg-gray-300 text-gray-500" : "bg-[#56b35a] hover:bg-[#469e4a] text-white"}`}
                >
                  <FileSpreadsheet size={20} />
                  {isExporting ? "Mengunduh..." : "DOWNLOAD EXCEL (.xls)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Yakin ingin keluar?</h3>
            <p className="text-gray-500 mb-8 font-medium">Anda perlu login kembali untuk mengakses panel admin.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-6 py-2 border-2 rounded-full font-bold">Batal</button>
              <button onClick={handleLogout} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-200">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}