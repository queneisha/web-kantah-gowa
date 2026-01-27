"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Save,
  Image as ImageIcon,
  Type,
  Edit,
  ListOrdered,
  LayoutGrid,
  Plus,
  Monitor,
  LogIn,
  UserPlus,
  Trash2,
  Menu,
  FileSpreadsheet,
} from "lucide-react";
import { button } from "framer-motion/client";  

export default function EditKontenPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // State untuk menyimpan data teks
  const [konten, setKonten] = useState({
    heroTitle1: "Selamat Datang",
    heroTitle2: "Sistem Informasi Kantor Pertanahan Gowa",
    heroTitle3: "Platform digital untuk Notaris dan PPAT dalam melakukan pendaftaran, pengajuan permohonan, dan pemantauan status layanan pertanahan secara efisien dan terpadu.",
    footerText1: "© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.",
    footerText2: "Sistem Informasi Internal untuk Notaris dan PPAT",
    navText1: "KANTAH Gowa",
    navText2: "Sistem Informasi & Layanan Internal",
    navText3: "Administrator",
  });

  const [loginKonten, setLoginKonten] = useState({
  headerTitle: "Selamat Datang Kembali",
  subHeader: "Silahkan login untuk mengakses sistem layanan KANTAH Gowa",
  backgroundImg: "/path-to-background.jpg",
  maskotImg: "/path-to-maskot.png",
  formTitle: "Login",
  labelEmail: "Email",
  placeholderEmail: "Masukan Email Anda",
  labelPassword: "Password",
  placeholderPassword: "Masukan Password Anda",
  textLupaPassword: "Lupa Password?",
  textTombolLogin: "Login",
  textRegisterPrompt: "Belum Punya Akun?",
  textRegisterLink: "Daftar disini"
});

// State Register (Lengkap sesuai gambar permintaan Anda)
  const [registerKonten, setRegisterKonten] = useState({
    headerTitle: "Buat Akun Anda!",
    subHeader: "Silahkan daftar untuk membuat akun di sistem layanan pertanahan kantah Gowa.",
    labelNama: "Nama Lengkap",
    formTitle2: "Register",
    placeholderNama: "Masukkan Nama Lengkap Anda",
    labelJabatan: "Jabatan",
    listJabatan: ["Notaris/PPAT", "Sekertaris Notaris/PPAT", "Anggota ATR BPN"],
    labelEmail: "Email",
    placeholderEmail: "Email Anda",
    labelNoHp: "Nomor Handphone",
    placeholderNoHp: "No. HP Anda",
    labelPassword: "Password",
    placeholderPassword: "Password",
    labelKonfirmasi: "Konfirmasi Password",
    placeholderKonfirmasi: "Ulangi Password"
  });

  // State untuk data Alur (CRUD Preview)
  const [alurSistem, setAlurSistem] = useState([
    { id: 1, judul: "1. Registrasi Akun", deskripsi: "Notaris/PPAT mendaftar dengan data lengkap dan menunggu persetujuan dari Admin Kantah." },
    { id: 2, judul: "2. Ajukan Permohonan", deskripsi: "Setelah akun disetujui, ajukan permohonan layanan dengan mengisi form yang tersedia." },
    { id: 3, judul: "3. Pantau Status", deskripsi: "Pantau perkembangan permohonan dan terima notifikasi melalui sistem dan email." }
  ]);

    const [fiturUtama, setFiturUtama] = useState([
    { id: 1, judul: "Manajemen Permohonan", deskripsi: "Ajukan dan pantau status permohonan layanan pertanahan secara real-time" },
    { id: 2, judul: "Sistem Verifikasi", deskripsi: "Proses verifikasi akun dan permohonan yang aman dan terstruktur" },
    { id: 3, judul: "Riwayat Lengkap", deskripsi: "Akses riwayat semua permohonan dengan filter dan pencarian" },
    { id: 4, judul: "Notifikasi Otomatis", deskripsi: "Terima pemberitahuan melalui sistem dan email untuk setiap update" }
]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    console.log("Data Register yang disimpan:", registerKonten);
    // Tambahkan logika pengiriman ke API/Backend di sini
    alert("Perubahan berhasil disimpan!");
  };

  const updateFitur = (id: number, field: string, value: string) => {
  setFiturUtama(fiturUtama.map(item => item.id === id ? { ...item, [field]: value } : item));
};

  // Fungsi untuk update teks alur
  const updateAlur = (id: number, field: string, value: string) => {
    setAlurSistem(alurSistem.map(item => item.id === id ? { ...item, [field]: value } : item));
};

// 1. Efek untuk menangani mounting dan membaca localStorage (Cegah Hydration Error)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarStatus");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  // 2. Simpan status sidebar setiap kali berubah
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarStatus", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, mounted]);

  // Helper untuk Sidebar Item
  const SidebarItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className="block group relative">
      <button 
        className={`flex items-center w-full py-3.5 transition-all rounded-xl font-bold whitespace-nowrap
        ${active ? "bg-[#56b35a] shadow-lg text-white" : "text-white hover:bg-white/10"} 
        ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
      >
        <Icon size={22} className="shrink-0" /> 
        {isSidebarOpen && <span>{label}</span>}
      </button>

      {/* TOOLTIP: Muncul saat sidebar tertutup */}
      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl border border-white/10 top-1/2 -translate-y-1/2 whitespace-nowrap">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
        </div>
      )}
    </Link>
  );

  // Jangan render apapun sebelum mounted untuk menghindari mismatch HTML server vs client
  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden">
      
      {/* NAVBAR HITAM */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30 shadow-md">
              <div className="flex items-center">
                <div className="w-12 flex justify-start items-center">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Menu size={24} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <img src="/logo.png" alt="Logo" className="h-10 w-auto shrink-0" />
                  <div className="flex flex-col min-w-max">
                    <h1 className="font-bold text-lg leading-none whitespace-nowrap">KANTAH Gowa - Admin</h1>
                    <p className="text-[10px] opacity-70 whitespace-nowrap">Sistem Manajemen Internal</p>
                  </div>
                </div>
              </div>
              <h2 className="text-sm font-bold tracking-widest opacity-90 hidden sm:block">Administrator</h2>
            </header>
      
            <div className="flex flex-1 overflow-hidden">
              
              {/* SIDEBAR COKELAT */}
              <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-[#7c4d2d] text-white flex flex-col shadow-xl z-20 transition-all duration-300 ease-in-out relative`}>
                <nav className="flex-1 px-3 py-8 space-y-4">
                  <SidebarItem href="/AdminDashboard" icon={LayoutDashboard} label="Beranda" />
                  <SidebarItem href="/AdminDashboard/DataUser" icon={Users} label="Data User" />
                  <SidebarItem href="/AdminDashboard/DataPermohonan" icon={FileText} label="Data Permohonan" />
                  <SidebarItem href="/AdminDashboard/Pengaturan" icon={Settings} label="Pengaturan" />
                  <SidebarItem href="/AdminDashboard/EditKonten" icon={Edit} label="Edit Konten" active={true} />
                  <SidebarItem href="/AdminDashboard/Riwayat" icon={FileSpreadsheet} label="Riwayat" />
      
                  {/* Tombol Keluar */}
                  <div className="pt-4 mt-4 border-t border-white/20">
                     <button 
                      onClick={() => setIsLogoutModalOpen(true)}
                      className={`group relative flex items-center w-full py-3.5 hover:bg-red-600 rounded-xl font-bold transition-all whitespace-nowrap ${isSidebarOpen ? "px-5 gap-3" : "justify-center px-0"}`}
                     >
                      <LogOut size={22} className="shrink-0" /> 
                      {isSidebarOpen && <span>Keluar</span>}
                      
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl top-1/2 -translate-y-1/2 whitespace-nowrap">
                          Keluar
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  </div>
                </nav>
              </aside>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div className="p-10">
            <div className="max-w-350 mx-auto">
              <h3 className="text-3xl font-black text-gray-900">Edit Konten Website</h3>
              <p className="text-gray-500 font-medium mb-8">Kelola informasi yang tampil di halaman depan Website</p>
              {isSaved && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[12px] font-bold animate-pulse flex items-center gap-2">
                  <Save size={14} /> Perubahan Disimpan
                </div>
              )}
            </div>

                {/* TAB MENU NAVIGASI UNTUK PEMISAHAN */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6">
              {[
                { id: "hero", label: "Hero", icon: <Type size={16} /> },
                { id: "navbar", label: "Navbar", icon: <LayoutGrid size={16} /> },
                { id: "footer", label: "Footer", icon: <Type size={16} /> },
                { id: "alur", label: "Alur", icon: <ListOrdered size={16} /> },
                { id: "fitur", label: "Fitur", icon: <Settings size={16} /> },
                { id: "login", label: "Halaman Login", icon: <LogIn size={16} /> },
                { id: "register", label: "Halaman Register", icon: <UserPlus size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === tab.id ? "bg-[#8b5e3c] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6">

              

              {/* SECTION HERO / BAGIAN UTAMA */}
              {activeTab === "hero" && (
              <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <Type size={18} /> Bagian Utama (Hero Section)
                    </div>
                    <button 
                    onClick={() => handleSave()}
                    className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"
                    >
                    <Save size={14} /> Simpan
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Header Utama</label>
                    <input 
                        type="text" 
                        value={konten.heroTitle1}
                        onChange={(e) => setKonten({...konten, heroTitle1: e.target.value})}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[16px] font-semibold"
                    />
                    </div>

                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Judul Sistem</label>
                    <input 
                        type="text" 
                        value={konten.heroTitle2}
                        onChange={(e) => setKonten({...konten, heroTitle2: e.target.value})}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[16px] font-semibold"
                    />
                    </div>

                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Teks Deskripsi</label>
                    <textarea 
                        rows={3}
                        value={konten.heroTitle3}
                        onChange={(e) => setKonten({...konten, heroTitle3: e.target.value})}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[16px] resize-none leading-relaxed font-semibold"
                    />
                    </div>

                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1 block mb-3">Gambar Background</label>
                    <div className="group bg-gray-50 p-6 rounded-[20px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                        <div className="p-3 bg-white rounded-full text-gray-900 shadow-sm group-hover:text-[#56b35a] transition-colors">
                        <ImageIcon size={24} />
                        </div>
                        <div className="space-y-1">
                        <p className="text-[13px] font-bold text-gray-800 group-hover:text-[#56b35a] transition-colors">Ganti Gambar Hero</p>
                        <p className="text-[10px] text-gray-900 font-black">Maksimal 2MB • JPG/PNG</p>
                        </div>
                        <button className="text-[11px] font-black bg-gray-900 text-white px-5 py-2 rounded-lg tracking-widest group-hover:bg-[#56b35a] transition-all">
                        Pilih File
                        </button>
                    </div>
                    </div>
                </div>
              </section>
              )}

              {/* SECTION FOOTER */}
              {activeTab === "footer" && (
              <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type size={18} /> Teks Footer
                  </div>
                  <button 
                    onClick={() => handleSave()}
                    className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"
                  >
                    <Save size={14} /> Simpan
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Teks Footer Baris 1</label>
                    <input 
                      type="text" 
                      value={konten.footerText1} 
                      onChange={(e) => setKonten({ ...konten, footerText1: e.target.value })}
                      className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl text-[16px] font-semibold focus:border-[#56b35a] focus:outline-none transition" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Teks Footer Baris 2</label>
                    <input 
                      type="text" 
                      value={konten.footerText2} 
                      onChange={(e) => setKonten({ ...konten, footerText2: e.target.value })}
                      className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl text-[16px] font-semibold focus:border-[#56b35a] focus:outline-none transition" 
                    />
                  </div>
                </div>
              </section>
              )}

                {/* SECTION NAVBAR */}
                {activeTab === "navbar" && (
              <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <LayoutGrid size={18} /> Navbar
                    </div>
                    <button 
                    onClick={() => handleSave()}
                    className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"
                    >
                    <Save size={14} /> Simpan
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Tagline</label>
                    <input 
                        type="text" 
                        value={konten.navText1}
                        onChange={(e) => setKonten({...konten, navText1: e.target.value})}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[16px] font-semibold"
                    />
                    </div>

                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1">Tagline 2</label>
                    <input 
                        type="text" 
                        value={konten.navText2}
                        onChange={(e) => setKonten({...konten, navText2: e.target.value})}
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[16px] font-semibold"
                    />
                    </div>

                    <div className="space-y-1">
                    <label className="text-[15px] font-bold text-gray-900 ml-1 block mb-3">Icon</label>
                    <div className="group bg-gray-50 p-6 rounded-[20px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                        <div className="p-3 bg-white rounded-full text-gray-900 shadow-sm group-hover:text-[#56b35a] transition-colors">
                        <ImageIcon size={24} />
                        </div>
                        <div className="space-y-1">
                        <p className="text-[13px] font-bold text-gray-800 group-hover:text-[#56b35a] transition-colors">Ganti Icon</p>
                        <p className="text-[10px] text-gray-900 font-black">Maksimal 2MB • JPG/PNG</p>
                        </div>
                        <button className="text-[11px] font-black bg-gray-900 text-white px-5 py-2 rounded-lg tracking-widest group-hover:bg-[#56b35a] transition-all">
                        Pilih File
                        </button>
                    </div>
                    </div>
                </div>
              </section>
              )}

              {/* SECTION ALUR PENGGUNAAN SISTEM */}
              {activeTab === "alur" && (
              <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2"><ListOrdered size={18} /> Alur Penggunaan Sistem</div>
                    <button onClick={() => handleSave()} className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"><Save size={14} /> Simpan</button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {alurSistem.map((step) => (
                      <div key={step.id} className="p-5 bg-gray-50 rounded-[20px] border border-gray-100 space-y-4 relative">
                        <div className="space-y-1">
                          <label className="text-[15px] font-bold text-gray-900 ml-1">Judul Langkah</label>
                          <input 
                            type="text" 
                            value={step.judul}
                            onChange={(e) => updateAlur(step.id, 'judul', e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[13px] font-medium resize-none leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[15px] font-bold text-gray-900 ml-1">Deskripsi</label>
                          <textarea 
                            rows={3}
                            value={step.deskripsi}
                            onChange={(e) => updateAlur(step.id, 'deskripsi', e.target.value)}
                            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[13px] font-medium resize-none leading-relaxed"
                          />
                        </div>
                        <div className="pt-2">
                           <div className="group w-full h-8 bg-white rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-900 font-bold hover:bg-green-50/50 hover:border-[#56b35a] cursor-pointer transition-all duration-300">
                             <ImageIcon size={12} className="mr-2 group-hover:text-[#56b35a] transition-colors"/> 
                             <span className="group-hover:text-[#56b35a] transition-colors">Ganti Icon Langkah</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              )}

                {/* SECTION FITUR UTAMA */}
                {activeTab === "fitur" && (
                <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <Settings size={18} /> Fitur Utama Website
                    </div>
                    <button 
                    onClick={() => handleSave()} 
                    className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"
                    >
                    <Save size={14} /> Simpan
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fiturUtama.map((fitur) => (
                        <div key={fitur.id} className="p-5 bg-gray-50 rounded-[20px] border border-gray-100 space-y-4 relative">
                        <div className="space-y-1">
                            <label className="text-[15px] font-bold text-gray-900 ml-1">Judul Fitur</label>
                            <input 
                            type="text" 
                            value={fitur.judul}
                            onChange={(e) => updateFitur(fitur.id, 'judul', e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[13px] font-medium leading-relaxed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[15px] font-bold text-gray-900 ml-1">Deskripsi Fitur</label>
                            <textarea 
                            rows={3}
                            value={fitur.deskripsi}
                            onChange={(e) => updateFitur(fitur.id, 'deskripsi', e.target.value)}
                            className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-[13px] font-medium resize-none leading-relaxed"
                            />
                        </div>
                        <div className="pt-2">
                            <div className="group w-full h-8 bg-white rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-900 font-bold hover:bg-green-50/50 hover:border-[#56b35a] cursor-pointer transition-all duration-300">
                            <ImageIcon size={12} className="mr-2 group-hover:text-[#56b35a] transition-colors"/> 
                            <span className="group-hover:text-[#56b35a] transition-colors">Ganti Icon Fitur</span>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </section>
                )}

                 {/* SECTION HALAMAN LOGIN */}
                 {activeTab === "login" && (
                    <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <LogIn size={18} /> Pengaturan Tampilan Halaman Login
                        </div>
                        <button 
                        onClick={() => handleSave()} 
                        className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"
                        >
                        <Save size={14} /> Simpan
                        </button>
                    </div>

                    <div className="p-6 space-y-10">
                        <div className="space-y-4">
                        <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Teks Judul Utama</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Judul Utama (Header)</label>
                            <input 
                                type="text" 
                                value={loginKonten.headerTitle}
                                onChange={(e) => setLoginKonten({...loginKonten, headerTitle: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                                placeholder="Contoh: Selamat Datang Kembali"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Sub-judul (Keterangan)</label>
                            <textarea 
                                rows={2}
                                value={loginKonten.subHeader}
                                onChange={(e) => setLoginKonten({...loginKonten, subHeader: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                                placeholder="Masukkan deskripsi singkat di bawah judul"
                            />
                            </div>
                        </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Konten di Dalam Kotak Login</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Judul Kotak (Form)</label>
                            <input 
                                type="text" 
                                value={loginKonten.formTitle}
                                onChange={(e) => setLoginKonten({...loginKonten, formTitle: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Email</label>
                            <input 
                                type="text" 
                                value={loginKonten.labelEmail}
                                onChange={(e) => setLoginKonten({...loginKonten, labelEmail: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Email</label>
                            <input 
                                type="text" 
                                value={loginKonten.placeholderEmail}
                                onChange={(e) => setLoginKonten({...loginKonten, placeholderEmail: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Password</label>
                            <input 
                                type="text" 
                                value={loginKonten.labelPassword}
                                onChange={(e) => setLoginKonten({...loginKonten, labelPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Password</label>
                            <input 
                                type="text" 
                                value={loginKonten.placeholderPassword}
                                onChange={(e) => setLoginKonten({...loginKonten, placeholderPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Teks Lupa Password</label>
                            <input 
                                type="text" 
                                value={loginKonten.textLupaPassword}
                                onChange={(e) => setLoginKonten({...loginKonten, textLupaPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Pengaturan Gambar & Media</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Gambar Maskot</label>
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center min-h-[150px] hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                                <ImageIcon className="text-gray-900 mb-2 group-hover:text-[#56b35a] transition-colors" size={32} />
                                <p className="text-[12px] text-gray-500 font-medium group-hover:text-[#56b35a] transition-colors">Klik untuk ganti karakter petugas</p>
                                <div className="mt-2 text-[10px] bg-[#8b5e3c] text-white px-2 py-1 rounded shadow-sm group-hover:bg-[#56b35a] transition-colors">Format: PNG (Transparan)</div>
                            </div>
                            </div>

                            <div className="space-y-3">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Gambar Background</label>
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center min-h-[150px] hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                                <Monitor className="text-gray-900 mb-2 group-hover:text-[#56b35a] transition-colors" size={32} />
                                <p className="text-[12px] text-gray-500 font-medium group-hover:text-[#56b35a] transition-colors">Klik untuk ganti background kantor</p>
                                <div className="mt-2 text-[10px] bg-gray-700 text-white px-2 py-1 rounded shadow-sm group-hover:bg-[#56b35a] transition-colors">Rekomendasi: 1920 x 1080 px</div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>
                )}

                {/* SECTION HALAMAN REGISTER */}
                {activeTab === "register" && (
                <section className="bg-white rounded-[25px] shadow-sm border border-gray-200 overflow-hidden mb-20">
              <div className="bg-[#8b5e3c] p-4 px-6 text-white font-bold text-[16px] flex items-center justify-between">
                <div className="flex items-center gap-2"><UserPlus size={18} /> Pengaturan Tampilan Halaman Register</div>
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#56b35a] hover:bg-[#469e4a] text-white px-4 py-1.5 rounded-lg font-bold transition text-[15px] shadow-sm"><Save size={14} /> Simpan</button>
              </div>

              <div className="p-6 space-y-10">
                {/* Bagian Header Form */}
                <div className="space-y-4">
                  <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Teks Judul Utama</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[16px] font-bold text-gray-700 ml-1">Judul Utama (Header)</label>
                      <input type="text" value={registerKonten.headerTitle} onChange={(e) => setRegisterKonten({...registerKonten, headerTitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-bold text-gray-700 ml-1">Sub-judul (Keterangan)</label>
                      <textarea rows={2} value={registerKonten.subHeader} onChange={(e) => setRegisterKonten({...registerKonten, subHeader: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Bagian Input Form (Email, HP, Password) */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Konten di Dalam Kotak Register</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Nama (Form)</label>
                            <input 
                                type="text" 
                                value={registerKonten.formTitle2}
                                onChange={(e) => setRegisterKonten({...registerKonten, formTitle2: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Nama</label>
                            <input 
                                type="text" 
                                value={registerKonten.labelNama}
                                onChange={(e) => setRegisterKonten({...registerKonten, labelNama: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Nama</label>
                            <input 
                                type="text" 
                                value={registerKonten.placeholderNama}
                                onChange={(e) => setRegisterKonten({...registerKonten, placeholderNama: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Email</label>
                            <input 
                                type="text" 
                                value={registerKonten.labelEmail}
                                onChange={(e) => setRegisterKonten({...registerKonten, labelEmail: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Email</label>
                            <input 
                                type="text" 
                                value={registerKonten.placeholderEmail}
                                onChange={(e) => setRegisterKonten({...registerKonten, placeholderEmail: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label No Hp</label>
                            <input 
                                type="text" 
                                value={registerKonten.labelNoHp}
                                onChange={(e) => setRegisterKonten({...registerKonten, labelNoHp: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder No Hp</label>
                            <input 
                                type="text" 
                                value={registerKonten.placeholderNoHp}
                                onChange={(e) => setRegisterKonten({...registerKonten, placeholderNoHp: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Password</label>
                            <input 
                                type="text" 
                                value={registerKonten.labelPassword}
                                onChange={(e) => setRegisterKonten({...registerKonten, labelPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Password</label>
                            <input 
                                type="text" 
                                value={registerKonten.placeholderPassword}
                                onChange={(e) => setRegisterKonten({...registerKonten, placeholderPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Label Konfirmasi Password</label>
                            <input 
                                type="text" 
                                value={registerKonten.labelKonfirmasi}
                                onChange={(e) => setRegisterKonten({...registerKonten, labelKonfirmasi: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                            <div className="space-y-2">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Placeholder Konfirmasi Password</label>
                            <input 
                                type="text" 
                                value={registerKonten.placeholderKonfirmasi}
                                onChange={(e) => setRegisterKonten({...registerKonten, placeholderKonfirmasi: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#56b35a] focus:outline-none transition text-gray-900"
                            />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Pengaturan Gambar & Media</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Gambar Maskot</label>
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center min-h-[150px] hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                                <ImageIcon className="text-gray-900 mb-2 group-hover:text-[#56b35a] transition-colors" size={32} />
                                <p className="text-[12px] text-gray-500 font-medium group-hover:text-[#56b35a] transition-colors">Klik untuk ganti karakter petugas</p>
                                <div className="mt-2 text-[10px] bg-[#8b5e3c] text-white px-2 py-1 rounded shadow-sm group-hover:bg-[#56b35a] transition-colors">Format: PNG (Transparan)</div>
                            </div>
                            </div>

                            <div className="space-y-3">
                            <label className="text-[16px] font-bold text-gray-700 ml-1">Gambar Background</label>
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center min-h-[150px] hover:border-[#56b35a] hover:bg-green-50/30 cursor-pointer transition-all duration-300">
                                <Monitor className="text-gray-900 mb-2 group-hover:text-[#56b35a] transition-colors" size={32} />
                                <p className="text-[12px] text-gray-500 font-medium group-hover:text-[#56b35a] transition-colors">Klik untuk ganti background kantor</p>
                                <div className="mt-2 text-[10px] bg-gray-700 text-white px-2 py-1 rounded shadow-sm group-hover:bg-[#56b35a] transition-colors">Rekomendasi: 1920 x 1080 px</div>
                            </div>
                            </div>
                        </div>
                        </div>
                </div>

                {/* Bagian Jabatan (Sesuai Permintaan: Tambah, Hapus, Edit) */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-[16px] font-bold text-gray-900 border-b pb-2">Opsi Jabatan (Dropdown)</h4>
                    <span className="text-[12px] text-gray-500 font-medium italic">*Input ini akan muncul di pilihan dropdown register</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registerKonten.listJabatan.map((jab, index) => (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={jab} 
                            onChange={(e) => {
                              const newList = [...registerKonten.listJabatan];
                              newList[index] = e.target.value;
                              setRegisterKonten({...registerKonten, listJabatan: newList});
                            }} 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:border-[#56b35a] focus:outline-none font-medium text-sm transition"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newList = registerKonten.listJabatan.filter((_, i) => i !== index);
                            setRegisterKonten({...registerKonten, listJabatan: newList});
                          }}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition shadow-sm border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setRegisterKonten({...registerKonten, listJabatan: [...registerKonten.listJabatan, "Jabatan Baru"]})}
                      className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#56b35a] hover:text-[#56b35a] hover:bg-green-50/50 transition text-sm font-bold"
                    >
                      <Plus size={18} /> Tambah Opsi Jabatan
                    </button>
                  </div>
                </div>
              </div>
            </section>
                )}
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>
      {/* MODAL POP UP KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Anda akan keluar dari admin panel. Anda perlu login kembali untuk mengakses sistem.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-8 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Batal
              </button>

              <Link href="/">
                <button className="px-8 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                  Ya, Keluar
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function setMounted(arg0: boolean) {
  throw new Error("Function not implemented.");
}
