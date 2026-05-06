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
  Eye,
  Check,
  ChevronDown,
  Trash2, 
  Menu,
  Edit,
  FileSpreadsheet,
  Search,
  X,
  Clock
} from "lucide-react";

interface UserData {
  id: number;
  nama: string;
  email: string;
  jabatan: string;
  notaris?: string;
  hp: string;
  tgl: string;
  status: string;
}

export default function DataUserPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua Status");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [users, setUsers] = useState<UserData[]>([]);
  
  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });
  
  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });
  const fetchNavbarData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8000/api/hero-display", {
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
  };const fetchKonten = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8000/api/hero-display", {
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
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/all-users', {
        headers: { 'Accept': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) { console.error(error); }
  };

  const formatTitleCase = (str: string) => {
    if (!str) return "Tanpa Nama";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    setMounted(true);
    fetchNavbarData();
    fetchKonten();
    fetchUsers();
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (!mounted) {
    return <div className="opacity-0">Loading...</div>; 
  }

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'aktif') return 'bg-green-100 text-green-600 border-green-500';
    if (s === 'menunggu') return 'bg-orange-100 text-orange-600 border-orange-500';
    if (s === 'ditolak') return 'bg-red-100 text-red-600 border-red-500';
    return 'bg-gray-100 text-gray-600 border-gray-500';
  };

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

  const handleApprove = async () => {
    if (!selectedUser) return;
  
    const token = sessionStorage.getItem("token");
  
    const res = await fetch(`http://localhost:8000/api/approve-user/${selectedUser.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.ok) {
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id ? { ...u, status: "Aktif" } : u
        )
      );
  
      setNotification({ type: "success", message: "User berhasil disetujui ✅" });
    }
  
    setIsApproveModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
  
    const token = sessionStorage.getItem("token");
  
    const res = await fetch(`http://localhost:8000/api/admin/users/${selectedUser.id}/reject`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
  
      setNotification({ type: "success", message: "User berhasil dihapus ❌" });
    }
  
    setIsRejectModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesFilter = selectedFilter === "Semua Status" || user.status?.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden" suppressHydrationWarning >
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
    <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" active={true} />
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
          <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-6 md:space-y-10">
            <div className="border-b-2 border-gray-200 pb-4">
              <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase">Manajemen User</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">Kelola akses dan data pendaftaran akun</p>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#56b35a] transition-colors" size={18} />
                <input 
                  type="text" placeholder="Cari nama atau email..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none font-semibold text-gray-700 shadow-sm focus:ring-2 ring-[#56b35a]/20 focus:border-[#56b35a] transition-all"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-auto">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className="flex items-center justify-between bg-white border border-gray-200 px-6 py-3 rounded-2xl w-full md:min-w-[180px] font-bold text-xs text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {selectedFilter.toUpperCase()} 
                  <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-2xl p-2 shadow-2xl z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    {["Semua Status", "Menunggu", "Aktif", "Ditolak"].map((opt) => (
                      <button key={opt} onClick={() => { setSelectedFilter(opt); setIsFilterOpen(false); }} className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-colors ${selectedFilter === opt ? "bg-[#7c4d2d] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[25px] md:rounded-[35px] shadow-lg border lg:border-2 border-[#7c4d2d] overflow-hidden mb-10">
              <div className="bg-[#8b5e3c] p-4 px-6 md:px-10 text-white font-bold text-sm md:text-lg uppercase tracking-wider">Daftar User Sistem</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[10px] md:text-base font-bold ">Detail User</th>
                      <th className="px-8 py-5 text-[10px]  md:text-base font-bold ">Jabatan / Instansi</th>
                      <th className="px-8 py-5 text-[10px] md:text-base font-bold ">Status Akun</th>
                      <th className="px-8 py-5 text-[10px]  md:text-base font-bold
                       text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-xs md:text-base tracking-tight">{formatTitleCase(user.nama)}</span>
                              <span className="text-[10px] md:text-[11px] text-gray-500 font-bold">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-[10px] md:text-xs text-gray-700 ">{user.jabatan}</span>
                              {user.notaris && <span className="text-[9px] md:text-[10px] text-gray-400 italic font-bold">NOTARIS/PPAT/PPATS: {user.notaris}</span>}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold border-2 inline-block whitespace-nowrap uppercase tracking-widest ${getStatusStyles(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                          <div className="flex justify-center gap-2">
  {/* DETAIL */}
  <button 
    onClick={() => {setSelectedUser(user); setIsDetailOpen(true)}}
    title="Lihat Detail"
    className="group relative p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 
    hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
  >
    <Eye size={16} />
  </button>

  {/* APPROVE */}
  {user.status?.toLowerCase() === 'menunggu' && (
    <button 
      onClick={() => {setSelectedUser(user); setIsApproveModalOpen(true)}}
      title="Setujui"
      className="group relative p-2 bg-green-50 text-green-600 rounded-xl border border-green-100 
      hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
    >
      <Check size={16} />
    </button>
  )}

  {/* DELETE */}
  <button 
    onClick={() => {setSelectedUser(user); setIsRejectModalOpen(true)}}
    title="Hapus"
    className="group relative p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 
    hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
  >
    <Trash2 size={16} />
  </button>
</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic font-bold  tracking-widest text-xs">Tidak ada data user ditemukan...</td></tr>
                    )}
                  </tbody>
                </table>
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
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-6 md:px-10 py-3 rounded-full border-2 border-gray-400 text-gray-600 font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-gray-50">Batal</button>
              <button onClick={handleLogout} className="px-6 md:px-10 py-3 rounded-full bg-red-600 text-white font-bold text-xs md:text-sm uppercase tracking-widest transition-hover hover:bg-red-700 shadow-lg shadow-red-200">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

{isDetailOpen && selectedUser && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    
    <div className="bg-white rounded-[25px] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in duration-200">

      {/* HEADER */}
      <div className="bg-[#8b5e3c] p-5 px-6 text-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Detail User</h3>
          <p className="text-xs opacity-80">Informasi lengkap pengguna</p>
        </div>

        <button 
          onClick={() => setIsDetailOpen(false)}
          className="p-2 rounded-full hover:bg-white/20 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">

        <div>
          <p className="text-xs text-gray-400 font-bold">Nama</p>
          <p className="font-semibold text-gray-800">{formatTitleCase(selectedUser.nama)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-bold">Email</p>
          <p className="font-semibold text-gray-800">{selectedUser.email}</p>
        </div>

        <div>
  <p className="text-xs text-gray-400 font-bold">Jabatan</p>

  <p className="font-semibold text-gray-800">
    {selectedUser.jabatan}
  </p>

  {/* Nama Notaris (khusus staf notaris) */}
  {selectedUser.jabatan?.toLowerCase().includes("staf notaris") && selectedUser.notaris && (
    <p className="text-xs text-[#8b5e3c] font-bold mt-1">
      Notaris/PPAT/PPATS: {selectedUser.notaris}
    </p>
  )}
</div>
        <div>
          <p className="text-xs text-gray-400 font-bold">No HP</p>
          <p className="font-semibold text-gray-800">
            {selectedUser.hp || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-bold">Status</p>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(selectedUser.status)}`}>
            {selectedUser.status}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-bold">Tanggal Daftar</p>
          <p className="font-semibold text-gray-800">
            {selectedUser.tgl}
          </p>
        </div>

      </div>

      {/* FOOTER ACTION */}
   

    </div>
  </div>
)}



{isApproveModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 w-[350px] text-center shadow-xl">
      <h3 className="text-xl font-bold text-green-600">Setujui User?</h3>
      <p className="mt-2 text-gray-600">User akan melakukan login dan mengakses sistem</p>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={() => setIsApproveModalOpen(false)}
          className="flex-1 py-2 border rounded-lg"
        >
          Batal
        </button>

        <button 
          onClick={handleApprove}
          className="flex-1 py-2 bg-green-600 text-white rounded-lg"
        >
          Setujui
        </button>
      </div>
    </div>
  </div>
)}
{isRejectModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 w-[350px] text-center shadow-xl">
      <h3 className="text-xl font-bold text-red-600">Hapus/tolak User?</h3>
      <p className="mt-2 text-gray-600">User harus melakukan login/daftar ulang.</p>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={() => setIsRejectModalOpen(false)}
          className="flex-1 py-2 border rounded-lg"
        >
          Batal
        </button>

        <button 
          onClick={handleDelete}
          className="flex-1 py-2 bg-red-600 text-white rounded-lg"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}