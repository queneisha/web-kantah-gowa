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
} from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // --- STATE NOTIFIKASI ---
  const [unreadCount, setUnreadCount] = useState(0);

  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPATS dan PPAT",
  });

  const [stats, setStats] = useState([
    { label: "Diproses", value: 0, icon: <Clock size={20} className="text-orange-500" />, borderColor: "border-orange-500", textColor: "text-orange-500" },
    { label: "Disetujui", value: 0, icon: <CheckCircle size={20} className="text-green-500" />, borderColor: "border-green-500", textColor: "text-green-500" },
    { label: "Ditolak", value: 0, icon: <XCircle size={20} className="text-red-500" />, borderColor: "border-red-500", textColor: "text-red-500" },
    { label: "Total Permohonan", value: 0, icon: <FileText size={20} className="text-black" />, borderColor: "border-black", textColor: "text-black" },
  ]);

  // 1. Fungsi Fetch Notifikasi (Ambil Jumlah Unread)
  const fetchUnreadNotifications = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/notifikasi/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n: any) => n.is_read === 0).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Gagal ambil notifikasi:", error);
    }
  };

  // 2. Fungsi Fetch Statistik Permohonan
  const fetchPermohonanStats = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/riwayat/${userId}`);
      if (!response.ok) return;
      const data = await response.json();
      
      const diproses = data.filter((item: any) => item.status === 'Proses').length;
      const disetujui = data.filter((item: any) => item.status === 'Disetujui').length;
      const ditolak = data.filter((item: any) => item.status === 'Ditolak').length;
      const total = data.length;

      setStats([
        { label: "Diproses", value: diproses, icon: <Clock size={20} className="text-orange-500" />, borderColor: "border-orange-500", textColor: "text-orange-500" },
        { label: "Disetujui", value: disetujui, icon: <CheckCircle size={20} className="text-green-500" />, borderColor: "border-green-500", textColor: "text-green-500" },
        { label: "Ditolak", value: ditolak, icon: <XCircle size={20} className="text-red-500" />, borderColor: "border-red-500", textColor: "text-red-500" },
        { label: "Total Permohonan", value: total, icon: <FileText size={20} className="text-black" />, borderColor: "border-black", textColor: "text-black" },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Load Sidebar Status
    const savedSidebar = localStorage.getItem("sidebarStatus");
    if (savedSidebar !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebar));
    }

    // Auth Check
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        router.push('/AdminDashboard');
        return;
      }
      setUserData(user);
      
      // Initial Fetch
      fetchPermohonanStats(user.id);
      fetchUnreadNotifications(user.id);

      // Polling setiap 10 detik agar dashboard tetap update
      const interval = setInterval(() => {
        fetchPermohonanStats(user.id);
        fetchUnreadNotifications(user.id);
      }, 10000);

      return () => clearInterval(interval);
    } else {
      router.push('/Login');
    }
  }, [router]);

  // Fetch Navbar & Footer dari API
  useEffect(() => {
    const fetchTampilan = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display");
        const data = await res.json();
        if (res.ok) {
          setNavData({
            navText1: data.navText1 || "KANTAH Gowa",
            navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
            navbarIcon: data.navbarIcon || "/logo.png",
          });
          setKonten({
            footerText1: data.footerText1 || konten.footerText1,
            footerText2: data.footerText2 || konten.footerText2
          });
        }
      } catch (error) {
        console.error("Gagal ambil data tampilan:", error);
      }
    };
    if (mounted) fetchTampilan();
  }, [mounted]);

  // Simpan status sidebar saat berubah
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    router.push("/");
  };

  // Komponen SidebarItem dengan Badge
  const SidebarItem = ({ href, icon: Icon, label, active = false, badgeCount = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon size={22} className="shrink-0" /> 
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
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
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

  if (!mounted || !userData) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      {/* Header */}
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
              <h1 className="font-bold text-lg leading-none whitespace-nowrap">{navData.navText1} - User</h1>
              <p className="text-[10px] opacity-70 whitespace-nowrap">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold tracking-tight">{userData.nama_lengkap || userData.name}</h2>
          <p className="text-[10px] opacity-70">{userData.email}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" active={true} />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            
            {/* Notifikasi dengan Badge */}
            <SidebarItem 
              href="/UserDashboard/Notifikasi" 
              icon={Bell} 
              label="Notifikasi" 
              badgeCount={unreadCount} 
            />

            <div className="pt-4 mt-4 border-t border-white/20">
               <button onClick={() => setIsLogoutModalOpen(true)} className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-10 flex-1">
            <div className="w-full text-left">
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Beranda</h3>
                <p className="text-gray-600 font-medium">Selamat datang, {userData.name || userData.nama_lengkap}</p>
                <hr className="mt-5 border-b-2 border-gray-200" />
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className={`bg-white p-7 rounded-[25px] shadow-sm border-2 ${stat.borderColor} flex justify-between items-start transition-transform hover:scale-[1.02]`}>
                    <div>
                      <p className="text-gray-500 text-[13px] font-bold mb-5 tracking-tight">{stat.label}</p>
                      <h4 className={`text-6xl font-black ${stat.textColor}`}>{stat.value}</h4>
                    </div>
                    <div className="mt-1">{stat.icon}</div>
                  </div>
                ))}
              </div>

              {/* Account Info Card */}
              <div className="w-full bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-8 text-white">
                  <span className="font-bold text-lg">Informasi Akun</span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Nama Lengkap</p>
                      <p className="text-lg font-bold text-gray-800">{userData.nama_lengkap || userData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Email</p>
                      <p className="text-lg font-bold text-gray-800">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Jabatan / Role</p>
                      <p className="text-lg font-bold text-gray-800 capitalize">{userData.jabatan || userData.role}</p>
                      {(userData.jabatan || "").toLowerCase().includes('sekretaris') && userData.nama_notaris && (
                        <p className="text-sm italic text-gray-500 mt-1">Notaris: {userData.nama_notaris}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Nomor HP</p>
                      <p className="text-lg font-bold text-gray-800">{userData.nomor_hp || userData.phone || "-"}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Status Akun</p>
                    <span className="px-5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full uppercase inline-block">
                      {userData.status || "Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center">
            <p className="text-[10px] font-bold">{konten.footerText1}</p>
            <p className="text-[9px] opacity-60 mt-1 tracking-widest">{konten.footerText2}</p>
          </footer>
        </main>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-600 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-600 text-gray-600 font-bold">Batal</button>
              <button onClick={handleLogout} className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold shadow-lg">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}