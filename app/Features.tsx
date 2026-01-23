"use client";
import React from "react";
import { motion } from "framer-motion";

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
    <div className="bg-[#5d4037] relative overflow-hidden">
      
      {/* --- BACKGROUND ANIMASI ELEGAN (Framer Motion) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -60, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px]"
        />
      </div>

      {/* --- SECTION 1: ALUR PENGGUNAAN SISTEM --- */}
      <section className="py-20 px-6 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-white mb-12 tracking-tight"
        >
          Alur Penggunaan Sistem
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-5">
          {steps.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[35px] p-5 flex items-center gap-6 shadow-2xl transition-all"
            >
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 2: FITUR UTAMA --- */}
      <section className="bg-white rounded-t-[100px] py-24 px-12 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center text-5xl font-bold text-[#56b35a] mb-16 tracking-tighter"
        >
          Fitur Utama
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-white p-10 rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-8 border border-gray-50 hover:border-green-100 transition-all"
            >
              <div className="bg-green-50 p-6 rounded-[30px] text-[#56b35a] text-4xl shadow-inner flex shrink-0">
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
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}