"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Eye,
  Check,
  X,
  ChevronDown,
  Trash2, 
  Menu,
  Edit,
  FileSpreadsheet,
  Search // Tambah icon search
} from "lucide-react";

interface UserData {
  nama: string;
  email: string;
  jabatan: string;
  hp: string;
  tgl: string;
  status: string;
}

export default function DataUserPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // State untuk Dropdown Filter & Search
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua Status");
  const [searchTerm, setSearchTerm] = useState(""); // State baru untuk search

  const [users, setUsers] = useState<UserData[]>([
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", jabatan: "PPAT", hp: "09876543234", tgl: "11 Januari 2026", status: "Aktif" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", jabatan: "Notaris", hp: "07653456782", tgl: "12 Januari 2026", status: "Aktif" },
    { nama: "Nurul Karimah", email: "nkarimah421@gmail.com", jabatan: "Notaris", hp: "081341062046", tgl: "13 Januari 2026", status: "Menunggu" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", jabatan: "PPAT", hp: "09876543234", tgl: "11 Januari 2026", status: "Aktif" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", jabatan: "Notaris", hp: "07653456782", tgl: "12 Januari 2026", status: "Aktif" },
    { nama: "Nurul Karimah", email: "nkarimah421@gmail.com", jabatan: "Notaris", hp: "081341062046", tgl: "13 Januari 2026", status: "Menunggu" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", jabatan: "PPAT", hp: "09876543234", tgl: "11 Januari 2026", status: "Aktif" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", jabatan: "Notaris", hp: "07653456782", tgl: "12 Januari 2026", status: "Aktif" },
    { nama: "Nurul Karimah", email: "nkarimah421@gmail.com", jabatan: "Notaris", hp: "081341062046", tgl: "13 Januari 2026", status: "Menunggu" },
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", jabatan: "PPAT", hp: "09876543234", tgl: "11 Januari 2026", status: "Aktif" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", jabatan: "Notaris", hp: "07653456782", tgl: "12 Januari 2026", status: "Aktif" },
    { nama: "Nurul Karimah", email: "nkarimah421@gmail.com", jabatan: "Notaris", hp: "081341062046", tgl: "13 Januari 2026", status: "Menunggu" },
  ]);

  // 1. Sinkronisasi Sidebar & Cegah Hydration Error
  useEffect(() => {
    setMounted(true);
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

  // Logika Filter Tabel (Ditambahkan logika Search)
  const filteredUsers = users.filter((user) => {
    const matchesFilter = selectedFilter === "Semua Status" || user.status === selectedFilter;
    const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenDetail = (user: UserData) => { setSelectedUser(user); setIsDetailOpen(true); };
  const handleOpenApprove = (user: UserData) => { setSelectedUser(user); setIsApproveModalOpen(true); };
  const handleOpenReject = (user: UserData) => { setSelectedUser(user); setIsRejectModalOpen(true); };

  const confirmApprove = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.email === selectedUser.email ? { ...u, status: "Aktif" } : u));
      setIsApproveModalOpen(false);
    }
  };

  const confirmReject = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.email !== selectedUser.email));
      setIsRejectModalOpen(false);
      setSelectedUser(null);
    }
  };

  // Helper Sidebar Item dengan Tooltip
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

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR */}
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
              <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - Admin</h1>
              <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
            </div>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" active={true} />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />

            <div className="pt-4 mt-4 border-t border-white/20">
               <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
               >
                <LogOut size={22} className="shrink-0" /> 
                {isSidebarOpen && <span>Keluar</span>}
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
        
        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between relative">
          <div className="p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="pb-4">
                <h3 className="text-3xl font-black text-gray-900">Manajemen User</h3>
                <p className="text-gray-500 font-medium">Kelola data Notaris dan PPAT</p>
              </div>

              {/* SEARCH BAR BARU (LENGKUNG SEMPURNA) */}
              <div className="relative max-w-md group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7c4d2d] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau email..." 
                  className="w-full pl-14 pr-12 py-3.5 bg-white border-2 border-transparent focus:border-[#7c4d2d] rounded-full outline-none font-bold shadow-md transition-all text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-5 px-10 flex justify-between items-center">
                  <h4 className="text-white font-bold text-xl">Daftar User</h4>

                  <div className="relative">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center justify-between bg-white px-6 py-2 rounded-full min-w-[160px] shadow-md transition-all active:scale-95"
                    >
                      <span className="text-[#1a1a1a] font-bold text-sm">{selectedFilter}</span>
                      <ChevronDown size={18} className={`ml-2 text-gray-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 mt-3 w-full bg-white rounded-[25px] p-2 shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50">
                        <div className="flex flex-col gap-1">
                          {["Semua Status", "Menunggu", "Aktif"].map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedFilter(option);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full py-2 px-4 rounded-full text-sm font-bold transition-colors text-center
                                ${selectedFilter === option 
                                  ? "bg-[#2563eb] text-white shadow-sm" 
                                  : "bg-[#f1f1f1] text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-3 border-gray-200">
                        <th className="px-6 py-4 text-sm font-bold text-gray-800">Nama Lengkap</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800">Email</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800">Jabatan</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800">Nomor HP</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800">Status</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-5 text-sm text-gray-600 font-medium">{user.nama}</td>
                            <td className="px-6 py-5 text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-5 text-sm text-gray-500 font-semibold">{user.jabatan}</td>
                            <td className="px-6 py-5 text-sm text-gray-500">{user.hp}</td>
                            <td className="px-6 py-5">
                              <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${
                                user.status === 'Aktif' ? 'bg-green-100 text-green-600 border-green-500' : 
                                'bg-orange-100 text-orange-600 border-orange-500'
                              }`}>{user.status}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleOpenDetail(user)} className="p-1.5 bg-blue-50 text-blue-600 border-2 border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"><Eye size={16} /></button>
                                {user.status === 'Aktif' ? (
                                  <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                                ) : (
                                  <>
                                    <button onClick={() => handleOpenApprove(user)} className="p-1.5 bg-green-50 text-green-600 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"><Check size={16} /></button>
                                    <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><X size={16} /></button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-bold italic">User tidak ditemukan...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* MODAL APPROVE */}
      {isApproveModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-bold text-green-600 mb-2">Setujui User</h3>
            <p className="text-gray-500 font-semibold text-lg">{selectedUser.nama}</p>
            <p className="mt-4 text-gray-700 font-semibold">Apakah Anda yakin ingin menyetujui akun ini?</p>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <button onClick={confirmApprove} className="px-10 py-3 rounded-full bg-green-600 text-white font-bold">Ya, Setujui</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJECT/DELETE */}
      {isRejectModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-bold text-red-600 mb-2">Hapus User</h3>
            <p className="text-gray-500 font-semibold text-lg">{selectedUser.nama}</p>
            <p className="mt-4 text-gray-700 font-semibold">Data user ini akan dihapus permanen. Lanjutkan?</p>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <button onClick={confirmReject} className="px-10 py-3 rounded-full bg-red-600 text-white font-bold">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsDetailOpen(false)} className="absolute top-8 right-8 text-red-600 hover:scale-110 transition-transform"><X size={32} strokeWidth={3} /></button>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Detail User</h3>
            <div className="space-y-4 text-lg">
              <div><p className="text-sm font-semibold text-gray-900">Nama Lengkap</p><p className="text-gray-500 font-medium">{selectedUser.nama}</p></div>
              <div><p className="text-sm font-semibold text-gray-900">Email</p><p className="text-gray-500 font-medium">{selectedUser.email}</p></div>
              <div><p className="text-sm font-semibold text-gray-900">Jabatan</p><p className="text-gray-500 font-medium">{selectedUser.jabatan}</p></div>
              <div><p className="text-sm font-semibold text-gray-900">Status</p><span className="text-green-600 font-bold">{selectedUser.status}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-500 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <Link href="/"><button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-200">Ya, Keluar</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}