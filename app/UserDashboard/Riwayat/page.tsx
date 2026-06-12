"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function RiwayatPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [riwayatData, setRiwayatData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // State untuk data tampilan dari API
  const [displayData, setDisplayData] = useState({
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon: "/logo.png",
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa.",
    footerText2: "Sistem Informasi Internal Notaris/PPAT/PPATS."
  });
  const unreadCount = notifications.filter(n => n.is_read === 0).length;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawUnreadCount = notifications.filter(n => n.is_read === 0).length;
const formatBadge = (count: number) => (count > 9 ? "9+" : count);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      fetchInitialData();
      fetchRiwayatPermohonan(user.id);
      fetchNotifikasi(user.id);
    } else {
      router.push('/Login');
    }

    // Klik di luar untuk menutup filter
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as any)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const fetchInitialData = async () => {
    try {
      const resHero = await fetch("http://bpn.kadastrium.id/api/hero-display");
      if (resHero.ok) {
        const data = await resHero.json();
        setDisplayData(prev => ({
          ...prev,
          navText1: data.navText1 || prev.navText1,
          navText2: data.navText2 || prev.navText2,
          navbarIcon: data.navbarIcon || prev.navbarIcon,
          footerText1: data.footerText1 || prev.footerText1,
          footerText2: data.footerText2 || prev.footerText2,
        }));
      }
    } catch (e) { 
      console.error("Error display data:", e); 
    }
  }; // <-- Tadi kurang tutup kurung ini

  const fetchNotifikasi = async (userId: string) => {
    try {
      const response = await fetch(`http://bpn.kadastrium.id/api/notifikasi/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) { 
      console.error("Error notif:", error); 
    }
  };

  const fetchRiwayatPermohonan = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://bpn.kadastrium.id/api/riwayat/${userId}`);
      if (response.ok) {
        const data = await response.json();
        
        console.log("Data mentah dari API:", data);
  
        const formattedData = data.map((item: any) => ({
          tgl: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          }) : '-',
          
          jenis: item.jenis_pendaftaran || '-', 
          
          // Jika user pilih 'Lainnya', teks keterangannya biasanya ada di field 'jenis_lainnya' 
          // (sesuai fungsi store Anda)
          jenis_lainnya: item.jenis_lainnya || null,
          
          hak: item.jenis_hak || '-',
          no: item.no_sertipikat || '-', 
          
          lokasi: item.desa || '-', 
          desa: item.kecamatan || '-', 
          
          status: item.status || 'Menunggu',
          
          // PERBAIKAN DI SINI: Sesuaikan dengan nama kolom di database/controller
          // Di Laravel Anda tadi menyimpannya di 'catatan_pendaftaran'
          catatan_admin: item.catatan_pendaftaran || "Tidak ada catatan"
        }));
        
        setRiwayatData(formattedData);
      }
    } catch (error) { 
      console.error("Error riwayat:", error); 
    } finally { 
      setIsLoading(false); 
    }
  };
  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/Login");
  };

  const dataTerfilter = riwayatData.filter((item) => {
    if (filterStatus === "Semua Status") return true;
   
    return item.status === filterStatus;
  });

  const SidebarItem = ({ href, icon: Icon, label, active = false, badgeCount = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        onClick={() => { if(window.innerWidth < 1024) setIsSidebarOpen(false) }}
        className={`flex items-center w-full py-3.5 transition-all duration-300 rounded-xl font-bold whitespace-nowrap
        ${active 
          ? "bg-[#56b35a] shadow-lg text-white" 
          : "text-white hover:bg-white/10 active:scale-95"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon 
            size={22} 
            className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "scale-110" : ""}`} 
          /> 
          
          {/* Badge saat Sidebar Menciut (Bulat kecil di pojok ikon) */}
          {!isSidebarOpen && badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white border-2 border-[#7c4d2d] animate-pulse font-bold">
              {formatBadge(badgeCount)}
            </span>
          )}
        </div>
  
        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full min-w-0">
            <span className="truncate">{label}</span>
            
            {/* Badge saat Sidebar Terbuka (Bulat merah di kanan teks) */}
            {badgeCount > 0 && (
              <span className="bg-red-600 text-white text-[11px] h-6 w-6 flex items-center justify-center rounded-full shadow-md font-semibold shrink-0 ml-2">
                {formatBadge(badgeCount)}
              </span>
            )}
          </div>
        )}
      </button>
    </Link>
  );

  if (!mounted || !userData) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      {/* HEADER */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-4 md:px-8 z-[40] shadow-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className={`flex items-center gap-2 md:gap-3 transition-opacity ${isSidebarOpen && "max-lg:opacity-0"}`}>
            <img src={displayData.navbarIcon} alt="Logo" className="h-8 md:h-10 w-auto" />
            <div className="flex flex-col">
              <h1 className="font-bold text-xs md:text-lg leading-none">{displayData.navText1}</h1>
              <p className="text-[8px] md:text-[10px] opacity-70">{displayData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold truncate max-w-[150px]">{userData?.nama_lengkap}</h2>
          <p className="text-[10px] opacity-70 truncate max-w-[150px]">{userData?.email}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-[50] ${isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out`}>
          <div className="lg:hidden flex items-center justify-between p-5 border-b border-white/10">
             <div className="flex items-center gap-2">
                <img src={displayData.navbarIcon} alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xs uppercase tracking-widest">Menu</span>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={24} /></button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" active={true} />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" badgeCount={rawUnreadCount} />
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <button 
                onClick={() => setIsLogoutModalOpen(true)} 
                className={`group flex items-center w-full py-3.5 transition-all duration-300 rounded-xl font-bold
                bg-transparent text-white hover:bg-red-600 hover:shadow-lg active:scale-95
                ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
              >
                <LogOut size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-x-1" /> 
                {isSidebarOpen && <span className="transition-transform duration-300 group-hover:translate-x-1">Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-4 md:p-10 flex-1">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">Riwayat Permohonan</h3>
                <p className="text-gray-600 font-medium text-xs md:text-sm">Data historis seluruh permohonan Anda</p>
                <hr className="mt-4 border-gray-200" />
              </div>

              <div className="bg-white rounded-[25px] shadow-sm border border-gray-200 lg:border-2 lg:border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                  <span className="font-bold text-base md:text-lg">Daftar Permohonan</span>
                  
                  <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center justify-between gap-3 w-full sm:min-w-[140px] px-4 py-2 bg-white rounded-full text-[#4a4a4a] transition-all hover:bg-gray-100 shadow-md"
                    >
                      <span className="text-xs font-bold">{filterStatus}</span>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-[20px] shadow-2xl border border-gray-100 p-2 z-[60] animate-in fade-in zoom-in duration-200">
                        {["Semua Status", "Proses", "Disetujui", "Ditolak", "Menunggu"].map((status) => (
                          <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                            className={`w-full text-center py-2.5 px-4 my-1 rounded-full text-xs font-bold transition-all
                              ${filterStatus === status ? "bg-[#2b6be6] text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-200"}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hak</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">No Sertipikat</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catatan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {isLoading ? (
                        <tr><td colSpan={7} className="py-20 text-center text-gray-400 italic">Memuat data...</td></tr>
                      ) : dataTerfilter.length > 0 ? (
                        dataTerfilter.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.tgl}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-gray-700">{item.jenis}</p>
                              {item.jenis_lainnya && <p className="text-[10px] text-blue-600 italic">"{item.jenis_lainnya}"</p>}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.hak}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{item.no}</td>
                            <td className="px-6 py-4">
                               <div className="text-sm font-semibold text-gray-700">{item.lokasi}</div>
                               <div className="text-[11px] text-gray-700">{item.desa}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase
                                ${item.status === "Disetujui" ? "border-green-500 text-green-600 bg-green-50" : 
                                  item.status === "Ditolak" ? "border-red-500 text-red-600 bg-red-50" : 
                                  item.status === "Diproses" || item.status === "Proses" ? "border-blue-500 text-blue-600 bg-blue-50" : 
                                  "border-orange-500 text-orange-600 bg-orange-50"}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 italic max-w-xs truncate">
                            {item.catatan_admin}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={7} className="py-20 text-center text-gray-400 italic">Tidak ada data permohonan.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center shrink-0">
            <p className="text-[10px] font-bold opacity-80 px-4 leading-relaxed">
              {displayData.footerText1} {displayData.footerText2}
            </p>
          </footer>
        </main>
      </div>

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-6 md:p-8 w-full max-w-sm md:max-w-md shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-sm md:text-base text-gray-600 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-600 font-bold text-gray-800">Batal</button>
            <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}