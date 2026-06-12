"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Features() {
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [features, setFeatures] = useState<Features[]>([]);

  interface Features {
    id: number;
    judul: string;
    deskripsi: string;
    icon: string;
  }

  interface StepItem {
    id: number;
    judul: string;
    deskripsi: string;
    icon: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resFitur, resAlur] = await Promise.all([
          fetch("http://bpn.kadastrium.id/api/fiturs", { cache: "no-store" }),
          fetch("http://bpn.kadastrium.id/api/alurs", { cache: "no-store" }),
        ]);

        // Cek apakah respons berhasil
        if (!resFitur.ok) {
          throw new Error(`Failed to fetch fiturs: ${resFitur.status} ${resFitur.statusText}`);
        }
        if (!resAlur.ok) {
          throw new Error(`Failed to fetch alurs: ${resAlur.status} ${resAlur.statusText}`);
        }

        const dataFitur = await resFitur.json();
        const dataAlur = await resAlur.json();

        // Log data untuk debugging
        console.log("Data fiturs:", dataFitur);
        console.log("Data alurs:", dataAlur);

        setFeatures(dataFitur);
        setSteps(dataAlur);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#5d4037] relative overflow-hidden">
      {/* --- BACKGROUND ANIMASI ELEGAN --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
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
              <div className="bg-[#7c4d2d] text-white w-20 h-20 rounded-[25px] flex items-center justify-center text-4xl shadow-lg shrink-0 overflow-hidden relative">
                {s.icon && s.icon.length > 4 ? (
                  <img 
                    src={`http://bpn.kadastrium.id/storage/icons/${s.icon}`} 
                    className="w-full h-full object-contain p-3 opacity-100 relative z-10 block"
                    alt={s.judul}
                    style={{ opacity: 1 }}
                  />
                ) : (
                  <span>{s.icon || "✨"}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[#333] text-xl mb-1 leading-tight">
                  {s.judul}
                </h3>
                <p className="text-gray-500 text-sm leading-snug">
                  {s.deskripsi}
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
              <div className="!bg-[#56b35a] flex items-center justify-center rounded-[30px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden">
                {f.icon && f.icon.length > 2 ? (
                  <img
                    src={`http://bpn.kadastrium.id/storage/icons/${f.icon}`}
                    className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    alt={f.judul}
                    style={{ filter: 'brightness(0) invert(1) drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}
                  />
                ) : (
                  <span className="text-white text-4xl">{f.icon || "✨"}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-[#56b35a] text-2xl mb-2 tracking-tight leading-tight">
                  {f?.judul}
                </h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {f?.deskripsi}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}