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
        // Hapus 'status' dari validasi karena status ada di DB, bukan dikirim user
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Cek Akun
        if (!$user) {
            return response()->json([
                'message' => 'Akun tidak ditemukan.'
            ], 401);
        }

        // 2. Cek Password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau Password salah!'
            ], 401);
        }

        // 3. Cek Status (kecuali admin)
        // Jika user bukan admin dan status bukan 'aktif' maka tolak login
        if (strtolower($user->role ?? 'user') !== 'admin' && strtolower($user->status) !== 'aktif') {
            return response()->json([
                'message' => 'Akun Anda belum aktif. Silakan tunggu persetujuan Admin KANTAH Gowa.'
            ], 403);
        }

        // 4. Sukses Login
        $isAdmin = strtolower($user->role ?? 'user') === 'admin';

        // Buat token Sanctum untuk API authentication
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login Berhasil',
            'user' => $user,
            'is_admin' => $isAdmin,
            'redirect' => $isAdmin ? '/AdminDashboard' : '/UserDashboard',
            'token' => $token,
        ], 200);
    }
}
