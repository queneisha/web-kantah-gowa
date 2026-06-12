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
  ShieldCheck,
  Info,
  Edit,
  Menu,
  FileSpreadsheet,
  X,
  Database,
  Cpu,
  Layers,
  Tag,
  Lock
} from "lucide-react";

export default function PengaturanPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });
  
  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });
  const fetchKonten = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://bpn.kadastrium.id/api/hero-display", {
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setKonten({
          footerText1: data.footerText1 || "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
          footerText2: data.footerText2 || "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
        });
      }
    } catch (error) { 
      console.error("Gagal ambil data konten footer:", error); 
    }

  };
  const fetchNavbarData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://bpn.kadastrium.id/api/hero-display", {
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok) {
        setNavData({
          navText1: data.navText1 || "KANTAH Gowa",
          navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
          navbarIcon: data.navbarIcon || "/logo.png",
        });
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    setMounted(true);
    fetchNavbarData();
    fetchKonten();
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (!mounted) return null;

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
        <Icon size={22} className="shrink-0 transition-transform group-hover:scale-110" />
        {isSidebarOpen && <span className="transition-all duration-300">{label}</span>}
      </button>

      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-[60] shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap hidden lg:block uppercase tracking-widest font-bold">
          {label}
        </div>
      )}
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-4 md:px-8 z-40 shadow-md">
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
    <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda"  />
    <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User"  />
    <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan"  />
    <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" active={true} />
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

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col w-full">
          <div className="p-4 md:p-10 max-w-7xl mx-auto w-full flex-grow space-y-8">
            
            {/* 1. BAGIAN ATAS: KEAMANAN & KONFIGURASI */}
            <div className="border-b-2 border-gray-200 pb-4">
              <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Pengaturan & Privasi</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">Manajemen keamanan data internal</p>
            </div>

            <div className="bg-white rounded-[25px] md:rounded-[35px] shadow-lg border-2 border-[#7c4d2d] overflow-hidden">
              <div className="bg-[#7c4d2d] p-4 px-8 text-white font-bold flex items-center gap-3">
                <Lock size={20} />
                <span className="uppercase text-sm tracking-widest">Prosedur Keamanan Data</span>
              </div>
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="p-2 bg-[#56b35a] text-white rounded-lg"><ShieldCheck size={20}/></div>
                    <div>
                      <p className="font-black text-[11px] text-gray-900 uppercase">Enkripsi Password</p>
                      <p className="text-[10px] text-gray-500 font-bold  mt-1 leading-relaxed">Menggunakan algoritma hash Bcrypt untuk melindungi kredensial user.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="p-2 bg-[#56b35a] text-white rounded-lg"><Users size={20}/></div>
                    <div>
                      <p className="font-black text-[11px] text-gray-900 uppercase">Role-Based Access</p>
                      <p className="text-[10px] text-gray-500 font-bold  mt-1 leading-relaxed">Pembatasan fitur berdasarkan jabatan (Admin, Notaris, PPAT).</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-[25px] p-6 text-blue-900">
                  <div className="flex items-center gap-2 mb-3 font-black uppercase text-xs"><Info size={16}/><span>Pemberitahuan Sistem</span></div>
                  <p className="text-[10px] font-bold uppercase leading-relaxed opacity-80">Seluruh aktivitas perubahan data permohonan akan dicatat ke dalam sistem log riwayat untuk audit internal Kantor Pertanahan Kabupaten Gowa.</p>
                </div>
              </div>
            </div>

            {/* 2. BAGIAN BAWAH: INFORMASI SISTEM (SEPERTI YANG DIMINTA) */}
            <div className="bg-[#1a1a1a] rounded-[25px] md:rounded-[35px] shadow-2xl overflow-hidden text-white p-6 md:p-10 mt-12 border-b-4 border-orange-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl"><Layers size={24} className="text-orange-400" /></div>
                <div>
                  <h4 className="text-lg font-black leading-none uppercase tracking-tight">Spesifikasi Arsitektur Sistem</h4>
                  <p className="text-[10px] opacity-50  tracking-[0.2em] mt-1 font-bold">Detail teknis pengembangan aplikasi</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[9px] font-black text-orange-400 tracking-widest mb-2 uppercase">Framework</p>
                  <p className="font-bold text-xs uppercase">React + TS</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[9px] font-black text-orange-400 tracking-widest mb-2 uppercase">Database</p>
                  <p className="font-bold text-xs uppercase">MySQL API</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[9px] font-black text-orange-400 tracking-widest mb-2 uppercase">Build Version</p>
                  <p className="font-bold text-xs uppercase">v1.0-Stable</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[9px] font-black text-orange-400 tracking-widest mb-2 uppercase">Styling</p>
                  <p className="font-bold text-xs uppercase">Tailwind CSS</p>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER */}
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
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-6 md:px-10 py-3 rounded-full border-2 border-gray-400 text-gray-600 font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-gray-50">Batal</button>
              <button onClick={handleLogout} className="px-6 md:px-10 py-3 rounded-full bg-red-600 text-white font-bold text-xs md:text-sm uppercase tracking-widest transition-hover hover:bg-red-700 shadow-lg shadow-red-200">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}