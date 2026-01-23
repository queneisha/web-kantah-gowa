export default function Features() {
  const steps = [
    { 
      id: 1, 
      title: "Registrasi Akun", 
      desc: "Notaris/PPAT mendaftar dengan data lengkap dan menunggu persetujuan dari Admin Kantah.",
      icon: "👤" 
    },
    { 
      id: 2, 
      title: "Ajukan Permohonan", 
      desc: "Setelah akun disetujui, ajukan permohonan layanan dengan mengisi form yang tersedia.",
      icon: "📋" 
    },
    { 
      id: 3, 
      title: "Pantau Status", 
      desc: "Pantau perkembangan permohonan dan terima notifikasi melalui sistem dan email.",
      icon: "🕒" 
    }
  ];

  const features = [
    { title: "Manajemen Permohonan", desc: "Ajukan dan pantau status permohonan layanan pertanahan secara real-time", icon: "📦" },
    { title: "Sistem Verifikasi", desc: "Proses verifikasi akun dan permohonan yang aman dan terstruktur", icon: "🛡️" },
    { title: "Riwayat Lengkap", desc: "Akses riwayat semua permohonan dengan filter dan pencarian", icon: "📑" },
    { title: "Notifikasi Otomatis", desc: "Terima pemberitahuan melalui sistem dan email untuk setiap update", icon: "🔔" }
  ];

  return (
    <div className="bg-[#5d4037]">
      {/* Alur Penggunaan Sistem */}
      <section className="py-20 px-6">
        <h2 className="text-center text-3xl font-bold text-white mb-12 tracking-tight">
          Alur Penggunaan Sistem
        </h2>
        <div className="max-w-3xl mx-auto space-y-5">
          {steps.map((s) => (
            <div key={s.id} className="bg-white rounded-[35px] p-5 flex items-center gap-6 shadow-2xl transition-transform hover:scale-[1.02]">
              {/* Box Ikon yang lebih bulat dan shadow lembut */}
              <div className="bg-[#7c4d2d] text-white w-20 h-20 rounded-[25px] flex items-center justify-center text-4xl shadow-lg shrink-0">
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#333] text-xl mb-1">
                  {s.id}. {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-snug">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="bg-white rounded-t-[100px] py-24 px-12">
        <h2 className="text-center text-5xl font-bold text-[#56b35a] mb-16 tracking-tighter">
          Fitur Utama
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-8 border border-gray-50 hover:border-green-100 transition-all">
              <div className="bg-green-50 p-6 rounded-[30px] text-[#56b35a] text-4xl shadow-inner">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-[#56b35a] text-2xl mb-2 tracking-tight">
                  {f.title}
                </h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}