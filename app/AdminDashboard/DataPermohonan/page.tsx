"use client";
import React, { useState, useRef, useEffect } from "react";
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
  X,
  Edit,
  Menu,
  FileSpreadsheet,
  Search
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
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedMohon, setSelectedMohon] = useState<Permohonan | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const updateDropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Handle Click Outside Dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (updateDropdownRef.current && !updateDropdownRef.current.contains(event.target as Node)) {
        setIsUpdateStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [dataMohon, setDataMohon] = useState<Permohonan[]>([
    { id: "1", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "11 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", noSertifikat: "32143", lokasi: "Somba Opu", kecamatan: "Barombong", status: "Menunggu" },
    { id: "2", nama: "Niki Renaningtyas", email: "tyas01@gmail.com", tgl: "12 Januari 2026", jenis: "SKPT", hak: "Hak Milik", noSertifikat: "65487", lokasi: "Palangga", kecamatan: "Baringkanaya", status: "Menunggu" },
    { id: "3", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "13 Januari 2026", jenis: "SKPT", hak: "Hak Milik", noSertifikat: "54326", lokasi: "Katangka", kecamatan: "Jeneberang", status: "Menunggu" },
    { id: "4", nama: "Nabila Humairah AR", email: "bila00@gmail.com", tgl: "14 Januari 2026", jenis: "Pengecekan", hak: "Hak Guna Bangunan", noSertifikat: "24556", lokasi: "Sepakat", kecamatan: "Andi tonro", status: "Menunggu" },
  ]);

  const filteredData = dataMohon.filter((item) => {
  const matchesStatus = filterStatus === "Semua Status" || item.status === filterStatus;
  const matchesSearch = 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.noSertifikat.includes(searchTerm);
  
  return matchesStatus && matchesSearch;
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
    setIsUpdateStatusOpen(false);
  };

  const handleUpdateStatus = () => {
    if (selectedMohon) {
      setDataMohon(prev => prev.map(item => 
        item.id === selectedMohon.id ? { ...item, status: newStatus } : item
      ));
      setIsEditPopupOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedMohon) {
      setDataMohon(prev => prev.filter(item => item.id !== selectedMohon.id));
      setIsDeletePopupOpen(false);
      setSelectedMohon(null);
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
                          <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - Admin</h1>
                          <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
                  </header>
            
                  <div className="flex flex-1 overflow-hidden">
                    
                    {/* SIDEBAR COKELAT */}
                    <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
                      <nav className="flex-1 px-3 py-8 space-y-4">
                        <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
                        <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
                        <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" active={true} />
                        <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
                        <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
                        <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />
            
                        {/* Tombol Keluar */}
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

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10">
            <div className="mx-auto text-left">
              <h3 className="text-3xl font-black text-gray-900 ">Manajemen Permohonan</h3>
              <p className="text-gray-500 border-b-2 border-gray-200 pb-4 font-medium mb-8">Kelola dan verifikasi permohonan</p>

              <div className="relative max-w-md mb-8 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#7c4d2d] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama, email, atau no. sertifikat..." 
                className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-100 shadow-sm focus:border-[#56b35a] rounded-2xl outline-none font-semibold transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                <X size={18} />
                </button>
               )}
              </div>
            </div>
              <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-5 px-10 flex justify-between items-center text-white">
                  <span className="font-bold text-lg">Daftar Permohonan</span>
                  
                  <div className="relative min-w-45" ref={dropdownRef}>
                    <div 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center justify-between bg-white rounded-full px-5 py-2 cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
                    >
                      <span className="text-gray-800 text-sm font-bold">{filterStatus}</span>
                      <ChevronDown size={16} className={`text-gray-700 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isFilterOpen && (
                      <div className="absolute left-0 mt-2 w-full bg-white shadow-2xl rounded-3xl p-3 z-100 border border-gray-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-1.5">
                          {["Semua Status", "Proses", "Disetujui", "Ditolak"].map((status) => (
                            <button
                              key={status}
                              onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                              className={`w-full py-2 px-4 rounded-full text-sm font-bold text-center transition-all
                                ${filterStatus === status ? "bg-[#2563eb] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-800 font-bold text-[13px] border-b-2 border-gray-200">
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
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((mohon) => (
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
                              <button onClick={() => {setSelectedMohon(mohon); setIsDeletePopupOpen(true);}} className="p-1.5 text-red-500 border-2 border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
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
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* MODAL EDIT STATUS */}
      {isEditPopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[25px] w-full max-w-xl shadow-2xl relative text-left p-8 animate-in fade-in zoom-in duration-200">
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
            <div className="mb-6 relative" ref={updateDropdownRef}> 
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Status Baru</label>
              <div 
                onClick={() => setIsUpdateStatusOpen(!isUpdateStatusOpen)}
                className="flex items-center justify-between w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-all"
              >
                <span className="text-gray-700 text-[14px] font-bold">{newStatus}</span>
                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isUpdateStatusOpen ? 'rotate-180' : ''}`} />
              </div>
              {isUpdateStatusOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white shadow-2xl rounded-[20px] p-2 z-[150] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-1">
                    {["Disetujui", "Ditolak"].map((status) => (
                      <button key={status} type="button" onClick={() => {setNewStatus(status); setIsUpdateStatusOpen(false);}} className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold text-center transition-all ${newStatus === status ? "bg-[#2563eb] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}>{status}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsEditPopupOpen(false)} className="px-6 py-2 rounded-full border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition text-sm">Tutup</button>
              <button onClick={handleUpdateStatus} className="px-6 py-2 rounded-full bg-[#4CAF50] text-white font-bold hover:bg-[#43a047] transition shadow-md text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeletePopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[30px] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-[24px] font-bold text-[#e60000] mb-1">Hapus Permohonan</h3>
            <p className="text-[18px] font-semibold text-gray-700 ">{selectedMohon.nama}</p>
            <p className="text-gray-600 font-medium text-[15px] mb-8">Data ini akan dihapus permanen. Lanjutkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeletePopupOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-100 font-bold text-gray-400">Batal</button>
              <button onClick={confirmDelete} className="px-8 py-2.5 rounded-full bg-[#e60000] text-white font-bold shadow-lg">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-500 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 text-gray-600 border-gray-600 font-bold">Batal</button>
              <Link href="/"><button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-200">Ya, Keluar</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}