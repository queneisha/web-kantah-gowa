import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <footer className="bg-[#1a1a1a] text-white py-6 text-center">
        <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
        <p className="text-[9px] opacity-60 mt-1 tracking-widest">Sistem Informasi Internal untuk Notaris dan PPAT</p>
      </footer>
    </main>
  );
}