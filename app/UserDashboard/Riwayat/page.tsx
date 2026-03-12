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
  
  // --- STATE NOTIFIKASI ---
  const [notifications, setNotifications] = useState<any[]>([]);
  // Menghitung jumlah yang belum dibaca (is_read === 0)
  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Notifikasi (Agar badge angka muncul)
  const fetchNotifikasi = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifikasi/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  };

  // 2. Fetch Riwayat Permohonan
  const fetchRiwayatPermohonan = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/riwayat/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setRiwayatData([]);
        return;
      }

      const data = await response.json();
      const formattedData = data.map((item: any) => ({
        tgl: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        }) : '-',
        jenis: item.jenis_pendaftaran || '-',
        jenis_lainnya: item.jenis_lainnya || null,
        hak: item.jenis_hak || '-',
        no: item.no_sertipikat || '-',
        lokasi: item.desa || '-',
        desa: item.kecamatan || '-',
        status: item.status || 'Menunggu',
        catatan: item.catatan_pendaftaran || '-'
      }));
      setRiwayatData(formattedData);
    } catch (error) {
      console.error('Error fetching riwayat:', error);
      setRiwayatData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
  });

  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });

  // Efek Utama (Mounting & Auth)
  useEffect(() => {
    setMounted(true);
    
    // Load Sidebar Status
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }

    // Auth & Data Fetching
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        router.push('/AdminDashboard');
        return;
      }
      setUserData(user);
      if (user.id) {
        fetchRiwayatPermohonan(user.id);
        fetchNotifikasi(user.id);
      }
    } else {
      router.push('/Login');
    }
  }, [router]);

  // Fetch data tampilan (Hero/Nav)
  useEffect(() => {
    const fetchTampilan = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display");
        const data = await res.json();
        if (res.ok) {
          setKonten({
            footerText1: data.footerText1 || konten.footerText1,
            footerText2: data.footerText2 || konten.footerText2
          });
          setNavData({
            navText1: data.navText1 || "KANTAH Gowa",
            navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
            navbarIcon: data.navbarIcon || "/logo.png",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data tampilan:", error);
      }
    };
    if (mounted) fetchTampilan();
  }, [mounted]);

  // Save sidebar status
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/Login");
  };

  // Filter Logic
  const dataTerfilter = riwayatData.filter((item) => {
    if (filterStatus === "Semua Status") return true;
    if (filterStatus === "Proses") return item.status === "Diproses";
    return item.status === filterStatus;
  });

  // Sidebar Item Component dengan LOGIKA BADGE
  const SidebarItem = ({ href, icon: Icon, label, active = false, badgeCount = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon size={22} className="shrink-0" /> 
          {/* Badge kecil saat sidebar tertutup */}
          {!isSidebarOpen && badgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-[#7c4d2d]">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </div>

        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full">
            <span>{label}</span>
            {badgeCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                {badgeCount}
              </span>
            )}
          </div>
        )}
      </button>

      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label} {badgeCount > 0 && `(${badgeCount})`}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center">
          <div className="w-12 flex justify-start items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <img src={navData.navbarIcon} alt="Logo" className="h-10 w-auto shrink-0" />
            <div className="flex flex-col min-w-max">
              <h1 className="font-bold text-lg leading-none whitespace-nowrap">{navData.navText1} - User </h1>
              <p className="text-[10px] opacity-70 whitespace-nowrap">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold tracking-tight">{userData?.nama_lengkap || 'User'}</h2>
          <p className="text-[10px] opacity-70">{userData?.email || 'email@example.com'}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" active={true} />
            
            {/* Notifikasi dengan Badge Angka */}
            <SidebarItem 
              href="/UserDashboard/Notifikasi" 
              icon={Bell} 
              label="Notifikasi" 
              badgeCount={unreadCount} 
            />
       
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

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-10 flex-1">
            <div className="max-w-[1400px] mx-auto">
              
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Riwayat Permohonan</h3>
                <p className="text-gray-600 font-medium text-sm">Data historis seluruh permohonan Anda</p>
                <hr className="mt-5 border-b-2 border-gray-200" />
              </div>

              <div className="bg-white rounded-[25px] shadow-sm border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-8 flex justify-between items-center text-white">
                  <span className="font-bold text-lg">Daftar Permohonan</span>
                  
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
                
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b-3 border-gray-200">
                      <tr>
                        <th className="px-8 py-4 text-[14px] font-bold text-gray-600">Tanggal Daftar</th>
                        <th className="px-6 py-4 text-[14px] font-bold text-gray-600">Jenis Pendaftaran</th>
                        <th className="px-6 py-4 text-[14px] font-bold text-gray-600">Jenis Hak</th>
                        <th className="px-6 py-4 text-[14px] font-bold text-gray-600">No. Sertipikat</th>
                        <th className="px-6 py-4 text-[14px] font-bold text-gray-600">Lokasi</th>
                        <th className="px-6 py-4 text-[14px] font-bold text-gray-600 text-center">Status</th>
                        <th className="px-8 py-4 text-[14px] font-bold text-gray-600">Catatan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="py-20 text-center text-gray-400 font-bold italic">
                            Memuat data riwayat permohonan...
                          </td>
                        </tr>
                      ) : dataTerfilter.length > 0 ? (
                        dataTerfilter.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100 transition-colors">
                            <td className="px-8 py-5 text-sm font-medium text-gray-600">{item.tgl}</td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-medium text-gray-600">{item.jenis}</p>
                              {item.jenis_lainnya && (
                                <p className="text-[11px] text-gray-600 italic mt-1">"{item.jenis_lainnya}"</p>
                              )}
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-gray-600">{item.hak}</td>
                            <td className="px-6 py-5 text-sm font-medium text-gray-600">{item.no}</td>
                            <td className="px-6 py-5">
                               <div className="text-sm font-medium text-gray-600">{item.lokasi}</div>
                               <div className="text-[10px] text-gray-500 font-medium">{item.desa}</div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`min-w-[90px] px-4 py-1 rounded-full text-[10px] font-bold border-2 inline-block
                                ${item.status === "Disetujui" ? "border-green-500 text-green-500 bg-green-50" : 
                                  item.status === "Ditolak" ? "border-red-500 text-red-500 bg-red-50" : 
                                  item.status === "Proses" ? "border-blue-500 text-blue-500 bg-blue-50" : 
                                  "border-orange-500 text-orange-500 bg-orange-50"}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-600 italic">{item.catatan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-20 text-center text-gray-400 font-bold italic">
                            Tidak ada data permohonan
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
            <p className="text-[10px] font-bold">{konten.footerText1}</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">{konten.footerText2}</p>
          </footer>
        </main>
      </div>

      {/* --- MODAL POP UP KELUAR --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-600 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
             <div className="flex justify-end gap-3 mt-10">
               <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-600 text-gray-600 font-bold">Batal</button>
               <button onClick={handleLogout} className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold">Ya, Keluar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}