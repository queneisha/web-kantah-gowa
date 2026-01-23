<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Mengambil semua data user untuk ditampilkan di tabel Admin
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Mengubah status user menjadi 'Aktif' (Tombol Centang Hijau)
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

    // Menghapus atau menolak user (Tombol Silang Merah)
    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User berhasil dihapus']);
        }
        return response()->json(['message' => 'Gagal menghapus user'], 404);
    }
}