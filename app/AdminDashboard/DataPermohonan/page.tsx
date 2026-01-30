"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Edit3,
  ChevronDown,
  Trash2,
  Edit,
  Menu,
  FileSpreadsheet,
  Search,
  Lock 
} from "lucide-react";

interface Permohonan {
  id: string;
  nama: string;
  email: string;
  jabatan: string;
  nama_notaris?: string | null;
  tgl: string;
  jenis: string;
  jenis_lainnya?: string | null;
  hak: string;
  noSertifikat: string;
  lokasi: string;
  kecamatan: string;
  status: string;
  catatan?: string | null;
}

export default function DataPermohonanPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedMohon, setSelectedMohon] = useState<Permohonan | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [catatanPenolakan, setCatatanPenolakan] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const updateDropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [userData, setUserData] = useState({
    nama: "",
    jabatan: "",
    nama_notaris: ""
  });

  const [allPermohonan, setAllPermohonan] = useState<Permohonan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAllPermohonan = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch('http://localhost:8000/api/all-permohonan', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Gagal parse response JSON:', e);
        }
        console.error('Fetch /all-permohonan error', response.status, errorData);

        // Jika tidak terautentikasi atau tidak diizinkan, arahkan ke halaman login
        if (response.status === 401 || response.status === 403) {
          setNotification({ type: 'error', message: 'Sesi berakhir atau tidak memiliki akses. Silakan login ulang.' });
          try {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          } catch (e) {
            // ignore
          }
          setTimeout(() => {
            if (typeof window !== 'undefined') window.location.href = '/Login';
          }, 1200);
          return;
        }

        throw new Error((errorData && errorData.message) || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setAllPermohonan(data);
    } catch (error) {
      console.error("Gagal mengambil data permohonan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          nama: user.nama_lengkap || user.nama || "User", 
          jabatan: user.jabatan || "Staff",
          nama_notaris: user.nama_notaris || ""
        });
      } catch (e) {
        console.error("Gagal parse data user", e);
      }
    }

    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
    fetchAllPermohonan();

    // Setup smart polling - refetch setiap 30 detik
    const pollInterval = setInterval(() => {
      fetchAllPermohonan();
    },  100000);

    // Setup visibility change - refetch saat tab menjadi aktif
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAllPermohonan();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

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

  const filteredData = allPermohonan
    .filter((item) => {
      // Filter untuk hanya menampilkan permohonan yang MENUNGGU atau DIPROSES
      const isActiveStatus = item.status === "Menunggu" || item.status === "Proses";
      const matchesSearch = 
        (item.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (item.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.noSertifikat || "").includes(searchTerm);
      return isActiveStatus && matchesSearch;
    })
    .sort((a, b) => {
      // Prioritas: Menunggu di atas, Proses di bawah
      if (a.status === "Menunggu" && b.status !== "Menunggu") return -1;
      if (a.status !== "Menunggu" && b.status === "Menunggu") return 1;
      return 0;
    });

  // Fungsi untuk membuka data (ubah status ke Proses)
  const handleInstantProcess = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch(`http://localhost:8000/api/permohonan/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'Proses' })
      });

      if (response.ok) {
        // Update UI
        setAllPermohonan(prev => prev.map(item => 
          item.id === id ? { ...item, status: "Proses" } : item
        ));
        setNotification({ type: 'success', message: 'Data permohonan dibuka. Status berubah menjadi Diproses' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        const errorData = await response.json();
        setNotification({ type: 'error', message: errorData.message || 'Gagal membuka data' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setNotification({ type: 'error', message: 'Terjadi kesalahan saat membuka data' });
    }
  };

  const handleOpenEdit = (mohon: Permohonan) => {
    setSelectedMohon(mohon);
    setNewStatus(mohon.status); 
    setCatatanPenolakan("");
    setIsEditPopupOpen(true);
    setIsUpdateStatusOpen(false);
  };

  const handleDeleteClick = (mohon: Permohonan) => {
    setSelectedMohon(mohon);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMohon) return;
    try {
      setIsSaving(true);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch(`http://localhost:8000/api/permohonan/${selectedMohon.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        setAllPermohonan(prev => prev.filter(item => item.id !== selectedMohon.id));
        setIsDeletePopupOpen(false);
        setSelectedMohon(null);
        setNotification({ type: 'success', message: 'Permohonan berhasil dihapus' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        const errorData = await response.json();
        setNotification({ type: 'error', message: errorData.message || 'Gagal menghapus permohonan' });
      }
    } catch (error) {
      console.error("Gagal menghapus permohonan:", error);
      setNotification({ type: 'error', message: 'Terjadi kesalahan saat menghapus' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedMohon || !newStatus) {
      setNotification({ type: 'error', message: 'Silakan pilih status terlebih dahulu' });
      return;
    }
    try {
      setIsSaving(true);
      const payload: any = { status: newStatus };
      if (newStatus === 'Ditolak' && catatanPenolakan.trim()) {
        payload.catatan = catatanPenolakan;
      }
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch(`http://localhost:8000/api/permohonan/${selectedMohon.id}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setAllPermohonan(prev => prev.map(item => 
          item.id === selectedMohon.id ? { ...item, status: newStatus } : item
        ));
        setIsEditPopupOpen(false);
        setSelectedMohon(null);
        setNewStatus("");
        setCatatanPenolakan("");
        setNotification({ type: 'success', message: `Status berhasil diubah menjadi ${newStatus}` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        const errorData = await response.json();
        setNotification({ type: 'error', message: errorData.message || 'Gagal mengupdate status' });
      }
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      setNotification({ type: 'error', message: 'Terjadi kesalahan saat mengupdate status' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    // Clear all user session data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sidebarStatus");
    // Redirect to home page
    router.push("/");
  };

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
    </Link>
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      {/* NOTIFICATION */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] px-6 py-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg mr-4">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <div className="flex flex-col">
              <h1 className="font-bold text-lg leading-none">KANTAH Gowa - Admin</h1>
              <p className="text-[10px] opacity-70 uppercase tracking-widest">Sistem Manajemen Internal</p>
            </div>
          </div>
        </div>
       <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out`}>
          <nav className="flex-1 px-3 py-8 space-y-4">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" active={true} />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit3} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />
            <div className="pt-4 mt-4 border-t border-white/20">
              <button onClick={() => setIsLogoutModalOpen(true)} className={`flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all ${isSidebarOpen ? "px-5 gap-3" : "justify-center"}`}>
                <LogOut size={22} /> {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-10">
          <div className="mx-auto text-left">
            <h3 className="text-3xl font-black text-gray-900">Manajemen Permohonan</h3>
            <p className="text-gray-500 border-b-2 border-gray-200 pb-4 font-medium mb-8">Kelola dan verifikasi permohonan</p>

            <div className="relative max-w-md mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama, email, atau no. sertifikat..." 
                className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-100 shadow-sm focus:border-[#56b35a] rounded-2xl outline-none font-semibold transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[35px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
              <div className="bg-[#8b5e3c] p-5 px-10 flex justify-between items-center text-white">
                <span className="font-bold text-lg">Daftar Permohonan ({filteredData.length})</span>
                <div className="relative min-w-45" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-between bg-white rounded-full px-5 py-2 cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <span className="text-gray-800 text-sm font-bold">{filterStatus}</span>
                    <ChevronDown size={16} className={`text-gray-700 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isFilterOpen && (
                    <div className="absolute left-0 mt-2 w-full bg-white shadow-2xl rounded-3xl p-3 z-50 border border-gray-50 animate-in fade-in zoom-in-95 duration-200">
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

              <div className="p-6 overflow-x-auto">
                {isLoading ? (
                  <div className="py-20 text-center text-gray-400 italic font-bold">Mengambil data permohonan...</div>
                ) : (
                  <table className="w-full text-sm text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-gray-800 font-bold text-[13px]">
                        <th className="px-6 py-2">Nama Pemohon</th>
                        <th className="px-6 py-2">Tgl Daftar</th>
                        <th className="px-6 py-2">Jenis</th>
                        <th className="px-6 py-2">Hak</th>
                        <th className="px-6 py-2">No. Sertipikat</th>
                        <th className="px-6 py-2">Lokasi</th>
                        <th className="px-6 py-2 text-center">Status</th>
                        <th className="px-6 py-2">Catatan</th>
                        <th className="px-6 py-2 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((mohon) => (
                          <tr 
                            key={mohon.id} 
                            className={`group transition-all duration-300 rounded-2xl ${
                              mohon.status === "Menunggu" ? "bg-white/60" : "bg-white hover:bg-gray-50 shadow-md"
                            }`}
                          >
                            <td className={`px-6 py-5 first:rounded-l-2xl transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>
                              {/* PERBAIKAN: Menampilkan nama dari user yang login */}
                              <p className="font-bold text-gray-800 text-[14px] uppercase">{mohon.nama || "PENGGUNA"}</p>
                              <div className="flex flex-col">
                                <p className="text-[11px] text-[#56b35a] font-bold uppercase">{mohon.jabatan || "-"}</p>
                                {mohon.nama_notaris && (
                                  <p className="text-[9px] text-gray-400 italic">{mohon.nama_notaris}</p>
                                )}
                              </div>
                            </td>
                            <td className={`px-6 py-5 text-gray-600 font-medium text-[13px] transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>{mohon.tgl}</td>
                            <td className={`px-6 py-5 transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>
                              <p className="text-gray-600 font-medium text-[13px]">{mohon.jenis}</p>
                              {mohon.jenis_lainnya && (
                                <p className="text-[11px] text-gray-400 italic mt-1">"{mohon.jenis_lainnya}"</p>
                              )}
                            </td>
                            <td className={`px-6 py-5 text-gray-600 font-medium text-[13px] transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>{mohon.hak}</td>
                            <td className={`px-6 py-5 text-gray-600 font-medium text-[13px] transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>{mohon.noSertifikat}</td>
                            <td className={`px-6 py-5 transition-all duration-700 ${mohon.status === "Menunggu" ? "blur-[5px] select-none opacity-40" : "blur-0"}`}>
                              <p className="font-bold text-gray-700 text-[13px] uppercase">{mohon.lokasi}</p>
                              <p className="text-[11px] text-gray-400 font-medium uppercase">{mohon.kecamatan}</p>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`inline-block px-5 py-1 rounded-full text-[12px] font-bold border-2 transition-all duration-300 ${
                                mohon.status === "Disetujui" ? "border-green-500 text-green-500 bg-white" :
                                mohon.status === "Proses" ? "border-blue-400 text-blue-500 bg-white" :
                                mohon.status === "Ditolak" ? "border-red-400 text-red-500 bg-white" :
                                "border-[#ff8a3d] text-[#ff8a3d] bg-white"
                              }`}>
                                {mohon.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-xs text-gray-600 italic max-w-xs truncate" title={mohon.catatan || ""}>
                              {mohon.catatan ? mohon.catatan : "-"}
                            </td>
                            <td className="px-6 py-5 last:rounded-r-2xl">
                              <div className="flex justify-center gap-2">
                                {mohon.status === "Menunggu" ? (
                                  <button onClick={() => handleInstantProcess(mohon.id)} className="flex items-center gap-2 px-4 py-2 bg-[#7c4d2d] text-white rounded-full font-bold text-[11px] hover:bg-[#5d3a22] transition-all">
                                    <Lock size={14} /> BUKA DATA
                                  </button>
                                ) : (
                                  <>
                                    <button onClick={() => handleOpenEdit(mohon)} className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                      <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(mohon)} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-gray-400">Data tidak ditemukan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL HAPUS */}
      {isDeletePopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[30px] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-[24px] font-bold text-[#e60000] mb-1">Hapus Permohonan</h3>
            <p className="text-[18px] font-semibold text-gray-700 ">{selectedMohon.nama}</p>
            <p className="text-gray-600 font-medium text-[15px] mb-8">Data ini akan dihapus permanen. Lanjutkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeletePopupOpen(false)} disabled={isSaving} className="px-8 py-2.5 rounded-full border-2 border-gray-100 font-bold text-gray-400 disabled:opacity-50">Batal</button>
              <button onClick={confirmDelete} disabled={isSaving} className="px-8 py-2.5 rounded-full bg-[#e60000] text-white font-bold shadow-lg disabled:opacity-50">{isSaving ? 'Menghapus...' : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT STATUS */}
      {isEditPopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[25px] w-full max-w-xl shadow-2xl relative text-left p-0 animate-in fade-in zoom-in duration-200 border-2 border-[#7c4d2d] my-auto max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-8 overflow-y-auto flex-1">
            <div className="flex justify-between items-start mb-5">
                <h2 className="text-xl font-black text-gray-900">Detail Permohonan</h2>
                <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest border border-blue-100 uppercase">Verifikasi Data</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Pemohon</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.nama}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kecamatan</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.kecamatan}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Pendaftaran</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.jenis}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Desa/Kelurahan</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.lokasi}</p></div>
              {selectedMohon.jenis_lainnya && (
                <div className="col-span-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500"><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keterangan Lainnya</p><p className="text-gray-700 font-medium text-[13px] italic">'{selectedMohon.jenis_lainnya}'</p></div>
              )}
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Hak</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.hak}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Pendaftaran</p><p className="text-gray-800 font-bold text-[14px]">{selectedMohon.tgl}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">No. Sertipikat</p><p className="text-blue-600 font-black text-[15px]">{selectedMohon.noSertifikat}</p></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status Saat ini</p>
                <span className={`inline-block px-4 py-0.5 rounded-full border-2 font-bold text-[11px] bg-white ${
                  selectedMohon.status === "Disetujui" ? "border-green-500 text-green-500" :
                  selectedMohon.status === "Proses" ? "border-blue-400 text-blue-500" :
                  selectedMohon.status === "Ditolak" ? "border-red-400 text-red-500" :
                  "border-[#ff8a3d] text-[#ff8a3d]"
                }`}>{selectedMohon.status}</span>
              </div>
              {selectedMohon.catatan && (
                <div className="col-span-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500"><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Catatan Admin</p><p className="text-gray-700 font-medium text-[13px]">{selectedMohon.catatan}</p></div>
              )}
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-3">Tentukan Keputusan</h3>
            <div className="mb-6 relative" ref={updateDropdownRef}> 
              <div 
                onClick={() => setIsUpdateStatusOpen(!isUpdateStatusOpen)}
                className="flex items-center justify-between w-full p-4 bg-white border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
              >
                <span className={`text-[14px] font-bold ${newStatus === 'Ditolak' ? 'text-red-500' : newStatus === 'Disetujui' ? 'text-green-600' : 'text-gray-700'}`}>{newStatus || 'Pilih Status'}</span>
                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isUpdateStatusOpen ? 'rotate-180' : ''}`} />
              </div>
              {isUpdateStatusOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white shadow-2xl rounded-[20px] p-2 z-[150] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-1">
                    {["Disetujui", "Ditolak"].map((status) => (
                      <button key={status} type="button" onClick={() => {setNewStatus(status); setIsUpdateStatusOpen(false);}} className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${newStatus === status ? (status === 'Disetujui' ? "bg-green-500 text-white shadow-md" : "bg-red-500 text-white shadow-md") : "text-gray-700 hover:bg-gray-100"}`}>{status}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {newStatus === 'Ditolak' && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <label className="text-sm font-bold text-red-900 block mb-2">Alasan Penolakan</label>
                {selectedMohon?.catatan ? (
                  <div className="w-full p-3 border border-red-300 rounded-lg bg-white text-gray-800 text-sm min-h-[100px] flex items-start">
                    <p className="text-gray-700">{selectedMohon.catatan}</p>
                  </div>
                ) : (
                  <textarea 
                    value={catatanPenolakan}
                    onChange={(e) => setCatatanPenolakan(e.target.value)}
                    placeholder="Jelaskan alasan permohonan ditolak..."
                    className="w-full p-3 border border-red-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                  />
                )}
                {selectedMohon?.catatan && (
                  <p className="text-xs text-red-700 mt-2 font-semibold italic">✓ Alasan penolakan sudah ditulis dan tidak dapat diubah</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 px-8 pb-8 bg-white border-t border-gray-100">
              <button onClick={() => setIsEditPopupOpen(false)} disabled={isSaving} className="px-8 py-3 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition text-sm disabled:opacity-50">Batal</button>
              <button onClick={handleUpdateStatus} disabled={isSaving || !newStatus} className="px-10 py-3 rounded-full bg-[#1a1a1a] text-white font-bold hover:bg-black transition shadow-lg text-sm disabled:opacity-50">{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
            </div>
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