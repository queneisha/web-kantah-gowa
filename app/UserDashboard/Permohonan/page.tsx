"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Bell, 
  LogOut,
  FileText,
  Send,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
  MessageSquare
} from "lucide-react";

// --- KOMPONEN CUSTOM DROPDOWN ---
interface AdminSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  name: string;
}

const AdminStyleSelect: React.FC<AdminSelectProps> = ({ label, options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl font-medium transition-all border-none outline-none
          ${isOpen ? "ring-2 ring-[#56b35a] bg-white shadow-md" : "bg-[#e9e9e9] text-gray-700"}`}
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-[#56b35a]" : "text-gray-500"}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-[25px] p-2 animate-in fade-in zoom-in duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(name, opt);
                setIsOpen(false);
              }}
              className={`w-full text-center py-3 px-4 my-1 rounded-full text-sm font-bold transition-all
                ${value === opt 
                  ? "bg-[#56b35a] text-white shadow-lg" 
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PermohonanPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    jenisPendaftaran: "",
    catatanPendaftaran: "",
    jenisHak: "",
    noSertipikat: "",
    desa: "",
    kecamatan: ""
  });

  const handleCustomChange = (name: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      catatanPendaftaran: name === "jenisPendaftaran" && value !== "Lainnya" ? "" : prev.catatanPendaftaran
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNoSertipikatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && value.length <= 5)) {
      setFormData(prev => ({ ...prev, noSertipikat: value }));
    }
  };

  const handleReset = () => {
    setFormData({
      jenisPendaftaran: "",
      catatanPendaftaran: "",
      jenisHak: "",
      noSertipikat: "",
      desa: "",
      kecamatan: ""
    });
  };

  const triggerConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jenisPendaftaran || !formData.jenisHak || !formData.noSertipikat) {
        alert("Harap lengkapi Jenis Pendaftaran, Jenis Hak, dan No. Sertipikat!");
        return;
    }
    if (formData.jenisPendaftaran === "Lainnya" && !formData.catatanPendaftaran) {
        alert("Harap isi catatan pendaftaran lainnya!");
        return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    handleReset();
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans overflow-hidden relative">
      
      {/* --- HEADER --- */}
      <header className="w-full bg-[#1a1a1a] text-white h-20 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <div className="text-left">
            <h1 className="font-bold text-lg leading-none">KANTAH Gowa - User</h1>
            <p className="text-[10px] opacity-70">Sistem Informasi Internal Notaris & PPAT</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold tracking-tight">Nurul Karimah</h2>
          <p className="text-[10px] opacity-70">nkarimah421@gmail.com</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="w-72 bg-[#7c4d2d] text-white flex flex-col shadow-xl">
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link href="/UserDashboard"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><LayoutDashboard size={22} /> Beranda</button></Link>
            <Link href="/UserDashboard/Permohonan"><button className="flex items-center gap-3 w-full px-5 py-3.5 bg-[#56b35a] rounded-xl font-bold shadow-lg text-left transition"><FileEdit size={22} /> Permohonan</button></Link>
            <Link href="/UserDashboard/Riwayat"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><History size={22} /> Riwayat</button></Link>
            <Link href="/UserDashboard/Notifikasi"><button className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-white/10 rounded-xl transition text-left font-bold"><Bell size={22} /> Notifikasi</button></Link>
            <div className="pt-4 border-t border-white/20 mt-4">
              <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-red-600 rounded-xl transition text-left font-bold"><LogOut size={22} /> Keluar</button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col relative">
          <div className="p-10 flex-1">
            <div className="max-w-[1400px] mx-auto text-left">
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900">Permohonan</h3>
                <p className="text-gray-500 font-medium">Ajukan permohonan baru</p>
                <hr className="mt-5 border-gray-200" />
              </div>

              <form onSubmit={triggerConfirm} className="max-w-4xl bg-white rounded-[30px] shadow-xl border-2 border-[#7c4d2d] overflow-hidden">
                <div className="bg-[#8b5e3c] p-4 px-8 text-white flex items-center gap-3">
                  <FileText size={24} />
                  <span className="font-bold text-lg">Form Permohonan</span>
                </div>

                <div className="p-8 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                    <input type="text" value="Nurul Karimah" disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium" />
                  </div>

                  <AdminStyleSelect 
                    label="Jenis Pendaftaran"
                    name="jenisPendaftaran"
                    placeholder="Pilih jenis pendaftaran"
                    options={["Pengecekan", "SKPT", "Lainnya"]}
                    value={formData.jenisPendaftaran}
                    onChange={handleCustomChange}
                  />

                  {formData.jenisPendaftaran === "Lainnya" && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        Catatan Pendaftaran (Sebutkan Lainnya)
                      </label>
                      <input 
                        type="text" 
                        name="catatanPendaftaran" 
                        value={formData.catatanPendaftaran} 
                        onChange={handleChange} 
                        placeholder="Ketik jenis pendaftaran Anda di sini..." 
                        required 
                        className="w-full px-4 py-3 bg-[#f0fff0] border-2 border-[#56b35a]/30 rounded-xl font-medium focus:ring-2 focus:ring-[#56b35a] outline-none text-black transition-all" 
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Tanggal Pendaftaran</label>
                    <input 
                      type="text" 
                      value={new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} 
                      disabled 
                      className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl text-gray-500 font-medium" 
                    />
                  </div>

                  <AdminStyleSelect 
                    label="Jenis Hak"
                    name="jenisHak"
                    placeholder="Pilih jenis hak"
                    options={["Hak Milik", "Hak Guna Bangunan", "Hak Pengelolaan", "Hak Pakai", "Hak Guna Usaha", "Hak Wakaf"]}
                    value={formData.jenisHak}
                    onChange={handleCustomChange}
                  />

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">5 Angka Terakhir No. Hak Sertipikat</label>
                    <input type="text" name="noSertipikat" value={formData.noSertipikat} onChange={handleNoSertipikatChange} placeholder="00001" required className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl font-medium focus:ring-2 focus:ring-[#56b35a] outline-none text-black" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Desa / Kelurahan</label>
                    <input type="text" name="desa" value={formData.desa} onChange={handleChange} placeholder="Nama desa / kelurahan" required className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl font-medium focus:ring-2 focus:ring-[#56b35a] outline-none text-black" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Kecamatan</label>
                    <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Nama kecamatan" required className="w-full px-4 py-3 bg-[#e9e9e9] border-none rounded-xl font-medium focus:ring-2 focus:ring-[#56b35a] outline-none text-black" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#56b35a] text-white font-bold rounded-xl shadow-lg hover:bg-[#469e4a] transition">
                      <Send size={18} /> Ajukan Permohonan
                    </button>
                    <button type="button" onClick={handleReset} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                      <RotateCcw size={18} /> Reset Form
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <footer className="w-full bg-[#1a1a1a] text-white py-6 text-center mt-10">
            <p className="text-[10px] font-bold">© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.</p>
            <p className="text-[9px] opacity-50 tracking-widest mt-1">Sistem Informasi Internal untuk Notaris dan PPAT</p>
          </footer>
        </main>
      </div>

      {/* --- POPUP 1: KONFIRMASI --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[35px] p-8 w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">Periksa Kembali Dokumen</h3>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-4 mb-6">
              <AlertTriangle className="text-orange-500 shrink-0" size={24} />
              <p className="text-sm text-gray-600 leading-relaxed">
                Pastikan seluruh <b>data dan dokumen</b> yang <b>anda</b> kirim sudah benar. Kesalahan data dapat menyebabkan proses permohonan tertunda.
              </p>
            </div>

            <div className="space-y-4 px-4 mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Jenis Pendaftaran</p>
                <p className="font-bold text-gray-800">
                  {formData.jenisPendaftaran} {formData.catatanPendaftaran && `(${formData.catatanPendaftaran})`}
                </p>
              </div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Jenis Hak</p><p className="font-bold text-gray-800">{formData.jenisHak}</p></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">5 Angka Terakhir No. Hak Sertipikat</p><p className="font-bold text-gray-800">{formData.noSertipikat}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-bold text-gray-400 uppercase">Desa / Kelurahan</p><p className="font-bold text-gray-800">{formData.desa}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Kecamatan</p><p className="font-bold text-gray-800">{formData.kecamatan}</p></div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="px-8 py-3 rounded-full border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition">Periksa Kembali</button>
              <button onClick={handleFinalSubmit} className="px-8 py-3 rounded-full bg-[#56b35a] text-white font-bold hover:bg-[#469e4a] shadow-lg transition">Ya, Kirim Permohonan</button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2: BERHASIL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[35px] p-12 w-full max-w-4xl shadow-2xl border-[3px] border-green-500 relative animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={60} className="text-green-500" />
              </div>
              <h3 className="text-4xl font-black text-[#56b35a] mb-4">Permohonan Berhasil Diajukan!</h3>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Permohonan Anda telah masuk ke sistem dan menunggu persetujuan dari Admin. Anda akan menerima notifikasi melalui email dan sistem.
              </p>
              <button onClick={() => setShowSuccessModal(false)} className="mt-10 px-12 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-black transition shadow-lg">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

        {/* MODAL POP UP KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[25px] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Yakin untuk keluar?</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Anda akan keluar dari user panel. Anda perlu login kembali untuk mengakses sistem.
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