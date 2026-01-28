<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permohonan; // Pastikan Anda sudah punya Model Permohonan
use Illuminate\Support\Facades\Validator;

class PermohonanController extends Controller
{
    // 1. Fungsi untuk Menyimpan Data dari Form Next.js
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'jenisPendaftaran' => 'required',
            'jenisHak' => 'required',
            'noSertipikat' => 'required',
            'desa' => 'required',
            'kecamatan' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid', 'errors' => $validator->errors()], 422);
        }

        $permohonan = Permohonan::create([
            'user_id' => $request->user_id,
            'jenis_pendaftaran' => $request->jenisPendaftaran,
            'catatan_pendaftaran' => $request->catatanPendaftaran,
            'jenis_hak' => $request->jenisHak,
            'no_sertipikat' => $request->noSertipikat,
            'desa' => $request->desa,
            'kecamatan' => $request->kecamatan,
            'status' => 'Menunggu', // Status default
        ]);

        return response()->json(['message' => 'Permohonan berhasil dikirim!', 'data' => $permohonan], 201);
    }

    // 2. Fungsi untuk Mengambil Riwayat (yang Anda tanyakan tadi)
    public function getRiwayatUser($userId)
    {
        $riwayat = Permohonan::where('user_id', $userId)
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json($riwayat);
    }
}