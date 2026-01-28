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

        // 3. Cek Status (Gunakan strtolower agar tidak sensitif huruf besar/kecil)
        if (strtolower($user->status) !== 'aktif') {
            return response()->json([
                'message' => 'Akun Anda belum aktif. Silakan tunggu persetujuan Admin KANTAH Gowa.'
            ], 403);
        }

        // 4. Sukses Login
        return response()->json([
            'message' => 'Login Berhasil',
            'user' => $user,
            // Pastikan Anda mengirim token jika menggunakan Sanctum/JWT
            'token' => 'dummy-token-atau-generate-token-disini' 
        ], 200);
    }
}