import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex flex-col font-sans">
      {/* Navbar Minimalis */}
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
            {/* Kartu Luar Transparan (Glassmorphism) */}
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] shadow-2xl w-full max-w-xl border border-white/40">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#7c4d2d] mb-2">Selamat Datang Kembali</h2>
                <p className="text-[#7c4d2d] text-sm font-medium">
                  Silahkan login untuk mengakses sistem layanan KANTAH Gowa
                </p>
              </div>

              {/* Kartu Dalam Putih Solid */}
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#7c4d2d] mb-6">Login</h3>
                
                {/* Menambahkan autoComplete="off" untuk mencegah auto-fill browser */}
                <form className="space-y-5" autoComplete="off">
                  {/* Kolom Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#7c4d2d] ml-2">Email</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-green-600 text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </span>
                      <input 
                        type="email" 
                        placeholder="Masukan Email Anda" 
                        autoComplete="off"
                        className="w-full pl-14 pr-6 py-3.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium transition-all" 
                      />
                    </div>
                  </div>

                  {/* Kolom Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#7c4d2d] ml-2">Password</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-green-600 text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </span>
                      <input 
                        type="password" 
                        placeholder="Masukan Password Anda" 
                        autoComplete="new-password"
                        className="w-full pl-14 pr-12 py-3.5 bg-white rounded-full border-2 border-[#7c4d2d]/30 focus:border-[#7c4d2d] outline-none text-[#7c4d2d] placeholder:text-gray-400 font-medium transition-all" 
                      />
                    </div>
                    <div className="text-right pr-4">
                      <button type="button" className="text-xs font-bold text-[#7c4d2d]/70 hover:text-[#7c4d2d]">Lupa Password?</button>
                    </div>
                  </div>

                  {/* Bagian Tombol Tengah */}
                  <div className="flex flex-col items-center pt-4">
                    <button className="w-1/2 bg-[#56b35a] hover:bg-[#43a047] text-white py-3.5 rounded-full font-bold text-xl shadow-lg transition-transform active:scale-95">
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
        <p className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">Sistem Informasi Internal untuk Notaris dan PPAT</p>
      </footer>
    </main>
  );
}