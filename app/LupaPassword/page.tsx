"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

export default function LupaPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLupaPassword = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try{
      const response = await fetch('http://localhost:8000/api/lupa-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ email: formData.get("email")}),
      });

      const result = await response.json();
      if (response.ok){
        alert("sukses! " + result.message);
        router.push('/Login');
      } else {
        alert(result.message || "Email tidak ditemukan.");
      }
    } catch (error){
      alert("Gagal terhubung ke server.");
    }
  };

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
  });

  const [loginKonten, setLoginKonten]= useState({
    headerTitle: "Selamat Datang Kembali",
    subHeader: "Silahkan login untuk mengakses sistem layanan KANTAH Gowa",
    maskot_path: "/maskot_login.png",
    background_path: "/background.jpg",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try { 
        const [resHero, resConfig] = await Promise.all([
          fetch ('http://localhost:8000/api/hero-display', { cache: 'no-store' }),
          fetch ('http://localhost:8000/api/loginconfig', { cache: 'no-store' }),
        ]);
        const dataHero = await resHero.json();
        const dataConfig = await resConfig.json();

        if (dataHero) {
          setKonten({
            footerText1: dataHero.footerText1 || "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
            footerText2: dataHero.footerText2 || "Sistem Informasi Internal untuk Notaris dan PPAT"
          });
        }
     if (dataConfig){
      const getFullUrl = (path: string, defaultImg: string)=> {
        if (!path) return defaultImg;
        if(path.startsWith('http')) return path;
        const cleanPath = path.replace('public/', '');
        return `http://localhost:8000/storage/${cleanPath}`;
      };
      setLoginKonten({
        headerTitle: dataConfig.headerTitle || "Selamat Datang Kembali",
        subHeader: dataConfig.subHeader || "Silahkan login untuk mengakses sistem layanan KANTAH Gowa",
        maskot_path: getFullUrl(dataConfig.maskot_path, "/maskot_login.png"),
        background_path: getFullUrl(dataConfig.background_path, "/background.jpg"),
      });
     } 
    } catch (error){
      console.error("gagal mengambil data:", error);
    }
  }; fetchAllData(); }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // --- VALIDASI STATUS AKUN (DIPERBARUI) ---
        // Mengambil status, mengubah ke string, menghapus spasi, dan mengubah ke huruf kecil
        const userStatus = result.user?.status?.toString().trim().toLowerCase();

        // Cek apakah akun ditolak
        if (userStatus === "ditolak") {
          alert(`Maaf, pendaftaran akun Anda telah ditolak oleh Admin KANTAH Gowa.\n\nAlasan: ${result.user?.rejection_reason || 'Tidak ada alasan yang diberikan'}\n\nSilakan hubungi admin untuk informasi lebih lanjut.`);
          return;
        }

        if (userStatus !== "aktif") {
          alert("Akun Anda belum aktif. Silakan tunggu persetujuan Admin KANTAH Gowa.");
          return; // Berhenti jika status bukan 'aktif'
        }

        // --- LOGIKA PENYIMPANAN DATA USER (Hanya jika status 'aktif') ---
        // Gunakan sessionStorage untuk user data (isolated per tab/window)
        sessionStorage.setItem("user", JSON.stringify(result.user)); 
        sessionStorage.setItem("token", result.token);
        // localStorage hanya untuk preference yang persisten
        localStorage.setItem("sidebarStatus", JSON.stringify(false));

        alert(`Selamat Datang, ${result.user.nama_lengkap || result.user.name || 'User'}!`);
        
        // Cek Role untuk diarahkan ke Dashboard yang sesuai
        if (result.user?.role === 'admin' || payload.email === 'admin@gmail.com') {
          router.push("/AdminDashboard/DataUser");
        } else {
          router.push("/UserDashboard");
        }
      } else {
        alert(result.message || "Terjadi kesalahan saat login.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal terhubung ke server. Pastikan API Laravel (Port 8000) menyala.");
    }

  }; 

  return (
    <main className="min-h-screen relative flex flex-col font-sans">
      <Navbar />

      <section className="flex-1 relative flex items-center justify-center overflow-hidden py-12">
        <div 
        className="absolute inset-0 bg-cover bg-center -z-10 brightness-75"
         style={{
          backgroundImage: `url(${loginKonten.background_path})`,
          backgroundColor: '#cccccc'
        }} />
        
        <div className="container mx-auto px-16 flex items-center gap-10">
          <div className="hidden lg:block w-1/3 transform translate-y-24 translate-x-20">
            <img src={loginKonten.maskot_path}
             alt="Maskot" className="h-[600px] object-contain drop-shadow-2xl" 
             onError={(e) => {
              (e.target as HTMLImageElement).src = "/maskot_login.png";
             }}/>
          </div>

          <div className="flex-1 flex flex-col items-center z-20">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] shadow-2xl w-full max-w-xl border border-white/40">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#7c4d2d] mb-2">Lupa Password?</h2>
                <p className="text-[#7c4d2d] text-sm font-medium">
                Masukkan email Anda untuk menerima link reset password.
                </p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#7c4d2d] mb-6"> Reset Password   </h3>
                
                <form onSubmit={handleLupaPassword} className="space-y-5" autoComplete="off">
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="block text-sm font-bold text-[#7c4d2d] ml-2">Email</label>
                    <input 
                    id="email"
                      name="email" 
                      type="email" 
                      required
                      suppressHydrationWarning={true}
                      placeholder="Masukan Email Anda" 
                      className="w-full px-5 py-3 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                    />
                  </div>

                  <div className="flex flex-col items-center pt-4">
                  <button className="w-full bg-[#56b35a] text-white py-4 rounded-2xl font-bold hover:bg-[#469e4a] transition">
                     Kirim Link Reset
                  </button>
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-[#1a1a1a] text-white py-6 text-center">
        <p className="text-[10px] font-bold">{konten.footerText1}</p>
        <p className="text-[9px] opacity-60 mt-1 tracking-widest">{konten.footerText2}</p>
      </footer>
    </main>
  );
}