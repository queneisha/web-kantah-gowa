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
  X
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [navbarIconUrl, setNavbarIconUrl] = useState<string>("/logo.png");

  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/all-users', {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUsers();

    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  // FUNGSI DETAIL BARU
  const handleOpenDetail = async (user: UserData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        setIsDetailOpen(true);
      } else {
        // Fallback jika API detail bermasalah, gunakan data dari list
        setSelectedUser(user);
        setIsDetailOpen(true);
      }
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
      setSelectedUser(user);
      setIsDetailOpen(true);
    }
  };

 const confirmApprove = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`http://localhost:8000/api/approve-user/${selectedUser.id}`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          // KUNCI PERBAIKAN: Gunakan status yang seragam (misal "aktif" kecil) 
          // atau pastikan sama dengan yang dicek di LoginPage.
          setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: "aktif" } : u));
          
          setIsApproveModalOpen(false);
          alert("User berhasil disetujui!");
        }
      } catch (error) {
        alert("Gagal menghubungi server.");
      }
    }
  };

  const confirmReject = async () => {
  if (selectedUser) {
    try {
      // PERHATIKAN URL DI BAWAH INI: Tambahkan 'admin' dan 'reject'
      const response = await fetch(`http://localhost:8000/api/admin/users/${selectedUser.id}/reject`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setIsRejectModalOpen(false);
        setSelectedUser(null);
        alert("User berhasil dihapus.");
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus: ${errorData.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    }
  }
};

 const filteredUsers = users
  .sort((a, b) => {
    const statusA = a.status?.toLowerCase();
    const statusB = b.status?.toLowerCase();

    // ✅ Prioritas: status MENUNGGU selalu di atas
    if (statusA === "menunggu" && statusB !== "menunggu") return -1;
    if (statusA !== "menunggu" && statusB === "menunggu") return 1;

    // ✅ Jika status sama → urutkan dari tanggal paling baru
    const dateA = new Date(a.tgl).getTime();
    const dateB = new Date(b.tgl).getTime();
    return dateB - dateA;
  })
  .filter((user) => {
    const userStatus = user.status?.toLowerCase();
    const filterStatus = selectedFilter.toLowerCase();

    const matchesFilter =
      selectedFilter === "Semua Status" || userStatus === filterStatus;

    const matchesSearch =
      user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });


  const handleOpenApprove = (user: UserData) => { setSelectedUser(user); setIsApproveModalOpen(true); };
  const handleOpenReject = (user: UserData) => { setSelectedUser(user); setIsRejectModalOpen(true); };

  const handleLogout = async () => {
    // Clear all user session data from sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("sidebarStatus");
    // Redirect to home page
    router.push("/");
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
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

  // Fetch navbar icon dari backend
    const fetchNavbarIcon = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/hero-display");
        const data = await res.json();
        setNavbarIconUrl(data.navbarIcon || "/logo.png");
      } catch (error) {
        console.error("Gagal fetch navbar icon:", error);
      }
    };

    fetchNavbarIcon();

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
            <img src={navbarIconUrl} alt="Logo" className="h-10 w-auto shrink-0" />
              <div className="flex flex-col min-w-max">
                <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - User</h1>
                <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
              </div>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col transition-all duration-300 relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" active={true} />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />
            <div className="pt-4 border-t border-white/20">
               <button onClick={() => setIsLogoutModalOpen(true)} className={`flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all px-5 gap-3 ${!isSidebarOpen && "justify-center px-0"}`}>
                <LogOut size={22} /> {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>
        
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative">
          <div className="p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="pb-4 border-b-2 border-gray-200">
                <h3 className="text-3xl font-black text-gray-900">Manajemen User</h3>
                <p className="text-gray-600 font-medium">Kelola data pendaftaran akun</p>
              </div>

              <div className="relative max-w-md group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau email..." 
                  className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-100 shadow-sm focus:border-[#56b35a] rounded-2xl outline-none font-semibold transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-5 px-10 flex justify-between items-center">
                  <h4 className="text-white font-bold text-xl">Daftar User</h4>
                  <div className="relative">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)} 
                      className="flex items-center justify-between bg-white px-6 py-2 rounded-full min-w-[160px] font-bold text-sm text-gray-600 transition-all shadow-sm"
                    >
                      {selectedFilter} 
                      <ChevronDown 
                        size={18} 
                        className={`ml-2 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : "rotate-0"}`} 
                      />
                    </button>
                    
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-3 w-full bg-white rounded-[25px] p-2 shadow-2xl z-50 border border-gray-100">
                        {["Semua Status", "Menunggu", "Aktif"].map((option) => (
                          <button 
                            key={option} 
                            onClick={() => { setSelectedFilter(option); setIsFilterOpen(false); }} 
                            className={`w-full py-2 px-4 rounded-full text-sm font-bold mb-1 transition-colors ${
                              selectedFilter === option 
                                ? "bg-[#7c4d2d] text-white" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-3 border-gray-200">
                        <th className="px-6 py-4 text-gray-600 text-sm font-bold">Nama Lengkap</th>
                        <th className="px-6 py-4 text-gray-600 text-sm font-bold">Email</th>
                        <th className="px-6 py-4 text-gray-600 text-sm font-bold">Jabatan</th>
                        <th className="px-6 py-4 text-gray-600 text-sm font-bold">Status</th>
                        <th className="px-6 py-4 text-gray-600 text-sm font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-5 text-gray-600 text-sm font-medium">{user.nama}</td>
                            <td className="px-6 py-5 text-gray-600 text-sm font-medium">{user.email}</td>
                            <td className="px-6 py-5 text-gray-600 text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-600">{user.jabatan}</span>
                                {user.notaris ? (
                                  <span className="text-[13px] text-gray-600 italic mt-0.5">
                                    {user.jabatan.toLowerCase().includes("sekretaris") ? `Notaris/PPAT : ${user.notaris}` : user.notaris}
                                  </span>
                                ) : (
                                  user.jabatan.toLowerCase().includes("sekretaris") && (
                                    <span className="text-[13px] text-red-400 italic mt-0.5">
                                      Data Notaris Kosong
                                    </span>
                                  )
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${user.status === 'Aktif' ? 'bg-green-100 text-green-600 border-green-500' : 'bg-orange-100 text-orange-600 border-orange-500'}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleOpenDetail(user)} className="p-1.5 bg-blue-50 text-blue-600 border-2 border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"><Eye size={16} /></button>
                                {user.status !== 'Aktif' && (
                                  <button onClick={() => handleOpenApprove(user)} className="p-1.5 bg-green-50 text-green-600 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"><Check size={16} /></button>
                                )}
                                <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-600 font-bold">Data Kosong...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-auto">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa.</p>
          </footer>
        </main>
      </div>

      {/* MODAL DETAIL USER */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[35px] w-full max-w-lg overflow-hidden shadow-2xl border-2 border-[#7c4d2d] animate-in fade-in zoom-in duration-300">
            <div className="bg-[#8b5e3c] p-6 text-white flex justify-between items-center px-8">
              <div>
                <h3 className="text-xl font-black">Detail Profil User</h3>
                <p className="text-xs opacity-80">Informasi lengkap akun pendaftar</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-5 bg-white">
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
                <span className="text-[14px] uppercase tracking-wider font-bold  font-black text-gray-600">Nama Lengkap</span>
                <span className="font-medium text-[14px] text-gray-500 italic">{selectedUser.nama}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
                <span className="text-[14px] uppercase tracking-wider font-bold  font-black text-gray-600">Alamat Email</span>
                <span className="font-medium text-[14px] text-gray-500 italic">{selectedUser.email}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
                <span className="text-[14px] uppercase tracking-wider font-bold font-black text-gray-600">Jabatan & Instansi</span>
                <span className="font-medium text-[14px] text-gray-500 italic">{selectedUser.jabatan} {selectedUser.notaris ? `(${selectedUser.notaris})` : ''}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
                <span className="text-[13px] uppercase tracking-wider font-bold font-black text-gray-600">Nomor Handphone (WhatsApp)</span>
                <span className="font-medium text-[14px] text-gray-500 italic">{selectedUser.hp || '-'}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
                <span className="text-[13px] uppercase tracking-wider font-bold font-black text-gray-600">Status Akun</span>
                <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-black border-2 ${selectedUser.status === 'Aktif' ? 'bg-green-50 text-green-600 border-green-500' : 'bg-orange-50 text-orange-600 border-orange-500'}`}>
                  {selectedUser.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] uppercase tracking-wider font-bold font-black text-gray-600">Tanggal Mendaftar</span>
                <span className="font-medium text-[14px] text-gray-500 italic">{selectedUser.tgl}</span>
              </div>
            </div>

            
          </div>
        </div>
      )}

      {/* MODAL APPROVE */}
      {isApproveModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-3xl font-bold text-green-600 mb-2">Setujui User</h3>
            <p className="text-gray-600 font-semibold">Berikan akses login kepada <b>{selectedUser.nama}</b>?</p>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-8 py-3 rounded-full border-2 font-bold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={confirmApprove} className="px-8 py-3 rounded-full bg-green-600 text-white font-bold">Ya, Setujui</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJECT */}
      {isRejectModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl">
            {selectedUser.status === 'Aktif' ? (
              <>
                <h3 className="text-3xl font-bold text-red-600 mb-2">Hapus User</h3>
                <p className="text-gray-600 font-semibold">Hapus user dengan nama <b>{selectedUser.nama}</b>?</p>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-red-600 mb-2">Tolak Pendaftaran</h3>
                <p className="text-gray-600 font-semibold">Tolak pendaftaran akun dengan nama <b>{selectedUser.nama}</b>?</p>
              </>
            )}
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-8 py-3 rounded-full border-2 font-bold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={confirmReject} className="px-8 py-3 rounded-full bg-red-600 text-white font-bold">Ya, {selectedUser.status === 'Aktif' ? 'Hapus' : 'Tolak'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Anda akan keluar dari admin panel. Anda perlu login kembali untuk mengakses sistem.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-10">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-8 py-2.5 rounded-full border-2 border-gray-600 text-gray-600 font-bold hover:bg-gray-50 transition"
              >
            Batal
              </button>
              <button 
                onClick={handleLogout}
                className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                  Ya, Keluar
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}