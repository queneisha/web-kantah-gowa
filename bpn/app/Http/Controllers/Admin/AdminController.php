<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permohonan;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Mengambil data statistik untuk dashboard card
     * Permohonan di-set 0 sementara karena tabel belum ada
     */
    public function getStats()
    {
        return response()->json([
            'total_user'       => User::count(),
            'user_menunggu'    => User::where('status', 'menunggu')->count(),
            'total_permohonan' => Permohonan::count(),
            'permohonan_masuk' => Permohonan::where('status', 'Menunggu')->count(),
        ]);
    }

    /**
     * Mengambil data user terbaru (limit 5) untuk tabel di dashboard
     */
    public function getLatestUsers()
    {
        $users = User::orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($user) {
                return [
                    'id'      => $user->id,
                    'nama'    => $user->nama_lengkap,
                    'jabatan' => $user->jabatan,
                    'status'  => ucfirst($user->status),
                    'notaris' => $user->nama_notaris ?? '-', 
                ];
            });

        return response()->json($users);
    }

    /**
     * Mengambil semua user dan menyesuaikan format kolom untuk halaman Data User
     * Diurutkan berdasarkan status (menunggu di atas), kemudian dari yang terbaru
     */
    public function getUsers()
    {
        $users = User::orderByRaw("CASE WHEN status = 'menunggu' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id'      => $user->id,
                    'nama'    => $user->nama_lengkap, // Mapping ke frontend
                    'email'   => $user->email,
                    'jabatan' => $user->jabatan,
                    'hp'      => $user->nomor_hp,      // Mapping ke frontend
                    'status'  => ucfirst($user->status),
                    'notaris' => $user->nama_notaris ?? null,
                'tgl'     => $user->created_at->format('d F Y'),
            ];
        });

        return response()->json($users);
    }

    /**
     * Mengambil detail satu user berdasarkan ID untuk Modal View
     */
    public function showUser($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json([
            'id'         => $user->id,
            'nama'       => $user->nama_lengkap,
            'email'      => $user->email,
            'jabatan'    => $user->jabatan,
            'hp'         => $user->nomor_hp,
            'status'     => ucfirst($user->status),
            'notaris'    => $user->nama_notaris ?? null,
            'tgl' => $user->created_at->format('d F Y'),
        ]);
    }

    /**
     * Menyetujui pendaftaran user (Update status ke aktif)
     */
    public function approveUser($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->status = 'aktif';
            $user->save();
            return response()->json(['message' => 'User approved successfully']);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    /**
     * Mengambil data permohonan terbaru (limit 5) untuk tabel di dashboard
     */
    public function getLatestPermohonan()
    {
        $permohonan = Permohonan::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'id'            => $item->id,
                    'nama'          => $item->user->nama_lengkap ?? 'Tanpa Nama',
                    'jenis'         => $item->jenis_pendaftaran,
                    'jenis_lainnya' => $item->jenis_lainnya ?? null,
                    'status'        => $item->status,
                ];
            });

        return response()->json($permohonan);
    }

    public function destroy($id)
{
    try {
        $user = \App\Models\User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dihapus.'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Gagal menghapus user: ' . $e->getMessage()
        ], 500);
    }
}
}