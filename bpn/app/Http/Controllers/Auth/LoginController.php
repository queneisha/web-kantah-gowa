<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Logika Akun Tidak Ditemukan (Ditolak Admin)
        if (!$user) {
            return response()->json([
                'message' => 'Akun Anda telah ditolak oleh Admin KANTAH Gowa.'
            ], 401);
        }

        // 2. Cek Password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau Password salah!'
            ], 401);
        }

        // 3. Cek Status Aktif (Menunggu Persetujuan)
        if ($user->status !== 'Aktif') {
            return response()->json([
                'message' => 'Akun Anda belum aktif. Silakan tunggu persetujuan Admin KANTAH Gowa.'
            ], 403);
        }

        // 4. Sukses Login
        return response()->json([
            'message' => 'Login Berhasil',
            'user' => $user
        ], 200);
    }
}