"use client"; // Diperlukan untuk interaksi event dan state
import Link from "next/link";

export default function LoginPage() {

  // Fungsi untuk menangani login ke API Laravel
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mengambil data dari form menggunakan name attribute
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
        // Jika berhasil, arahkan ke dashboard
        alert("Selamat Datang!");
        window.location.href = "/UserDashboard"; 
      } else {
        /** * Bagian ini sekarang dinamis. 
         * Jika Laravel mengirimkan "Akun Anda telah ditolak...", 
         * maka alert akan menampilkan pesan tersebut secara otomatis.
         */
        alert(result.message || "Terjadi kesalahan saat login.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal terhubung ke server.");
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col font-sans">
      {/* Navbar Minimalis */}
      <nav className="flex items-center justify-between px-12 py-4 bg-[#1a1a1a] text-white z-20">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" /> 
          <div className="flex flex-col">
            <h1 className="font-bold text-xl leading-none">KANTAH Gowa</h1>
            <p className="text-[10px] tracking-tighter text-gray-400">Sistem Informasi & Layanan Internal</p>
          </div>
        </div>
        <Link href="/" className="px-8 py-2 bg-[#8b5e3c] text-white rounded-full text-sm font-bold hover:bg-[#724d31] transition">
          Beranda
        </Link>
      </nav>

      {/* Konten Utama */}
      <section className="flex-1 relative flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center -z-10 brightness-75" />
        
        <div className="container mx-auto px-16 flex items-center gap-10">
          {/* Maskot Kiri */}
          <div className="hidden lg:block w-1/3 transform translate-y-24 translate-x-20">
            <img src="/maskot_login.png" alt="Maskot" className="h-[600px] object-contain drop-shadow-2xl" />
          </div>

          {/* Form Login */}
          <div className="flex-1 flex flex-col items-center z-20">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] shadow-2xl w-full max-w-xl border border-white/40">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#7c4d2d] mb-2">Selamat Datang Kembali</h2>
                <p className="text-[#7c4d2d] text-sm font-medium">
                  Silahkan login untuk mengakses sistem layanan KANTAH Gowa
                </p>
              </div>

              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#7c4d2d] mb-6">Login</h3>
                
                <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
                  {/* Kolom Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#7c4d2d] ml-2">Email</label>
                    <div className="relative">
                      <input 
                        name="email" 
                        type="email" 
                        required
                        placeholder="Masukan Email Anda" 
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                      />
                    </div>
                  </div>

                  {/* Kolom Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#7c4d2d] ml-2">Password</label>
                    <div className="relative">
                      <input 
                        name="password" 
                        type="password" 
                        required
                        placeholder="Masukan Password Anda" 
                        autoComplete="new-password"
                        className="w-full px-5 py-3 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium text-xs transition-all" 
                      />
                    </div>
                    <div className="text-right pr-4">
                      <button type="button" className="text-xs font-bold text-[#7c4d2d]/70 hover:text-[#7c4d2d]">Lupa Password?</button>
                    </div>
                  </div>

                  {/* Tombol Login */}
                  <div className="flex flex-col items-center pt-4">
                    <button type="submit" className="w-1/2 bg-[#56b35a] hover:bg-[#43a047] text-white py-3.5 rounded-full font-bold text-xl shadow-lg transition-transform active:scale-95">
                      Login
                    </button>
                    
                    <p className="text-center text-xs mt-8 font-bold text-[#7c4d2d]/70">
                      Belum Punya Akun? <Link href="/Register" className="text-green-600 hover:underline">Daftar disini</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-[#1a1a1a] text-white py-6 text-center">
        <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
        <p className="text-[9px] opacity-60 mt-1 tracking-widest">Sistem Informasi Internal untuk Notaris dan PPAT</p>
      </footer>
    </main>
  );
}