"use client";
import React, { useState, useEffect, useRef } from "react";
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
  XCircle,
  Menu,
  RefreshCw,
} from "lucide-react";

export default function UserDashboardPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // State untuk menyimpan data user dari login
  const [userData, setUserData] = useState<any>(null);
  
  // State untuk statistik permohonan
  const [permohonanStats, setPermohonanStats] = useState({
    diproses: 0,
    disetujui: 0,
    ditolak: 0,
    total: 0
  });

  const [stats, setStats] = useState([
    { label: "Diproses", value: 0, icon: <Clock size={20} className="text-orange-500" />, borderColor: "border-orange-500", textColor: "text-orange-500" },
    { label: "Disetujui", value: 0, icon: <CheckCircle size={20} className="text-green-500" />, borderColor: "border-green-500", textColor: "text-green-500" },
    { label: "Ditolak", value: 0, icon: <XCircle size={20} className="text-red-500" />, borderColor: "border-red-500", textColor: "text-red-500" },
    { label: "Total Permohonan", value: 0, icon: <FileText size={20} className="text-black" />, borderColor: "border-black", textColor: "text-black" },
  ]);

  useEffect(() => {
    setMounted(true);
    
    // 1. Ambil status sidebar
    const savedSidebar = localStorage.getItem("sidebarStatus");
    if (savedSidebar !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebar));
    }

    // 2. Ambil data user yang login (Dihubungkan ke sistem Login)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  // 3. Fetch data permohonan dari backend berdasarkan user_id
  useEffect(() => {
    if (mounted && userData?.id) {
      fetchPermohonanStats(userData.id);
      
      // Setup interval refetch setiap 5 detik untuk update real-time
      refreshIntervalRef.current = setInterval(() => {
        fetchPermohonanStats(userData.id);
      }, 5000); // 5000ms = 5 detik

      // Cleanup interval saat component unmount
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [mounted, userData]);

  // Fungsi untuk fetch statistik permohonan user
  const fetchPermohonanStats = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/riwayat/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Gagal fetch permohonan');
        return;
      }

      const data = await response.json();
      
      // Hitung statistik berdasarkan status
      const diproses = data.filter((item: any) => item.status === 'Proses').length;
      const disetujui = data.filter((item: any) => item.status === 'Disetujui').length;
      const ditolak = data.filter((item: any) => item.status === 'Ditolak').length;
      const total = data.length;

      setPermohonanStats({
        diproses,
        disetujui,
        ditolak,
        total
      });

      // Update stats array dengan nilai yang baru
      setStats([
        { label: "Diproses", value: diproses, icon: <Clock size={20} className="text-orange-500" />, borderColor: "border-orange-500", textColor: "text-orange-500" },
        { label: "Disetujui", value: disetujui, icon: <CheckCircle size={20} className="text-green-500" />, borderColor: "border-green-500", textColor: "text-green-500" },
        { label: "Ditolak", value: ditolak, icon: <XCircle size={20} className="text-red-500" />, borderColor: "border-red-500", textColor: "text-red-500" },
        { label: "Total Permohonan", value: total, icon: <FileText size={20} className="text-black" />, borderColor: "border-black", textColor: "text-black" },
      ]);
    } catch (error) {
      console.error('Error fetching permohonan stats:', error);
    }
  };

  // Fungsi manual refresh untuk user
  const handleManualRefresh = async () => {
    if (userData?.id) {
      setIsRefreshing(true);
      await fetchPermohonanStats(userData.id);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button 
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
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

  // Fungsi Logout untuk membersihkan storage
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!mounted || !userData) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      {/* HEADER */}
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
                <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - User</h1>
                <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
              </div>
            </div>
          </div>

          {/* Dinamis berdasarkan User Login */}
          <div className="text-right hidden sm:block flex items-center gap-6">
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{userData.name || userData.nama_lengkap}</h2>
              <p className="text-[10px] opacity-70">{userData.email}</p>
            </div>
          </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" active={true} />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" />

            <div className="pt-4 mt-4 border-t border-white/20">
               <button onClick={() => setIsLogoutModalOpen(true)} className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
                <LogOut size={22} className="shrink-0 text-white" /> 
                {isSidebarOpen && <span className="text-white">Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">
          <div className="p-10 flex-1">
            <div className="max-w-350 mx-auto text-left">
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Beranda</h3>
                <p className="text-gray-500 font-medium">Selamat datang, {userData.name || userData.nama_lengkap}</p>
                <hr className="mt-5 border-b-2 border-gray-200" />
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className={`bg-white p-7 rounded-[25px] shadow-sm border-2 ${stat.borderColor} flex justify-between items-start transition-transform hover:scale-[1.02]`}>
                    <div>
                      <p className="text-gray-400 text-[13px] font-bold mb-1 tracking-tight">{stat.label}</p>
                      <h4 className={`text-6xl font-black ${stat.textColor}`}>{stat.value}</h4>
                    </div>
                    <div className="mt-1">{stat.icon}</div>
                  </div>
                ))}
              </div>

              {/* ACCOUNT INFO CARD - Terhubung ke Database */}
<div className="max-w-2xl bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
  <div className="bg-[#8b5e3c] p-4 px-8 text-white">
    <span className="font-bold text-lg">Informasi Akun</span>
  </div>
  <div className="p-8 grid grid-cols-2 gap-y-6">
    <div>
      <p className="text-sm text-gray-400 font-bold tracking-tight">Nama Lengkap</p>
      <p className="font-semibold text-gray-800 text-lg">{userData.name || userData.nama_lengkap}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400 font-bold tracking-tight">Email</p>
      <p className="font-semibold text-gray-800 text-lg">{userData.email}</p>
    </div>
    
    {/* BAGIAN JABATAN YANG DIPERBARUI */}
    <div>
      <p className="text-sm text-gray-400 font-bold tracking-tight">Jabatan</p>
      <p className="font-semibold text-gray-800 text-lg">{userData.jabatan || userData.role}</p>
      
      {/* Logika: Jika jabatan mengandung kata Sekretaris, munculkan Nama Notaris */}
      {(userData.jabatan || "").toLowerCase().includes('sekretaris') && userData.nama_notaris && (
        <p className="text-sm font-normal italic text-gray-600 mt-1 leading-tight">
          Nama Notaris/PPAT: <span className="font-medium text-gray-700">{userData.nama_notaris}</span>
        </p>
      )}
    </div>

    <div>
      <p className="text-sm text-gray-400 font-bold tracking-tight">No HP.</p>
      <p className="font-semibold text-gray-800 text-lg">{userData.nomor_hp || userData.phone || "-"}</p>
    </div>
    <div className="col-span-2">
      <p className="text-sm text-gray-400 font-bold mb-2 tracking-tight">Status</p>
      <span className="px-5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full uppercase">
        {userData.status || "Aktif"}
      </span>
    </div>
  </div>
</div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
          </footer>
        </main>
      </div>

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-500 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
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