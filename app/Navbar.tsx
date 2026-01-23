import Link from "next/link"; // Pastikan import ini ada di paling atas

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
       <img src="/logo.png" alt="Logo" className="h-10 w-auto" /> 
        <div className="flex flex-col">
          <h1 className="font-bold text-xl leading-none">KANTAH Gowa</h1>
          <p className="text-[10px] uppercase tracking-tighter text-gray-400">Sistem Informasi & Layanan Internal</p>
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
    </nav>
  );
}