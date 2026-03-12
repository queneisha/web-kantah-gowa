"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../Navbar";

export default function RegisterPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Untuk mencegah hydration error

  const [config, setConfig] = useState({
    judul_utama: 'Buat Akun Anda!',
    sub_judul: 'Silahkan daftar untuk membuat akun di sistem layanan pertanahan kantah Gowa.',
    background_path: '/background.jpg',
    opsi_jabatan: ["Notaris/PPAT/PPATS", "Staf Notaris/PPAT/PPATS", "Staf ATR BPN"],
  });

  const [selectedJabatan, setSelectedJabatan] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/registerconfig');
        const result = await response.json();
        if (result && !result.error) {
          const dbJabatan = result.opsi_jabatan?.length > 0 
                          ? result.opsi_jabatan 
                          : config.opsi_jabatan;
          
          setConfig((prev) => ({
            ...prev,
            ...result,
            background_path: result.background_path 
              ? `http://localhost:8000/storage/${result.background_path.replace(/^\/+/g, '')}` 
              : prev.background_path,
            opsi_jabatan: dbJabatan
          }));
          setSelectedJabatan(dbJabatan[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT dan PPATS",
  });

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await fetch('http://localhost:8000/api/hero-display', { cache: 'no-store' })
        const data = await response.json();
        if (data) {
          setKonten({
            footerText1: data.footerText1,
            footerText2: data.footerText2
          });
        }
      } catch (error){
        console.error('gagal mengambil data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleDaftar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (formData.get("password") !== formData.get("password_confirmation")) {
      alert("Konfirmasi password tidak cocok!");
      setIsLoading(false);
      return;
    }

    const payload = {
      nama_lengkap: formData.get("nama_lengkap"),
      jabatan: selectedJabatan,
      // Pastikan pengecekan string di sini juga sama
      nama_notaris: selectedJabatan.toLowerCase().includes("staf notaris") 
        ? formData.get("nama_notaris") 
        : null,
      email: formData.get("email"),
      nomor_hp: formData.get("nomor_hp"),
      password: formData.get("password"),
    };
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) { setShowPopup(true); } 
      else { const result = await response.json(); alert(result.message || "Gagal mendaftar."); }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen flex flex-col font-sans overflow-hidden relative">
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[40px] p-4 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="border-4 border-[#56b35a] rounded-[35px] p-8 flex flex-col items-center text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#56b35a] rounded-full flex items-center justify-center shadow-lg shadow-[#56b35a]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#56b35a] mb-4">Registrasi Berhasil !</h2>
              <p className="text-[#56b35a] text-sm font-semibold leading-relaxed mb-8">
                Akun Anda telah terdaftar dan menunggu persetujuan dari Admin KANTAH Gowa.
              </p>
              <Link href="/" className="block w-full bg-[#56b35a] hover:bg-[#43a047] text-white py-4 rounded-full font-bold text-lg transition-all shadow-md active:scale-95">
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <section className="flex-1 relative flex items-center justify-center overflow-hidden py-10 z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={config.background_path || "/background.jpg"} 
            alt="Background"
            className="w-full h-full object-cover object-center brightness-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative flex flex-col items-center z-10">
          <div className="w-full max-w-2xl">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[50px] shadow-2xl border border-white/40">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#7c4d2d] mb-1">{config.judul_utama}</h2>
                <p className="text-[#7c4d2d] text-xs font-medium">{config.sub_judul}</p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#7c4d2d] mb-4 ml-1">Daftar</h3>
                <form onSubmit={handleDaftar} className="flex flex-col gap-4" autoComplete="off">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Nama Lengkap</label>
                      <input type="text" name="nama_lengkap" required placeholder="Nama Lengkap Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Jabatan</label>
                      <div className="relative">
                        <div onClick={() => setIsOpen(!isOpen)} className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] text-[#7c4d2d] font-medium text-xs flex justify-between items-center cursor-pointer">
                          <span>{selectedJabatan}</span>
                          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {isOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#7c4d2d]/30 rounded-[20px] overflow-hidden shadow-xl">
                            {config.opsi_jabatan.map((item, index) => (
                              <div key={index} onClick={() => { setSelectedJabatan(item); setIsOpen(false); }} className="px-5 py-2 text-xs text-[#7c4d2d] hover:bg-[#7c4d2d]/10 cursor-pointer border-b border-gray-50 last:border-none">
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PERBAIKAN LOGIKA DISINI: Hanya muncul jika mengandung kata 'Sekretaris' */}
                {/* Kolom ini hanya muncul jika pilihan mengandung kata 'notaris' tapi bukan admin/atasan langsung */}
{selectedJabatan?.toLowerCase().includes("staf notaris") && (
  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">
      Nama Notaris/PPAT/PPATS 
    </label>
    <input 
      type="text" 
      name="nama_notaris" 
      required 
      placeholder="Masukkan Nama Notaris/PPAT/PPATS Anda" 
      className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/50 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" 
    />
  </div>
)}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Email</label>
                      <input type="email" name="email" required placeholder="Email Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Nomor Handphone</label>
                      <input type="text" name="nomor_hp" required placeholder="No. HP Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" required placeholder="Password" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                          <img src="/icon_mata.png" alt="toggle" className="w-4 h-4 object-contain" />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Konfirmasi Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" required placeholder="Ulangi Password" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] text-xs transition-all" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                          <img src="/icon_mata.png" alt="toggle" className="w-4 h-4 object-contain" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-1/2 bg-[#56b35a] hover:bg-[#43a047] disabled:bg-gray-400 text-white py-3 rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                    >
                      {isLoading ? "Memproses..." : "Daftar"}
                    </button>
                    <p className="text-center text-xs mt-6 font-bold text-[#7c4d2d]/70">
                      Sudah Punya Akun? <Link href="/Login" className="text-green-600 hover:underline">Login disini</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </section>
      
      <footer className="bg-[#1a1a1a] text-white py-6 text-center z-10 relative">
        <p className="text-[10px] font-bold">{konten.footerText1}</p>
        <p className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">{konten.footerText2}</p>
      </footer>
    </main>
  );
}