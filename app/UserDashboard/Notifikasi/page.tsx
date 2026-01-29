"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fetch notifikasi dari backend
  const fetchNotifikasi = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/notifikasi/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
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
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (error) {
      console.error("Gagal memperbarui notifikasi:", error);
    }
  };

  // 1. Efek untuk menangani mounting dan membaca localStorage (Cegah Hydration Error)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }

    // Ambil data user dari localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      // Fetch notifikasi berdasarkan user_id
      if (user.id) {
        fetchNotifikasi(user.id);
      }
    }
  }, []);

  // 2. Simpan status sidebar setiap kali berubah
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  // Helper untuk Sidebar Item
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

      {/* TOOLTIP: Muncul saat sidebar tertutup */}
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  // Jangan render apapun sebelum mounted untuk menghindari mismatch HTML server vs client
  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
                    <div className="flex items-center">
                      <div className="w-12 flex justify-start items-center">
                        <button 
                          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
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
                           <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" active={true} />
               
                           {/* Tombol Keluar */}
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
        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="p-10 flex-1">
            <div className="max-w-[1200px] mx-auto">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Notifikasi</h3>
                  <p className="text-gray-500 font-medium">Pemberitahuan resmi terkait permohonan Anda</p>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-[#e62b2b] text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg">
                    {unreadCount} Belum Dibaca
                  </span>
                )}
              </div>
              
              <hr className="mt-5 border-b-2 border-gray-200 mb-8 " />

              {/* Daftar Notifikasi */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-20 text-center text-gray-400 italic font-bold">Mengambil notifikasi...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`relative flex items-start gap-4 p-5 rounded-[20px] border-2 transition-all
                        ${notif.status === 'ditolak' ? 'border-red-500 bg-red-50' : 
                          notif.status === 'disetujui' ? 'border-green-500 bg-green-50' : 
                          'border-blue-500 bg-blue-50'} ${notif.is_read ? 'opacity-50 grayscale-[0.3]' : ''}`}
                    >
                      <div className="mt-0.5">
                        {notif.status === 'ditolak' && <XCircle className="text-red-500" size={24} />}
                        {notif.status === 'disetujui' && <CheckCircle2 className="text-green-500" size={24} />}
                        {notif.status === 'proses' && <Info className="text-blue-500" size={24} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                          <span className="text-[9px] font-bold text-gray-400 tracking-tighter">{notif.date}</span>
                        </div>
                        
                        <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-3">{notif.message}</p>
                        
                        {/* Box Detail Pengajuan */}
                        <div className="bg-white/80 rounded-xl p-3 border border-gray-100 flex gap-5 items-center flex-wrap">
                          <div className="flex gap-4">
                            <div>
                              <p className="text-[8px] text-gray-400 font-bold tracking-widest">Jenis</p>
                              <p className="text-[10px] font-bold text-gray-700">{notif.detail.jenis}</p>
                              {notif.detail.jenis_lainnya && (
                                <p className="text-[9px] text-gray-500 italic mt-1 font-medium">({notif.detail.jenis_lainnya})</p>
                              )}
                            </div>
                            <div className="border-l border-gray-100 pl-4">
                              <p className="text-[8px] text-gray-400 font-bold tracking-widest">No. Sertipikat</p>
                              <p className="text-[10px] font-bold text-gray-700">{notif.detail.no}</p>
                            </div>
                            <div className="border-l border-gray-100 pl-4">
                              <p className="text-[8px] text-gray-400 font-bold tracking-widest">Lokasi</p>
                              <p className="text-[10px] font-bold text-gray-700">{notif.detail.lokasi}</p>
                            </div>
                          </div>
                        </div>

                        {notif.detail.catatan && (
                          <div className="mt-3 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                            <p className="text-[8px] text-gray-500 font-bold tracking-widest uppercase mb-1">Catatan Admin</p>
                            <p className="text-[10px] text-gray-700 font-medium">{notif.detail.catatan}</p>
                          </div>
                        )}

                      {/* Tombol Aksi - Warna disesuaikan dengan kolom */}
                      <div className="flex justify-end mt-3">
                        {!notif.is_read && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className={`text-[9px] font-black tracking-tight transition-colors hover:underline
                              ${notif.status === 'ditolak' ? 'text-red-600' : 
                                notif.status === 'disetujui' ? 'text-green-600' : 
                                'text-blue-600'}`}
                          >
                            Tandai Sudah Dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <p className="font-bold">Belum ada notifikasi</p>
                </div>
              )}
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Anda akan keluar dari user panel. Anda perlu login kembali untuk mengakses sistem.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-8 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Batal
              </button>

              <Link href="/">
                <button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                  Ya, Keluar
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}