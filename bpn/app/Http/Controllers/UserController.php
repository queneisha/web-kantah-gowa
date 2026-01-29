<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserApprovedMail;
use Illuminate\Support\Facades\Log;

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

    Log::info('Mengirim email ke: ' . $user->email);

    Mail::to($user->email)->send(new UserApprovedMail($user));

    Log::info('Email terkirim!');

    return response()->json(['message' => 'Akun disetujui & email dikirim']);
}


    /**
     * Menghapus atau menolak user
     */
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
