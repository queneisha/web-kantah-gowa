"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

export default function LupaPasswordPage() {
  const router = useRouter();
  
  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });

  const [loginKonten, setLoginKonten] = useState({
    headerTitle: "Selamat Datang Kembali",
    subHeader: "Silahkan login untuk mengakses sistem layanan KANTAH Gowa",
    maskot_path: "/maskot_login.png",
    background_path: "/background.jpg",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try { 
        const [resHero, resConfig] = await Promise.all([
          fetch('http://bpn.kadastrium.id/api/hero-display', { cache: 'no-store' }),
          fetch('http://bpn.kadastrium.id/api/loginconfig', { cache: 'no-store' }),
        ]);
        const dataHero = await resHero.json();
        const dataConfig = await resConfig.json();

        if (dataHero) {
          setKonten({
            footerText1: dataHero.footerText1 || "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
            footerText2: dataHero.footerText2 || "Sistem Informasi Internal untuk Notaris dan PPAT"
          });
        }
        
        if (dataConfig) {
          const getFullUrl = (path: string, defaultImg: string) => {
            if (!path) return defaultImg;
            if (path.startsWith('http')) return path;
            const cleanPath = path.replace('public/', '');
            return `http://bpn.kadastrium.id/storage/${cleanPath}`;
          };
          setLoginKonten({
            headerTitle: dataConfig.headerTitle || "Selamat Datang Kembali",
            subHeader: dataConfig.subHeader || "Silahkan login untuk mengakses sistem layanan KANTAH Gowa",
            maskot_path: getFullUrl(dataConfig.maskot_path, "/maskot_login.png"),
            background_path: getFullUrl(dataConfig.background_path, "/background.jpg"),
          });
        } 
      } catch (error) {
        console.error("gagal mengambil data:", error);
      }
    }; 
    fetchAllData(); 
  }, []);

  const handleLupaPassword = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('http://bpn.kadastrium.id/api/lupa-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ email: formData.get("email") }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("sukses! " + result.message);
        router.push('/Login');
      } else {
        alert(result.message || "Email tidak ditemukan.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans overflow-hidden relative">
      <Navbar />

      {/* SECTION UTAMA: Mengikuti struktur Login yang baru */}
      <section className="flex-1 relative flex items-center justify-center py-10 z-10">
        
        {/* 1. PERBAIKAN BACKGROUND (Sama Persis dengan Login) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={loginKonten.background_path} 
            alt="Background"
            className="w-full h-full object-cover object-center brightness-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* 2. MASKOT (Sama Persis Letaknya dengan Login) */}
        <div className="hidden lg:block absolute bottom-0 left-4 z-20 pointer-events-none">
          <img 
            src={loginKonten.maskot_path} 
            alt="Maskot" 
            className="h-[85vh] max-h-[550px] object-contain align-bottom drop-shadow-2xl" 
            onError={(e) => { e.currentTarget.src = "/maskot_login.png"; }}
          />
        </div>

        {/* 3. CONTAINER FORM */}
        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <div className="w-full max-w-md"> 
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[50px] shadow-2xl border border-white/40">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#7c4d2d] mb-1">Lupa Password?</h2>
                <p className="text-[#7c4d2d] text-xs font-medium px-4">
                  Masukkan email Anda untuk menerima link reset password.
                </p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#7c4d2d] mb-4">Reset Password</h3>
                
                <form onSubmit={handleLupaPassword} className="flex flex-col gap-4" autoComplete="off">
                  <div>
                    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="Masukkan Email Anda" 
                      className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 text-xs outline-none text-[#7c4d2d]" 
                    />
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <button type="submit" className="w-full bg-[#56b35a] hover:bg-[#43a047] text-white py-3 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all">
                      Kirim Link Reset
                    </button>
                    <p className="text-center text-xs mt-6 font-bold text-[#7c4d2d]/70">
                      Ingat Password? <Link href="/Login" className="text-green-600 hover:underline">Login disini</Link>
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