"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Eye,
  UserX,
  Check,
  X,
  Trash2 // Menambahkan icon tempat sampah
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
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [users, setUsers] = useState<UserData[]>([
    { nama: "Nabila Humairah AR", email: "bila00@gmail.com", jabatan: "PPAT", hp: "09876543234", tgl: "11 Januari 2026", status: "Aktif" },
    { nama: "Niki Renaningtyas", email: "tyas01@gmail.com", jabatan: "Notaris", hp: "07653456782", tgl: "12 Januari 2026", status: "Aktif" },
    { nama: "Nurul Karimah", email: "nkarimah421@gmail.com", jabatan: "Notaris", hp: "081341062046", tgl: "13 Januari 2026", status: "Menunggu" },
  ]);

  const handleOpenDetail = (user: UserData) => { setSelectedUser(user); setIsDetailOpen(true); };
  const handleOpenDeactivate = (user: UserData) => { setSelectedUser(user); setIsDeactivateModalOpen(true); };
  const handleOpenActivate = (user: UserData) => { setSelectedUser(user); setIsActivateModalOpen(true); };
  const handleOpenApprove = (user: UserData) => { setSelectedUser(user); setIsApproveModalOpen(true); };
  const handleOpenReject = (user: UserData) => { setSelectedUser(user); setIsRejectModalOpen(true); };

  const confirmApprove = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.email === selectedUser.email ? { ...u, status: "Aktif" } : u));
      setIsApproveModalOpen(false);
    }
  };

  // Logika Otomatis Hapus Data saat ditolak/dihapus
  const confirmReject = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.email !== selectedUser.email));
      setIsRejectModalOpen(false);
      setSelectedUser(null);
    }
  };

  const confirmDeactivate = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.email === selectedUser.email ? { ...u, status: "Tidak Aktif" } : u));
      setIsDeactivateModalOpen(false);
    }
  };

  const confirmActivate = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.email === selectedUser.email ? { ...u, status: "Aktif" } : u));
      setIsActivateModalOpen(false);
    }
  };

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
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">Administrator</h2>
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
                <div className="bg-[#8b5e3c] p-5 px-10"><h4 className="text-white font-bold text-xl">Daftar User</h4></div>
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
                    <tbody className="divide-y divide-gray-50">
                      {users.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 text-sm text-gray-600 font-medium">{user.nama}</td>
                          <td className="px-6 py-5 text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-5 text-sm text-gray-500 font-semibold">{user.jabatan}</td>
                          <td className="px-6 py-5 text-sm text-gray-500">{user.hp}</td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${
                              user.status === 'Aktif' ? 'bg-green-100 text-green-600 border-green-500' : 
                              user.status === 'Menunggu' ? 'bg-orange-100 text-orange-600 border-orange-500' : 
                              'bg-red-100 text-red-600 border-red-500'
                            }`}>{user.status}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleOpenDetail(user)} className="p-1.5 bg-blue-50 text-blue-600 border-2 border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"><Eye size={16} /></button>

                              {user.status === 'Aktif' ? (
                                <>
                                  <button onClick={() => handleOpenDeactivate(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><UserX size={16} /></button>
                                  {/* Icon Trash untuk hapus user aktif */}
                                  <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                                </>
                              ) : user.status === 'Tidak Aktif' ? (
                                <>
                                  <button onClick={() => handleOpenActivate(user)} className="p-1.5 bg-green-50 text-green-600 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"><Check size={16} /></button>
                                  <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleOpenApprove(user)} className="p-1.5 bg-green-50 text-green-600 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"><Check size={16} /></button>
                                  <button onClick={() => handleOpenReject(user)} className="p-1.5 bg-red-50 text-red-600 border-2 border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><X size={16} /></button>
                                </>
                              )}
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

        {/* FOOTER HITAM */}
          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 uppercase tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>

        </main>
      </div>

      {/* POPUP SETUJU */}
      {isApproveModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-green-600">Setujui User</h3>
            <div className="mb-8 text-left">
              <p className="text-gray-500 font-semibold text-lg">{selectedUser.nama}</p>
              <p className="mt-4 text-gray-700 font-semibold">Apakah Anda yakin ingin menyetujui akun ini?</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold text-gray-700">Batal</button>
              <button onClick={confirmApprove} className="px-10 py-3 rounded-full bg-green-600 text-white font-bold shadow-lg shadow-green-200">Ya, Setujui</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP HAPUS/TOLAK */}
      {isRejectModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-red-600">Hapus User</h3>
            <div className="mb-8 text-left">
              <p className="text-gray-500 font-semibold text-lg">{selectedUser.nama}</p>
              <p className="mt-4 text-gray-700 font-semibold">Data user ini akan dihapus permanen dari sistem. Lanjutkan?</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold text-gray-700">Batal</button>
              <button onClick={confirmReject} className="px-10 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-200">Ya, Hapus</button>
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
            <div className="space-y-4 text-lg text-left">
              <div><p className="text-sm font-semibold text-gray-900 uppercase">Nama Lengkap</p><p className="text-gray-500 font-medium">{selectedUser.nama}</p></div>
              <div><p className="text-sm font-semibold text-gray-900 uppercase">Email</p><p className="text-gray-500 font-medium">{selectedUser.email}</p></div>
              <div><p className="text-sm font-semibold text-gray-900 uppercase">Jabatan</p><p className="text-gray-500 font-medium">{selectedUser.jabatan}</p></div>
              <div><p className="text-sm font-semibold text-gray-900 uppercase">Status</p><span className="text-green-600 font-bold">{selectedUser.status}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* NONAKTIFKAN MODAL */}
      {isDeactivateModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-black text-gray-900 mb-2">Nonaktifkan User</h3>
            <div className="mb-8 text-left">
              <p className="text-gray-500 font-bold text-lg">{selectedUser.nama}</p>
              <p className="mt-4 text-gray-700 font-bold">User ini tidak akan bisa mengakses sistem sementara waktu.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeactivateModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold text-gray-700">Batal</button>
              <button onClick={confirmDeactivate} className="px-10 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-200">Nonaktifkan</button>
            </div>
          </div>
        </div>
      )}

      {/* AKTIFKAN MODAL */}
      {isActivateModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-black text-gray-900 mb-2 text-green-600">Aktifkan User</h3>
            <div className="mb-8 text-left">
              <p className="text-gray-500 font-bold text-lg">{selectedUser.nama}</p>
              <p className="mt-4 text-gray-700 font-bold">Apakah Anda yakin ingin mengaktifkan kembali akses user ini?</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsActivateModalOpen(false)} className="px-10 py-3 rounded-full border-2 border-gray-200 font-bold text-gray-700">Batal</button>
              <button onClick={confirmActivate} className="px-10 py-3 rounded-full bg-green-600 text-white font-bold shadow-lg shadow-green-200">Ya, Aktifkan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP KELUAR */}
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