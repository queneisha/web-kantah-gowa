<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Mengambil semua data user dengan pemetaan kolom yang sesuai untuk Frontend.
     * Termasuk perbaikan typo jabatan dan penambahan data Notaris/PPAT.
     */
    public function index()
    {
        $users = User::all()->map(function($user) {
            return $this->formatUserResponse($user);
        });

        return response()->json($users);
    }

    /**
     * Mengambil 3-5 user terbaru yang baru mendaftar untuk widget Dashboard.
     */
    public function getLatestUsers()
    {
        $latestUsers = User::orderBy('created_at', 'desc')
                            ->take(5)
                            ->get()
                            ->map(function($user) {
                                return $this->formatUserResponse($user);
                            });

        return response()->json($latestUsers);
    }

    /**
     * Helper function untuk menstandarisasi format data user yang dikirim ke frontend.
     */
    private function formatUserResponse($user)
    {
        $jabatan = $user->jabatan;
        if (strtolower($jabatan) === 'sekretaris notaris/ppat') {
            $jabatan = 'Sekretaris Notaris/PPAT';
        }

        return [
            'id'      => $user->id,
            'nama'    => $user->nama_lengkap, 
            'email'   => $user->email,
            'jabatan' => $jabatan,
            'notaris' => $user->nama_notaris,
            'hp'      => $user->nomor_hp,
            'status'  => ucfirst($user->status), // 'menunggu' -> 'Menunggu'
            'tgl'     => $user->created_at ? $user->created_at->format('d/m/Y') : '-'
        ];
    }

    /**
     * Mengubah status user menjadi 'Aktif'
     */
    public function approve($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $user->status = 'Aktif';
        $user->save();

        return response()->json(['message' => 'Akun berhasil disetujui!']);
    }

    /**
     * Menghapus atau menolak user
     * Jika status masih 'menunggu' -> tolak (ubah status ke 'Ditolak')
     * Jika status 'Aktif' -> hapus user
     */
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // Jika user masih menunggu, tolak pendaftaran
        if (strtolower($user->status) === 'menunggu') {
            $user->status = 'Ditolak';
            $user->rejection_reason = $request->input('reason', 'Pendaftaran ditolak oleh admin');
            $user->save();
            
            return response()->json(['message' => 'Pendaftaran user berhasil ditolak']);
        }
        
        // Jika user sudah aktif, hapus data user
        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus']);
    }
}