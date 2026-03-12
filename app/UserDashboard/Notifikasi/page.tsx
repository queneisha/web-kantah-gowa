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
  Menu
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string; 
  status: string;
  jenis: string;
  jenis_lainnya?: string | null;
  catatan?: string | null;
  no: string;
  lokasi: string;
  is_read: boolean;
  detail: {
    jenis: string;
    jenis_lainnya?: string | null;
    no: string;
    lokasi: string;
    catatan?: string | null;
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

  // --- FUNGSI FORMAT WAKTU WITA (Asia/Makassar) ---
  const formatNotifDateWITA = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString; 

      const datePart = d.toLocaleDateString("id-ID", {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: "Asia/Makassar"
      });
      
      const timePart = d.toLocaleTimeString("id-ID", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: "Asia/Makassar"
      }).replace(/\./g, ':');

      return `${datePart} pukul ${timePart}`;
    } catch (e) {
      return dateString;
    }
  };

  const unreadCount = notifications.length;

  const fetchNotifikasi = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/notifikasi/${userId}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setNotifications(data.filter((n: Notification) => !n.is_read));
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifikasi/${id}/read`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Gagal memperbarui notifikasi:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) setIsSidebarOpen(JSON.parse(saved));

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        router.push('/AdminDashboard');
        return;
      }
      setUserData(user);
      if (user.id) fetchNotifikasi(user.id);
    } else {
      router.push('/Login');
    }
  }, [router]);

  useEffect(() => {
    if (mounted) localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen, mounted]);

  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.removeItem("sidebarStatus");
    router.push("/");
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

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await fetch('http://localhost:8000/api/hero-display');
        const data = await response.json();
        if (data) {
          setKonten({ footerText1: data.footerText1, footerText2: data.footerText2 });
          setNavData({
            navText1: data.navText1 || "KANTAH Gowa",
            navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
            navbarIcon: data.navbarIcon || "/logo.png",
          });
        }
      } catch (error){
        console.error('gagal mengambil data: ', error);
      }
    };
    fetchData();
  }, []);

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
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#7c4d2d]">
              {badgeCount}
            </span>
          )}
        </div>
        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full">
            <span>{label}</span>
            {badgeCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                {badgeCount}
              </span>
            )}
          </div>
        )}
      </button>
    </Link>
  );

  if (!mounted) return null;

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
            <img src={navData.navbarIcon} alt="Logo" className="h-10 w-auto shrink-0" />
            <div className="flex flex-col min-w-max">
              <h1 className="font-bold text-lg leading-none whitespace-nowrap">{navData.navText1}</h1>
              <p className="text-[10px] opacity-70 whitespace-nowrap">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold tracking-tight">{userData?.nama_lengkap || "User"}</h2>
          <p className="text-[10px] opacity-70">{userData?.email || "email@example.com"}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" active={true} badgeCount={unreadCount} />
            <div className="pt-4 mt-4 border-t border-white/20">
              <button onClick={() => setIsLogoutModalOpen(true)} className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
                <LogOut size={22} className="shrink-0 text-white" /> 
                {isSidebarOpen && <span className="text-white">Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="p-10 flex-1">
            <div className="max-w-[1200px] mx-auto">
              <div>
                <h3 className="text-3xl font-black text-gray-900">Notifikasi</h3>
                <p className="text-gray-500 font-medium">Pemberitahuan resmi terkait permohonan Anda</p>
              </div>
              <hr className="mt-5 border-b-2 border-gray-200 mb-8 " />

              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-20 text-center text-gray-400 italic font-bold">Mengambil notifikasi...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`relative flex items-start gap-4 p-6 rounded-[24px] border-2 transition-all
                        ${notif.status === 'ditolak' ? 'border-red-500 bg-red-50' : 
                          notif.status === 'disetujui' ? 'border-green-500 bg-green-50' : 
                          'border-blue-500 bg-blue-50'}`}
                    >
                      <div className="mt-1">
                        {notif.status === 'ditolak' && <XCircle className="text-red-500" size={24} />}
                        {notif.status === 'disetujui' && <CheckCircle2 className="text-green-500" size={24} />}
                        {notif.status === 'proses' && <Info className="text-blue-500" size={24} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-800 text-base leading-tight">{notif.title}</h4>
                          {/* BAGIAN JAM WITA UNIK PER CARD */}
                          <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap ml-4">
                            {formatNotifDateWITA(notif.date)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">{notif.message}</p>
                        
                        <div className="bg-white/80 rounded-xl p-4 border border-gray-200 flex gap-6 items-center flex-wrap">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Jenis</p>
                              <p className="text-xs font-bold text-gray-800">{notif.detail.jenis}</p>
                            </div>
                            <div className="border-l border-gray-200 pl-6">
                              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">No. Sertipikat</p>
                              <p className="text-xs font-bold text-gray-800">{notif.detail.no}</p>
                            </div>
                            <div className="border-l border-gray-200 pl-6">
                              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Lokasi</p>
                              <p className="text-xs font-bold text-gray-800">{notif.detail.lokasi}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className={`text-xs font-bold transition-colors hover:underline
                              ${notif.status === 'ditolak' ? 'text-red-600' : 
                                notif.status === 'disetujui' ? 'text-green-600' : 
                                'text-blue-600'}`}
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

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center">
            <p className="text-[10px] font-bold">{konten.footerText1}</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1 uppercase">{konten.footerText2}</p>
          </footer>
        </main>
      </div>

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