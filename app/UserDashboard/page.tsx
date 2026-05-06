"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Menu,
  X,
  RefreshCw
} from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [userData, setUserData] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const formatTitleCase = (str: string) => {
    if (!str) return "Tanpa Nama";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  
  // State untuk data tampilan (Navbar & Footer)
  const [displayData, setDisplayData] = useState({
    navText1: "KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon: "/logo.png",
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });

  // State untuk statistik permohonan
  const [stats, setStats] = useState([
    { label: "Diproses", value: 0, icon: <Clock size={20} className="text-orange-500" />, borderColor: "border-orange-500", textColor: "text-orange-500", statusKey: 'Proses' },
    { label: "Disetujui", value: 0, icon: <CheckCircle size={20} className="text-green-500" />, borderColor: "border-green-500", textColor: "text-green-500", statusKey: 'Disetujui' },
    { label: "Ditolak", value: 0, icon: <XCircle size={20} className="text-red-500" />, borderColor: "border-red-500", textColor: "text-red-500", statusKey: 'Ditolak' },
    { label: "Total Permohonan", value: 0, icon: <FileText size={20} className="text-black" />, borderColor: "border-black", textColor: "text-black", statusKey: 'Total' },
  ]);

  // 1. Inisialisasi: Cek Auth & Screen Size
  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        router.push('/AdminDashboard');
      } else {
        setUserData(user);
        fetchInitialData(user.id);
      }
    } else {
      router.push('/Login');
    }

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  // 2. Fetch Data (Display & Stats)
  const fetchInitialData = async (userId: string) => {
    // Ambil Konten Hero/Display
    try {
      const resHero = await fetch("http://localhost:8000/api/hero-display");
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
    } catch (e) { console.error("Error display data:", e); }

    // Jalankan fetch statistik pertama kali & set interval
    fetchPermohonanStats(userId);
    refreshIntervalRef.current = setInterval(() => fetchPermohonanStats(userId), 10000); // Tiap 10 detik
  };

  const fetchPermohonanStats = async (userId: string) => {
    try {
      // Ambil Riwayat
      const resRiwayat = await fetch(`http://localhost:8000/api/riwayat/${userId}`);
      if (resRiwayat.ok) {
        const data = await resRiwayat.json();
        const diproses = data.filter((item: any) => item.status === 'Proses').length;
        const disetujui = data.filter((item: any) => item.status === 'Disetujui').length;
        const ditolak = data.filter((item: any) => item.status === 'Ditolak').length;

        setStats(prev => prev.map(s => {
          if (s.label === "Diproses") return { ...s, value: diproses };
          if (s.label === "Disetujui") return { ...s, value: disetujui };
          if (s.label === "Ditolak") return { ...s, value: ditolak };
          return { ...s, value: data.length };
        }));
      }

      // Ambil Notifikasi unread
      const resNotif = await fetch(`http://localhost:8000/api/notifikasi/${userId}`);
      if (resNotif.ok) {
        const dataNotif = await resNotif.json();
        setUnreadCount(dataNotif.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error auto-update:', error);
    }
  };


  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false, badgeCount = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        onClick={() => { if(window.innerWidth < 1024) setIsSidebarOpen(false) }}
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon size={22} className="shrink-0" /> 
          {badgeCount > 0 && !isSidebarOpen && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {badgeCount}
            </span>
          )}
        </div>
        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full">
            <span className="truncate">{label}</span>
            {badgeCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badgeCount}</span>
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
          <div className="flex items-center gap-2 md:gap-3">
            <img src={displayData.navbarIcon} alt="Logo" className="h-8 md:h-10 w-auto shrink-0" />
            <div className="flex flex-col">
              <h1 className="font-bold text-sm md:text-lg leading-none truncate max-w-[150px] md:max-w-none">{displayData.navText1}</h1>
              <p className="text-[8px] md:text-[10px] opacity-70 truncate max-w-[150px] md:max-w-none">{displayData.navText2}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <h2 className="text-xs md:text-sm font-bold truncate">{formatTitleCase(userData.nama_lengkap) || userData.name}</h2>
            <p className="text-[9px] md:text-[10px] opacity-70 truncate">{userData.email}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-[50] ${isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out`}>
          <div className={`lg:hidden flex items-center justify-between p-5 border-b border-white/10 ${!isSidebarOpen && "hidden"}`}>
             <div className="flex items-center gap-2">
                <img src={displayData.navbarIcon} alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xs uppercase tracking-widest">Menu</span>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-full text-white">
                <X size={24} />
             </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" active={true} />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" badgeCount={unreadCount} />
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <button onClick={() => setIsLogoutModalOpen(true)} className={`flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
                <LogOut size={22} className="shrink-0" /> 
                {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-4 md:p-10 flex-1">
            <div className="mb-6 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">Beranda</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium truncate">Selamat datang, {formatTitleCase(userData.nama_lengkap) || userData.name}</p>
              <hr className="mt-4 border-gray-200" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
              {stats.map((stat, idx) => (
                <div key={idx} className={`bg-white p-4 md:p-7 rounded-[20px] md:rounded-[25px] shadow-sm border-2 ${stat.borderColor} flex flex-col md:flex-row justify-between items-start transition-transform hover:scale-[1.02]`}>
                  <div className="order-2 md:order-1">
                    <p className="text-gray-500 text-[10px] md:text-[13px] font-bold mb-1 md:mb-5 uppercase tracking-tighter md:tracking-tight">{stat.label}</p>
                    <h4 className={`text-3xl md:text-6xl font-black ${stat.textColor}`}>{stat.value}</h4>
                  </div>
                  <div className="order-1 md:order-2 mb-2 md:mb-0 opacity-50 md:opacity-100">{stat.icon}</div>
                </div>
              ))}
            </div>

            {/* Account Info Card */}
            <div className="w-full bg-white rounded-[20px] md:rounded-[30px] shadow-lg border border-gray-200 lg:border-2 lg:border-[#7c4d2d] overflow-hidden">
              <div className="bg-[#8b5e3c] p-4 px-6 md:px-8 text-white flex justify-between items-center">
                <span className="font-bold text-base md:text-lg">Informasi Akun</span>
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">{userData.status || "Aktif"}</span>
              </div>
              <div className="p-5 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nama Lengkap</p>
                    <p className="text-sm md:text-lg font-bold text-gray-800 truncate">{formatTitleCase(userData.nama_lengkap) || userData.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm md:text-lg font-bold text-gray-800 break-all">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Jabatan / Role</p>
                    <p className="text-sm md:text-lg font-bold text-gray-800 capitalize">
                      {userData.jabatan || userData.role}
                      {userData.nama_notaris && <span className="block text-xs font-normal italic text-gray-500">Notaris: {userData.nama_notaris}</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nomor HP</p>
                    <p className="text-sm md:text-lg font-bold text-gray-800">{userData.nomor_hp || userData.phone || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 px-4 text-center mt-auto">
            <p className="text-[8px] md:text-[10px] font-bold">{displayData.footerText1}</p>
            <p className="text-[7px] md:text-[9px] opacity-60 mt-1 tracking-widest">{displayData.footerText2}</p>
          </footer>
        </main>
      </div>

      {/* Logout Modal */}
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