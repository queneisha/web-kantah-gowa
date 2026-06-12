"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  CheckCircle2, 
  XCircle, 
  Info,
  Menu,
  X
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string; 
  status: string;
  is_read: boolean;
  detail: {
    jenis: string;
    no: string;
    lokasi: string;
    catatan?: string;
  };
}

export default function NotifikasiPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
  });

  const [navData, setNavData] = useState({
    navText1: "KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon: "/logo.png",
  });

  const formatNotifDateWITA = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString; 
      return d.toLocaleDateString("id-ID", {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: "Asia/Makassar"
      }).replace(/\./g, ':');
    } catch (e) { return dateString; }
  };

  const fetchNotifikasi = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://bpn.kadastrium.id/api/notifikasi/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.filter((n: Notification) => !n.is_read));
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`http://bpn.kadastrium.id/api/notifikasi/${id}/read`, { method: 'PATCH' });
      if (response.ok) setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      fetchNotifikasi(user.id);
    } else {
      router.push('/Login');
    }

    fetch('http://bpn.kadastrium.id/api/hero-display')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setKonten({ footerText1: data.footerText1, footerText2: data.footerText2 });
          setNavData(prev => ({ ...prev, ...data }));
        }
      }).catch(console.error);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false, badgeCount = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        onClick={() => { if(window.innerWidth < 1024) setIsSidebarOpen(false) }}
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10 hover:shadow-md"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon size={22} className="shrink-0" /> 
          {!isSidebarOpen && badgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#7c4d2d]">
              {badgeCount}
            </span>
          )}
        </div>
        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full">
            <span className="truncate">{label}</span>
            {badgeCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{badgeCount}</span>}
          </div>
        )}
      </button>
    </Link>
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-4 md:px-8 z-[40] shadow-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className={`flex items-center gap-2 md:gap-3 transition-opacity ${isSidebarOpen && "max-lg:opacity-0"}`}>
            <img src={navData.navbarIcon} alt="Logo" className="h-8 md:h-10 w-auto" />
            <div className="flex flex-col">
              <h1 className="font-bold text-xs md:text-lg leading-none truncate">{navData.navText1}</h1>
              <p className="text-[8px] md:text-[10px] opacity-70 truncate">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold truncate max-w-[150px]">{userData?.nama_lengkap}</h2>
          <p className="text-[10px] opacity-70 truncate">{userData?.email}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-[50] ${isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out`}>
          <div className={`lg:hidden flex items-center justify-between p-5 border-b border-white/10 ${!isSidebarOpen && "hidden"}`}>
             <div className="flex items-center gap-2">
                <img src={navData.navbarIcon} alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xs uppercase">Menu Utama</span>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={24} /></button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" active={true} badgeCount={notifications.length} />
            <div className="pt-4 mt-4 border-t border-white/10">
              <button 
                onClick={() => setIsLogoutModalOpen(true)} 
                className={`flex items-center w-full py-3.5 hover:bg-red-600 hover:shadow-lg hover:shadow-red-900/20 rounded-xl font-bold transition-all ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
              >
                <LogOut size={22} className="shrink-0" /> {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="p-4 sm:p-10 flex-1"> 
            <div className="max-w-[1000px] mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">Notifikasi</h3>
                <p className="text-sm sm:text-base text-gray-500 font-medium">Pemberitahuan resmi terkait permohonan Anda</p>
                <hr className="mt-5 border-gray-200" />
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-20 text-center text-gray-400 italic font-bold">Mengambil data...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-[24px] border-2 transition-all
                        ${notif.status === 'ditolak' ? 'border-red-500 bg-red-50' : 
                          notif.status === 'disetujui' ? 'border-green-500 bg-green-50' : 
                          'border-blue-500 bg-blue-50'}`}
                    >
                      <div className="shrink-0">
                        {notif.status === 'ditolak' && <XCircle className="text-red-500" size={28} />}
                        {notif.status === 'disetujui' && <CheckCircle2 className="text-green-500" size={28} />}
                        {(notif.status === 'proses' || notif.status === 'Diproses') && <Info className="text-blue-500" size={28} />}
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800 text-base leading-tight">{notif.title}</h4>
                          <span className="text-[10px] font-bold text-gray-400 mt-1 sm:mt-0">{formatNotifDateWITA(notif.date)}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{notif.message}</p>
                        
                        <div className="bg-white/80 rounded-xl p-4 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Jenis</p>
                            <p className="text-xs font-bold text-gray-800">{notif.detail.jenis}</p>
                          </div>
                          <div className="md:border-l md:pl-4">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">No. Sertipikat</p>
                            <p className="text-xs font-bold text-gray-800">{notif.detail.no}</p>
                          </div>
                          <div className="md:border-l md:pl-4">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Lokasi</p>
                            <p className="text-xs font-bold text-gray-800 truncate">{notif.detail.lokasi}</p>
                          </div>
                          {notif.status === 'ditolak' && notif.detail.catatan && (
  <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-r-lg">
    <p className="text-[9px] text-red-600 font-bold uppercase tracking-wider">Catatan Pendaftaran / Alasan:</p>
    <p className="text-xs font-medium text-red-800 italic">
      "{notif.detail.catatan}"
    </p>
  </div>
)}
                          
                        </div>

                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs font-black uppercase tracking-tighter hover:underline text-gray-500 transition-colors"
                          >
                            Tandai Sudah Dibaca
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400 italic">
                    <p className="font-bold text-lg">Belum ada notifikasi baru</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center text-[10px] font-bold shrink-0">
            {konten.footerText1}
            <p className="text-[9px] opacity-60 mt-1 tracking-widest uppercase">{konten.footerText2}</p>
          </footer>
        </main>
      </div>

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