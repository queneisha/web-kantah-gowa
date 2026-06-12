"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  Clock,
  Edit,
  Menu,
  X,
  FileSpreadsheet
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const formatTitleCase = (str: string) => {
    if (!str) return "Tanpa Nama";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const [stats, setStats] = useState({
    total_user: 0,
    user_menunggu: 0,
    total_permohonan: 0,
    permohonan_masuk: 0
  });

  const [navData, setNavData] = useState({
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon: "/logo.png",
  });

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPATS dan PPAT",
  });

  const [latestUsers, setLatestUsers] = useState([]);
  const [latestPermohonan, setLatestPermohonan] = useState([]);
  const [allPermohonan, setAllPermohonan] = useState([]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    fetchInitialData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchInitialData = async () => {
    const token = sessionStorage.getItem('token');
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

    try {
      const [resStats, resUsers, resPermohonan, resHero] = await Promise.all([
        fetch('http://bpn.kadastrium.id/api/dashboard-stats', { headers }),
        fetch('http://bpn.kadastrium.id/api/latest-users', { headers }),
        fetch('http://bpn.kadastrium.id/api/latest-permohonan', { headers }),
        fetch('http://bpn.kadastrium.id/api/hero-display', { headers })
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resUsers.ok) setLatestUsers(await resUsers.json());
      if (resPermohonan.ok) setLatestPermohonan(await resPermohonan.json());
      if (resHero.ok) {
        const data = await resHero.json();
        setNavData(prev => ({ ...prev, ...data }));
        setKonten({ footerText1: data.footerText1, footerText2: data.footerText2 });
      }

      const resAll = await fetch('http://bpn.kadastrium.id/api/all-permohonan', { headers });

if (resAll.ok) {
  const data = await resAll.json();
  setAllPermohonan(data);
}
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const permohonanMasuk = allPermohonan.filter((p: any) => {
    const status = (p.status || "").toLowerCase().trim();
    const userStatus = (p.user_status || "").toLowerCase().trim();
  
    return (
      status === "menunggu" &&
      userStatus === "aktif"
    );
  }).length;

  // 2. TOTAL Permohonan: Menghitung SEMUA permohonan dari user yang aktif
  // (Tanpa filter status disetujui/ditolak agar hasilnya 14)
  const totalPermohonan = allPermohonan.filter((p: any) => {
    const userStatus = (p.user_status || "").toLowerCase().trim();
    return userStatus === "aktif";
  }).length;

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button
        onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false) }}
        className={`flex items-center w-full py-3.5 transition-all duration-300 rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"}
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <Icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "scale-110" : ""}`} />
        {isSidebarOpen && <span className="transition-all duration-300">{label}</span>}
      </button>
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-[60] shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap hidden lg:block">
          {label}
        </div>
      )}
    </Link>
  );

  const totalPermohonanAktif = latestPermohonan.filter(
    (p: any) => p.user_status?.toLowerCase() === "aktif"
  ).length;

  const filteredPermohonan = latestPermohonan
  .filter((p: any) => p.user_status?.toLowerCase() === "aktif")
  .slice(0, 5);

  if (!mounted) return null;

  const totalUserAktif = latestUsers.filter(
    (u: any) => u.status?.toLowerCase() === "aktif"
  ).length;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-4 md:px-8 z-40 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <img src={navData.navbarIcon} alt="Logo" className="h-8 md:h-10 w-auto shrink-0" />
            <div className="flex flex-col min-w-max">
              <h1 className="font-bold text-sm md:text-lg leading-none">{navData.navText1} <span className="hidden xs:inline">- Admin</span></h1>
              <p className="text-[8px] md:text-[10px] opacity-70">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <h2 className="text-xs md:text-sm font-bold tracking-widest opacity-90 hidden sm:block">
    Administrator
  </h2>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR OVERLAY MOBILE */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

       {/* SIDEBAR */}
<aside className={`
  fixed lg:static inset-y-0 left-0 z-50
  ${isSidebarOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"} 
  bg-[#7c4d2d] text-white flex flex-col shadow-xl transition-all duration-300 ease-in-out
`}>

  {/* SIDEBAR HEADER (SUDAH DIBERSIHKAN) */}
  <div className="flex items-center p-3 mb-2 justify-center">
    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-full">
      <X size={20} />
    </button>
  </div>

  {/* NAVIGATION (NO SCROLL) */}
  <nav className="flex-1 px-3 py-2 lg:py-3 space-y-1 lg:space-y-2 overflow-hidden">
    <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" active={true} />
    <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
    <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
    <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
    <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
    <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />

    <div className="pt-4 mt-4 border-t border-white/20">
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className={`group flex items-center w-full py-3.5 transition-all duration-300 rounded-xl font-bold 
        bg-transparent text-white hover:bg-red-600
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <LogOut size={22} className="shrink-0" />
        {isSidebarOpen && <span>Keluar</span>}
      </button>
    </div>
  </nav>
</aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col w-full">
          {notification && (
            <div className={`fixed top-5 right-5 z-[200] px-6 py-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top duration-300 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white text-sm font-bold`}>
              {notification.message}
            </div>
          )}

          <div className="p-4 md:p-10 space-y-6 md:space-y-10 max-w-7xl mx-auto w-full flex-grow">
            <div className="border-b-2 border-gray-200 pb-4">
              <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase">Beranda</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">Panel Administrasi KANTAH Gowa</p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">

{/* USER MENUNGGU */}
<div className="bg-white p-4 md:p-7 rounded-[20px] md:rounded-[25px] shadow-sm border-2 border-orange-500 flex flex-col md:flex-row justify-between items-start hover:scale-[1.02] transition">
  <div>
    <p className="text-gray-500 text-[10px] md:text-[13px] font-bold mb-2 uppercase">
      User Menunggu ACC
    </p>
    <h4 className="text-3xl md:text-6xl font-black text-orange-500">
      {stats.user_menunggu}
    </h4>
  </div>
  <UserCheck size={22} className="opacity-50 md:opacity-100 text-orange-500" />
</div>

{/* TOTAL USER */}
<div className="bg-white p-4 md:p-7 rounded-[20px] md:rounded-[25px] shadow-sm border-2 border-black flex flex-col md:flex-row justify-between items-start hover:scale-[1.02] transition">
  <div>
    <p className="text-gray-500 text-[10px] md:text-[13px] font-bold mb-2 uppercase">
      Total User Terdaftar
    </p>
    <h4 className="text-3xl md:text-6xl font-black text-black">
  {totalUserAktif}
</h4>
  </div>
  <Users size={22} className="opacity-50 md:opacity-100 text-black" />
</div>

{/* PERMOHONAN MASUK */}
<div className="bg-white p-4 md:p-7 rounded-[20px] md:rounded-[25px] shadow-sm border-2 border-blue-500 flex flex-col md:flex-row justify-between items-start hover:scale-[1.02] transition">
  <div>
    <p className="text-gray-500 text-[10px] md:text-[13px] font-bold mb-2 uppercase">
      Permohonan Masuk
    </p>
    <h4 className="text-3xl md:text-6xl font-black text-blue-500">
    {permohonanMasuk}
    </h4>
  </div>
  <Clock size={22} className="opacity-50 md:opacity-100 text-blue-500" />
</div>

{/* TOTAL PERMOHONAN */}
<div className="bg-white p-4 md:p-7 rounded-[20px] md:rounded-[25px] shadow-sm border-2 border-green-500 flex flex-col md:flex-row justify-between items-start hover:scale-[1.02] transition">
  <div>
    <p className="text-gray-500 text-[10px] md:text-[13px] font-bold mb-2 uppercase">
      Total Permohonan
    </p>
    <h4 className="text-3xl md:text-6xl font-black text-green-500">
    {totalPermohonan}
    </h4>
  </div>
  <FileText size={22} className="opacity-50 md:opacity-100 text-green-500" />
</div>

</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
            {/* TABEL USER TERBARU */}
<div className="bg-white rounded-[30px] overflow-hidden shadow-lg border-2 border-[#7c4d2d]">
  <div className="p-4 px-8 bg-[#8b5e3c] text-white font-bold text-lg">User Terbaru</div>
  <div className="p-6 space-y-4">
    {latestUsers.length > 0 ? (
      latestUsers.map((user: any) => (
        <TableRow
          key={user.id}
 
          name={formatTitleCase(user.nama_lengkap || user.nama || user.name)}
 
          role={(user.jabatan)}
          status={user.status}
    
          notaris={user.nama_notaris || user.notaris ? formatTitleCase(user.nama_notaris || user.notaris) : null}
        />
      ))
    ) : (
      <p className="text-center text-gray-400 py-4 italic">Memuat data user...</p>
    )}
  </div>
</div>

            {/* TABEL PERMOHONAN TERBARU */}
<div className="bg-white rounded-[30px] overflow-hidden shadow-lg border-2 border-[#7c4d2d]">
  <div className="p-4 px-8 bg-[#8b5e3c] text-white font-bold text-lg">Permohonan Terbaru</div>
  <div className="p-6 space-y-4">
    {latestPermohonan.length > 0 ? (
      latestPermohonan
        // Filter super ketat: pastikan nama ada, bukan null, dan bukan sekadar spasi
        .filter((p: any) => p.nama && p.nama.toString().trim().length > 0) 
        .slice(0, 5) // Tetap ambil 5 data teratas setelah difilter
        .map((permohonan: any) => (
          <TableRow
            key={permohonan.id}
            name={formatTitleCase(permohonan.nama)}
            role={permohonan.jenis}
            status={permohonan.status}
            jenis_lainnya={permohonan.jenis_lainnya}
          />
        ))
    ) : (
      <p className="text-center text-gray-400 py-4 italic">Memuat data permohonan...</p>
    )}
  </div>
</div>
</div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-4 md:py-6 text-center mt-auto px-4">
            <p className="text-[8px] md:text-[10px] font-bold  tracking-tight">{konten.footerText1}</p>
            <p className="text-[7px] md:text-[9px] opacity-50 tracking-[0.2em] mt-1 font-light">{konten.footerText2}</p>
          </footer>
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-6 md:p-10 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl md:text-3xl font-black text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-sm md:text-lg text-gray-600 font-medium mt-3">Sesi Anda akan berakhir. Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-8 md:mt-12">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-6 md:px-10 py-3 rounded-full border-2 border-gray-400 text-gray-600 font-bold text-xs md:text-smtracking-widest hover:bg-gray-50">Batal</button>
              <button onClick={handleLogout} className="px-6 md:px-10 py-3 rounded-full bg-red-600 text-white font-bold text-xs md:text-sm tracking-widest transition-hover hover:bg-red-700 shadow-lg shadow-red-200">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color, icon, textColor }: any) {
  return (
    <div className={`bg-white p-4 md:p-6 rounded-[20px] md:rounded-[25px] border-l-8 md:border-l-[12px] ${color} shadow-sm transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[8px] md:text-[10px] mb-2 md:mb-5 font-black text-gray-600 tracking-tighter">{label}</p>
          <h4 className={`text-3xl md:text-5xl font-black ${textColor}`}>{value}</h4>
        </div>
        <div className="p-2 bg-gray-50 rounded-xl shrink-0">{icon}</div>
      </div>
      <p className="text-[10px] md:text-xs font-black text-gray-400 mt-4 md:mt-6 italic border-t pt-2  tracking-tight">{sub}</p>
    </div>
  );
}

function TableRow({ name, role, status, notaris, jenis_lainnya }: any) {
  const statusLower = status?.toLowerCase();
  let statusColor = "bg-orange-100 text-orange-600 border-orange-500";

  if (statusLower === "aktif" || statusLower === "disetujui") {
    statusColor = "bg-green-100 text-green-600 border-green-500";
  } else if (statusLower === "ditolak") {
    statusColor = "bg-red-100 text-red-600 border-red-500";
  } else if (statusLower === "diproses" || statusLower === "proses") {
    statusColor = "border-blue-400 text-blue-500 bg-white";
  }

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between border-b-2 border-gray-100 pb-3 last:border-0 last:pb-0 gap-2">
      <div className="flex flex-col text-left">
        <span className="font-black text-xs md:text-sm text-gray-800 line-clamp-1 tracking-tight">{name || "Tanpa Nama"}</span>
        <span className="text-[9px] capitalize md:text-[11px] font-bold text-gray-500 ">{role}</span>
        {jenis_lainnya && (
          <span className="text-[9px] md:text-[11px] italic text-blue-500 font-bold">"{jenis_lainnya}"</span>
        )}
        {notaris && (
          <span className="text-[9px] md:text-[10px] italic text-gray-400 font-semibold mt-0.5  tracking-tighter">Notaris: {notaris}</span>
        )}
      </div>
      <span className={`px-3 md:px-5 py-1 rounded-full text-[8px] md:text-[10px] font-black border-2 whitespace-nowrap shrink-0  tracking-widest ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}