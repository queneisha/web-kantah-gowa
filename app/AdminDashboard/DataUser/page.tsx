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
  Trash2 
} from "lucide-react";

// Properti nama_notaris ditambahkan ke Interface
interface UserData {
  id: number;
  nama_lengkap: string;
  email: string;
  jabatan: string;
  nama_notaris?: string; // Menampung data nama atasan
  nomor_hp: string;
  status: string;
}

export default function DataUserPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua Status");

  const [users, setUsers] = useState<UserData[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmApprove = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${selectedUser.id}/approve`, {
          method: 'PUT',
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alert("User berhasil diaktifkan!");
          setIsApproveModalOpen(false);
          fetchUsers();
        }
      } catch (error) {
        alert("Gagal menghubungi server.");
      }
    }
  };

  const confirmReject = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${selectedUser.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("User berhasil dihapus.");
          setIsRejectModalOpen(false);
          fetchUsers();
        }
      } catch (error) {
        alert("Gagal menghapus user.");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    if (selectedFilter === "Semua Status") return true;
    return user.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleOpenDetail = (user: UserData) => { setSelectedUser(user); setIsDetailOpen(true); };
  const handleOpenApprove = (user: UserData) => { setSelectedUser(user); setIsApproveModalOpen(true); };
  const handleOpenReject = (user: UserData) => { setSelectedUser(user); setIsRejectModalOpen(true); };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - Admin</h1>
            <p className="text-[10px] opacity-70">Sistem Manajemen Internal</p>
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-widest opacity-90">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20">
          <nav className="flex-1 px-4 py-8 space-y-4">
            <Link href="/AdminDashboard"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left"><LayoutDashboard size={22} /> Beranda</button></Link>
            <Link href="/AdminDashboard/DataUser"><button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-semibold transition shadow-lg text-left"><Users size={22} /> Data User</button></Link>
            <Link href="/AdminDashboard/DataPermohonan"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left"><FileText size={22} /> Data Permohonan</button></Link>
            <Link href="/AdminDashboard/Pengaturan"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl font-bold transition text-left"><Settings size={22} /> Pengaturan</button></Link>
            <div className="pt-4 mt-4 border-t border-white/20">
              <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl font-bold transition text-left"><LogOut size={22} /> Keluar</button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between relative">
          <div className="p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="pb-4">
                <h3 className="text-3xl font-black text-gray-900">Manajemen User</h3>
                <p className="text-gray-500 font-medium">Kelola data Notaris dan PPAT</p>
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
                              onClick={() => { setSelectedFilter(option); setIsFilterOpen(false); }}
                              className={`w-full py-2 px-4 rounded-full text-sm font-bold transition-colors text-center
                                ${selectedFilter === option ? "bg-[#2563eb] text-white" : "bg-[#f1f1f1] text-gray-700 hover:bg-gray-200"}`}
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 text-sm text-gray-600 font-medium">{user.nama_lengkap}</td>
                          <td className="px-6 py-5 text-sm text-gray-500">{user.email}</td>
                          
                          {/* KOLOM JABATAN DENGAN LOGIKA OTOMATIS */}
                          <td className="px-6 py-5 text-sm text-gray-500 font-semibold">
                            <div className="flex flex-col">
                              <span>{user.jabatan}</span>
                              {user.jabatan === "Sekertaris Notaris/PPAT" && user.nama_notaris && (
                                <span className="text-[10px] text-blue-600 italic font-bold mt-1">
                                  Atasan: {user.nama_notaris}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-500">{user.nomor_hp}</td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${
                              user.status === 'Aktif' ? 'bg-green-100 text-green-600 border-green-500' : 'bg-orange-100 text-orange-600 border-orange-500'
                            }`}>{user.status}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleOpenDetail(user)} className="p-1.5 bg-blue-50 text-blue-600 border-2 border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"><Eye size={16} /></button>
                              {user.status !== 'Aktif' && (
                                <button onClick={() => handleOpenApprove(user)} className="p-1.5 bg-green-50 text-green-600 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"><Check size={16} /></button>
                              )}
                              <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
          </footer>
        </main>
      </div>

      {/* MODAL APPROVE */}
      {isApproveModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-green-600">Setujui User</h3>
            <div className="mb-8 text-left">
              <p className="text-gray-500 font-semibold text-lg">{selectedUser.nama_lengkap}</p>
              <p className="mt-4 text-gray-700 font-semibold">Aktifkan akun ini sekarang?</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <button onClick={confirmApprove} className="px-10 py-3 rounded-full bg-green-600 text-white font-bold">Ya, Setujui</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJECT / DELETE */}
      {isRejectModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-3xl font-bold text-red-600 mb-2">Hapus User</h3>
            <p className="text-gray-700 mb-8">Hapus {selectedUser.nama_lengkap} secara permanen?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <button onClick={confirmReject} className="px-10 py-3 rounded-full bg-red-600 text-white font-bold">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (DIPERBARUI DENGAN NAMA NOTARIS) */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsDetailOpen(false)} className="absolute top-8 right-8 text-red-600"><X size={32} /></button>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Detail User</h3>
            <div className="space-y-4">
              <div><p className="text-sm font-bold text-[#7c4d2d]">Nama Lengkap</p><p className="font-medium">{selectedUser.nama_lengkap}</p></div>
              <div><p className="text-sm font-bold text-[#7c4d2d]">Email</p><p className="font-medium">{selectedUser.email}</p></div>
              <div>
                <p className="text-sm font-bold text-[#7c4d2d]">Jabatan</p>
                <p className="font-medium">{selectedUser.jabatan}</p>
                {selectedUser.jabatan === "Sekertaris Notaris/PPAT" && selectedUser.nama_notaris && (
                   <p className="text-xs text-blue-600 font-bold italic mt-1 bg-blue-50 p-2 rounded-lg border border-blue-200">
                     Bekerja pada Notaris: {selectedUser.nama_notaris}
                   </p>
                )}
              </div>
              <div><p className="text-sm font-bold text-[#7c4d2d]">Nomor HP</p><p className="font-medium">{selectedUser.nomor_hp}</p></div>
              <div><p className="text-sm font-bold text-[#7c4d2d]">Status</p><span className={`font-bold ${selectedUser.status === 'Aktif' ? 'text-green-600' : 'text-orange-600'}`}>{selectedUser.status}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Yakin untuk keluar?</h3>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-200 font-bold">Batal</button>
              <Link href="/"><button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold">Ya, Keluar</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}