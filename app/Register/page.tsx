"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJabatan, setSelectedJabatan] = useState("Notaris/PPAT");
  const opsiJabatan = ["Notaris/PPAT", "Sekertaris Notaris/PPAT", "Anggota ATR BPN"];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State untuk popup berhasil
  const [showPopup, setShowPopup] = useState(false);

  // --- FUNGSI HANDLE DAFTAR (API INTEGRATION) ---
  const handleDaftar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Validasi password
    if (formData.get("password") !== formData.get("password_confirmation")) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    const payload = {
      nama_lengkap: formData.get("nama_lengkap"),
      jabatan: selectedJabatan,
      // Mengambil nilai input nama_notaris jika jabatan adalah Sekertaris
      nama_notaris: selectedJabatan === "Sekertaris Notaris/PPAT" ? formData.get("nama_notaris") : null,
      email: formData.get("email"),
      nomor_hp: formData.get("nomor_hp"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setShowPopup(true);
      } else {
        alert(result.message || "Gagal mendaftar, periksa kembali data Anda.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col font-sans">
      {/* POPUP BERHASIL */}
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
                Akun Anda telah terdaftar dan menunggu persetujuan dari Admin KANTAH Gowa. Anda akan menerima notifikasi melalui email setelah akun disetujui.
              </p>
              <Link 
                href="/" 
                className="block w-full bg-[#56b35a] hover:bg-[#43a047] text-white py-4 rounded-full font-bold text-lg transition-all shadow-md active:scale-95"
              >
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-4 bg-[#1a1a1a] text-white z-20">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" /> 
          <div className="flex flex-col">
            <h1 className="font-bold text-xl leading-none">KANTAH Gowa</h1>
            <p className="text-[10px] uppercase tracking-tighter text-gray-400">Sistem Informasi & Layanan Internal</p>
          </div>
        </div>
        <Link href="/" className="px-8 py-2 bg-[#8b5e3c] text-white rounded-full text-sm font-bold hover:bg-[#724d31] transition">
          Beranda
        </Link>
      </nav>

      <section className="flex-1 relative flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center -z-10 brightness-90" />
        
        <div className="container mx-auto px-16 flex items-center gap-10">
          <div className="flex-1 flex justify-end">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] shadow-2xl w-full max-w-xl border border-white/40">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#7c4d2d] mb-2">Buat Akun Anda!</h2>
                <p className="text-[#7c4d2d] text-sm font-medium">Silahkan daftar untuk membuat akun di sistem layanan pertanahan kantah Gowa.</p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#7c4d2d] mb-4">Daftar</h3>
                <form onSubmit={handleDaftar} className="grid grid-cols-1 gap-4" autoComplete="off">
                  
                  {/* Nama Lengkap */}
                  <div>
                    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" required placeholder="Masukkan Nama Lengkap Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" />
                  </div>

                  {/* Jabatan */}
                  <div>
                    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Jabatan</label>
                    <div className="relative">
                      <div onClick={() => setIsOpen(!isOpen)} className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] text-[#7c4d2d] font-medium text-xs flex justify-between items-center cursor-pointer transition-all">
                        <span>{selectedJabatan}</span>
                        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                      {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#7c4d2d]/30 rounded-[25px] overflow-hidden shadow-xl">
                          {opsiJabatan.map((item) => (
                            <div key={item} onClick={() => { setSelectedJabatan(item); setIsOpen(false); }} className="px-5 py-2.5 text-xs text-[#7c4d2d] hover:bg-[#7c4d2d]/10 cursor-pointer border-b border-gray-50 last:border-none">
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INPUT DINAMIS: Nama Notaris (Otomatis Muncul) */}
                  {selectedJabatan === "Sekertaris Notaris/PPAT" && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Nama Notaris/PPAT (Atasan)</label>
                      <input 
                        type="text" 
                        name="nama_notaris"
                        required 
                        placeholder="Masukkan Nama Notaris Atasan Anda" 
                        className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/50 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                      />
                    </div>
                  )}

                  {/* Email & HP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Email</label>
                      <input type="email" name="email" required placeholder="Email Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Nomor Handphone</label>
                      <input type="text" name="nomor_hp" required placeholder="No. HP Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" />
                    </div>
                  </div>

                  {/* Password & Konfirmasi */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password"
                          required
                          placeholder="Password" 
                          className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                          <img src="/icon_mata.png" alt="toggle" className="w-5 h-5 object-contain" />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Konfirmasi Password</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          name="password_confirmation"
                          required
                          placeholder="Ulangi Password" 
                          className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                          <img src="/icon_mata.png" alt="toggle" className="w-5 h-5 object-contain" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <button type="submit" className="w-1/2 bg-[#56b35a] hover:bg-[#43a047] text-white py-3.5 rounded-full font-bold text-xl shadow-lg transition-transform active:scale-95">
                      Daftar
                    </button>
                    <p className="text-center text-xs mt-8 font-bold text-[#7c4d2d]/70">
                      Sudah Punya Akun? <Link href="/Login" className="text-green-600 hover:underline">Login disini</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-1/3 transform translate-y-16 translate-x-10">
            <img src="/maskot_daftar.png" alt="Maskot" className="h-[600px] object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>
      
      <footer className="bg-[#1a1a1a] text-white py-6 text-center">
        <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
        <p className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">Sistem Informasi Internal untuk Notaris dan PPAT</p>
      </footer>
    </main>
  );
}