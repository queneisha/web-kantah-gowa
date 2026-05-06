"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLupaPassword, setShowLupaPassword] = useState(false);

  const [config, setConfig] = useState({
    judul_utama: 'Selamat Datang Kembali!',
    sub_judul: 'Silahkan login untuk mengakses sistem layanan pertanahan kantah Gowa.',
    background_path: '/background.jpg',
  });

  const [konten, setKonten] = useState({
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris/PPAT/PPATS",
  });

  // 1. Ambil Konfigurasi Tampilan dari Backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [resHero, resConfig] = await Promise.all([
          fetch('http://localhost:8000/api/hero-display', { cache: 'no-store' }),
          fetch('http://localhost:8000/api/loginconfig', { cache: 'no-store' }),
        ]);
        
        const dataHero = await resHero.json();
        const result = await resConfig.json();

        if (resHero.ok && dataHero) {
          setKonten({
            footerText1: dataHero.footerText1 || konten.footerText1,
            footerText2: dataHero.footerText2 || konten.footerText2
          });
        }

        if (resConfig.ok && result && !result.error) {
          setConfig((prev) => ({
            ...prev,
            judul_utama: result.headerTitle || prev.judul_utama,
            sub_judul: result.subHeader || prev.sub_judul,
            background_path: result.background_path 
              ? `http://localhost:8000/storage/${result.background_path.replace(/^\/+/g, '').replace('public/', '')}` 
              : prev.background_path,
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 2. Fungsi Login Utama
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
          'Accept': 'application/json', // Memaksa Laravel mengirim JSON jika terjadi error
         
          
        },body: JSON.stringify(payload),
        
      });


      // Cek apakah responnya JSON (mencegah error "Unexpected token <")
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textError = await response.text();
        console.error("Server Error Response:", textError);
        throw new Error("Server mengalami masalah (bukan format JSON).");
      }

      const result = await response.json();

      if (response.ok) {
        const userStatus = result.user?.status?.toString().trim().toLowerCase();
        
        // Cek Status Akun
        if (userStatus === "ditolak") {
          alert(`Maaf, akun Anda ditolak.\nAlasan: ${result.user?.rejection_reason}`);
          return;
        }
        if (userStatus !== "aktif") {
          alert("Akun Anda belum aktif. Silakan tunggu persetujuan Admin.");
          return;
        }

        // Simpan ke Session Storage sesuai preferensi user
        sessionStorage.setItem("user", JSON.stringify(result.user));
        sessionStorage.setItem("token", result.token);
        
        // Redirect berdasarkan Role
        if (result.user?.role === 'admin' || payload.email === 'admin@gmail.com') {
          router.push("/AdminDashboard");
        } else {
          router.push("/UserDashboard");
        }
      } else {
        alert(result.message || "Email atau Password salah.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(error.message || "Gagal terhubung ke server. Pastikan Laravel menyala.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fungsi Lupa Password
  const handleLupaPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
    
      const response = await fetch('http://localhost:8000/api/lupa-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
          'Accept': 'application/json',  
      
        },body: JSON.stringify({ email: formData.get("email_lupa") }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Sukses! " + result.message);
        setShowLupaPassword(false);
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

      {/* POP-UP LUPA PASSWORD */}
      {showLupaPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[40px] shadow-2xl w-full max-w-md border border-white/40 animate-in zoom-in duration-300">
            <div className="bg-white rounded-[35px] p-8 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-[#7c4d2d]">Reset Password</h3>
                <button onClick={() => setShowLupaPassword(false)} className="text-[#7c4d2d] hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-[#7c4d2d] text-xs mb-6">Masukkan email Anda untuk menerima link reset password.</p>
              <form onSubmit={handleLupaPasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Email</label>
                  <input type="email" name="email_lupa" required placeholder="Email Terdaftar" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 text-xs outline-none text-[#7c4d2d]" />
                </div>
                <button type="submit" className="w-full bg-[#56b35a] hover:bg-[#43a047] text-white py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all mt-2">
                  Kirim Link Reset
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN SECTION */}
      <section className="flex-1 relative flex items-center justify-center py-10 z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={config.background_path} alt="Background" className="w-full h-full object-cover object-center brightness-90" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <div className="w-full max-w-md"> 
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[50px] shadow-2xl border border-white/40">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#7c4d2d] mb-1">{config.judul_utama}</h2>
                <p className="text-[#7c4d2d] text-xs font-medium px-4">{config.sub_judul}</p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#7c4d2d] mb-4">Login</h3>
                <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
                  <div>
                    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Email</label>
                    <input type="email" name="email" required placeholder="Email Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 text-xs outline-none text-[#7c4d2d]" />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-[#7c4d2d] mb-1 block ml-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" required placeholder="Password Anda" className="w-full px-5 py-2.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 text-xs outline-none text-[#7c4d2d]" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                        <img src="/icon_mata.png" alt="toggle" className="w-4 h-4 object-contain" />
                      </button>
                    </div>
                    <div className="text-right mt-1">
                      <button type="button" onClick={() => setShowLupaPassword(true)} className="text-[10px] font-bold text-[#7c4d2d]/60 hover:text-[#7c4d2d]">Lupa Password?</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full bg-[#56b35a] hover:bg-[#43a047] text-white py-3 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? "Memproses..." : "Login"}
                    </button>
                    <p className="text-center text-xs mt-6 font-bold text-[#7c4d2d]/70">
                      Belum Punya Akun? <Link href="/Register" className="text-green-600 hover:underline">Daftar disini</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-auto">
            <p className="text-[10px] font-bold">{konten.footerText1}</p>
            <p className="text-[9px] opacity-60 mt-1 tracking-widest">{konten.footerText2}</p>
          </footer>
    </main>
  );
}