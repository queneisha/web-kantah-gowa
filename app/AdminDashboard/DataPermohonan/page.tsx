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
  ChevronDown,
  Trash2,
  Edit,
  Menu,
  FileSpreadsheet,
  Search,
  Lock,
  X 
} from "lucide-react";

interface Permohonan {
  id: string;
  nama: string;
  email: string;
  jabatan: string;
  nama_notaris?: string | null;
  tgl: string;
  jenis: string;
  jenis_lainnya?: string | null; // Tambahan field jika ada
  hak: string;
  noSertifikat: string;
  lokasi: string;
  kecamatan: string;
  status: string;
  catatan_pendaftaran?: string | null;
  catatan_admin?: string | null; // Untuk riwayat penolakan
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

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });
  
  const [navData, setNavData] = useState({
    navText1:"KANTAH Gowa", 
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon:"/logo.png",
  });

  useEffect(() => {
    setMounted(true);
    fetchNavbarData();
    fetchAllPermohonan();
    fetchKonten();

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          nama: user.nama_lengkap || user.nama || "User", 
          jabatan: user.jabatan || "Staff",
          nama_notaris: user.nama_notaris || ""
        });
      } catch (e) { console.error(e); }
    }

    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    } else {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }
  }, []);

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
  };

  const fetchKonten = async () => {
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
    } catch (error) { console.error(error); }
  };

  const fetchAllPermohonan = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/all-permohonan', {
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.clear();
          window.location.href = '/Login';
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setAllPermohonan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = allPermohonan
    .filter((item) => {
      const isActiveStatus = item.status === "Menunggu" || item.status === "Proses";
      const matchesSearch = 
        (item.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (item.noSertifikat || "").includes(searchTerm);
      return isActiveStatus && matchesSearch;
    })
    .sort((a, b) => (a.status === "Menunggu" ? -1 : 1));

  const handleInstantProcess = async (id: string) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/permohonan/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'Proses' })
      });

      if (response.ok) {
        setAllPermohonan(prev => prev.map(item => item.id === id ? { ...item, status: "Proses" } : item));
        setNotification({ type: 'success', message: 'Status berubah menjadi Diproses' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) { console.error(error); }
  };

  
  const handleUpdateStatus = async () => {
    if (!selectedMohon || !newStatus) return;
    if (newStatus === 'Ditolak' && !catatanPenolakan.trim()) {
      setNotification({ type: 'error', message: 'Alasan penolakan wajib diisi!' });
      return;
    }
    try {
      setIsSaving(true);
      const token = sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/permohonan/${selectedMohon.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          status: newStatus, 
          catatan_pendaftaran: catatanPenolakan // Terkirim ke Backend
        })
      });

      if (response.ok) {
        setCatatanPenolakan(""); 
        fetchAllPermohonan();
        setIsEditPopupOpen(false);
        setNotification({ type: 'success', message: 'Status & Alasan Admin Berhasil Disimpan!' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) { 
      console.error("Update Error:", error);
    } finally { 
      setIsSaving(false); 
    }
  };

  const confirmDelete = async () => {
    if (!selectedMohon) return;
    try {
      setIsSaving(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/permohonan/${selectedMohon.id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        setAllPermohonan(prev => prev.filter(item => item.id !== selectedMohon.id));
        setIsDeletePopupOpen(false);
      }
    } finally { setIsSaving(false); }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("sidebarStatus");
    router.push("/");
  };

  if (!mounted) return <div className="bg-[#f5f5f5] h-screen w-full" />;

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
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
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
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${isSidebarOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"} bg-[#7c4d2d] text-white flex flex-col shadow-xl transition-all duration-300 ease-in-out`}>
          <nav className="flex-1 px-3 py-6 space-y-2">
            <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
            <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" active={true} />
            <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
            <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" />
            <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />
            <div className="pt-4 border-t border-white/20">
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

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col p-4 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase">Manajemen Permohonan</h3>
            <p className="text-gray-600 border-b-2 border-gray-200 pb-4 mb-8">Kelola dan verifikasi permohonan</p>

            <div className="bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
              <div className="bg-[#8b5e3c] p-6 flex justify-between items-center text-white">
                <span className="font-bold">Daftar Permohonan ({filteredData.length})</span>
              </div>

              {/* TABLE */}
              <div className="hidden lg:block p-6 overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-gray-800 font-bold">
                      <th className="px-6 py-2">Pemohon</th>
                      <th className="px-6 py-2">Jenis Pendaftaran</th>
                      <th className="px-6 py-2">Jenis Hak</th>
                      <th className="px-6 py-2">Lokasi</th>
                      <th className="px-6 py-2">No. Sertipikat</th>
                      <th className="px-6 py-2 text-center">Status</th>
                      <th className="px-6 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((mohon) => {
                      const isWaiting = mohon.status === "Menunggu";
                      const blurClass = isWaiting ? "blur-[5px] select-none opacity-40" : "blur-0";

                      return (
                        <tr key={mohon.id} className="bg-white hover:bg-gray-50 shadow-sm rounded-2xl">
                          <td className={`px-6 py-5 rounded-l-2xl ${blurClass}`}>
                            <p className="font-bold text-gray-700 uppercase">{mohon.nama}</p>
                            <p className="text-[10px] text-gray-400">{mohon.jabatan}</p>
                          </td>
                          <td className={`px-6 py-5 ${blurClass}`}>
                            <p className="text-gray-600 font-medium">{mohon.jenis}</p>
                            {mohon.jenis.toLowerCase() === "lainnya" && mohon.jenis_lainnya && (
                            <p className="text-[11px] text-blue-600 italic mt-1 leading-tight">
                            Keterangan: {mohon.jenis_lainnya}
                            </p>
                            )}
                          </td>
                          {/* KOLOM DIBAWAH INI SEKARANG IKUT BLUR JIKA MENUNGGU */}
                          <td className={`px-6 py-5 text-gray-600 ${blurClass}`}>{mohon.hak || "-"}</td>
                          <td className={`px-6 py-5 text-gray-600 ${blurClass}`}>{mohon.lokasi}</td>
                          <td className={`px-6 py-5 text-gray-600 ${blurClass}`}>{mohon.noSertifikat}</td>
                          
                          <td className="px-6 py-5 text-center">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold border-2 ${isWaiting ? "border-orange-400 text-orange-500" : "border-blue-400 text-blue-500"}`}>
                              {mohon.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 rounded-r-2xl text-center">
                            <div className="flex justify-center gap-2">
                              {isWaiting ? (
                                <button onClick={() => handleInstantProcess(mohon.id)} className="flex items-center gap-2 px-4 py-2 bg-[#7c4d2d] text-white rounded-full font-bold text-[10px]">
                                  <Lock size={14} /> BUKA DATA
                                </button>
                              ) : (
                                <button onClick={() => { setSelectedMohon(mohon); setIsEditPopupOpen(true); }} className="p-2 text-blue-500 bg-blue-50 rounded-xl">
                                  <Edit size={16} />
                                </button>
                              )}
                              <button onClick={() => { setSelectedMohon(mohon); setIsDeletePopupOpen(true); }} className="p-2 text-red-500 bg-red-50 rounded-xl">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL EDIT STATUS & DETAIL */}
      {isEditPopupOpen && selectedMohon && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[30px] w-full max-w-lg shadow-2xl relative border-2 border-[#7c4d2d] overflow-hidden flex flex-col">
            <div className="p-8 overflow-y-auto max-h-[85vh]">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-black text-gray-900">Verifikasi Berkas</h2>
                <button onClick={() => setIsEditPopupOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-4 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Nama / Jabatan</p>
                  <p className="font-bold text-gray-700">{selectedMohon.nama} ({selectedMohon.jabatan})</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Jenis Pendaftaran</p>
                  <p className="font-bold text-gray-700">{selectedMohon.jenis}</p>
                  {/* PERBAIKAN: JIKA JENIS LAINNYA, MUNCULKAN CATATAN DIBAWAHNYA */}
                  {selectedMohon.jenis.toLowerCase().includes("lainnya") && selectedMohon.jenis_lainnya && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mt-2 font-medium">
                      Catatan: {selectedMohon.jenis_lainnya}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Jenis Hak</p>
                    <p className="font-bold text-gray-700">{selectedMohon.hak}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">No. Sertifikat</p>
                    <p className="font-bold text-gray-700">{selectedMohon.noSertifikat}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black text-gray-900 uppercase">Ubah Status Berkas:</p>
                <div className="flex gap-2">
                  {["Disetujui", "Ditolak"].map((s) => (
                    <button key={s} onClick={() => setNewStatus(s)} className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black transition-all border-2 ${newStatus === s ? (s === 'Disetujui' ? "bg-green-500 border-green-600 text-white" : "bg-red-500 border-red-600 text-white") : "bg-white border-gray-200 text-gray-400"}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATATAN ADMIN UNTUK RIWAYAT */}
              {newStatus === 'Ditolak' && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Alasan Penolakan (Akan muncul di riwayat user):</p>
                  <textarea className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-sm outline-none focus:border-red-300 font-medium" placeholder="Tuliskan alasan penolakan berkas ini..." value={catatanPenolakan} onChange={(e) => setCatatanPenolakan(e.target.value)} rows={3} />
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={handleUpdateStatus} disabled={isSaving || !newStatus} className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-black text-xs shadow-xl disabled:opacity-30">
                  {isSaving ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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


      
    </div>
  );
}