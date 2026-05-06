"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  FileEdit,
  History,
  Bell,
  LogOut,
  FileText,
  Send,
  RotateCcw,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

// --- KOMPONEN CUSTOM DROPDOWN ---
interface AdminSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  name: string;
}

const AdminStyleSelect: React.FC<AdminSelectProps> = ({ label, options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      {label && <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl font-medium transition-all border-none outline-none
          ${isOpen ? "ring-2 ring-[#56b35a] bg-white shadow-md" : "bg-[#e9e9e9] text-black"}`}
      >
        <span className={`truncate ${value ? "text-black" : "text-gray-500"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#56b35a]" : "text-gray-500"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-[25px] p-2 animate-in fade-in zoom-in duration-200 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(name, opt);
                setIsOpen(false);
              }}
              className={`w-full text-center py-3 px-4 my-1 rounded-full text-sm font-bold transition-all
                ${value === opt
                  ? "bg-[#56b35a] text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PermohonanPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    jenisPendaftaran: "",
    catatanPendaftaran: "",
    jenisHak: "",
    noSertipikat: "",
    desa: "",
    kecamatan: ""
  });

  const [navData, setNavData] = useState({
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navbarIcon: "/logo.png",
  });

  // 1. Fetch data Tampilan (Navbar & Footer)
  const fetchDisplayData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/hero-display");
      if (res.ok) {
        const data = await res.json();
        setNavData({
          navText1: data.navText1 || "KANTAH Gowa",
          navText2: data.navText2 || "Sistem Informasi & Layanan Internal",
          navbarIcon: data.navbarIcon || "/logo.png",
        });
      }
    } catch (error) {
      console.error("Gagal ambil data display:", error);
    }
  };

  // 2. Fetch Notifikasi
  const fetchUnreadNotifications = async (userId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/notifications/unread-count/${userId}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      console.log("Cek Data Notif:", data); // LIHAT DI INSPECT CONSOLE (F12)

      if (res.ok) {
        // Ambil angka dari berbagai kemungkinan nama field API
        const hasilCount = data.count ?? data.unread_count ?? data.data?.count ?? 0;
        
        // Paksa jadi Number dan simpan
        setUnreadCount(Number(hasilCount));
      }
    } catch (error) {
      console.error("Gagal mengambil count notifikasi:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      
      // Pastikan panggil ini dengan ID yang benar
      fetchDisplayData();
      if (user.id) {
        fetchUnreadNotifications(user.id);
      }
    } else {
      router.push('/Login');
    }
  }, []); // Cukup sekali saat mount

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const handleCustomChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      catatanPendaftaran: name === "jenisPendaftaran" && value !== "Lainnya" ? "" : prev.catatanPendaftaran
    }));
  };

  const triggerConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jenisPendaftaran || !formData.jenisHak || !formData.noSertipikat || !formData.desa || !formData.kecamatan) {
      alert("Harap lengkapi seluruh data form!");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      const res = await fetch("http://localhost:8000/api/permohonan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          jenisPendaftaran: formData.jenisPendaftaran,
          catatanPendaftaran: formData.catatanPendaftaran,
          jenisHak: formData.jenisHak,
          noSertipikat: formData.noSertipikat,
          desa: formData.desa,
          kecamatan: formData.kecamatan,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        setFormData({
          jenisPendaftaran: "",
          catatanPendaftaran: "",
          jenisHak: "",
          noSertipikat: "",
          desa: "",
          kecamatan: "",
        });
      } else {
        alert(data.message || "Gagal mengirim permohonan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const SidebarItem = ({ href, icon: Icon, label, active = false, badge = 0 }: any) => (
    <Link href={href} className="block group relative">
      <button 
        onClick={() => { if(window.innerWidth < 1024) setIsSidebarOpen(false) }}
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <div className="relative">
          <Icon size={22} className="shrink-0" /> 
          {/* Badge saat sidebar mengecil (kecil di pojok ikon) */}
          {badge > 0 && !isSidebarOpen && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white border-2 border-[#7c4d2d] animate-pulse">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
  
        {isSidebarOpen && (
          <div className="flex justify-between items-center w-full min-w-0">
            <span className="truncate">{label}</span>
            
            {/* Badge saat sidebar terbuka (bulat merah di kanan teks) */}
            {Number(badge) > 0 && (
              <span className="bg-red-600 text-white text-[11px] h-6 w-6 flex items-center justify-center rounded-full shadow-md font-semibold shrink-0 ml-2">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </div>
        )}
      </button>
    </Link>
  );

  if (!mounted || !userData) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-4 md:px-8 z-[40] shadow-md shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className={`flex items-center gap-2 md:gap-3 transition-opacity ${isSidebarOpen && "max-lg:opacity-0"}`}>
            <img src={navData.navbarIcon} alt="Logo" className="h-8 md:h-10 w-auto shrink-0" />
            <div className="flex flex-col">
              <h1 className="font-bold text-xs md:text-lg leading-none truncate max-w-[150px]">{navData.navText1}</h1>
              <p className="text-[8px] md:text-[10px] opacity-70">{navData.navText2}</p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-xs md:text-sm font-bold truncate">{userData.nama_lengkap || userData.name}</h2>
          <p className="text-[9px] md:text-[10px] opacity-70 truncate">{userData.email}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-[50]
          ${isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"} 
          bg-[#7c4d2d] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        `}>
          <div className={`lg:hidden flex items-center justify-between p-5 border-b border-white/10 ${!isSidebarOpen && "hidden"}`}>
             <div className="flex items-center gap-2">
                <img src={navData.navbarIcon} alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xs uppercase tracking-widest">Menu Utama</span>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                <X size={24} />
             </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />
            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" active={true} />
            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />
            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" badge={unreadCount} />
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <button onClick={() => setIsLogoutModalOpen(true)} className={`flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>
                <LogOut size={22} className="shrink-0" /> 
                {isSidebarOpen && <span>Keluar</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">Permohonan</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium">Lengkapi formulir pendaftaran di bawah ini</p>
              <hr className="mt-4 border-gray-200" />
            </div>

            <form onSubmit={triggerConfirm} className="bg-white rounded-[25px] md:rounded-[35px] shadow-xl border border-gray-200 lg:border-2 lg:border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 md:p-5 px-6 md:px-8 text-white flex items-center gap-3">
                  <FileText size={22} className="shrink-0" />
                  <span className="font-bold text-base md:text-lg">Formulir Pendaftaran</span>
                </div>

                <div className="p-5 md:p-8 space-y-5 md:space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nama Pemohon</label>
                    <input type="text" value={userData.nama_lengkap || userData.name} disabled className="w-full px-4 py-3 bg-[#f0f0f0] border-none rounded-xl text-gray-500 font-bold" />
                  </div>

                  <AdminStyleSelect
                    label="Jenis Pendaftaran"
                    name="jenisPendaftaran"
                    placeholder=" Pilih Jenis "
                    options={["Pengecekan", "SKPT", "Lainnya"]}
                    value={formData.jenisPendaftaran}
                    onChange={handleCustomChange}
                  />

                  {formData.jenisPendaftaran === "Lainnya" && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                      <label className="text-sm font-bold text-gray-700 ml-1">Keterangan Lainnya</label>
                      <input type="text" name="catatanPendaftaran" value={formData.catatanPendaftaran} onChange={(e) => setFormData({...formData, catatanPendaftaran: e.target.value})} placeholder="Tulis alasan..." className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl outline-none" />
                    </div>
                  )}

                  <AdminStyleSelect
                    label="Jenis Hak"
                    name="jenisHak"
                    placeholder=" Pilih Hak "
                    options={["Hak Milik", "Hak Guna Usaha", "Hak Guna Bangunan", "Hak Pengelolaan", "Hak Pakai", "Wakaf"]}
                    value={formData.jenisHak}
                    onChange={handleCustomChange}
                  />

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 ml-1">5 Digit Terakhir No. Sertipikat</label>
                    <input
                      type="text"
                      name="noSertipikat"
                      value={formData.noSertipikat}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                        setFormData({ ...formData, noSertipikat: value });
                      }}
                      placeholder="Contoh: 00123"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Desa / Kelurahan</label>
                      <input type="text" name="desa" value={formData.desa} onChange={(e) => setFormData({...formData, desa: e.target.value})} placeholder="Nama Desa" className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 ml-1">Kecamatan</label>
                      <input type="text" name="kecamatan" value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} placeholder="Nama Kecamatan" className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#56b35a] text-white font-bold rounded-xl shadow-lg hover:bg-[#469e4a] transition transform active:scale-95">
                      <Send size={18} /> Kirim Permohonan
                    </button>
                    <button type="button" onClick={() => setFormData({jenisPendaftaran: "", catatanPendaftaran: "", jenisHak: "", noSertipikat: "", desa: "", kecamatan: ""})} className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                      <RotateCcw size={18} /> Reset
                    </button>
                  </div>
                </div>
              </form>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
         <div className="bg-white rounded-[25px] p-6 md:p-8 w-full max-w-sm md:max-w-md shadow-2xl">
           <h3 className="text-xl md:text-2xl font-bold text-gray-900">Yakin kirim permohonan?</h3>
           <p className="text-sm md:text-base text-gray-600 font-medium mt-2">Pastikan data yang kamu masukkan sudah benar!</p>
           <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-gray-600 rounded-xl font-bold text-gray-800">Batal</button>
              <button onClick={handleFinalSubmit} className="flex-1 py-3 bg-[#56b35a] text-white font-bold rounded-xl shadow-lg hover:bg-[#469e4a]">Ya, Kirim</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-6 md:p-8 w-full max-w-sm md:max-w-md shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-sm md:text-base text-gray-600 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-600 font-bold text-gray-800">Batal</button>
            <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}