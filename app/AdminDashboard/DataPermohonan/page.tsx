"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Edit3,
  ChevronDown,
  Trash2,
  Eye,
  X
} from "lucide-react";

interface Permohonan {
  id: string;
  nama: string;
  email: string;
  tgl: string;
  jenis: string;
  hak: string;
  noSertifikat: string;
  lokasi: string;
  kecamatan: string;
  status: string;
}

export default function DataPermohonanPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedMohon, setSelectedMohon] = useState<Permohonan | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // STATE UNTUK FILTER
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  
  const [dataMohon, setDataMohon] = useState<Permohonan[]>([
    { id: "1", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "11 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", kecamatan: "Barombong", status: "Menunggu" },
    { id: "2", nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tgl: "12 Januari 2026", jenis: "SKPT", hak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", kecamatan: "Baringkanaya", status: "Menunggu" },
    { id: "3", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "13 Januari 2026", jenis: "SKPT", hak: "Hak Milik", noSertifikat: "54326", lokasi: "Katangka", kecamatan: "Jeneberang", status: "Menunggu" },
    { id: "4", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "14 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", noSertifikat: "24556", lokasi: "Sepakat", kecamatan: "Andi tonro", status: "Menunggu" },
  ]);

  // LOGIKA FILTERING DATA
  const filteredData = dataMohon.filter((item) => {
    if (filterStatus === "Semua Status") return true;
    return item.status === filterStatus;
  });

  const handleInstantProcess = (id: string) => {
    setDataMohon(prev => prev.map(item => 
      item.id === id ? { ...item, status: "Proses" } : item
    ));
  };

  const handleOpenEdit = (mohon: Permohonan) => {
    setSelectedMohon(mohon);
    setNewStatus(mohon.status); 
    setIsEditPopupOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedMohon) {
      setDataMohon(prev => prev.map(item => 
        item.id === selectedMohon.id ? { ...item, status: newStatus } : item
      ));
      setIsEditPopupOpen(false);
    }
  };

  const handleOpenDelete = (mohon: Permohonan) => {
    setSelectedMohon(mohon);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMohon) {
      setDataMohon(prev => prev.filter(item => item.id !== selectedMohon.id));
      setIsDeletePopupOpen(false);
      setSelectedMohon(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <div className="text-left">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - Admin</h1>
            <p className="text-[10px] opacity-70">Sistem Manajemen Internal</p>
          </div>
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl">
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link href="/AdminDashboard"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><LayoutDashboard size={22} /> Beranda</button></Link>
            <Link href="/AdminDashboard/DataUser"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><Users size={22} /> Data User</button></Link>
            <Link href="/AdminDashboard/DataPermohonan"><button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold shadow-lg text-left"><FileText size={22} /> Data Permohonan</button></Link>
            <Link href="/AdminDashboard/Pengaturan"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><Settings size={22} /> Pengaturan</button></Link>
            <div className="pt-4 border-t border-white/20 mt-4">
              <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl transition text-left font-bold"><LogOut size={22} /> Keluar</button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10">
            <div className="max-w-[1400px] mx-auto text-left">
              <h3 className="text-3xl font-black text-gray-900 ">Manajemen Permohonan</h3>
              <p className="text-gray-500 font-medium mb-8">Kelola dan verifikasi permohonan</p>

              <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                {/* HEADER TABEL DENGAN FILTER SESUAI GAMBAR */}
                <div className="bg-[#8b5e3c] p-5 px-10 flex justify-between items-center text-white">
                  <span className="font-bold text-lg">Daftar Permohonan</span>
                  
                  {/* SELECT FILTER STATUS */}
                  <div className="relative flex items-center bg-white rounded-full px-4 py-1">
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent text-gray-700 text-sm font-bold outline-none appearance-none pr-6 cursor-pointer"
                    >
                      <option value="Semua Status">Semua Status</option>
                      <option value="Proses">Proses</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                    <ChevronDown size={16} className="text-gray-700 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm text-left border-separate border-spacing-y-0">
                    <thead>
                      <tr className=" text-gray-800 font-bold text-[13px] uppercase tracking- border-b-2 border-gray-200">
                        <th className="px-6 py-5">Nama Notaris/PPAT</th>
                        <th className="px-6 py-5">Tgl Daftar</th>
                        <th className="px-6 py-5">Jenis Pendaftaran</th>
                        <th className="px-6 py-5">Jenis Hak</th>
                        <th className="px-6 py-5">No. Sertipikat</th>
                        <th className="px-6 py-5">Lokasi</th>
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-6 py-5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* MENGGUNAKAN filteredData BUKAN dataMohon */}
                      {filteredData.length > 0 ? (
                        filteredData.map((mohon) => (
                          <tr key={mohon.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 text-[14px]">{mohon.nama}</p>
                              <p className="text-[11px] text-gray-400 font-medium">{mohon.email}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium text-[13px]">{mohon.tgl}</td>
                            <td className="px-6 py-4 text-gray-600 font-medium text-[13px]">{mohon.jenis}</td>
                            <td className="px-6 py-4 text-gray-600 font-medium text-[13px]">{mohon.hak}</td>
                            <td className="px-6 py-4 text-gray-600 font-medium text-[13px] tracking-wider">{mohon.noSertifikat}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-700 text-[13px]">{mohon.lokasi}</p>
                              <p className="text-[11px] text-gray-400 font-medium">{mohon.kecamatan}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-5 py-0.5 rounded-full text-[12px] font-bold border-2 transition-all duration-300 ${
                                mohon.status === "Disetujui" ? "border-green-500 text-green-500 bg-white" :
                                mohon.status === "Proses" ? "border-blue-400 text-blue-500 bg-white" :
                                mohon.status === "Ditolak" ? "border-red-400 text-red-500 bg-white" :
                                "border-[#ff8a3d] text-[#ff8a3d] bg-white"
                              }`}>
                                {mohon.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleInstantProcess(mohon.id)} className="p-1.5 text-green-600 border-2 border-green-500 rounded-lg hover:bg-green-600 hover:text-white transition active:scale-90"><Eye size={16} /></button>
                                <button onClick={() => handleOpenEdit(mohon)} className="p-1.5 text-blue-500 border-2 border-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"><Edit3 size={16} /></button>
                                <button onClick={() => handleOpenDelete(mohon)} className="p-1.5 text-red-500 border-2 border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-10 text-gray-400 font-medium italic">
                            Tidak ada data dengan status "{filterStatus}"
                          </td>
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
            <p className="text-[9px] opacity-50 uppercase tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* MODAL EDIT STATUS */}
      {isEditPopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[25px] w-full max-w-xl shadow-2xl overflow-hidden text-left p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 mb-5">Detail Permohonan</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
              <div><p className="text-[13px] font-bold text-gray-700">Nama Notaris/PPAT</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.nama}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">Kecamatan</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.kecamatan}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">Jenis Pendaftaran</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.jenis}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">Desa/Kelurahan</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.lokasi}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">Jenis Hak</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.hak}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">Tanggal Pendaftaran</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.tgl}</p></div>
              <div><p className="text-[13px] font-bold text-gray-700">No. Sertipikat</p><p className="text-gray-400 font-medium text-[13px]">{selectedMohon.noSertifikat}</p></div>
              <div>
                <p className="text-[13px] font-bold text-gray-700 mb-1">Status Saat ini</p>
                <span className="inline-block px-4 py-0.5 rounded-full border-2 font-bold text-[11px] border-gray-300 text-gray-500">{selectedMohon.status}</span>
              </div>
            </div>
            <hr className="border-gray-100 mb-6" />
            <h3 className="text-lg font-black text-gray-900 mb-3">Update Status</h3>
            <div className="mb-8">
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Status Baru</label>
              <div className="relative group">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-[14px] font-bold appearance-none outline-none focus:border-gray-400 transition-colors text-gray-700">
                  <option value="Proses">Proses</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditPopupOpen(false)} className="px-6 py-2 rounded-full border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition text-sm">Tutup</button>
              <button onClick={handleUpdateStatus} className="px-6 py-2 rounded-full bg-[#4CAF50] text-white font-bold hover:bg-[#43a047] transition shadow-md text-sm">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP HAPUS */}
      {isDeletePopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[30px] p-10 w-full max-w-md shadow-2xl text-left animate-in fade-in zoom-in duration-200">
            <h3 className="text-[24px] font-bold text-[#e60000] mb-1 tracking-tight">Hapus Permohonan</h3>
            <p className="text-[18px] font-semibold text-gray-700 ">{selectedMohon.nama}</p>
            <p className="text-[18px] font-semibold text-gray-700 ">{selectedMohon.email}</p>
            <p className="text-gray-600 font-medium text-[15px] leading-relaxed mb-8">Permohonan user ini akan dihapus permanen dari sistem. Lanjutkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeletePopupOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition text-sm">Batal</button>
              <button onClick={confirmDelete} className="px-8 py-2.5 rounded-full bg-[#e60000] text-white font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-200 active:scale-95">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP UP KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-500 font-medium leading-relaxed mt-4">Anda akan keluar dari admin panel. Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition">Batal</button>
              <Link href="/"><button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">Ya, Keluar</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}