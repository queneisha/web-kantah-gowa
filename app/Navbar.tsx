import Link from "next/link"; // Pastikan import ini ada di paling atas

export default function Navbar() {
  return (
    <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa</h1>
            <p className="text-[10px] opacity-70">Sistem Informasi & Layanan Internal</p>
          </div>
        </div>

      <div className="flex gap-4">
        {/* Hubungkan ke /login */}
        <Link href="/Login" className="px-6 py-1.5 border border-green-500 text-green-500 rounded-full text-sm font-bold hover:bg-green-500 hover:text-white transition">
          Login
        </Link>
        
        {/* Hubungkan ke /register */}
        <Link href="/Register" className="px-6 py-1.5 bg-[#8b5e3c] text-white rounded-full text-sm font-bold hover:bg-[#724d31] transition">
          Daftar Akun
        </Link>
      </div>
    </header>
  );
}