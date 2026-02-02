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

  CheckCircle2,

  AlertTriangle,

  Menu

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

        <span className={value ? "text-black" : "text-gray-500"}>

          {value || placeholder}

        </span>

        <ChevronDown

          size={20}

          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-[#56b35a]" : "text-gray-500"}`}

        />

      </button>



      {isOpen && (

        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-[25px] p-2 animate-in fade-in zoom-in duration-200">

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
  const router = useRouter();



  const [userData, setUserData] = useState({

    id: null,

    nama: "Guest",

    email: "guest@mail.com"

  });



  const [formData, setFormData] = useState({

    jenisPendaftaran: "",

    catatanPendaftaran: "",

    jenisHak: "",

    noSertipikat: "",

    desa: "",

    kecamatan: ""

  });



  useEffect(() => {

    setMounted(true);

    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {

      const user = JSON.parse(storedUser);

      // PROTEKSI: Jika user adalah admin, redirect ke AdminDashboard
      if (user.role === 'admin') {
        router.push('/AdminDashboard');
        return;
      }

      setUserData({

        id: user.id,

        nama: user.nama_lengkap || user.nama || "User",

        email: user.email || ""

      });

    } else {
      // PROTEKSI: Jika tidak ada user data, redirect ke login
      router.push('/Login');
      return;
    }

    const saved = localStorage.getItem("sidebarStatus");

    if (saved !== null) {

      setIsSidebarOpen(JSON.parse(saved));

    }

  }, [router]);



  useEffect(() => {

    if (mounted) {

      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));

    }

  }, [isSidebarOpen, mounted]);

  const handleLogout = async () => {
    // Bersihkan sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("sidebarStatus");
    // Redirect ke home
    router.push("/");
  };



  const handleCustomChange = (name: string, value: string) => {

    setFormData(prev => ({

      ...prev,

      [name]: value,

      catatanPendaftaran: name === "jenisPendaftaran" && value !== "Lainnya" ? "" : prev.catatanPendaftaran

    }));

  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

  };



  const handleNoSertipikatChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;

    if (value === "" || (/^\d+$/.test(value) && value.length <= 5)) {

      setFormData(prev => ({ ...prev, noSertipikat: value }));

    }

  };



  const handleReset = () => {

    setFormData({

      jenisPendaftaran: "",

      catatanPendaftaran: "",

      jenisHak: "",

      noSertipikat: "",

      desa: "",

      kecamatan: ""

    });

  };



  const triggerConfirm = (e: React.FormEvent) => {

    e.preventDefault();

    if (!formData.jenisPendaftaran || !formData.jenisHak || !formData.noSertipikat || !formData.desa || !formData.kecamatan) {

        alert("Harap lengkapi seluruh data form!");

        return;

    }

    // Validasi: jika jenis pendaftaran "Lainnya", catatan harus diisi
    if (formData.jenisPendaftaran === "Lainnya" && !formData.catatanPendaftaran.trim()) {
        alert("Harap jelaskan alasan Anda memilih jenis pendaftaran 'Lainnya'!");
        return;
    }

    setShowConfirmModal(true);

  };



  // --- FUNGSI FINAL SUBMIT YANG SUDAH DISINKRONKAN DENGAN LARAVEL ---

  const handleFinalSubmit = async () => {

    setIsLoading(true);

   

    // Pastikan nama field (key) di bawah ini sama persis dengan $validator di Laravel

    const dataToSend = {

      user_id: userData.id,
      nama: userData.nama,
      email: userData.email,

      jenisPendaftaran: formData.jenisPendaftaran,

      catatanPendaftaran: formData.catatanPendaftaran,

      jenisHak: formData.jenisHak,

      noSertipikat: formData.noSertipikat, // Menggunakan 'p' sesuai validator Laravel

      desa: formData.desa,

      kecamatan: formData.kecamatan,

    };



    try {

      const response = await fetch("http://localhost:8000/api/permohonan", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Accept": "application/json", // Agar Laravel mengirim error dalam bentuk JSON

        },

        body: JSON.stringify(dataToSend),

      });



      const result = await response.json();



      if (response.ok) {

        setShowConfirmModal(false);

        setShowSuccessModal(true);

        handleReset();

      } else {

        // Jika validasi gagal, log error ke console untuk debugging

        console.error("Validation Errors:", result.errors);

        alert(result.message || "Data tidak valid. Silakan periksa kembali isian Anda.");

      }

    } catch (error) {

      console.error("Fetch Error:", error);

      alert("Gagal terhubung ke server. Pastikan backend Laravel sudah berjalan.");

    } finally {

      setIsLoading(false);

    }

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

    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden relative">

      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">

        <div className="flex items-center">

          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg mr-4">

            <Menu size={24} />

          </button>

          <div className="flex items-center gap-3">

            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />

            <div className="flex flex-col">

              <h1 className="font-bold text-lg leading-none">KANTAH Gowa - User</h1>

              <p className="text-[10px] opacity-70">Sistem Manajemen Internal</p>

            </div>

          </div>

        </div>

        <div className="text-right hidden sm:block">

          <h2 className="text-sm font-bold tracking-tight">{userData.nama}</h2>

          <p className="text-[10px] opacity-70">{userData.email}</p>

        </div>

      </header>



      <div className="flex flex-1 overflow-hidden">

        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out`}>

          <nav className="flex-1 px-3 py-8 space-y-4">

            <SidebarItem href="/UserDashboard" icon={LayoutDashboard} label="Beranda" />

            <SidebarItem href="/UserDashboard/Permohonan" icon={FileEdit} label="Permohonan" active={true} />

            <SidebarItem href="/UserDashboard/Riwayat" icon={History} label="Riwayat" />

            <SidebarItem href="/UserDashboard/Notifikasi" icon={Bell} label="Notifikasi" />

            <div className="pt-4 mt-4 border-t border-white/20">

               <button onClick={() => setIsLogoutModalOpen(true)} className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}>

                <LogOut size={22} /> {isSidebarOpen && <span>Keluar</span>}

                
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



        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col">

          <div className="p-10 flex-1">

            <div className="max-w-[1400px] mx-auto text-left">

              <div className="mb-8">

                <h3 className="text-3xl font-black text-gray-900">Permohonan</h3>

                <p className="text-gray-600 font-medium">Ajukan permohonan baru</p>

                <hr className="mt-5 border-b-2 border-gray-200" />

              </div>



              <form onSubmit={triggerConfirm} className="max-w-5xl bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">

                <div className="bg-[#8b5e3c] p-4 px-8 text-white flex items-center gap-3">

                  <FileText size={24} />

                  <span className="font-bold text-lg">Form Permohonan</span>

                </div>



                <div className="p-8 space-y-5">

                  <div className="space-y-1.5">

                    <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>

                    <input type="text" value={userData.nama} disabled className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl text-gray-500 font-bold" />

                  </div>



                  <AdminStyleSelect

                    label="Jenis Pendaftaran"

                    name="jenisPendaftaran"

                    placeholder="Pilih jenis pendaftaran"

                    options={["Pengecekan", "SKPT", "Lainnya"]}

                    value={formData.jenisPendaftaran}

                    onChange={handleCustomChange}

                  />



                  {formData.jenisPendaftaran === "Lainnya" && (

                    <div className="space-y-1.5 animate-in slide-in-from-top-2 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">

                      <label className="text-sm font-bold text-gray-700 ml-1">Jelaskan Jenis Pendaftaran Lainnya</label>

                      <input type="text" name="catatanPendaftaran" value={formData.catatanPendaftaran} onChange={handleChange} placeholder="Tulis alasan atau penjelasan..." className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-black font-medium outline-none" />

                    </div>

                  )}



                  <AdminStyleSelect

                    label="Jenis Hak"

                    name="jenisHak"

                    placeholder="Pilih jenis hak"

                    options={["Hak Milik", "Hak Guna Bangunan", "Hak Pakai", "Hak Guna Usaha"]}

                    value={formData.jenisHak}

                    onChange={handleCustomChange}

                  />



                  <div className="space-y-1.5">

                    <label className="text-sm font-bold text-gray-700 ml-1">5 Angka Terakhir No. Sertipikat</label>

                    <input type="text" name="noSertipikat" value={formData.noSertipikat} onChange={handleNoSertipikatChange} placeholder="Contoh: 12345" className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl text-black font-medium outline-none" />

                  </div>



                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="space-y-1.5">

                      <label className="text-sm font-bold text-gray-700 ml-1">Desa / Kelurahan</label>

                      <input type="text" name="desa" value={formData.desa} onChange={handleChange} placeholder="Masukkan Desa" className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl text-black font-medium outline-none" />

                    </div>

                    <div className="space-y-1.5">

                      <label className="text-sm font-bold text-gray-700 ml-1">Kecamatan</label>

                      <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Masukkan Kecamatan" className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl text-black font-medium outline-none" />

                    </div>

                  </div>



                  <div className="flex gap-4 pt-4">

                    <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#56b35a] text-white font-bold rounded-xl shadow-lg hover:bg-[#469e4a] transition">

                      <Send size={18} /> Ajukan Permohonan

                    </button>

                    <button type="button" onClick={handleReset} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">

                      <RotateCcw size={18} /> Reset

                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center text-[10px] font-bold">

            © 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.

          </footer>

        </main>

      </div>



      {/* MODAL KONFIRMASI */}

      {showConfirmModal && (

        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="bg-white rounded-[35px] p-8 w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">

            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Konfirmasi Pengiriman</h3>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-4 mb-6">

              <AlertTriangle className="text-orange-500 shrink-0" size={24} />

              <p className="text-sm text-gray-600">Pastikan data sudah benar sebelum dikirim.</p>

            </div>

            <div className="flex justify-center gap-4 mt-8">

              <button onClick={() => setShowConfirmModal(false)} className="px-8 py-3 rounded-full border-2 border-gray-100 text-gray-500 font-bold">Kembali</button>

              <button onClick={handleFinalSubmit} disabled={isLoading} className="px-8 py-3 rounded-full bg-[#56b35a] text-white font-bold shadow-lg disabled:opacity-50">

                {isLoading ? "Mengirim..." : "Ya, Kirim Sekarang"}

              </button>

            </div>

          </div>

        </div>

      )}



      {/* MODAL BERHASIL */}

      {showSuccessModal && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">

          <div className="bg-white rounded-[35px] p-12 w-full max-w-2xl shadow-2xl border-[3px] border-green-500 animate-in zoom-in duration-300 flex flex-col items-center">

            <CheckCircle2 size={80} className="text-green-500 mb-6" />

            <h3 className="text-3xl font-black text-[#56b35a] mb-4">Berhasil!</h3>

            <p className="text-gray-600 text-lg">Permohonan Anda telah terkirim dan sedang diproses.</p>

            <button onClick={() => setShowSuccessModal(false)} className="mt-10 px-10 py-3 bg-green-500 text-white font-bold rounded-full">Tutup</button>

          </div>

        </div>

      )}



      {/* MODAL LOGOUT */}

      {isLogoutModalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
            <p className="text-gray-600 font-medium mt-2">Anda perlu login kembali untuk mengakses sistem.</p>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-8 py-2.5 rounded-full border-2 border-gray-600 text-gray-600 font-bold">Batal</button>
              <button onClick={handleLogout} className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold shadow-lg">Ya, Keluar</button>
            </div>
          </div>
        </div>

      )}

    </div>

  );

}